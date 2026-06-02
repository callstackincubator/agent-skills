---
title: Fastlane Deployment for React Native
impact: CRITICAL
tags: react-native, fastlane, github-actions, app-store, play-store, ci-cd, release-automation
---

# Skill: Fastlane Deployment for React Native

Use this workflow to set up repeatable mobile releases with Fastlane and GitHub Actions.

## Quick Config

1. Initialize Fastlane in `android/` and `ios/`.
2. Add shared lane logic in `fastlane/Fastfile`.
3. Configure `fastlane/Appfile` with placeholder values.
4. Store credentials in CI secrets only.
5. Trigger release lanes from semantic version tags.

## When to Use

- Creating first automated deployment pipeline.
- Replacing manual Play/App Store uploads with lane-driven release.
- Standardizing version increments and track promotion rules.

## Secret and Config Placeholders

Use placeholders only. Never commit real keys.

This repo’s deployment workflow expects credentials to be provided as **GitHub Actions repository secrets**.
Fastlane should read only the decoded files created during the workflow (for example `fastlane/play-store-account.json` and `fastlane/AuthKey.p8`).

| GitHub Actions secret variable | Purpose |
|---|---|
| `GOOGLE_PLAY_JSON_KEY_BASE64` | Google Play service account JSON (base64). Decoded to `fastlane/play-store-account.json`. |
| `ANDROID_KEYSTORE_BASE64` | Android release keystore (base64). Optional if your signing uses on-disk files or Gradle signing already. |
| `ANDROID_KEY_ALIAS` | Keystore alias (optional; used only if you wire keystore decoding/signing in CI). |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password (optional; used only if you wire keystore decoding/signing in CI). |
| `ANDROID_KEY_PASSWORD` | Key password (optional; used only if you wire keystore decoding/signing in CI). |
| `APP_STORE_CONNECT_KEY_ID` | App Store Connect API key id. Used for API-key authentication. |
| `APP_STORE_CONNECT_ISSUER_ID` | App Store Connect issuer id. Used for API-key authentication. |
| `APP_STORE_CONNECT_API_KEY_BASE64` | App Store Connect private key `.p8` (base64). Decoded to `fastlane/AuthKey.p8`. |
| `MATCH_PASSWORD` | Fastlane match encryption password (only if you use `match`). |

## One-time Setup: Add secrets in GitHub Actions

After setting up your Fastlane project, add the following secrets in:
`GitHub Repo -> Settings -> Secrets and variables -> Actions -> New repository secret`.

Use base64-encoded values:
- For service account JSON: base64 encode the contents of your `google-play-service-account.json`.
- For App Store Connect `.p8`: base64 encode the contents of your downloaded API key `.p8`.

Then re-run your workflow. The workflow will decode:
- `GOOGLE_PLAY_JSON_KEY_BASE64` -> `fastlane/play-store-account.json`
- `APP_STORE_CONNECT_API_KEY_BASE64` -> `fastlane/AuthKey.p8`

> Important: do not add raw keystore files or raw `.p8` files to the repo. Keep them only in GitHub Actions secrets.

## Fastlane Setup Commands

```bash
# From app root
bundle exec fastlane init

# Optional explicit platform setup
cd android && bundle exec fastlane init
cd ../ios && bundle exec fastlane init
```

## `fastlane/Appfile` Template

```ruby
app_identifier(ENV["IOS_BUNDLE_ID"])
apple_id(ENV["APPLE_ID"]) # Optional when using API-key auth; keep if your existing Fastlane setup relies on it.
itc_team_id(ENV["APP_STORE_CONNECT_TEAM_ID"])
team_id(ENV["IOS_DEV_PORTAL_TEAM_ID"])

package_name(ENV["ANDROID_PACKAGE_NAME"])
json_key_file("./fastlane/play-store-account.json")

app_store_connect_api_key(
  key_id: ENV["APP_STORE_CONNECT_KEY_ID"],
  issuer_id: ENV["APP_STORE_CONNECT_ISSUER_ID"],
  key_filepath: "./fastlane/AuthKey.p8",
)
```

## `fastlane/Fastfile` Template

```ruby
default_platform(:ios)

platform :android do
  desc "Upload Android build to internal track"
  lane :android_internal do
    gradle(task: "clean bundleRelease")
    upload_to_play_store(
      track: "internal",
      aab: "../android/app/build/outputs/bundle/release/app-release.aab",
      json_key: "./fastlane/play-store-account.json"
    )
  end

  desc "Promote to production"
  lane :android_production do
    upload_to_play_store(track: "production", track_promote_to: "production")
  end
end

platform :ios do
  desc "Build and upload to TestFlight"
  lane :ios_beta do
    increment_build_number(xcodeproj: "../ios/App.xcodeproj")
    build_app(scheme: "App", export_method: "app-store")
    upload_to_testflight(skip_waiting_for_build_processing: true)
  end

  desc "Submit to App Store"
  lane :ios_release do
    submit_for_review(
      automatic_release: false,
      submit_review: true
    )
  end
end
```

