// Login with test credentials 
async function login(username, password) {
    await $('#user-name').setValue(username);
    await $('#password').setValue(password);
    await $('#login-button').click();
}

// Get texts of element by selector
async function getElementsText(selector, browser) {
    const elements = await browser.$$(selector);
    const texts = [];

    let i = 0;
    while (i < elements.length) {
        const text = await elements[i].getText();
        texts.push(text);
        i++;
    }

    return texts;
}

// New tab
async function clickAndSwitchToNewTab(browser, originalWindow) {
    // Wait for a new tab to open
    await browser.waitUntil(async () => {
        const handles = await browser.getWindowHandles();
        return handles.length > 1;
    }, {
        timeout: 5000,
        timeoutMsg: 'Expected a new tab to open after clicking footer icon'
    });

    // Switch to the new tab
    const windowHandles = await browser.getWindowHandles();
    const newTab = windowHandles.find(handle => handle !== originalWindow);
    await browser.switchToWindow(newTab);

    return newTab;
}

// Randomizer for first names
function getRandomFirstName() {
    const names = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Jamie', 'Chris', 'Sam', 'Riley'];
    return names[Math.floor(Math.random() * names.length)];
}

// Randomizer for last names
function getRandomLastName() {
    const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Clark', 'Miller', 'Wilson', 'Garcia'];
    return lastNames[Math.floor(Math.random() * lastNames.length)];
}

// Randomizer for postal codes
function getRandomPostalCode() {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

module.exports = {
    login,
    getElementsText,
    clickAndSwitchToNewTab,
    getRandomFirstName,
    getRandomLastName,
    getRandomPostalCode
};
