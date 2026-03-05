---
title: Android Composite Action (RN CLI)
impact: HIGH
tags: android, github-actions, react-native, gradle, artifact
---

# Skill: Android Composite Action (RN CLI)

Composite action template for building React Native Android APK/AAB in GitHub Actions and uploading the resulting artifact.

## Quick Config

1. Create `.github/actions/rn-android-build/action.yml`.
2. Copy the template below.
3. Set `binary: apk` or `binary: aab`.
4. For signed builds, provide keystore + passwords via secrets.
5. Use action outputs (`artifact-name`, `artifact-id`, `artifact-url`) in downstream jobs.

## When to Use

- Need cloud Android build artifacts for testing or release promotion.
- Need configurable debug/release builds from one action.
- Need reliable artifact retrieval through `gh` and REST API.

## Prerequisites

- Linux runner with JDK 17.
- React Native dependencies installed.
- Android SDK and Gradle wrapper available in the repository.
- For signed builds: keystore and signing credentials in secrets.

## Template (`.github/actions/rn-android-build/action.yml`)

```yaml
name: React Native Android Build
description: Build React Native Android app in GitHub Actions and upload artifact

inputs:
  working-directory:
    description: Project root
    required: false
    default: "."
  variant:
    description: Build variant (Debug, Release, StagingRelease, etc.)
    required: false
    default: Debug
  binary:
    description: apk or aab
    required: false
    default: apk
  artifact-prefix:
    description: Prefix for artifact naming
    required: false
    default: rn-android
  custom-identifier:
    description: Optional stable identifier (PR number, channel, etc.)
    required: false
  artifact-retention-days:
    description: GitHub artifact retention
    required: false
    default: "7"
  sign:
    description: Enable signed build
    required: false
    default: "false"
  keystore-base64:
    description: Base64 keystore content
    required: false
  keystore-store-password:
    description: Keystore password
    required: false
  keystore-key-alias:
    description: Key alias
    required: false
  keystore-key-password:
    description: Key password
    required: false

outputs:
  artifact-name:
    description: Uploaded artifact name
    value: ${{ steps.names.outputs.artifact_name }}
  artifact-id:
    description: Uploaded artifact id
    value: ${{ steps.upload.outputs.artifact-id }}
  artifact-url:
    description: Uploaded artifact URL
    value: ${{ steps.upload.outputs.artifact-url }}

runs:
  using: composite
  steps:
    - name: Validate inputs
      shell: bash
      run: |
        set -euo pipefail

        if [[ "${{ inputs.binary }}" != "apk" && "${{ inputs.binary }}" != "aab" ]]; then
          echo "binary must be 'apk' or 'aab'"
          exit 1
        fi

        if [[ "${{ inputs.sign }}" == "true" ]]; then
          for required in \
            "${{ inputs.keystore-base64 }}" \
            "${{ inputs.keystore-store-password }}" \
            "${{ inputs.keystore-key-alias }}" \
            "${{ inputs.keystore-key-password }}"; do
            if [[ -z "$required" ]]; then
              echo "Missing signing inputs"
              exit 1
            fi
          done
        fi

    - name: Resolve Android project settings
      id: resolve
      shell: bash
      working-directory: ${{ inputs.working-directory }}
      run: |
        set -euo pipefail

        CONFIG_JSON="$(npx react-native config)"
        ANDROID_SOURCE_DIR="$(printf '%s' "$CONFIG_JSON" | node -e "const fs=require('fs');const j=JSON.parse(fs.readFileSync(0,'utf8'));process.stdout.write(j.project?.android?.sourceDir || 'android')")"
        APP_NAME="$(printf '%s' "$CONFIG_JSON" | node -e "const fs=require('fs');const j=JSON.parse(fs.readFileSync(0,'utf8'));process.stdout.write(j.project?.android?.appName || 'app')")"

        IDENTIFIER="${{ inputs.custom-identifier }}"
        if [[ -z "$IDENTIFIER" ]]; then
          if [[ "${{ github.event_name }}" == "pull_request" ]]; then
            IDENTIFIER="pr-${{ github.event.pull_request.number }}"
          else
            IDENTIFIER="${GITHUB_SHA::7}"
          fi
        fi

        echo "android_source_dir=$ANDROID_SOURCE_DIR" >> "$GITHUB_OUTPUT"
        echo "app_name=$APP_NAME" >> "$GITHUB_OUTPUT"
        echo "identifier=$IDENTIFIER" >> "$GITHUB_OUTPUT"

    - name: Prepare signing properties
      if: ${{ inputs.sign == 'true' }}
      id: signing
      shell: bash
      working-directory: ${{ inputs.working-directory }}
      run: |
        set -euo pipefail

        KEYSTORE_PATH="$RUNNER_TEMP/release.keystore"
        printf '%s' "${{ inputs.keystore-base64 }}" | base64 --decode > "$KEYSTORE_PATH"

        echo "keystore_path=$KEYSTORE_PATH" >> "$GITHUB_OUTPUT"

    - name: Build Android
      id: build
      shell: bash
      working-directory: ${{ inputs.working-directory }}
      run: |
        set -euo pipefail

        VARIANT="${{ inputs.variant }}"
        TASK_SUFFIX="$(echo "$VARIANT" | sed -E 's/(^|-)([a-z])/'"'"'\U\2'"'"'/g')"

        GRADLE_TASK="assemble${TASK_SUFFIX}"
        OUTPUT_ROOT="${{ steps.resolve.outputs.android_source_dir }}/${{ steps.resolve.outputs.app_name }}/build/outputs/apk"
        EXT="apk"

        if [[ "${{ inputs.binary }}" == "aab" ]]; then
          GRADLE_TASK="bundle${TASK_SUFFIX}"
          OUTPUT_ROOT="${{ steps.resolve.outputs.android_source_dir }}/${{ steps.resolve.outputs.app_name }}/build/outputs/bundle"
          EXT="aab"
        fi

        EXTRA_ARGS=()
        if [[ "${{ inputs.sign }}" == "true" ]]; then
          EXTRA_ARGS+=("-Pandroid.injected.signing.store.file=${{ steps.signing.outputs.keystore_path }}")
          EXTRA_ARGS+=("-Pandroid.injected.signing.store.password=${{ inputs.keystore-store-password }}")
          EXTRA_ARGS+=("-Pandroid.injected.signing.key.alias=${{ inputs.keystore-key-alias }}")
          EXTRA_ARGS+=("-Pandroid.injected.signing.key.password=${{ inputs.keystore-key-password }}")
        fi

        (
          cd "${{ steps.resolve.outputs.android_source_dir }}"
          ./gradlew ":${{ steps.resolve.outputs.app_name }}:${GRADLE_TASK}" "${EXTRA_ARGS[@]}"
        )

        BINARY_PATH="$(find "$OUTPUT_ROOT" -type f -name "*.${EXT}" | head -n1)"
        if [[ -z "$BINARY_PATH" ]]; then
          echo "No Android binary found"
          exit 1
        fi

        echo "binary_path=$BINARY_PATH" >> "$GITHUB_OUTPUT"

    - name: Build artifact name
      id: names
      shell: bash
      run: |
        set -euo pipefail

        VARIANT="$(echo "${{ inputs.variant }}" | tr '[:upper:]' '[:lower:]')"
        NAME="${{ inputs.artifact-prefix }}-${{ inputs.binary }}-${VARIANT}-${{ steps.resolve.outputs.identifier }}"
        echo "artifact_name=$NAME" >> "$GITHUB_OUTPUT"

    - name: Upload artifact
      id: upload
      uses: actions/upload-artifact@v4
      with:
        name: ${{ steps.names.outputs.artifact_name }}
        path: ${{ steps.build.outputs.binary_path }}
        if-no-files-found: error
        retention-days: ${{ inputs.artifact-retention-days }}
```

## Common Pitfalls

- Lowercase `variant` values causing wrong Gradle task names.
- Missing JDK setup in caller workflow.
- Attempting signed builds without all `android.injected.signing.*` parameters.
- Hardcoding module name to `app` when `react-native config` reports a custom `appName`.

## Related Skills

- [gha-ios-composite-action.md](gha-ios-composite-action.md)
- [gha-workflow-and-downloads.md](gha-workflow-and-downloads.md)
