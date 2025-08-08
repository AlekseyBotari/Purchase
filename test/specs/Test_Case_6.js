const fs = require('fs');
const path = require('path');

let regdata;

before(() => {
    const rawData = fs.readFileSync(path.join(__dirname, '../fixtures/TestData.json'));
    regdata = JSON.parse(rawData);
});

describe('Sorting', () => {
    it('Products', async () => {
        await browser.url(regdata.URL);
        await browser.pause(1000);

        const username = regdata.username;
        const password = regdata.password;

        const { login } = require('../utils/helpers');
        await login(username, password);
        const url = await browser.getUrl();
        expect(url.includes('inventory.html')).toBe(true);
        
        // Choose "Price (low to high)" in sorting dropdown
        const sortDropdown = await $('.product_sort_container');
        await sortDropdown.selectByVisibleText('Price (low to high)');

        await browser.waitUntil(
            async () => (await $$('div.inventory_item_price')).length > 0,
            {
                timeout: 5000,
                timeoutMsg: 'Prices not loaded',
            }
        );

        const priceElements = await $$('div.inventory_item_price');

        const prices = [];
        for (let el of priceElements) {
            const text = await el.getText();
            const num = parseFloat(text.replace('$', ''));
            prices.push(num);
        }

        const sortedPrices = [...prices].sort((a, b) => a - b);
        expect(prices).toEqual(sortedPrices);
        console.log('Products are correctly sorted by price (high to low)');

        // Choose "Price (high to low)" in sorting dropdown
        const sortDropdownHighToLow = await browser.$('.product_sort_container');
        await sortDropdownHighToLow.selectByVisibleText('Price (high to low)');
        await browser.pause(1000);
        const priceElementsHighToLow = await browser.$$('.inventory_item_price');
        const pricesHighToLow = [];

        for (const priceEl of priceElementsHighToLow) {
            const textHighToLow = await priceEl.getText();
            const numberHighToLow = parseFloat(textHighToLow.replace('$', ''));
            pricesHighToLow.push(numberHighToLow);
        }

        let sortedDescending = [...pricesHighToLow].sort((a, b) => b - a);
        expect(pricesHighToLow).toEqual(sortedDescending);
        console.log('Products are correctly sorted by price (high to low)');

        // Choose "Name (A to Z)" in sorting dropdown
        await sortDropdown.selectByVisibleText('Name (A to Z)');
        await browser.pause(1000);
        const { getElementsText } = require('../utils/helpers');
        let productNames = await getElementsText('.inventory_item_name', browser);
        const sortedNames = [...productNames].sort((a, b) => a.localeCompare(b));
        expect(productNames).toEqual(sortedNames);
        console.log('Products are correctly sorted by Name (A to Z)');

        // Choose "Name (Z to A)" in sorting dropdown
        await sortDropdown.selectByVisibleText('Name (Z to A)');
        await browser.pause(1000);
        productNames = await getElementsText('.inventory_item_name', browser);
        sortedDescending = [...productNames].sort((a, b) => b.localeCompare(a));
        expect(productNames).toEqual(sortedDescending);
        console.log('Products are correctly sorted by Name (Z to A)');
    });
});
