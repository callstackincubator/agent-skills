#!/bin/bash
progname="${0##*/}"
progname="${progname%.sh}"

# usage: check_elf_alignment.sh [path to *.so files|path to *.apk]

cleanup_trap() {
  if [ -n "${tmp}" -a -d "${tmp}" ]; then
    rm -rf ${tmp}
  fi
  exit $1
}

usage() {
  echo "Host side script to check the ELF alignment of shared libraries."
  echo "Shared libraries are reported ALIGNED when their ELF regions are"
  echo "16 KB or 64 KB aligned. Otherwise they are reported as UNALIGNED."
  echo
  echo "Usage: ${progname} [input-path|input-APK|input-APEX]"
}

if [ ${#} -ne 1 ]; then
  usage
  exit
fi

case ${1} in
  --help | -h | -\?)
    usage
    exit
    ;;

  *)
    dir="${1}"
    ;;
esac

if ! [ -f "${dir}" -o -d "${dir}" ]; then
  echo "Invalid file: ${dir}" >&2
  exit 1
fi

if [[ "${dir}" == *.apk ]]; then
  trap 'cleanup_trap' EXIT

  echo
  echo "Recursively analyzing $dir"
  echo

  if { zipalign --help 2>&1 | grep -q "\-P <pagesize_kb>"; }; then
    echo "=== APK zip-alignment ==="
    zipalign -v -c -P 16 4 "${dir}" | egrep 'lib/arm64-v8a|lib/x86_64|Verification'
    echo "========================="
  else
    echo "NOTICE: Zip alignment check requires build-tools version 35.0.0-rc3 or higher."
    echo "  You can install the latest build-tools by running the below command"
    echo "  and updating your \$PATH:"
    echo
    echo "    sdkmanager \"build-tools;35.0.0-rc3\""
  fi

  dir_filename=$(basename "${dir}")
  tmp=$(mktemp -d -t "${dir_filename%.apk}_out_XXXXX")
  unzip "${dir}" lib/* -d "${tmp}" >/dev/null 2>&1
  dir="${tmp}"
fi

if [[ "${dir}" == *.apex ]]; then
  trap 'cleanup_trap' EXIT

  echo
  echo "Recursively analyzing $dir"
  echo

  dir_filename=$(basename "${dir}")
  tmp=$(mktemp -d -t "${dir_filename%.apex}_out_XXXXX")
  deapexer extract "${dir}" "${tmp}" || { echo "Failed to deapex." && exit 1; }
  dir="${tmp}"
fi

RED="\e[31m"
GREEN="\e[32m"
YELLOW="\e[33m"
ENDCOLOR="\e[0m"

unaligned_libs=()
needs_update=()

# Function to check if a library needs alignment
needs_alignment() {
  local lib_path="$1"
  # Check if it's a 64-bit architecture that requires alignment
  if [[ "${lib_path}" == *"arm64-v8a"* ]] || [[ "${lib_path}" == *"x86_64"* ]]; then
    return 0  # true - needs alignment
  else
    return 1  # false - doesn't need alignment
  fi
}

echo
echo "=== ELF alignment ==="

matches="$(find "${dir}" -type f)"
IFS=$'\n'
for match in $matches; do
  # We could recursively call this script or rewrite it to though.
  [[ "${match}" == *".apk" ]] && echo "WARNING: doesn't recursively inspect .apk file: ${match}"
  [[ "${match}" == *".apex" ]] && echo "WARNING: doesn't recursively inspect .apex file: ${match}"

  [[ $(file "${match}") == *"ELF"* ]] || continue

  res="$(objdump -p "${match}" | grep LOAD | awk '{ print $NF }' | head -1)"
  if [[ $res =~ 2\*\*(1[4-9]|[2-9][0-9]|[1-9][0-9]{2,}) ]]; then
    echo -e "${match}: ${GREEN}ALIGNED${ENDCOLOR} ($res)"
  else
    if needs_alignment "${match}"; then
      echo -e "${match}: ${RED}UNALIGNED${ENDCOLOR} ($res) ${RED}[NEEDS UPDATE]${ENDCOLOR}"
      needs_update+=("${match}")
    else
      echo -e "${match}: ${YELLOW}UNALIGNED${ENDCOLOR} ($res) ${YELLOW}[UPDATE NOT REQUIRED]${ENDCOLOR}"
    fi
    unaligned_libs+=("${match}")
  fi
done

echo "====================="
echo
echo "=== Summary ==="
total_libs=${#matches[@]}
aligned_libs=0
unaligned_need_update=${#needs_update[@]}
unaligned_no_update=$((${#unaligned_libs[@]} - ${#needs_update[@]}))

# Count aligned libs
IFS=$'\n'
for match in $matches; do
  [[ $(file "${match}") == *"ELF"* ]] || continue
  res="$(objdump -p "${match}" | grep LOAD | awk '{ print $NF }' | head -1)"
  if [[ $res =~ 2\*\*(1[4-9]|[2-9][0-9]|[1-9][0-9]{2,}) ]]; then
    ((aligned_libs++))
  fi
done

echo "Total ELF libraries found: ${aligned_libs} + ${#unaligned_libs[@]} = $((aligned_libs + ${#unaligned_libs[@]}))"
echo -e "${GREEN}Aligned libraries: ${aligned_libs}${ENDCOLOR}"
echo -e "${RED}Unaligned (NEED UPDATE): ${unaligned_need_update}${ENDCOLOR}"
echo -e "${YELLOW}Unaligned (update NOT required): ${unaligned_no_update}${ENDCOLOR}"
echo

if [ ${unaligned_need_update} -gt 0 ]; then
  echo -e "${RED}⚠ Action required: ${unaligned_need_update} libraries need alignment updates${ENDCOLOR}"
else
  echo -e "${GREEN}✓ All required libraries are properly aligned!${ENDCOLOR}"
fi

echo "================"