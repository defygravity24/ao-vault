#!/bin/bash

# AO Vault App Icon Generator
# This script generates all required icon sizes for iOS App Store submission
# Requires: A 1024x1024 source icon named "icon-1024.png" in the same directory

echo "🎨 AO Vault App Icon Generator"
echo "================================"

# Check if source icon exists
if [ ! -f "icon-1024.png" ]; then
    echo "❌ Error: icon-1024.png not found!"
    echo "Please create a 1024x1024 PNG icon first."
    echo ""
    echo "Icon Design Tips:"
    echo "- Use a bold, simple design"
    echo "- Include 'AO' or a lock/vault symbol"
    echo "- Use purple/gold colors (AO3 theme)"
    echo "- No transparency allowed"
    echo "- No rounded corners (Apple adds them)"
    exit 1
fi

# Create AppIcon directory
mkdir -p ios-app/AOVault/Assets.xcassets/AppIcon.appiconset

# Function to resize icon
resize_icon() {
    size=$1
    name=$2
    echo "Creating ${name} (${size}x${size})..."
    sips -z $size $size icon-1024.png --out "ios-app/AOVault/Assets.xcassets/AppIcon.appiconset/${name}"
}

# Generate all required sizes
echo ""
echo "Generating icon sizes..."
echo "------------------------"

# iPhone Notification icons
resize_icon 40 "icon-20@2x.png"  # 20pt @2x
resize_icon 60 "icon-20@3x.png"  # 20pt @3x

# iPhone Settings icons
resize_icon 58 "icon-29@2x.png"  # 29pt @2x
resize_icon 87 "icon-29@3x.png"  # 29pt @3x

# iPhone Spotlight icons
resize_icon 80 "icon-40@2x.png"  # 40pt @2x
resize_icon 120 "icon-40@3x.png" # 40pt @3x

# iPhone App icons
resize_icon 120 "icon-60@2x.png" # 60pt @2x (iPhone)
resize_icon 180 "icon-60@3x.png" # 60pt @3x (iPhone)

# iPad icons
resize_icon 20 "icon-20.png"      # 20pt @1x
resize_icon 40 "icon-20@2x-ipad.png" # 20pt @2x
resize_icon 29 "icon-29.png"      # 29pt @1x
resize_icon 58 "icon-29@2x-ipad.png" # 29pt @2x
resize_icon 40 "icon-40.png"      # 40pt @1x
resize_icon 80 "icon-40@2x-ipad.png" # 40pt @2x
resize_icon 76 "icon-76.png"      # 76pt @1x
resize_icon 152 "icon-76@2x.png"  # 76pt @2x
resize_icon 167 "icon-83.5@2x.png" # 83.5pt @2x (iPad Pro)

# App Store icon
echo "Creating App Store icon..."
cp icon-1024.png "ios-app/AOVault/Assets.xcassets/AppIcon.appiconset/icon-1024.png"

# Create Contents.json for Asset Catalog
cat > ios-app/AOVault/Assets.xcassets/AppIcon.appiconset/Contents.json << 'EOF'
{
  "images" : [
    {
      "idiom" : "iphone",
      "scale" : "2x",
      "size" : "20x20",
      "filename" : "icon-20@2x.png"
    },
    {
      "idiom" : "iphone",
      "scale" : "3x",
      "size" : "20x20",
      "filename" : "icon-20@3x.png"
    },
    {
      "idiom" : "iphone",
      "scale" : "2x",
      "size" : "29x29",
      "filename" : "icon-29@2x.png"
    },
    {
      "idiom" : "iphone",
      "scale" : "3x",
      "size" : "29x29",
      "filename" : "icon-29@3x.png"
    },
    {
      "idiom" : "iphone",
      "scale" : "2x",
      "size" : "40x40",
      "filename" : "icon-40@2x.png"
    },
    {
      "idiom" : "iphone",
      "scale" : "3x",
      "size" : "40x40",
      "filename" : "icon-40@3x.png"
    },
    {
      "idiom" : "iphone",
      "scale" : "2x",
      "size" : "60x60",
      "filename" : "icon-60@2x.png"
    },
    {
      "idiom" : "iphone",
      "scale" : "3x",
      "size" : "60x60",
      "filename" : "icon-60@3x.png"
    },
    {
      "idiom" : "ipad",
      "scale" : "1x",
      "size" : "20x20",
      "filename" : "icon-20.png"
    },
    {
      "idiom" : "ipad",
      "scale" : "2x",
      "size" : "20x20",
      "filename" : "icon-20@2x-ipad.png"
    },
    {
      "idiom" : "ipad",
      "scale" : "1x",
      "size" : "29x29",
      "filename" : "icon-29.png"
    },
    {
      "idiom" : "ipad",
      "scale" : "2x",
      "size" : "29x29",
      "filename" : "icon-29@2x-ipad.png"
    },
    {
      "idiom" : "ipad",
      "scale" : "1x",
      "size" : "40x40",
      "filename" : "icon-40.png"
    },
    {
      "idiom" : "ipad",
      "scale" : "2x",
      "size" : "40x40",
      "filename" : "icon-40@2x-ipad.png"
    },
    {
      "idiom" : "ipad",
      "scale" : "1x",
      "size" : "76x76",
      "filename" : "icon-76.png"
    },
    {
      "idiom" : "ipad",
      "scale" : "2x",
      "size" : "76x76",
      "filename" : "icon-76@2x.png"
    },
    {
      "idiom" : "ipad",
      "scale" : "2x",
      "size" : "83.5x83.5",
      "filename" : "icon-83.5@2x.png"
    },
    {
      "idiom" : "ios-marketing",
      "scale" : "1x",
      "size" : "1024x1024",
      "filename" : "icon-1024.png"
    }
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}
EOF

echo ""
echo "✅ Success! All app icons generated."
echo ""
echo "📁 Icons saved to: ios-app/AOVault/Assets.xcassets/AppIcon.appiconset/"
echo ""
echo "Next steps:"
echo "1. Open the Xcode project"
echo "2. The icons will automatically be recognized"
echo "3. Build and test on a device"
echo ""
echo "Remember to create icon-1024.png first with your design!"