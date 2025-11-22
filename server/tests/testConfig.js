const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

function getChromeDriver() {
    const options = new chrome.Options();
    
    // pour l'nvironnement CI sur github
    if (process.env.CI) {
        options.addArguments('--headless');
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--disable-gpu');
    }
    
    return new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
}

module.exports = { getChromeDriver };
