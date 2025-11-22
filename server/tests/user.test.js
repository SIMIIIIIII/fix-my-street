const {By, until} = require('selenium-webdriver');
const { beforeAll, describe, expect } = require('@jest/globals');
const { getChromeDriver } = require('./testConfig');

const url_inscription = 'http://localhost:8080/inscription';
const url = 'http://localhost:8080/';

describe("Test inscription", () => {
    let driver;
    
    beforeAll(async () => {    
        driver = getChromeDriver();
    }, 10000);
  
    afterAll(async () => {
        await driver.quit();
    }, 15000);

    test('Tester titre de la page', async () => {
        await driver.get  ( url_inscription );
        let title = await driver.getTitle ();
        expect(title).toContain( 'Fix my City - Inscription' )

    }, 15000)

    test('Tester si connecté', async () => {
        await driver.get( url_inscription );
    
        let usernameElement = await driver.findElement(By.className('username-container'));
        let usernameText = await usernameElement.getText();
    
        expect(usernameText).toBeDefined();
        expect(usernameText).toContain('Connexion')
    }, 10000)

    test('Tester inscription invalid username', async () => {
    
        await driver.get(url_inscription);
        await driver.findElement(By.name('newUsername')).sendKeys('thela');
        await driver.findElement(By.name('newPassword')).sendKeys('#Thelama25');
        await driver.findElement(By.name('name')).sendKeys('Sim Lama');
        await driver.findElement(By.name('email')).sendKeys('sim.lama@gmail.com');
        
        // Selectionner que le form avec le post methode
        let inscriptionForm = await driver.findElement(By.css('form[method="post"]'));
        await inscriptionForm.submit();
        
        await driver.wait(until.elementLocated(By.className('error')), 5000);
        
        // verifier le message d'erreur
        let errorElement = await driver.findElement(By.className('error'));
        let errorText = await errorElement.getText();
        expect(errorText).toContain("Nom d'utilisateur doit avoir minimum 6 caractères");
        
        // verifer que qu'on est pas connecté
        await driver.get(url);
        let usernameElement = await driver.findElement(By.className('username-container'));
        let usernameText = await usernameElement.getText();
        expect(usernameText).toContain('Connexion');
    }, 15000)

    test('Tester inscription invalid password', async () => {
    
        await driver.get(url_inscription);
        await driver.findElement(By.name('newUsername')).sendKeys('thelama');
        await driver.findElement(By.name('newPassword')).sendKeys('Thelama25');
        await driver.findElement(By.name('name')).sendKeys('Sim Lama');
        await driver.findElement(By.name('email')).sendKeys('sim.lama@gmail.com');
        
        // Selectionner que le form avec le post methode
        let inscriptionForm = await driver.findElement(By.css('form[method="post"]'));
        await inscriptionForm.submit();
        
        await driver.wait(until.elementLocated(By.className('error')), 5000);
        
        // verifier le message d'erreur
        let errorElement = await driver.findElement(By.className('error'));
        let errorText = await errorElement.getText();
        expect(errorText).toContain("Mot de passe invalide invalide");
        
        // verifer que qu'on est pas connecté
        await driver.get(url);
        let usernameElement = await driver.findElement(By.className('username-container'));
        let usernameText = await usernameElement.getText();
        expect(usernameText).toContain('Connexion')
    }, 15000)

    test('Tester inscription invalid email', async () => {
    
        await driver.get(url_inscription);
        await driver.findElement(By.name('newUsername')).sendKeys('thelama');
        await driver.findElement(By.name('newPassword')).sendKeys('#Thelama25');
        await driver.findElement(By.name('name')).sendKeys('Sim Lama');
        await driver.findElement(By.name('email')).sendKeys('sim.lama@gmail');
        
        // Selectionner que le form avec le post methode
        let inscriptionForm = await driver.findElement(By.css('form[method="post"]'));
        await inscriptionForm.submit();
        
        await driver.wait(until.elementLocated(By.className('error')), 5000);
        
        // verifier le message d'erreur
        let errorElement = await driver.findElement(By.className('error'));
        let errorText = await errorElement.getText();
        expect(errorText).toContain("Adresse email invalide");
        
        // verifer que qu'on est pas connecté
        await driver.get(url);
        let usernameElement = await driver.findElement(By.className('username-container'));
        let usernameText = await usernameElement.getText();
        expect(usernameText).toContain('Connexion');
}, 15000)


})