## Recommended Android Lane (Production-Grade)

Use this lane when you need dynamic track targeting and automatic version code management from Play Console state.

Prerequisite (run locally): Android 16KB page-size alignment for the release build must pass (local `zipalign -c -P 16 -v 4` verification) before running this lane. See [native-android-16kb-alignment.md](../../react-native-best-practices/references/native-android-16kb-alignment.md).

```ruby
platform :android do
  desc "Build AAB and upload to Play Store with dynamic track + versioning"
  lane :deploy do |options|
    track = options[:track] || "internal" # internal, alpha, beta, production
    UI.message("Deploying to Play Store track: #{track}")

    version_name = ENV["VERSION_NAME"]
    version_name = nil if version_name.to_s.strip.empty?
    UI.message("Version Name: #{version_name || 'not provided, Gradle default will be used'}")

    tracks = ["internal", "alpha", "beta", "production"]
    all_codes = []

    tracks.each do |t|
      begin
        codes = google_play_track_version_codes(track: t)
        all_codes += codes if codes && !codes.empty?
      rescue
        UI.message("No builds found in #{t}")
      end
    end

    latest_version_code = all_codes.max || 0
    new_version_code = latest_version_code + 1

    UI.message("Latest version found: #{latest_version_code}")
    UI.message("Next version to use: #{new_version_code}")

    gradle_properties = {
      "android.injected.version.code" => new_version_code
    }
    gradle_properties["android.injected.version.name"] = version_name if version_name

    gradle(
      task: "bundle",
      build_type: "Release",
      properties: gradle_properties
    )

    upload_to_play_store(
      track: track,
      skip_upload_metadata: true,
      skip_upload_images: true,
      skip_upload_screenshots: true
    )

    UI.message("Deployment completed successfully")
  end
end
```

Use `android_internal`/`android_production` from the baseline template as a simpler fallback when dynamic versioning is not required.

## Recommended iOS Lane (Production-Grade)

Use this lane when you need one entrypoint for TestFlight internal, TestFlight external, and App Store upload.

```ruby
platform :ios do
  desc "Build and upload iOS app to TestFlight or App Store"
  lane :release do |options|
    release_target = options[:release_target] || "testflight_internal"
    UI.message("Release Target: #{release_target}")

    scheme = "GTTIANS"
    workspace = "GTTIANS.xcworkspace"

    begin
      latest_build = latest_testflight_build_number(
        app_identifier: ENV["APP_IDENTIFIER"]
      )
      build_number = latest_build + 1
    rescue => e
      UI.important("Could not fetch latest TestFlight build number: #{e.message}")
      build_number = 1
    end

    UI.message("Build Number: #{build_number}")
    increment_build_number(build_number: build_number)

    match(
      type: "appstore",
      readonly: true
    )

    build_app(
      workspace: workspace,
      scheme: scheme,
      export_method: "app-store",
      output_directory: "build",
      output_name: "GTTIANS.ipa",
      clean: true
    )

    case release_target
    when "testflight_internal"
      UI.message("Uploading to TestFlight Internal")
      upload_to_testflight(
        distribute_external: false,
        skip_waiting_for_build_processing: true
      )
    when "testflight_external"
      UI.message("Uploading to TestFlight External")
      upload_to_testflight(
        distribute_external: true,
        groups: ["Beta Testers"],
        skip_waiting_for_build_processing: true
      )
    when "appstore"
      UI.message("Uploading to App Store")
      upload_to_app_store(
        skip_metadata: true,
        skip_screenshots: true,
        submit_for_review: false,
        automatic_release: false
      )
    else
      UI.user_error!("Invalid release target: #{release_target}")
    end

    UI.success("iOS release complete: #{release_target}")
  end
end
```

Expected invocation examples:

```bash
bundle exec fastlane ios release release_target:testflight_internal
bundle exec fastlane ios release release_target:testflight_external
bundle exec fastlane ios release release_target:appstore
```

## GitHub Actions Release Workflow Template

