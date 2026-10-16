# Husie migration — Phase 2

This working copy is based on `Mirror_Gram_Independent_Phases1-5_MASTER.zip`. The original master archive is not modified.

## Changes in this phase
- Updated visible web app branding and page copy to Husie.
- Updated web metadata and added a Husie SVG icon.
- Updated Expo app display name, slug, and Android package metadata.
- Added a Settings link to the Delete Account page.
- Connected the Delete Account form to a new authenticated API endpoint. The endpoint requires the exact phrase `DELETE HUSIE`, deletes the authenticated user's database record (dependent rows cascade per schema), and attempts to remove owned media files.

## Verification status
- Source-level checks only so far; no live database was available.
- The native icon asset is currently a copied legacy image placeholder and should be replaced by a finalized Husie PNG before store submission.
- Account deletion must be tested with a disposable account and backed-up test database before production use.
- Private Circles are not implemented in this phase; this remains a separate feature phase.
