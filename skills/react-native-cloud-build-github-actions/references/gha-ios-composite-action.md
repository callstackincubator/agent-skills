---
title: iOS Composite Action (RN CLI)
impact: HIGH
tags: ios, github-actions, react-native, xcodebuild, artifact
---

# Skill: iOS Composite Action (RN CLI)

Composite action template for building React Native iOS apps in GitHub Actions and uploading `.app.tar.gz` (simulator) or `.ipa` (device) artifacts.

## Quick Config

1. Create `.github/actions/rn-ios-build/action.yml`.
2. Copy the template below.
3. For `destination: device`, pass `export-options-plist-base64` secret.
4. Use `actions/upload-artifact@v4` outputs (`artifact-id`, `artifact-url`).
5. Download later by ID (REST) or by run/name (`gh run download`).

## When to Use

- Need cloud iOS build artifacts for QA, PR validation, or smoke tests.
- Need deterministic artifact naming and machine-readable IDs.
- Need RN CLI project discovery without Rock (`npx react-native config`).

## Prerequisites

- macOS runner (`macos-14` or newer).
- Xcode scheme is known and buildable in CI.
- JS dependencies installed before invoking the action.
- For device `.ipa`: signing/export configuration and `ExportOptions.plist`.

## Template (`.github/actions/rn-ios-build/action.yml`)

