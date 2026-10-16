# Husie App Testing Toolkit

This toolkit starts with automated checks for Husie's web app. It is designed to be usable from a phone through GitHub Actions and Codespaces.

## What it checks

- The existing `Husie project verification` workflow checks web/API TypeScript and production builds.
- The `Husie app smoke test` workflow builds the web app, starts it with an isolated mock API, and checks the login page response.
- A headless Chromium browser then checks that `/login` returns HTTP 200, the login and account-creation headings, email/password fields, and buttons are visible, and no uncaught browser JavaScript errors occur.
- If the browser test fails, the workflow tries to upload a screenshot as an artifact and prints server logs.

## Run the smoke test from your phone

1. Open the Husie repository on GitHub.
2. Tap **Actions**.
3. Select **Husie app smoke test**.
4. Tap **Run workflow** and confirm the branch.
5. Open the run and inspect the steps. Green means the checks passed; red means open the failed step and read its logs.

## Important limitations

- This is an initial browser smoke test, not a full end-to-end test suite. It does not submit account forms or create real accounts.
- The mock API only isolates the login-page UI test. It does not prove that the real API, database, authentication, media uploads, or social features work end to end.
- Use disposable test accounts and test data. Never put real passwords, API keys, or production secrets into logs or source files.
- GitHub Actions usage and Codespaces usage may have account-specific limits. Check billing/usage before running workloads; do not assume unlimited free usage.

## Next stages

1. Add isolated API/database tests with disposable test data.
2. Add registration/login tests that use test-only accounts.
3. Add tests for posting, feeds, profiles, and navigation.
4. Publish a concise test report and preserve useful failure logs.