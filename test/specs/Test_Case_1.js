const fs = require('fs');
const path = require('path');

let regdata;

before(() => {
    const rawData = fs.readFileSync(path.join(__dirname, '../fixtures/TestData.json'));
    regdata = JSON.parse(rawData);
});

describe('Valid Login', () => {
    it('Login', async () => {
        await browser.url(regdata.URL); // Go to the login page

        const usernameField = await $('#user-name'); // Find the username input field
        await usernameField.setValue(regdata.username); // Enter valid login
        // Check that the value is entered into the field
        const enteredValueUsernameField = await usernameField.getValue();
        expect(enteredValueUsernameField).toBe(regdata.username);
        console.log(`Entered username: ${enteredValueUsernameField}`); // Console log for visibility

        const passwordField = await $('#password'); // Find the password input field
        await passwordField.setValue(regdata.password);  // Enter valid password
        // Check that the value is correctly stored
        const enteredValue = await passwordField.getValue();
        expect(enteredValue).toBe(regdata.password);
        // Check that the field type is "password" so it's masked as dots
        const fieldType = await passwordField.getAttribute('type');
        expect(fieldType).toBe('password');

        await $('#login-button').click(); // Click the "Login" button

        // Check that the "Products" title is displayed
        const productsTitle = await $('.title');
        await expect(productsTitle).toBeDisplayed();
        await expect(productsTitle).toHaveText('Products');

        // Check that the cart icon is displayed
        const cartIcon = await $('.shopping_cart_link');
        await expect(cartIcon).toBeDisplayed();
    });
});