```yaml
name: Mobile Release

on:
  workflow_dispatch:
    inputs:
      android_track:
        description: "Android track (internal | alpha | beta | production)"
        required: true
        default: "internal"
        type: choice
        options:
          - internal
          - alpha
          - beta
          - production
      ios_release_target:
        description: "iOS release target (testflight_internal | testflight_external | appstore)"
        required: true
        default: "testflight_internal"
        type: choice
        options:
          - testflight_internal
          - testflight_external
          - appstore
  push:
    tags:
      - "v*.*.*"

concurrency:
  group: mobile-release-${{ github.ref }}
  cancel-in-progress: false

jobs:
  release:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - name: Verify required secrets exist
        run: |
          test -n "${GOOGLE_PLAY_JSON_KEY_BASE64:-}" || (echo "Missing GOOGLE_PLAY_JSON_KEY_BASE64 secret" && exit 1)
          test -n "${APP_STORE_CONNECT_API_KEY_BASE64:-}" || (echo "Missing APP_STORE_CONNECT_API_KEY_BASE64 secret" && exit 1)
        env:
          GOOGLE_PLAY_JSON_KEY_BASE64: ${{ secrets.GOOGLE_PLAY_JSON_KEY_BASE64 }}
          APP_STORE_CONNECT_API_KEY_BASE64: ${{ secrets.APP_STORE_CONNECT_API_KEY_BASE64 }}
      - uses: ruby/setup-ruby@v1
        with:
          bundler-cache: true
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - name: Install dependencies
        run: |
          npm ci
          bundle install
      - name: Decode Play key
        run: echo "$GOOGLE_PLAY_JSON_KEY_BASE64" | base64 --decode > fastlane/play-store-account.json
        env:
          GOOGLE_PLAY_JSON_KEY_BASE64: ${{ secrets.GOOGLE_PLAY_JSON_KEY_BASE64 }}
      - name: Decode App Store key
        run: echo "$APP_STORE_CONNECT_API_KEY_BASE64" | base64 --decode > fastlane/AuthKey.p8
        env:
          APP_STORE_CONNECT_API_KEY_BASE64: ${{ secrets.APP_STORE_CONNECT_API_KEY_BASE64 }}
      - name: Run tests
        run: npm test -- --ci
      - name: Resolve release targets
        id: release-targets
        run: |
          if [ "${{ github.event_name }}" = "workflow_dispatch" ]; then
            echo "android_track=${{ github.event.inputs.android_track }}" >> "$GITHUB_OUTPUT"
            echo "ios_release_target=${{ github.event.inputs.ios_release_target }}" >> "$GITHUB_OUTPUT"
          else
            echo "android_track=internal" >> "$GITHUB_OUTPUT"
            echo "ios_release_target=testflight_internal" >> "$GITHUB_OUTPUT"
          fi
      - name: Android release (dynamic lane)
        run: bundle exec fastlane android deploy track:${{ steps.release-targets.outputs.android_track }}
        env:
          VERSION_NAME: ${{ github.ref_name }}
      - name: iOS release (dynamic lane)
        run: bundle exec fastlane ios release release_target:${{ steps.release-targets.outputs.ios_release_target }}
```

## GitHub Actions Concurrency Guard

Use a single release concurrency group per branch or tag to prevent duplicate Android `versionCode` allocation when two workflows run at the same time.

```yaml
concurrency:
  group: mobile-release-${{ github.ref }}
  cancel-in-progress: false
```

For manual release workflows, keep `cancel-in-progress: false` so an active deployment is not interrupted mid-publish.

## Versioning Strategy

- Parse semantic version from Git tag (`vX.Y.Z`) and write to app version fields.
- Auto-increment Android `versionCode` on each CI release.
- Auto-increment iOS `CFBundleVersion` per build.
- Promote from internal/beta to production only after verification gates pass.

## Release Channel Strategy

- Android: `internal` -> `beta` -> `production`.
- iOS: TestFlight external testers -> App Store submission.
- Require explicit approval for production lane invocation.

## Monorepo Targeting Notes

- Resolve target app directory before lane execution.
- Execute Fastlane from app directory containing `ios/` and `android/`.
- Use path-aware env variables when the repository contains multiple apps.

## Rollback / Hotfix Playbook

- Create `hotfix/<version>` branch from latest production tag.
- Ship patched build to internal/TestFlight first.
- Promote only after smoke/E2E pass.
- Communicate rollback reason, impact window, and next stable target.

## Common Pitfalls

- Committing real credential files.
- Reusing same build number for multiple iOS uploads.
- Running parallel Android release jobs that compute the same next version code.
- Missing Play Developer API permissions for track version lookups.
- Promoting to production without staged validation.
- Running lanes from wrong directory in monorepos.

## Related Skills

- [publish-checklist.md](publish-checklist.md)
- [e2e-prepublish-tests.md](e2e-prepublish-tests.md)
