const fs = require('fs');
const path = require('path');
const { login } = require('../utils/helpers');

let regdata;

before(() => {
    const rawData = fs.readFileSync(path.join(__dirname, '../fixtures/TestData.json'));
    regdata = JSON.parse(rawData);
});

let addedProductNames = [];
let addedProductPrices = [];

describe('Valid Checkout', () => {
    it('Checkout', async () => {

        await browser.url(regdata.URL); // Go to the login page
        await browser.pause(1000);

        const username = regdata.username;
        const password = regdata.password;

        await login(username, password);
        let url = await browser.getUrl();
        expect(url.includes('inventory.html')).toBe(true);

        const products = await $$('div.inventory_item');

        for (let i = 0; i < regdata.productsAmount; i++) {
            const name = await products[i].$('.inventory_item_name').getText();
            const priceText = await products[i].$('.inventory_item_price').getText();
            const price = parseFloat(priceText.replace('$', ''));

            // Save product name and price for later verification
            addedProductNames.push(name);
            addedProductPrices.push(price);

            await products[i].$('button.btn_inventory').click();
        }

        // Check the number in the cart
        const cartBadge = parseInt(await $('.shopping_cart_badge').getText(), 10);
        expect(cartBadge).toBe(regdata.productsAmount);


        await $('.shopping_cart_link').click();
        const cartItems = await $$('div.cart_item');
        const cartNames = [];

        for (const item of cartItems) {
            const name = await item.$('.inventory_item_name').getText();
            cartNames.push(name);
        }

        for (const expectedName of addedProductNames) {
            expect(cartNames).toContain(expectedName);
        }

        // Click checkout button
        const checkoutButton = await $('#checkout');
        await checkoutButton.click();

        await browser.pause(1000);

        // Verify the checkout form appears
        const formTitle = await $('.title').getText();
        expect(formTitle).toBe('Checkout: Your Information');

        // Verify input fields
        const firstName_form = await $('#first-name');
        const lastName_form = await $('#last-name');
        const postalCode_form = await $('#postal-code');

        expect(await firstName_form.isDisplayed()).toBe(true);
        expect(await lastName_form.isDisplayed()).toBe(true);
        expect(await postalCode_form.isDisplayed()).toBe(true);

        const { getRandomFirstName } = require('../utils/helpers');

        const firstName = getRandomFirstName();
        await $('#first-name').setValue(firstName);

        // Verify the field contains the value
        const value_form_firstName = await $('#first-name').getValue();
        expect(value_form_firstName).toBe(firstName);

        console.log('First Name entered:', firstName);

        const { getRandomLastName } = require('../utils/helpers');

        const lastName = getRandomLastName();
        await $('#last-name').setValue(lastName);

        // Verify the field contains the value
        const value_form_lastname = await $('#last-name').getValue();
        expect(value_form_lastname).toBe(lastName);

        console.log('Last Name entered:', lastName);

        const { getRandomPostalCode } = require('../utils/helpers');

        const postalCode = getRandomPostalCode();
        await $('#postal-code').setValue(postalCode);

        // Verify the field contains the value
        const value_form_postalCode = await $('#postal-code').getValue();
        expect(value_form_postalCode).toBe(postalCode);

        console.log('Postal Code entered:', postalCode);

        await $('#continue').click();
        const title = await $('.title').getText();
        expect(title).toBe('Checkout: Overview');

        const overviewItems = await $$('div.cart_item');
        const overviewNames = [];
        const overviewPrices = [];

        for (const item of overviewItems) {
            const name = await item.$('.inventory_item_name').getText();
            const priceText = await item.$('.inventory_item_price').getText();
            const price = parseFloat(priceText.replace('$', ''));

            overviewNames.push(name);
            overviewPrices.push(price);
        }

        // Check for matching added products
        for (const expectedName of addedProductNames) {
            expect(overviewNames).toContain(expectedName);
        }

        // Calculate the expected amount
        const expectedSubtotal = addedProductPrices.reduce((sum, p) => sum + p, 0);
        const totalText = await $('.summary_total_label').getText();
        const displayedTotal = parseFloat(totalText.replace('Total: $', ''));

        const taxRate = 0.08;
        const expectedTotal = expectedSubtotal * (1 + taxRate);
        const tolerance = 0.5;

        expect(Math.abs(displayedTotal - expectedTotal)).toBeLessThan(tolerance);

        console.log('Products and total verified on overview page');

        await $('#finish').click(); // Click the Finish button

        await browser.pause(1000);

        // Verify page title is "Checkout: Complete!"
        const titleCheckout = await $('.title').getText();
        expect(titleCheckout).toBe('Checkout: Complete!');

        // Verify confirmation message is shown
        const confirmationMessage = await $('.complete-header').getText();
        expect(confirmationMessage).toBe('Thank you for your order!');

        console.log('Order completed successfully, confirmation message verified.');

        // Click the Back Home button
        await $('#back-to-products').click();

        await browser.pause(1000);

        // Verify page title is inventory page
        const title_inventory = await $('.title').getText();
        expect(title_inventory).toBe('Products');

        // Verify at least one product is displayed
        const productsdisplayed = await $$('div.inventory_item');
        expect(productsdisplayed.length).toBeGreaterThan(0);

        // Verify cart is empty
        const cartBadgeExists = await $('.shopping_cart_badge').isExisting();
        expect(cartBadgeExists).toBe(false);

        console.log('Returned to inventory, products visible, cart is empty.');
    });
});