```yaml
name: React Native iOS Build
description: Build React Native iOS app in GitHub Actions and upload artifact

inputs:
  working-directory:
    description: Project root
    required: false
    default: "."
  scheme:
    description: Xcode scheme
    required: true
  configuration:
    description: Xcode configuration
    required: false
    default: Debug
  destination:
    description: simulator or device
    required: false
    default: simulator
  workspace-path:
    description: Optional path to .xcworkspace
    required: false
  project-path:
    description: Optional path to .xcodeproj
    required: false
  sdk:
    description: Optional override for SDK
    required: false
  derived-data-path:
    description: DerivedData path relative to working-directory
    required: false
    default: build/ios/DerivedData
  archive-path:
    description: Archive path for device builds
    required: false
    default: build/ios/archive/App.xcarchive
  export-options-plist-base64:
    description: Base64 ExportOptions.plist for device builds
    required: false
  artifact-prefix:
    description: Prefix for artifact naming
    required: false
    default: rn-ios
  custom-identifier:
    description: Optional stable identifier (PR number, channel, etc.)
    required: false
  artifact-retention-days:
    description: GitHub artifact retention
    required: false
    default: "7"

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

        if [[ "${{ inputs.destination }}" != "simulator" && "${{ inputs.destination }}" != "device" ]]; then
          echo "destination must be 'simulator' or 'device'"
          exit 1
        fi

        if [[ -n "${{ inputs.workspace-path }}" && -n "${{ inputs.project-path }}" ]]; then
          echo "Use workspace-path or project-path, not both"
          exit 1
        fi

        if [[ "${{ inputs.destination }}" == "device" && -z "${{ inputs.export-options-plist-base64 }}" ]]; then
          echo "export-options-plist-base64 is required for device builds"
          exit 1
        fi

    - name: Resolve iOS project settings
      id: resolve
      shell: bash
      working-directory: ${{ inputs.working-directory }}
      run: |
        set -euo pipefail

        CONFIG_JSON="$(npx react-native config)"
        IOS_SOURCE_DIR="$(printf '%s' "$CONFIG_JSON" | node -e "const fs=require('fs');const j=JSON.parse(fs.readFileSync(0,'utf8'));process.stdout.write(j.project?.ios?.sourceDir || 'ios')")"

        WORKSPACE="${{ inputs.workspace-path }}"
        PROJECT="${{ inputs.project-path }}"

        if [[ -z "$WORKSPACE" && -z "$PROJECT" ]]; then
          WORKSPACE="$(find "$IOS_SOURCE_DIR" -maxdepth 2 -name '*.xcworkspace' | head -n1 || true)"
          PROJECT="$(find "$IOS_SOURCE_DIR" -maxdepth 2 -name '*.xcodeproj' | head -n1 || true)"
        fi

        if [[ -n "$WORKSPACE" ]]; then
          CONTAINER_KIND="workspace"
          CONTAINER_PATH="$WORKSPACE"
        elif [[ -n "$PROJECT" ]]; then
          CONTAINER_KIND="project"
          CONTAINER_PATH="$PROJECT"
        else
          echo "Could not find .xcworkspace or .xcodeproj"
          exit 1
        fi

        SDK="${{ inputs.sdk }}"
        if [[ -z "$SDK" ]]; then
          if [[ "${{ inputs.destination }}" == "simulator" ]]; then
            SDK="iphonesimulator"
          else
            SDK="iphoneos"
          fi
        fi

        IDENTIFIER="${{ inputs.custom-identifier }}"
        if [[ -z "$IDENTIFIER" ]]; then
          if [[ "${{ github.event_name }}" == "pull_request" ]]; then
            IDENTIFIER="pr-${{ github.event.pull_request.number }}"
          else
            IDENTIFIER="${GITHUB_SHA::7}"
          fi
        fi

        echo "ios_source_dir=$IOS_SOURCE_DIR" >> "$GITHUB_OUTPUT"
        echo "container_kind=$CONTAINER_KIND" >> "$GITHUB_OUTPUT"
        echo "container_path=$CONTAINER_PATH" >> "$GITHUB_OUTPUT"
        echo "sdk=$SDK" >> "$GITHUB_OUTPUT"
        echo "identifier=$IDENTIFIER" >> "$GITHUB_OUTPUT"

    - name: Build iOS (simulator)
      if: ${{ inputs.destination == 'simulator' }}
      shell: bash
      working-directory: ${{ inputs.working-directory }}
      run: |
        set -euo pipefail

        if [[ "${{ steps.resolve.outputs.container_kind }}" == "workspace" ]]; then
          XCODE_CONTAINER=( -workspace "${{ steps.resolve.outputs.container_path }}" )
        else
          XCODE_CONTAINER=( -project "${{ steps.resolve.outputs.container_path }}" )
        fi

        xcodebuild \
          "${XCODE_CONTAINER[@]}" \
          -scheme "${{ inputs.scheme }}" \
          -configuration "${{ inputs.configuration }}" \
          -sdk "${{ steps.resolve.outputs.sdk }}" \
          -destination "generic/platform=iOS Simulator" \
          -derivedDataPath "${{ inputs.derived-data-path }}" \
          CODE_SIGNING_ALLOWED=NO \
          build

    - name: Package simulator app
      if: ${{ inputs.destination == 'simulator' }}
      id: simulator
      shell: bash
      working-directory: ${{ inputs.working-directory }}
      run: |
        set -euo pipefail

        APP_PATH="$(find "${{ inputs.derived-data-path }}/Build/Products" -type d -name '*.app' | head -n1)"
        if [[ -z "$APP_PATH" ]]; then
          echo "No .app found"
          exit 1
        fi

        mkdir -p build/ios
        APP_DIR="$(dirname "$APP_PATH")"
        APP_NAME="$(basename "$APP_PATH")"
        TARBALL="build/ios/${APP_NAME%.app}.app.tar.gz"
        tar -C "$APP_DIR" -czf "$TARBALL" "$APP_NAME"

        echo "artifact_path=$TARBALL" >> "$GITHUB_OUTPUT"

    - name: Build iOS archive (device)
      if: ${{ inputs.destination == 'device' }}
      shell: bash
      working-directory: ${{ inputs.working-directory }}
      run: |
        set -euo pipefail

        if [[ "${{ steps.resolve.outputs.container_kind }}" == "workspace" ]]; then
          XCODE_CONTAINER=( -workspace "${{ steps.resolve.outputs.container_path }}" )
        else
          XCODE_CONTAINER=( -project "${{ steps.resolve.outputs.container_path }}" )
        fi

        xcodebuild \
          "${XCODE_CONTAINER[@]}" \
          -scheme "${{ inputs.scheme }}" \
          -configuration "${{ inputs.configuration }}" \
          -sdk "${{ steps.resolve.outputs.sdk }}" \
          -destination "generic/platform=iOS" \
          -archivePath "${{ inputs.archive-path }}" \
          archive

    - name: Export IPA
      if: ${{ inputs.destination == 'device' }}
      id: device
      shell: bash
      working-directory: ${{ inputs.working-directory }}
      run: |
        set -euo pipefail

        EXPORT_PLIST="$RUNNER_TEMP/ExportOptions.plist"
        printf '%s' "${{ inputs.export-options-plist-base64 }}" | base64 --decode > "$EXPORT_PLIST"

        mkdir -p build/ios/export
        xcodebuild -exportArchive \
          -archivePath "${{ inputs.archive-path }}" \
          -exportPath build/ios/export \
          -exportOptionsPlist "$EXPORT_PLIST"

        IPA_PATH="$(find build/ios/export -type f -name '*.ipa' | head -n1)"
        if [[ -z "$IPA_PATH" ]]; then
          echo "No .ipa found"
          exit 1
        fi

        echo "artifact_path=$IPA_PATH" >> "$GITHUB_OUTPUT"

    - name: Build artifact name
      id: names
      shell: bash
      run: |
        set -euo pipefail

        CONFIG="$(echo "${{ inputs.configuration }}" | tr '[:upper:]' '[:lower:]')"
        NAME="${{ inputs.artifact-prefix }}-${{ inputs.destination }}-${CONFIG}-${{ steps.resolve.outputs.identifier }}"
        echo "artifact_name=$NAME" >> "$GITHUB_OUTPUT"

    - name: Upload artifact
      id: upload
      uses: actions/upload-artifact@v4
      with:
        name: ${{ steps.names.outputs.artifact_name }}
        path: ${{ steps.simulator.outputs.artifact_path || steps.device.outputs.artifact_path }}
        if-no-files-found: error
        retention-days: ${{ inputs.artifact-retention-days }}
```

## Common Pitfalls

- Passing both `workspace-path` and `project-path`.
- Forgetting `ExportOptions.plist` for device builds.
- Uploading `.app` directly instead of `tar.gz` (permission loss risk).
- Using non-macOS runner for iOS jobs.

## Related Skills

- [gha-android-composite-action.md](gha-android-composite-action.md)
- [gha-workflow-and-downloads.md](gha-workflow-and-downloads.md)
