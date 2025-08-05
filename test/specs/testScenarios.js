// Access fixture data 
const fs = require('fs');
const path = require('path');

let regdata;

before(() => {
    // Load fixture before all tests
    const rawData = fs.readFileSync(path.join(__dirname, '../fixtures/TestData1.json'));
    regdata = JSON.parse(rawData);
});

before(async () => {
    await browser.url(regdata.URL); // Open login page

    // Login with test credentials
    await $('#user-name').setValue(regdata.username);
    await $('#password').setValue(regdata.password);
    await $('#login-button').click();

    await browser.pause(1000); // Wait for inventory page
});

let addedProductNames = [];
let addedProductPrices = [];

describe('Cart functionality', () => {
    it('Add products to cart', async () => {
        const products = await $$('div.inventory_item');

        for (let i = 0; i < 2; i++) {
            const name = await products[i].$('.inventory_item_name').getText();
            const priceText = await products[i].$('.inventory_item_price').getText();
            const price = parseFloat(priceText.replace('$', ''));

            // Save product name and price for later verification
            addedProductNames.push(name);
            addedProductPrices.push(price);

            await products[i].$('button.btn_inventory').click();
        }

        // Check the number in the cart
        const cartBadge = await $('.shopping_cart_badge').getText();
        expect(cartBadge).toBe('2');
    });

    it('Displaying added products in the cart', async () => {
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
    });

    it('Form appearance after clicking the Checkout button', async () => {
        // Click "Checkout" button
        const checkoutButton = await $('#checkout');
        await checkoutButton.click();

        await browser.pause(1000);

        // Verify the checkout form appears
        const formTitle = await $('.title').getText();
        expect(formTitle).toBe('Checkout: Your Information');

        // Verify input fields
        const firstName = await $('#first-name');
        const lastName = await $('#last-name');
        const postalCode = await $('#postal-code');

        expect(await firstName.isDisplayed()).toBe(true);
        expect(await lastName.isDisplayed()).toBe(true);
        expect(await postalCode.isDisplayed()).toBe(true);
    });
});

describe('Fill the form', () => {

    const { getRandomFirstName } = require('../utils/helpers');

    it('Fill the First Name field', async () => {
        const firstName = getRandomFirstName();
        await $('#first-name').setValue(firstName);

        // Verify the field contains the value
        const value = await $('#first-name').getValue();
        expect(value).toBe(firstName);

        console.log('First Name entered:', firstName);
    });

    const { getRandomLastName } = require('../utils/helpers');

    it('Fill the Last Name field', async () => {
        const lastName = getRandomLastName();
        await $('#last-name').setValue(lastName);

        // Verify the field contains the value
        const value = await $('#last-name').getValue();
        expect(value).toBe(lastName);

        console.log('Last Name entered:', lastName);
    });

    const { getRandomPostalCode } = require('../utils/helpers');

    it('Fill the Postal Code field', async () => {
        const postalCode = getRandomPostalCode();
        await $('#postal-code').setValue(postalCode);

        // Verify the field contains the value
        const value = await $('#postal-code').getValue();
        expect(value).toBe(postalCode);

        console.log('Postal Code entered:', postalCode);
    });
});

describe('Completion of purchase', () => {
    it('Show products and total price from step one', async () => {
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
    });
});

describe('Final screens after purchase', () => {

    it('Checkout complete page', async () => {
        // Click the Finish button
        await $('#finish').click();

        // Pause to allow page load (optional)
        await browser.pause(1000);

        // Verify page title is "Checkout: Complete!"
        const title = await $('.title').getText();
        expect(title).toBe('Checkout: Complete!');

        // Verify confirmation message is shown
        const confirmationMessage = await $('.complete-header').getText();
        expect(confirmationMessage).toBe('Thank you for your order!');

        console.log('Order completed successfully, confirmation message verified.');
    });

    it('Display inventory page after final redirect', async () => {
        // Click the Back Home button
        await $('#back-to-products').click();

        // Wait for page load
        await browser.pause(1000);

        // Verify page title is inventory page
        const title = await $('.title').getText();
        expect(title).toBe('Products');

        // Verify at least one product is displayed
        const products = await $$('div.inventory_item');
        expect(products.length).toBeGreaterThan(0);

        // Verify cart is empty
        const cartBadgeExists = await $('.shopping_cart_badge').isExisting();
        expect(cartBadgeExists).toBe(false);

        console.log('Returned to inventory, products visible, cart is empty.');
    });
});
