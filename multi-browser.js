// Import necessary libraries
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');
const crx = require("crx-util");

// Modules for downloading and extracting CRX files
const { downloadCRXFile } = require('./modules/downloadCRX.module.js');
const { ExtractCRX } = require('./modules/CRXExtractor.module.js');

// Use Puppeteer Stealth
puppeteer.use(StealthPlugin());

// Define CRX download and extraction paths
const extensionId = 'ilehaonighjijnmpnagapkhpcdbhclfg';
const extensionName = 'grass-lite-node';
const extractedName = 'grass-node';

const extensionPath = path.resolve(__dirname, './');
const crxPath = './grass-node.crx';
const extractToPath = './';

// User agent list for browser automation
const userAgents = JSON.parse(fs.readFileSync('./user-agents.json', 'utf-8'));
const shuffledUserAgents = [...userAgents].sort(() => Math.random() - 0.5);

// Function to download CRX file
async function downloadCRXFile(extensionId, extensionName) {
    try {
        await crx.downloadById(`${extensionId}`, "chrome", './grass-node.crx');
        console.log('0% <===========================Downloading===========================> 100%');
        console.log(`Downloaded ${extensionName} CRX file to ./extensions/grass-node.crx`);
    } catch (error) {
        throw new Error(`Failed to download CRX file: ${error.message}`);
    }
}

// Function to extract CRX file
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

// Main script execution
(async () => {
    const browserCount = 3;
    const tasks = [];

    const message = await downloadCRXFile(extensionId, extensionName);
    console.log(message);

    await ExtractCRX();

    for (let i = 0; i < browserCount; i++) {
        tasks.push((async () => {
            if (shuffledUserAgents.length === 0) {
                throw new Error('No more unique user agents available.');
            }
            const randomUserAgent = shuffledUserAgents.pop(); 

            const browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    `--disable-extensions-except=${extensionPath}`,
                    `--load-extension=${extensionPath}`
                ],
                defaultViewport: null,
                ignoreHTTPSErrors: true,
            });

            const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

            const page = await browser.newPage();
            await page.setUserAgent(randomUserAgent);
            console.log(`Browser ${i + 1} launched with user agent: ${randomUserAgent}`);

            await page.goto(`chrome-extension://${extensionId}/index.html`);
            const title = await page.title();
            console.log(`Browser ${i + 1} visited: ${title}`);

            // Focus on the page (bring it to the front)
            await page.bringToFront();
            console.log(`Browser ${i + 1} focused.`);

            const newPage = await browser.newPage();
            await newPage.goto('https://app.getgrass.io/', { waitUntil: 'networkidle0', timeout: 60000 });
            const newPageTitle = await newPage.title();
            console.log(`New page in Browser ${i + 1} visited: ${newPageTitle} To Log In`);

            // Click Accept Cookie Button
            const CookieButtonSelector = '.chakra-button.css-1fjpdqi';
            await newPage.waitForSelector(CookieButtonSelector);
            await newPage.click(CookieButtonSelector);

            await delay(10000);

            // Enter Username and Password
            const usernameInputSelector = 'input[name="user"]';
            const passwordInputSelector = 'input[name="password"]';
            const loginButtonSelector = '.chakra-button.css-b4gyfj';

            await newPage.waitForSelector(usernameInputSelector);
            await newPage.type(usernameInputSelector, 'judenwadinobi@gmail.com');
            await newPage.waitForSelector(passwordInputSelector);
            await newPage.type(passwordInputSelector, 'Cro$$2005');
            await newPage.waitForSelector(loginButtonSelector);
            await newPage.click(loginButtonSelector);
            console.log(`Logged in Successfully Browser ${i + 1}.`);

            try {
                await newPage.waitForSelector(CookieButtonSelector);
                await newPage.click(CookieButtonSelector);
            } catch (error) {
                console.error(`Failed to close cookies in Browser ${i + 1}.`, error);
            }

            await page.bringToFront()

            // Close the browser if needed
            // await browser.close();
            console.log(`Browser ${i + 1} closed.`);
        })());
    }

    await Promise.all(tasks);

    console.log('All browser tasks completed.');
})();
