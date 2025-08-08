const fs = require('fs');
const path = require('path');
const { login } = require('../utils/helpers');

let regdata;

before(() => {
    const rawData = fs.readFileSync(path.join(__dirname, '../fixtures/TestData.json'));
    regdata = JSON.parse(rawData);
});

describe('Logout', () => {
    it('Login', async () => {
        await browser.url(regdata.URL); // Go to the login page

        await browser.pause(1000);

        const username = regdata.username;
        const password = regdata.password;

        await login(username, password);
        let url = await browser.getUrl();
        expect(url.includes('inventory.html')).toBe(true);

        await await $('#react-burger-menu-btn').click(); // Click the burger menu (top-left)

        // Wait for menu to be visible and check for 4 items
        const menuItems = await $$('.bm-item-list a');
        await browser.pause(500);

        expect(menuItems.length).toBe(regdata.burgerMenuItems); // Validate that the menu is expanded and has correct amount of items

        // Click the "Logout" link 
        const logoutLink = await $('#logout_sidebar_link');
        await logoutLink.click();

        // Verify redirect to login page
        await expect(browser).toHaveUrl(regdata.URL + '/');

        // check that the username and password fields are empty
        const usernameField = await $('#user-name');
        const passwordField = await $('#password');

        const usernameValue = await usernameField.getValue();
        const passwordValue = await passwordField.getValue();

        expect(usernameValue).toBe('');
        expect(passwordValue).toBe('');
    });
});
