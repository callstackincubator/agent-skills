#!/bin/bash
set -e

echo "Pre-build 16 KB Alignment Check"
echo "----------------------------------"

RISK_FOUND=0

#######################################
# 1) Auto-detect and verify NDK version
#######################################
echo "Auto-detecting NDK version..."

# Try multiple methods to detect NDK version
NDK_VERSION=""
NDK_MAJOR=0

# Method 1: Check android/build.gradle for ndkVersion in buildscript
if [[ -f "android/build.gradle" ]]; then
  NDK_LINE=$(grep -E "ndkVersion\s*=" android/build.gradle | head -n1 || true)
  
  if [[ -n "$NDK_LINE" ]]; then
    if [[ "$NDK_LINE" =~ \"([0-9]+)\.([0-9]+)\.([0-9]+)\" ]] || [[ "$NDK_LINE" =~ \'([0-9]+)\.([0-9]+)\.([0-9]+)\' ]]; then
      NDK_VERSION="${BASH_REMATCH[1]}.${BASH_REMATCH[2]}.${BASH_REMATCH[3]}"
      NDK_MAJOR="${BASH_REMATCH[1]}"
      echo "✓ NDK version detected from android/build.gradle: $NDK_VERSION"
    fi
  fi
fi

# Method 2: Check app/build.gradle if not found
if [[ -z "$NDK_VERSION" ]] && [[ -f "android/app/build.gradle" ]]; then
  NDK_LINE=$(grep -E "ndkVersion\s*=" android/app/build.gradle | head -n1 || true)
  
  if [[ -n "$NDK_LINE" ]]; then
    if [[ "$NDK_LINE" =~ \"([0-9]+)\.([0-9]+)\.([0-9]+)\" ]] || [[ "$NDK_LINE" =~ \'([0-9]+)\.([0-9]+)\.([0-9]+)\' ]]; then
      NDK_VERSION="${BASH_REMATCH[1]}.${BASH_REMATCH[2]}.${BASH_REMATCH[3]}"
      NDK_MAJOR="${BASH_REMATCH[1]}"
      echo "✓ NDK version detected from android/app/build.gradle: $NDK_VERSION"
    fi
  fi
fi

# Method 3: Check ANDROID_NDK_HOME environment variable
if [[ -z "$NDK_VERSION" ]] && [[ -n "$ANDROID_NDK_HOME" ]]; then
  if [[ -f "$ANDROID_NDK_HOME/source.properties" ]]; then
    NDK_FROM_ENV=$(grep "Pkg.Revision" "$ANDROID_NDK_HOME/source.properties" | cut -d'=' -f2 | tr -d ' ')
    if [[ -n "$NDK_FROM_ENV" ]]; then
      NDK_VERSION="$NDK_FROM_ENV"
      NDK_MAJOR=$(echo "$NDK_VERSION" | cut -d'.' -f1)
      echo "✓ NDK version detected from ANDROID_NDK_HOME: $NDK_VERSION"
    fi
  fi
fi

# Method 4: Check local.properties
if [[ -z "$NDK_VERSION" ]] && [[ -f "android/local.properties" ]]; then
  NDK_DIR=$(grep "ndk.dir" android/local.properties | cut -d'=' -f2 | tr -d ' ' || true)
  if [[ -n "$NDK_DIR" ]] && [[ -f "$NDK_DIR/source.properties" ]]; then
    NDK_FROM_LOCAL=$(grep "Pkg.Revision" "$NDK_DIR/source.properties" | cut -d'=' -f2 | tr -d ' ')
    if [[ -n "$NDK_FROM_LOCAL" ]]; then
      NDK_VERSION="$NDK_FROM_LOCAL"
      NDK_MAJOR=$(echo "$NDK_VERSION" | cut -d'.' -f1)
      echo "✓ NDK version detected from local.properties: $NDK_VERSION"
    fi
  fi
fi

# Evaluate NDK version
echo
if [[ -z "$NDK_VERSION" ]]; then
  echo "⚠ WARNING: Unable to auto-detect NDK version"
  echo "  Recommendation: Specify ndkVersion in android/app/build.gradle"
  echo "  Example: android { ndkVersion \"26.1.10909125\" }"
  RISK_FOUND=1
  echo
  echo "Proceeding with checks (assuming NDK requirements may not be met)..."
elif (( NDK_MAJOR < 26 )); then
  echo "✗ ERROR: NDK version $NDK_VERSION detected (major: $NDK_MAJOR)"
  echo "  16 KB page size support requires NDK r26 or higher"
  echo "  Current version does NOT support 16 KB alignment"
  RISK_FOUND=1
  echo
  echo "⚠ CRITICAL: Please upgrade to NDK r26+ before proceeding"
  echo "  Add to android/app/build.gradle:"
  echo "  android { ndkVersion \"26.1.10909125\" }"
else
  echo "✓ OK: NDK version $NDK_VERSION (major: $NDK_MAJOR) supports 16 KB page size"
fi

#######################################
# 2) Native binaries in node_modules
#######################################
echo
echo "Scanning node_modules for native binaries..."

NATIVE_FILES=$(find node_modules \
  \( -name "*.so" -o -name "*.aar" -o -name "*.framework" \) \
  2>/dev/null | grep "/android/" || true)

if [[ -z "$NATIVE_FILES" ]]; then
  echo "✓ OK: No native binaries found in node_modules"
else
  echo "⚠ WARNING: Native binaries detected:"
  echo "$NATIVE_FILES"
  RISK_FOUND=1
fi

#######################################
# 3) Prebuilt native libs (jniLibs)
#######################################
echo
echo "Checking for prebuilt native libraries (jniLibs)..."

PREBUILT_LIBS=$(find node_modules -name "*.so" 2>/dev/null | grep "jniLibs" || true)

if [[ -z "$PREBUILT_LIBS" ]]; then
  echo "✓ OK: No prebuilt native libraries detected"
else
  echo "⚠ WARNING: Prebuilt native libraries detected (HIGH RISK)"
  echo "$PREBUILT_LIBS"
  RISK_FOUND=1
fi

#######################################
# 4) Rebuilt native code (safe)
#######################################
echo
echo "Checking for rebuilt native code (CMake / cpp)..."

REBUILT_NATIVE=$(find node_modules -name "CMakeLists.txt" 2>/dev/null || true)

if [[ -n "$REBUILT_NATIVE" ]]; then
  echo "✓ OK: Rebuilt native code detected (safe)"
else
  echo "ℹ INFO: No rebuilt native code detected"
fi

#######################################
# 5) CMake page size configuration
#######################################
echo
echo "Checking CMake page size configuration..."

CMAKE_CONFIGURED=0

# Check Gradle arguments
if grep -R "CMAKE_ANDROID_PAGE_SIZE" android 2>/dev/null | grep -q "16384"; then
  echo "✓ OK: CMAKE_ANDROID_PAGE_SIZE configured via Gradle arguments"
  CMAKE_CONFIGURED=1
fi

# Check CMakeLists.txt
if [[ $CMAKE_CONFIGURED -eq 0 ]]; then
  if find android -name "CMakeLists.txt" -exec grep -q "CMAKE_ANDROID_PAGE_SIZE" {} \; 2>/dev/null; then
    echo "✓ OK: CMAKE_ANDROID_PAGE_SIZE configured in CMakeLists.txt"
    CMAKE_CONFIGURED=1
  fi
fi

if [[ $CMAKE_CONFIGURED -eq 0 ]]; then
  echo "⚠ WARNING: CMAKE_ANDROID_PAGE_SIZE not configured"
  RISK_FOUND=1
fi

#######################################
# FINAL SUMMARY
#######################################
echo
echo "----------------------------------"
echo "Pre-build scan complete"
echo

if [[ $RISK_FOUND -eq 0 ]]; then
  echo "✓ No 16 KB alignment risks detected"
  echo "  Your app appears ready for 16 KB page size support"
else
  echo "⚠ Potential 16 KB alignment risks detected"
  echo "  Review warnings above and ensure:"
  echo "  1. NDK r26+ is installed and configured"
  echo "  2. All native libraries are rebuilt with 16 KB support"
  echo "  3. CMAKE_ANDROID_PAGE_SIZE is set to 16384"
  echo
  echo "  Final validation must be done post-build using:"
  echo "  check_elf_alignment.sh [path-to-apk]"
fi

echo "----------------------------------"