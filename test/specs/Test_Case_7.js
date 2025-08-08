const fs = require('fs');
const path = require('path');
const { login, clickAndSwitchToNewTab } = require('../utils/helpers');

let regdata;

before(() => {
    const rawData = fs.readFileSync(path.join(__dirname, '../fixtures/TestData.json'));
    regdata = JSON.parse(rawData);
});

describe('Footer Links', () => {
    it('Footer', async () => {
        await browser.url(regdata.URL); // Go to the login page
        await browser.pause(1000);

        const username = regdata.username;
        const password = regdata.password;

        await login(username, password);
        let url = await browser.getUrl();
        expect(url.includes('inventory.html')).toBe(true);

        const socialMediaSelectors = [
            '.social_twitter a',
            '.social_facebook a',
            '.social_linkedin a'
        ];

        const footerURL = [
            'x.com',
            'facebook.com',
            'linkedin.com'
        ]

        let i = 0;
        for (const selector of socialMediaSelectors) {
            // Click icon in footer
            let footerIcon = await $(selector);
            await footerIcon.click();

            const originalWindow = await browser.getWindowHandle();
            const newTab = await clickAndSwitchToNewTab(browser, originalWindow);

            // Check the Twitter URL
            const newTabUrl = await browser.getUrl();

            expect(newTabUrl).toContain(footerURL[i]);
            
            console.log(`${footerURL[i].replace('.com', '')} opened successfully: ${newTabUrl}`);

            // Close the new tab and return to original
            await browser.closeWindow();
            await browser.switchToWindow(originalWindow);
            i++;
        }
    });
});
