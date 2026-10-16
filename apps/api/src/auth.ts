import crypto from 'node:crypto'
import type {FastifyRequest,FastifyReply} from 'fastify'
import {q} from './db.js'
const COOKIE='mirrorgram_session'
const days=Number(process.env.SESSION_DAYS||30)
export function hashToken(token:string){return crypto.createHash('sha256').update(token).digest('hex')}
export function newToken(){return crypto.randomBytes(48).toString('base64url')}
export async function createSession(reply:FastifyReply,userId:string){const token=newToken();await q('insert into sessions(user_id,token_hash,expires_at) values($1,$2,now()+($3||\' days\')::interval)',[userId,hashToken(token),String(days)]);reply.setCookie(COOKIE,token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:days*86400})}
export async function currentUser(request:FastifyRequest){const token=request.cookies[COOKIE];if(!token)return null;const r=await q('select u.id,u.email,u.username,u.display_name,u.avatar_path from sessions s join users u on u.id=s.user_id where s.token_hash=$1 and s.expires_at>now()',[hashToken(token)]);if(!r.rowCount)return null;await q('update sessions set last_seen_at=now() where token_hash=$1',[hashToken(token)]);return r.rows[0]}
export async function requireUser(request:FastifyRequest,reply:FastifyReply){const u=await currentUser(request);if(!u){reply.code(401).send({error:'Authentication required'});return null}return u}
export async function clearSession(request:FastifyRequest,reply:FastifyReply){const token=request.cookies[COOKIE];if(token)await q('delete from sessions where token_hash=$1',[hashToken(token)]);reply.clearCookie(COOKIE,{path:'/'})}
export function passwordHash(password:string){const salt=crypto.randomBytes(16).toString('hex');const hash=crypto.scryptSync(password,salt,64).toString('hex');return `scrypt:${salt}:${hash}`}
export function passwordVerify(password:string,stored:string){const [,salt,hex]=stored.split(':');if(!salt||!hex)return false;const a=Buffer.from(hex,'hex');const b=crypto.scryptSync(password,salt,64);return a.length===b.length&&crypto.timingSafeEqual(a,b)}

export async function userFromSessionToken(token:string){
  if(!token)return null;
  const r=await q('select u.id,u.email,u.username,u.display_name,u.avatar_path from sessions s join users u on u.id=s.user_id where s.token_hash=$1 and s.expires_at>now()',[hashToken(token)]);
  if(!r.rowCount)return null;
  await q('update sessions set last_seen_at=now() where token_hash=$1',[hashToken(token)]);
  return r.rows[0];
}
