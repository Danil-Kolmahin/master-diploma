#!/bin/sh

SOURCE_DIR=$1
OUTPUT_FILE=$2
IGNORE_FORMATS=("ico")

if [ -z "$SOURCE_DIR" ]; then
  echo "Source directory not provided."
  exit 1
fi

if [ -z "$OUTPUT_FILE" ]; then
  OUTPUT_FILE="combined.txt"
fi

> "$OUTPUT_FILE"

find "$SOURCE_DIR" -type f | while read -r file; do
  extension="${file##*.}"

  skip_file=false
  for ignore in "${IGNORE_FORMATS[@]}"; do
    if [ "$extension" = "$ignore" ]; then
      skip_file=true
      break
    fi
  done

  if [ "$skip_file" = true ]; then
    continue
  fi

  echo "# File: $file" >> "$OUTPUT_FILE"
  cat "$file" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
done
