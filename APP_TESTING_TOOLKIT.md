# Husie App Testing Toolkit

This toolkit starts with safe automated checks for Husie's web app. It is designed to be usable from a phone through GitHub Actions and Codespaces.

## What it checks

- The existing `Husie project verification` workflow checks web/API TypeScript and production builds.
- The `Husie app smoke test` workflow builds the web app, starts it, requests `/login`, and checks that the response contains the expected sign-in and account-creation content.
- Workflow logs are the first place to look when a check fails. They help distinguish build errors from a page that crashes at runtime.

## Run the smoke test

1. Open the Husie repository on GitHub.
2. Tap **Actions**.
3. Select **Husie app smoke test**.
4. Tap **Run workflow** and confirm the branch.
5. Open the run and inspect the steps. Green means the checks passed; red means open the failed step and read its logs.

## Important limitations

- This is an initial smoke test, not a full end-to-end test suite. It does not create real accounts or test private social features yet.
- The login page test does not prove that the API, database, media uploads, or authentication flows work end to end.
- Use disposable test accounts and test data. Never put real passwords, API keys, or production secrets into logs or source files.
- GitHub Actions usage and Codespaces usage may have account-specific limits. Check billing/usage before running workloads; do not assume unlimited free usage.

## Next stages

1. Add browser-based tests for navigation and page rendering.
2. Add isolated API/database tests with disposable test data.
3. Add registration/login tests that use test-only accounts.
4. Publish a concise test report and preserve useful failure logs.