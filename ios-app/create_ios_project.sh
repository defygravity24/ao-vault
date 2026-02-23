#!/bin/bash

# Create iOS App for AO Vault
echo "Creating AO Vault iOS App..."

# Create the Xcode project
cd ~/Desktop/ao-vault/ios-app

# Create a new iOS app using Swift
xcodegen_installed=$(which xcodegen)
if [ -z "$xcodegen_installed" ]; then
    echo "Installing XcodeGen..."
    brew install xcodegen
fi

# Create project structure
mkdir -p AOVault
mkdir -p AOVault/Sources
mkdir -p AOVault/Resources

echo "iOS app structure created. Please open Xcode to create the project manually."