const unzip = require("unzip-crx");
const path = require('path');
const fs = require('fs');
const crx = require("crx-util");


const crxPath = './extensions/grass-node.crx';
const extractToPath = './extensions/extracted/grass-node';

async function ExtractCRX() {
  try {
    if (!fs.existsSync(crxPath)) {
      console.error('Error: The CRX file does not exist.');
      return;
    }

    if (!fs.existsSync(extractToPath)) {
      fs.mkdirSync(extractToPath, { recursive: true });
    }

     crx.parser.extract(crxPath, extractToPath);

    console.log('==>  0% ========================== Extracting ============================== 100%');
    console.log('==> Extracted CRX Successfully to:', extractToPath);
  } catch (error) {
    console.error('Error during extraction:', error.message);
  }
}

module.exports = {
  ExtractCRX,
};
