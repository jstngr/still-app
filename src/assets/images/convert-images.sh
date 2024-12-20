#!/bin/bash

# Define the input directory (you can modify this if you want a specific path)
INPUT_DIR="./"  # Current directory
OUTPUT_DIR="./"  # Directory to save the WebP images

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Loop through all PNG and JPG images in the directory
for image in "$INPUT_DIR"/*.{png,jpg,jpeg}; do
  if [[ -f "$image" ]]; then
    # Get the file extension and the base filename
    extension="${image##*.}"
    filename=$(basename -- "$image")
    filename_noext="${filename%.*}"
    
    # Define output WebP file path
    output="$OUTPUT_DIR/$filename_noext.webp"
    
    # Convert the image to WebP using cwebp
    echo "Converting $image to $output"
    cwebp "$image" -o "$output"
  fi
done

echo "Conversion complete!"


# Make the script executable: Run the following command in the terminal:

# chmod +x convert-images.sh

# Execute the script: To convert the images, simply run:

# ./convert-images.sh