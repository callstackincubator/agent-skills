---
title: Workflow Wiring and Artifact Downloads
impact: CRITICAL
tags: github-actions, workflow, artifacts, gh-cli, rest-api
---

# Skill: Workflow Wiring and Artifact Downloads

Use this workflow to run both platform builds in cloud CI and expose artifact metadata for scripted retrieval.

## Quick Config

1. Create `.github/workflows/rn-cloud-build.yml`.
2. Call local composite actions from this skill (`rn-ios-build`, `rn-android-build`).
3. Keep `actions/upload-artifact@v4` output IDs.
4. Add signing secrets only when needed.
5. Retrieve with `gh run download` or `gh api`.

## When to Use

- Need one pipeline for iOS and Android build artifacts.
- Need PR and manual dispatch triggers.
- Need deterministic artifact retrieval in CI/CD or external tooling.

## Workflow Template (`.github/workflows/rn-cloud-build.yml`)

```yaml
name: RN Cloud Build

on:
  pull_request:
    branches: [main]
  workflow_dispatch:
    inputs:
      ios_destination:
        description: iOS destination
        required: true
        default: simulator
        type: choice
        options: [simulator, device]
      android_variant:
        description: Android Gradle variant
        required: true
        default: Debug
        type: string
      android_binary:
        description: Android output type
        required: true
        default: apk
        type: choice
        options: [apk, aab]

permissions:
  contents: read
  actions: read

jobs:
  ios:
    name: iOS build
    runs-on: macos-14
    outputs:
      artifact_name: ${{ steps.build.outputs.artifact-name }}
      artifact_id: ${{ steps.build.outputs.artifact-id }}
      artifact_url: ${{ steps.build.outputs.artifact-url }}
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install JS dependencies
        run: npm ci

      - name: Install CocoaPods
        run: |
          cd ios
          pod install --repo-update

      - name: Determine iOS destination
        id: ios-destination
        run: |
          if [[ "${{ github.event_name }}" == "workflow_dispatch" ]]; then
            echo "value=${{ inputs.ios_destination }}" >> "$GITHUB_OUTPUT"
          else
            echo "value=simulator" >> "$GITHUB_OUTPUT"
          fi

      - name: Build iOS
        id: build
        uses: ./.github/actions/rn-ios-build
        with:
          scheme: YourApp
          configuration: Debug
          destination: ${{ steps.ios-destination.outputs.value }}
          export-options-plist-base64: ${{ steps.ios-destination.outputs.value == 'device' && secrets.IOS_EXPORT_OPTIONS_PLIST_BASE64 || '' }}
          artifact-prefix: rn-ios

  android:
    name: Android build
    runs-on: ubuntu-latest
    outputs:
      artifact_name: ${{ steps.build.outputs.artifact-name }}
      artifact_id: ${{ steps.build.outputs.artifact-id }}
      artifact_url: ${{ steps.build.outputs.artifact-url }}
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '17'
          cache: gradle

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install JS dependencies
        run: npm ci

      - name: Determine Android params
        id: android-params
        run: |
          if [[ "${{ github.event_name }}" == "workflow_dispatch" ]]; then
            echo "variant=${{ inputs.android_variant }}" >> "$GITHUB_OUTPUT"
            echo "binary=${{ inputs.android_binary }}" >> "$GITHUB_OUTPUT"
          else
            echo "variant=Debug" >> "$GITHUB_OUTPUT"
            echo "binary=apk" >> "$GITHUB_OUTPUT"
          fi

      - name: Build Android
        id: build
        uses: ./.github/actions/rn-android-build
        with:
          variant: ${{ steps.android-params.outputs.variant }}
          binary: ${{ steps.android-params.outputs.binary }}
          artifact-prefix: rn-android

  summary:
    name: Build summary
    runs-on: ubuntu-latest
    needs: [ios, android]
    steps:
      - name: Publish artifact metadata
        run: |
          {
            echo "## RN Cloud Build Artifacts"
            echo ""
            echo "- iOS: name=${{ needs.ios.outputs.artifact_name }}, id=${{ needs.ios.outputs.artifact_id }}"
            echo "- Android: name=${{ needs.android.outputs.artifact_name }}, id=${{ needs.android.outputs.artifact_id }}"
            echo ""
            echo "Artifact URLs (auth required):"
            echo "- iOS: ${{ needs.ios.outputs.artifact_url }}"
            echo "- Android: ${{ needs.android.outputs.artifact_url }}"
          } >> "$GITHUB_STEP_SUMMARY"
```

## Download Artifacts with `gh`

```bash
# 1) Find recent runs for this workflow
gh run list --workflow "RN Cloud Build" --limit 10

# 2) Download by run id + artifact name
gh run download <run-id> -n <artifact-name> -D ./artifacts

# 3) Inspect artifacts for a run (IDs + names)
gh api repos/<owner>/<repo>/actions/runs/<run-id>/artifacts \
  --jq '.artifacts[] | {id, name, size_in_bytes, expired}'
```

## Download Artifacts with Direct REST API

```bash
# List repo artifacts
curl -sS \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/<owner>/<repo>/actions/artifacts" | jq '.artifacts[] | {id, name}'

# Download one artifact zip by ID
curl -L \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/<owner>/<repo>/actions/artifacts/<artifact-id>/zip" \
  -o artifact.zip
```

## Common Pitfalls

- Forgetting to set `permissions.actions: read` for API-driven artifact listing.
- Assuming artifact URLs are public; they require authenticated access.
- Not pinning artifact names, making `gh run download -n` brittle.
- Using `Release` on PR builds without signing inputs.

## Related Skills

- [gha-ios-composite-action.md](gha-ios-composite-action.md)
- [gha-android-composite-action.md](gha-android-composite-action.md)
