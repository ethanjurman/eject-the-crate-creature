#!/bin/bash

# Define the text file
TEXT_FILE="./audio/dialog.txt"

# Read each line and generate a WAV file
while IFS='|' read -r key value; do
    if [[ -n "$key" && -n "$value" ]]; then
        # Create a filename-friendly version of the key
        sanitized_key=$(echo "$key" | tr ' ' '_' | tr -d '[:punct:]')

        # Generate speech file
        echo "Generating: ${sanitized_key}.wav -> '$value'"
        espeak-ng.exe "$value" -w "./audio/en/${sanitized_key}.wav"
    fi
done < "$TEXT_FILE"
