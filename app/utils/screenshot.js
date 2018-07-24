const puppeteer = require('puppeteer');
const PATH = require('path');
const devices = require('puppeteer/DeviceDescriptors');


export default async function screenShot(config) {
    const browser = await puppeteer.launch({
        executablePath: './chromium/chrome.exe',
    });
    const page = await browser.newPage();
    await page.goto(config.url);
    if (config.model) {
        await page.emulate(devices[config.model]);
    }
    if (config.width && config.height) {
        await page.setViewport({
            width: config.width,
            height: config.height,
        });
    }
    await page.screenshot({
        path: PATH.join(config.path, config.fileName),
    });
    browser.close();
}
