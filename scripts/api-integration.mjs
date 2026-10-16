import assert from 'node:assert/strict';

const baseUrl = process.env.HUSIE_API_BASE_URL ?? 'http://127.0.0.1:4000';
const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
const account = { email: `husie-test-${unique}@example.test`, username: `test_${unique}`.slice(0, 30), password: `TestOnly-${unique}-Password` };

function sessionCookie(response) {
  const headers = response.headers.getSetCookie?.() ?? [];
  const session = headers.find((value) => value.startsWith('mirrorgram_session='));
  assert.ok(session, 'Expected API to set a mirrorgram_session cookie.');
  return session.split(';', 1)[0];
}

async function jsonRequest(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'content-type': 'application/json', ...(options.headers ?? {}) },
  });
  const text = await response.text();
  let body = {};
  try { body = text ? JSON.parse(text) : {}; } catch { throw new Error(`${path} returned non-JSON response: ${text.slice(0, 200)}`); }
  return { response, body };
}

const health = await fetch(`${baseUrl}/health`);
assert.equal(health.status, 200, 'API /health should return HTTP 200.');
assert.equal((await health.json()).ok, true, 'API health payload should report ok=true.');
console.log('PASS: API health endpoint.');

const ready = await fetch(`${baseUrl}/ready`);
assert.equal(ready.status, 200, 'API /ready should confirm database connectivity.');
assert.equal((await ready.json()).database, true, 'API /ready should report database=true.');
console.log('PASS: API database readiness.');

const registered = await jsonRequest('/api/auth/register', { method: 'POST', body: JSON.stringify(account) });
assert.equal(registered.response.status, 200, `Registration failed with HTTP ${registered.response.status}: ${JSON.stringify(registered.body)}`);
assert.equal(registered.body.user?.email, account.email, 'Registration should return the created user email.');
assert.equal(registered.body.user?.username, account.username, 'Registration should return the created username.');
const registerCookie = sessionCookie(registered.response);
console.log('PASS: Test account registration and session cookie.');

const meAfterRegister = await fetch(`${baseUrl}/api/auth/me`, { headers: { cookie: registerCookie } });
assert.equal(meAfterRegister.status, 200, 'Current-user endpoint should return HTTP 200 after registration.');
assert.equal((await meAfterRegister.json()).user?.email, account.email, 'Registered session should identify the new user.');
console.log('PASS: Registered session authenticates at /api/auth/me.');

const login = await jsonRequest('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: account.email, password: account.password }) });
assert.equal(login.response.status, 200, `Login failed with HTTP ${login.response.status}: ${JSON.stringify(login.body)}`);
assert.equal(login.body.user?.email, account.email, 'Login should return the matching user.');
const loginCookie = sessionCookie(login.response);
console.log('PASS: Login with valid credentials.');

const badLogin = await jsonRequest('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: account.email, password: 'DefinitelyWrongPassword' }) });
assert.equal(badLogin.response.status, 401, `Invalid login should be rejected; received HTTP ${badLogin.response.status}.`);
console.log('PASS: Invalid credentials are rejected.');

const duplicate = await jsonRequest('/api/auth/register', { method: 'POST', body: JSON.stringify(account) });
assert.equal(duplicate.response.status, 400, `Duplicate registration should be rejected; received HTTP ${duplicate.response.status}.`);
console.log('PASS: Duplicate account registration is rejected.');

// Seed a disposable post in the isolated test database, then exercise social endpoints through the API.
const { Pool } = await import('pg');
const testPool = new Pool({ connectionString: process.env.DATABASE_URL });
let seededPostId;
try {
  const seeded = await testPool.query('insert into posts(user_id,caption,visibility) values($1,$2,$3) returning id', [registered.body.user.id, 'Automated Husie test post', 'public']);
  seededPostId = seeded.rows[0].id;
} finally {
  await testPool.end();
}

const feed = await fetch(`${baseUrl}/api/feed?limit=10`, { headers: { cookie: loginCookie } });
assert.equal(feed.status, 200, 'Feed should return HTTP 200.');
const feedBody = await feed.json();
assert.ok(feedBody.posts.some((post) => post.id === seededPostId), 'Feed should include the seeded public post.');
console.log('PASS: Public feed returns the seeded post.');

const like = await jsonRequest(`/api/posts/${seededPostId}/like`, { method: 'POST', headers: { cookie: loginCookie }, body: '{}' });
assert.equal(like.response.status, 200, 'Like endpoint should return HTTP 200.');
assert.equal(like.body.liked, true, 'First like should set liked=true.');
const unlike = await jsonRequest(`/api/posts/${seededPostId}/like`, { method: 'POST', headers: { cookie: loginCookie }, body: '{}' });
assert.equal(unlike.body.liked, false, 'Second like should toggle liked=false.');
console.log('PASS: Like/unlike toggles correctly.');

const comment = await jsonRequest(`/api/posts/${seededPostId}/comments`, { method: 'POST', headers: { cookie: loginCookie }, body: JSON.stringify({ body: 'Automated test comment' }) });
assert.equal(comment.response.status, 200, `Comment failed with HTTP ${comment.response.status}: ${JSON.stringify(comment.body)}`);
assert.equal(comment.body.body, 'Automated test comment', 'Comment endpoint should return the saved comment.');
console.log('PASS: Authenticated comment creation.');

const profile = await fetch(`${baseUrl}/api/profiles/${registered.body.user.id}/full`, { headers: { cookie: loginCookie } });
assert.equal(profile.status, 200, 'Full profile endpoint should return HTTP 200.');
assert.equal((await profile.json()).profile?.username, account.username, 'Profile should match the registered account.');
console.log('PASS: Authenticated profile lookup.');

const secondAccount = { email: `husie-test-follower-${unique}@example.test`, username: `follower_${unique}`.slice(0, 30), password: `TestOnly-${unique}-FollowerPassword` };
const secondRegistered = await jsonRequest('/api/auth/register', { method: 'POST', body: JSON.stringify(secondAccount) });
assert.equal(secondRegistered.response.status, 200, `Second test registration failed with HTTP ${secondRegistered.response.status}.`);
const follow = await jsonRequest(`/api/follows/${registered.body.user.id}`, { method: 'POST', headers: { cookie: sessionCookie(secondRegistered.response) }, body: '{}' });
assert.equal(follow.response.status, 200, `Follow failed with HTTP ${follow.response.status}.`);
assert.equal(follow.body.following, true, 'Follow endpoint should return following=true.');
console.log('PASS: A second test account can follow the first account.');

const logout = await jsonRequest('/api/auth/logout', { method: 'POST', headers: { cookie: loginCookie }, body: '{}' });
assert.equal(logout.response.status, 200, `Logout failed with HTTP ${logout.response.status}.`);
const afterLogout = await fetch(`${baseUrl}/api/auth/me`, { headers: { cookie: loginCookie } });
assert.equal((await afterLogout.json()).user, null, 'Logged-out session should no longer identify a user.');
console.log('PASS: Logout invalidates the session.');
console.log('PASS: Husie API integration test completed.');
