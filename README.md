# Revil.js
## Setup
- Open a terminal in this directory
- If you don't already have Node.js installed, run `sudo apt-get install nodejs`
- Run `sudo npm install -g browserify`, `npm install ws`, `npm install osc` and `npm install deepmerge`

## Usage
- Make modifications to the code
- Run `browserify revil.js -o bundle.js`
- Run `node udp2ws.js`
- Open `revil.html` in your browser