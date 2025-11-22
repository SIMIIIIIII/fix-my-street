const {By} = require('selenium-webdriver');
const { beforeAll, describe, expect } = require('@jest/globals');
const { getChromeDriver } = require('./testConfig');

const url = 'http://localhost:8080/';

describe("Test home", () => {
    let driver;
    
    beforeAll(async () => {    
        driver = getChromeDriver();
    }, 10000);
  
    afterAll(async () => {
        await driver.quit();
    }, 15000);
  
    test('Tester le titre de la page', async () => {
        await driver.get  ( url );
        let title = await driver.getTitle ();
        expect(title).toContain( 'Fix my City' )
    }, 15000);
  
    test('Tester si connecté', async () => {
        await driver.get( url );
    
        let usernameElement = await driver.findElement(By.className('username-container'));
        let usernameText = await usernameElement.getText();
    
        expect(usernameText).toBeDefined();
        expect(usernameText).toContain('Connexion')
    })
})