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
    return Math.floor(10000 + Math.random() * 90000).toString(); // Generate a random 5-digit ZIP-like code
}

module.exports = {
    getRandomFirstName,
    getRandomLastName,
    getRandomPostalCode
};
