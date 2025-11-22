const {By, until} = require('selenium-webdriver');
const { beforeAll, describe, expect } = require('@jest/globals');
const { getChromeDriver } = require('./testConfig');

const url_iconnexion = 'http://localhost:8080/connexion';
const url = 'http://localhost:8080/';

describe("Test connexion", () => {
    let driver;
    
    beforeAll(async () => {    
        driver = getChromeDriver();
    }, 10000);
  
    afterAll(async () => {
        await driver.quit();
    }, 15000);

    test('Tester titre de la page', async () => {
        await driver.get  ( url_iconnexion );
        let title = await driver.getTitle ();
        expect(title).toContain( 'Fix my City - Connexion' )

    }, 10000)
})