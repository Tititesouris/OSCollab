# Revil.js
## Installation
- Fork and clone this repository
- Duplicate the file shapesConfig.example and call it shapesConfig.js. This is a local file and must remain untracked.

## Setup
- Open a terminal in this directory
- If you don't already have Node.js installed, run `sudo apt-get install nodejs`
- Run `sudo npm install -g browserify`, `npm install ws`, `npm install osc` and `npm install deepmerge`

## Usage
- Make modifications to the code
- Modify shapesConfig.js to fit the Revil scene
- Run `browserify revil.js -o bundle.js`
- Run `node udp2ws.js`
- Open `revil.html` in your browser