const fs = require('fs');
const path = require('path');

let regdata;

before(() => {
    const rawData = fs.readFileSync(path.join(__dirname, '../fixtures/TestData.json'));
    regdata = JSON.parse(rawData);
});

describe('Saving the card after logout ', () => {
    it('Cart', async () => {
        await browser.url(regdata.URL); // Go to the login page
        await browser.pause(1000);

        const username = regdata.username;
        const password = regdata.password;

        const { login } = require('../utils/helpers');

        await login(username, password);
        const url = await browser.getUrl();
        expect(url.includes('inventory.html')).toBe(true);

        const firstProduct = await $('.inventory_item');
        const productName = await firstProduct.$('.inventory_item_name').getText();
        await firstProduct.$('button.btn_inventory').click();

        // Verify cart count of items
        const cartBadge = await $('.shopping_cart_badge');
        expect(await cartBadge.getText()).toBe('1');

        await await $('#react-burger-menu-btn').click(); // Click the burger menu (top-left)

        // Wait for menu to be visible and check for count of items
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

        await login(username, password);
        expect(url.includes('inventory.html')).toBe(true);

        // Verify the same product is still in the cart
        const cartProductName = await $('.inventory_item_name').getText();
        expect(cartProductName).toBe(productName);

    });
});
