const fs = require('fs');
const path = require('path');
const crx = require("crx-util");

const outputDir = './extensions/grass-node.crx'

async function downloadCRXFile(extensionId, extensionName) {
    try {
      const response  =  crx.downloadById(`${extensionId}`, "chrome", outputDir);
      console.log('0% <===========================Downloading===========================> 100%');
      console.log(`Downloaded ${extensionName} CRX file to ${outputDir}`);
    } catch (error) {
        throw new Error(`Failed to download CRX file: ${error.message}`);
    }
}

module.exports = {
    downloadCRXFile
};
