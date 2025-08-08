const fs = require('fs');
const path = require('path');

let regdata;

before(() => {
    const rawData = fs.readFileSync(path.join(__dirname, '../fixtures/TestData.json'));
    regdata = JSON.parse(rawData);
});

describe('Login with invalid login', () => {
    it('Login', async () => {

        await browser.url(regdata.URL); // Go to the login page
 
        await $('#user-name').setValue(regdata.invalidUsername); // Enter invalid login
        await $('#password').setValue(regdata.password); // Enter valid password

        await $('#login-button').click(); // Click "Login" button

        // Check that the error message is displayed
        const errorMessage = await $('[data-test="error"]');
        await expect(errorMessage).toBeDisplayed();
        await expect(errorMessage).toHaveText(
            'Epic sadface: Username and password do not match any user in this service'
        );

        // Check if red border / error class is applied to fields
        const usernameField = await $('#user-name');
        const passwordField = await $('#password');

        const usernameClass = await usernameField.getAttribute('class');
        const passwordClass = await passwordField.getAttribute('class');

        expect(usernameClass).toContain('input_error');
        expect(passwordClass).toContain('input_error');

        // Check for X icons inside the fields (SVG error icons)
        const usernameIcon = await $('.form_group:nth-child(1) .svg-inline--fa');
        const passwordIcon = await $('.form_group:nth-child(2) .svg-inline--fa');

        await expect(usernameIcon).toBeDisplayed();
        await expect(passwordIcon).toBeDisplayed();
    });
});
