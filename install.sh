#!/bin/bash

# Avoid Darwin
if [[ "$OSTYPE" != "linux-gnu" ]]; then
  echo "The automated installation script does not support your OS (are you on a Mac?). You can most probably install Clover manually."
  exit
fi

# Welcome
echo ""
echo "Initializing Clover installer..."

# Build Essentials
sudo apt-get update
sudo apt-get install build-essential -y
sudo apt-get install python -y

# curl - nvm - Node.js - Yarn - pm2
echo ""
echo "Installing curl..."
sudo apt-get install curl -y
echo "Installing nvm..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
. ~/.nvm/nvm.sh
. ~/.profile
. ~/.bashrc
echo "Installing Node.js 14.15.3..."
nvm install 14.15.3
echo "Installing Yarn..."
sudo curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt install --no-install-recommends yarn
echo "Installing pm2 globally..."
yarn global add pm2
cd scripts || exit
yarn
node ./install.js
