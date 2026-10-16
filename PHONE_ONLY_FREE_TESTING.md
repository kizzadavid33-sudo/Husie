# Husie: free phone-only testing guide

This guide is for temporary testing only. It does not make GitHub a runtime dependency of Husie. Do not use real personal data or production passwords during testing.

## What this ZIP is and is not

- This is source code, not an APK.
- The Android app is a WebView shell; it needs a reachable Husie website.
- The web app, Node API, PostgreSQL database, and media storage must run together for full social-feature testing.
- The project has not been certified or fully integration-tested.

## Free test approach

1. Create a **private** GitHub repository for temporary testing. Upload this ZIP as a file.
2. Create a GitHub Codespace for that repository using the browser on your Android phone.
3. In the Codespace terminal, extract and copy the source into the repository root (adjust the ZIP filename if yours differs):

   ```sh
   unzip Husie_Free_Testing_Prep.zip
   cp -a Husie_Independent_Final_v7/. .
   ```

4. Commit the extracted project files in the private repository so the build workflow can find them. Do not upload `.env` files, passwords, tokens, or real user data.
5. In the Codespace terminal, check that Docker is available, then run:

   ```sh
   docker --version
   docker compose version
   docker compose up --build
   ```

6. In the Codespace **Ports** tab, open port `3000`. Keep it private for your own initial checks; if you need an APK to access the site, change port visibility to public temporarily and treat the URL as a public test endpoint. Anyone with a public forwarded URL may be able to reach it.
7. Open the forwarded HTTPS website URL on your Android phone and test with disposable accounts only. Keep the Codespace running while testing; the URL may change if the Codespace is recreated.
8. To build an APK from the included GitHub Actions workflow, add a repository **variable** named `HUSIE_WEB_URL` containing the current forwarded HTTPS website URL, then run the `Husie Android APK` workflow manually. Download the APK from that workflow's artifact. The workflow deliberately does not publish a GitHub Release.

## Free usage and safety

- GitHub Codespaces has a monthly free quota on eligible personal accounts; stop the Codespace when you finish. Confirm the billing page says there is no payment method or spending enabled if you must guarantee $0.
- Public forwarded ports are accessible to anyone who knows the URL. Do not test with real user data, and make the port private again when finished.
- This is not production hosting. The site will stop when the Codespace stops, and test data may be lost.
- Avoid `docker compose down -v` unless you intentionally want to delete the test database volume.
- A working APK build does not prove login, media, messaging, notifications, or other features work. Those require separate tests.
- Do not use this temporary setup for a public launch.
