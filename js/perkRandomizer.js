// ==========================================
// Perk Randomizer
// ==========================================

let perkData = {
    survivor: [],
    killer: []
};

// ==========================================
// Load Perk Data
// ==========================================

async function loadPerks() {

    try {

        const response = await fetch("data/perks.json");

        if (!response.ok) {
            throw new Error(`Could not load perks.json (${response.status})`);
        }

        perkData = await response.json();

        console.log("✔ Perk data loaded");

    } catch (error) {

        console.error("❌ Error loading perk data:", error);

    }
}

// ==========================================
// Randomize Perks
// ==========================================

function getRandomPerks(perks, amount = 4) {

    if (!perks || perks.length === 0) {
        return [];
    }

    // Make a copy so we don't modify the original list
    const availablePerks = [...perks];

    // Shuffle the perks
    for (let i = availablePerks.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [availablePerks[i], availablePerks[j]] =
        [availablePerks[j], availablePerks[i]];

    }

    // Return the requested number
    return availablePerks.slice(0, amount);
}

// ==========================================
// Display Perks With Shuffle Animation
// ==========================================

function displayPerks(perks, containerId) {

    const container = document.getElementById(containerId);

    if (!container) {
        return;
    }

    container.innerHTML = "";

    // Create the four cards first
    perks.forEach((perk, index) => {

        const perkCard = document.createElement("div");

        perkCard.className = "perk-card";

        perkCard.setAttribute(
            "data-slot",
            index + 1
        );

        perkCard.innerHTML = `
            <div class="perk-question">?</div>

            <div class="perk-result">
                ${perk.name}
            </div>
        `;

        container.appendChild(perkCard);

    });


    // Start the reveal animation
    const cards = container.querySelectorAll(".perk-card");

    cards.forEach((card, index) => {

        setTimeout(() => {

            card.classList.add("shuffling");

        }, index * 150);


        // Reveal each perk after shuffling
        setTimeout(() => {

            card.classList.remove("shuffling");

            card.classList.add("revealed");

        }, 1000 + (index * 250));

    });

}
// ==========================================
// Survivor Randomizer
// ==========================================

function randomizeSurvivorPerks() {

    const selectedPerks = getRandomPerks(
        perkData.survivor,
        4
    );

    displayPerks(
        selectedPerks,
        "survivorPerks"
    );

    const button = document.getElementById(
        "randomizeSurvivorPerksBtn"
    );

    if (button) {

        button.textContent = "🔄 Randomize Again";

    }

}

// ==========================================
// Killer Randomizer
// ==========================================

function randomizeKillerPerks() {

    const selectedPerks = getRandomPerks(
        perkData.killer,
        4
    );

    displayPerks(
        selectedPerks,
        "killerPerks"
    );

    const button = document.getElementById(
        "randomizeKillerPerksBtn"
    );

    if (button) {

        button.textContent = "🔄 Randomize Again";

    }

}

// ==========================================
// Reset Survivor Perks
// ==========================================

function resetSurvivorPerks() {

    const container = document.getElementById(
        "survivorPerks"
    );

    if (container) {

        container.innerHTML = "";

        for (let i = 0; i < 4; i++) {

            const perkCard = document.createElement("div");

            perkCard.className = "perk-card";

            perkCard.setAttribute(
                "data-slot",
                i + 1
            );

            perkCard.innerHTML = `
                <div class="perk-question">?</div>
            `;

            container.appendChild(perkCard);

        }

    }


    const button = document.getElementById(
        "randomizeSurvivorPerksBtn"
    );

    if (button) {

        button.textContent =
            "🎲 Randomize 4 Survivor Perks";

    }

}


// ==========================================
// Reset Killer Perks
// ==========================================

function resetKillerPerks() {

    const container = document.getElementById(
        "killerPerks"
    );

    if (container) {

        container.innerHTML = "";

        for (let i = 0; i < 4; i++) {

            const perkCard = document.createElement("div");

            perkCard.className = "perk-card";

            perkCard.setAttribute(
                "data-slot",
                i + 1
            );

            perkCard.innerHTML = `
                <div class="perk-question">?</div>
            `;

            container.appendChild(perkCard);

        }

    }


    const button = document.getElementById(
        "randomizeKillerPerksBtn"
    );

    if (button) {

        button.textContent =
            "🎲 Randomize 4 Killer Perks";

    }

}
// ==========================================
// Initialize
// ==========================================

function initializePerkRandomizer() {

    const survivorButton =
        document.getElementById(
            "randomizeSurvivorPerksBtn"
        );

    const killerButton =
        document.getElementById(
            "randomizeKillerPerksBtn"
        );

    if (survivorButton) {

        survivorButton.addEventListener(
            "click",
            randomizeSurvivorPerks
        );

    }

    if (killerButton) {

        killerButton.addEventListener(
            "click",
            randomizeKillerPerks
        );

    }

    const resetSurvivorButton =
    document.getElementById(
        "resetSurvivorPerksBtn"
    );

const resetKillerButton =
    document.getElementById(
        "resetKillerPerksBtn"
    );


if (resetSurvivorButton) {

    resetSurvivorButton.addEventListener(
        "click",
        resetSurvivorPerks
    );

}


if (resetKillerButton) {

    resetKillerButton.addEventListener(
        "click",
        resetKillerPerks
    );

}

}

// ==========================================
// Show Empty Perk Cards
// ==========================================

function showEmptyPerkCards(containerId) {

    const container = document.getElementById(containerId);

    if (!container) {
        return;
    }

    container.innerHTML = "";

    for (let i = 0; i < 4; i++) {

        const perkCard = document.createElement("div");

        perkCard.className = "perk-card";

        perkCard.setAttribute(
            "data-slot",
            i + 1
        );

        perkCard.innerHTML = `
            <div class="perk-question">?</div>
        `;

        container.appendChild(perkCard);

    }

}
// ==========================================
// Initialize Empty Perk Cards
// ==========================================

function initializeEmptyPerkCards() {

    showEmptyPerkCards("survivorPerks");
    showEmptyPerkCards("killerPerks");

}

// ==========================================
// Start
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadPerks();

        initializePerkRandomizer();

        initializeEmptyPerkCards();

    }
);
