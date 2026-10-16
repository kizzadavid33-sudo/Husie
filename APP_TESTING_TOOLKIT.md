# Husie App Testing Toolkit

This toolkit runs automated checks for Husie's web app and API. It is designed to be managed from a phone through GitHub Actions.

## What it checks

- The existing `Husie project verification` workflow checks web/API TypeScript and production builds.
- The web smoke test builds the web app, starts it with an isolated mock API, and checks the login page.
- A headless Chromium browser checks the login page returns HTTP 200, headings, email/password fields and buttons are visible, and no uncaught browser JavaScript errors occur.
- The API integration test starts a disposable PostgreSQL database, applies the project's SQL schema, starts the real Husie API, and tests health/readiness, registration, current-user session, valid login, rejection of invalid credentials, rejection of duplicate registration, and logout.
- If a test fails, the workflow prints relevant server logs; browser failures may also upload a screenshot artifact.

## Run tests from your phone

1. Open the Husie repository on GitHub.
2. Tap **Actions**.
3. Select **Husie app smoke test**.
4. Tap **Run workflow** and choose the `add-app-testing-toolkit` branch while reviewing these changes.
5. Open the run. Green means checks passed; red means open the failed step and read its logs.

## Safety and limitations

- API integration tests use a temporary PostgreSQL database and generated test-only accounts. They do not use production credentials or real user data.
- The browser test uses a mock API and verifies the UI only. The separate API test uses the real Husie API and a disposable database.
- These tests do not yet cover media uploads, feed behavior, messaging, live streams, privacy rules, or every screen.
- GitHub Actions and Codespaces have account-specific usage limits. Check your usage before running workloads; do not assume unlimited free usage.

## Next stages

1. Add tests for posts, feed, profiles, and privacy behavior.
2. Add media upload and messaging tests using disposable data.
3. Keep test reports and useful failure artifacts easy to inspect from a phone.