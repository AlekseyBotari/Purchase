const fs = require('fs');
const path = require('path');
const { login } = require('../utils/helpers');

let regdata;

before(() => {
    const rawData = fs.readFileSync(path.join(__dirname, '../fixtures/TestData.json'));
    regdata = JSON.parse(rawData);
});

describe('Checkout without products', () => {
    it('Checkout', async () => {
        await browser.url(regdata.URL); // Go to the login page
        await browser.pause(1000);

        const username = regdata.username;
        const password = regdata.password;

        await login(username, password);
        let url = await browser.getUrl();
        expect(url.includes('inventory.html')).toBe(true);


        // Click on the "Cart" button
        const cartBtn = await $('.shopping_cart_link');
        await cartBtn.click();

        // Check that the "Cart" page is displayed
        const currentUrl = await browser.getUrl();
        expect(currentUrl).toContain('cart.html');

        const cartItems = await $$('.cart_item');

        await $('#checkout').click(); // Click on the "Checkout" button

        if (cartItems.length === 0) {
            // Check that left on cart.html
            url = await browser.getUrl();
            expect(url).toContain('cart.html');
            console.log('Error, Cart is empty, Proceed to Checkout: Your Information');
        }
    });
});
