#!/bin/bash
set -e

echo "Pre-build 16 KB Alignment Check"
echo "----------------------------------"

RISK_FOUND=0

#######################################
# 1) NDK version check (SAFE)
#######################################
NDK_LINE=$(grep -R "ndkVersion" android 2>/dev/null | head -n1 || true)

if [[ -z "$NDK_LINE" ]]; then
  echo "WARNING: NDK version not specified (recommended r26+)"
  RISK_FOUND=1
else
  if [[ "$NDK_LINE" =~ ([0-9]+) ]]; then
    NDK_MAJOR="${BASH_REMATCH[1]}"

    if (( NDK_MAJOR < 26 )); then
      echo "ERROR: NDK major version $NDK_MAJOR detected (requires r26+)"
      RISK_FOUND=1
    else
      echo "OK: NDK major version $NDK_MAJOR"
    fi
  else
    echo "WARNING: Unable to parse NDK version (non-literal value)"
    RISK_FOUND=1
  fi
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
  echo "OK: No native binaries found in node_modules"
else
  echo "WARNING: Native binaries detected:"
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
  echo "OK: No prebuilt native libraries detected"
else
  echo "WARNING: Prebuilt native libraries detected (HIGH RISK)"
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
  echo "OK: Rebuilt native code detected (safe)"
else
  echo "INFO: No rebuilt native code detected"
fi

#######################################
# 5) CMake page size configuration
#######################################
echo
echo "Checking CMake page size configuration..."

CMAKE_CONFIGURED=0

# 🔹 Check Gradle arguments
if grep -R "CMAKE_ANDROID_PAGE_SIZE" android 2>/dev/null | grep -q "16384"; then
  echo "OK: CMAKE_ANDROID_PAGE_SIZE configured via Gradle arguments"
  CMAKE_CONFIGURED=1
fi

# 🔹 Check CMakeLists.txt
if [[ $CMAKE_CONFIGURED -eq 0 ]]; then
  if find android -name "CMakeLists.txt" -exec grep -q "CMAKE_ANDROID_PAGE_SIZE" {} \; 2>/dev/null; then
    echo "OK: CMAKE_ANDROID_PAGE_SIZE configured in CMakeLists.txt"
    CMAKE_CONFIGURED=1
  fi
fi

if [[ $CMAKE_CONFIGURED -eq 0 ]]; then
  echo "WARNING: CMAKE_ANDROID_PAGE_SIZE not configured"
  RISK_FOUND=1
fi

#######################################
# FINAL SUMMARY
#######################################
echo
echo "----------------------------------"

if [[ $RISK_FOUND -eq 0 ]]; then
  echo "Pre-build scan complete"
  echo "No 16 KB alignment risks detected"
else
  echo "Pre-build scan complete"
  echo "Potential 16 KB alignment risks detected"
  echo "Final validation must be done post-build"
fi
