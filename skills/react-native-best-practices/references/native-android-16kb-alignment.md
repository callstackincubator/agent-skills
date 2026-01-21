---
title: Native Android 16 KB Alignment
impact: CRITICAL
tags: android, native, 16kb, alignment, page-size, build, arm64, x86_64, react-native
---

# Native Android 16 KB page size alignment

---

## Quick Reference

| Item                 | Details                     |
| -------------------- | --------------------------- |
| Android versions     | Android 14+ (API 34)        |
| React Native support | React Native >= 0.79        |
| Affected ABIs        | `arm64-v8a`, `x86_64`       |
| Not affected         | `armeabi-v7a`, `x86`        |
| Required alignment   | `p_align >= 0x4000` (16 KB) |

---

## Quick Pattern

### Incorrect (will fail on 16 KB devices)

```text
ALIGN 0x1000
```

### Correct

```text
ALIGN 0x4000
```

---

## Quick Command

### Pre-build 16 KB Alignment Check (recommended)

Run this check **before building** to catch common issues in legacy projects:

```bash
bash scripts/prebuild_16kb_check.sh
```

This pre-build check helps detect:

* legacy prebuilt native libraries
* high-risk upgrade scenarios

> This check is preventive. Final validation must still be performed on built artifacts.

---

### Post-build Verification (macOS / Linux / Windows)

Use Android’s official ELF alignment script after generating an APK or AAB:

```bash
bash scripts/check_elf_alignment.sh android/app/build/outputs/apk/release/app-release.apk
```

Script source:
[https://cs.android.com/android/platform/superproject/main/+/main:system/extras/tools/check_elf_alignment.sh](https://cs.android.com/android/platform/superproject/main/+/main:system/extras/tools/check_elf_alignment.sh)

---

### Post-build Verification (Windows)

On Windows, use `llvm-readelf` from the Android NDK:

```powershell
llvm-readelf -l libexample.so
```

Look for an `ALIGN` value of `0x4000` or higher.

---

## Deep Dive

### Background

Starting with **Android 14 (API 34)**, devices may use a **16 KB memory page size**.
Native shared libraries (`.so` files) that are not aligned to 16 KB may:

* crash at runtime on 16 KB page-size devices
* be rejected by Google Play during validation

React Native supports 16 KB page sizes starting from **React Native 0.79**.
When using React Native >= 0.79, React Native core and Hermes binaries are built
with correct alignment.

However, **third-party native libraries** included in an app may still be
misaligned, especially in **legacy apps** or when using SDKs that ship
prebuilt `.so` files.

---

### When to Use

Verify native library alignment when:

* upgrading a legacy app to React Native >= 0.79
* adding or updating third-party SDKs with native code
* preparing a release for Google Play
* investigating crashes on Android 14+ devices

Upgrading React Native alone does **not** rebuild third-party native binaries.

---

### What Needs to Be Aligned

Only **64-bit ABIs** are affected by the 16 KB page size requirement:

* **Requires alignment**: `arm64-v8a`, `x86_64`
* **Not affected**: `armeabi-v7a` (32-bit), `x86` (32-bit)

If an unaligned library is present only for a 32-bit ABI, no action is required.

---

### Step-by-Step

1. Run the **pre-build 16 KB alignment check**:

   ```bash
   bash scripts/prebuild_16kb_check.sh
   ```

2. Build the APK or AAB.

3. Verify ELF alignment:

   * macOS / Linux: use the official Android script
   * Windows: use `llvm-readelf` from the Android NDK

4. Identify unaligned `arm64-v8a` or `x86_64` libraries.

5. Update, rebuild, or replace the affected libraries.

---

### Common Pitfalls

* Assuming a React Native upgrade rebuilds third-party native libraries
* Ignoring ABI-specific failures (only 64-bit ABIs are affected)
* Using `zipalign` instead of checking ELF alignment
* Validating only debug builds and skipping release artifacts

---

### How Alignment Issues Are Fixed

Alignment issues cannot be fixed by packaging alone.
They require **replacing or rebuilding** the affected native libraries.

Typical options include:

* updating the SDK to a version built with a modern Android toolchain
* requesting a 16 KB–compatible build from the vendor
* rebuilding the library from source
* removing unused native dependencies

---

## References

* Android documentation:
  [https://developer.android.com/guide/practices/page-sizes](https://developer.android.com/guide/practices/page-sizes)
