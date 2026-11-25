// ==========================================
// Killer Tracker v2.0
// ==========================================

let selectedKiller = null;
let currentKillerChallenge = null;

// ==========================================
// Initialize
// ==========================================

function initializeKillers() {

    renderKillers(gameData.killers);

   // Restore killer borders
    Object.entries(progress.killers).forEach(([id, data]) => {

        applyKillerStatus(id, data.status);

    });

  }

// ==========================================
// Random Killer
// ==========================================

function initializeRandomKiller() {

    const button = document.getElementById(
        "randomKillerBtn"
    );

    button.onclick = randomKiller;

}

function finishRandomKiller(killer) {

     // Use the same logic as manual selection
    setCurrentKillerChallenge(killer);

    // Save the current killer challenge
    progress.randomizer.killer = killer.id;
    progress.randomizer.result = "In Progress";

    saveProgress();

    // Scroll the selected killer into view
    const card = document.getElementById(
        `killer-${killer.id}`
    );

   }

function randomKiller() {

    const button = document.getElementById(
        "randomKillerBtn"
    );

    button.disabled = true;

    button.textContent = "🎲 Randomizing...";

    // Exclude Adept killers
// Exclude killers from unowned chapters

const killers = gameData.killers.filter(killer => {

    const saved = progress.killers[killer.id];

    // Exclude completed Adepts
    if (saved && saved.status === "adept") {
        return false;
    }

    // Don't immediately pick the current Killer again
    if (
        currentKillerChallenge !== null &&
        killer.id === currentKillerChallenge
    ) {
        return false;
    }

    return killer.owned;
});

    // Everything completed
    if (killers.length === 0) {

        alert(
            "🎉 Congratulations!\n\nEvery Killer Adept has been completed!"
        );

        button.textContent = "🎲 Random Killer";

        button.disabled = false;

        return;

    }

    let spins = 0;

    let previousCard = null;

    const animation = setInterval(() => {

        if (previousCard) {

            previousCard.classList.remove("randomizing");

        }

        const killer =
            killers[Math.floor(Math.random() * killers.length)];

        // Update the Current Killer display while spinning
    const display = document.getElementById("currentKillerDisplay");

if (display) {
    display.innerHTML = `
        <img src="assets/killers/${killer.image}" alt="${killer.name}">
        <h3>${killer.name}</h3>
    `;
}    

        const card = document.getElementById(
            `killer-${killer.id}`
            
        );

        previousCard = card;

        card.classList.add("randomizing");

        spins++;

        if (spins >= 18) {

            clearInterval(animation);

            card.classList.remove("randomizing");

            finishRandomKiller(killer);

            button.textContent = "🎲 Random Killer";

            button.disabled = false;

        }

    }, 90);

}

// ==========================================
// Render Killer Portraits
// ==========================================

function killerClicked(killer) {

    selectedKiller = killer;

    // Select this killer as the current challenge
    setCurrentKillerChallenge(killer);

}

function selectKillerResult(result) {

    if (!selectedKiller) return;

    let icon = "";

    switch (result) {

        case "Adept":
            icon = "🟢";
            break;

        case "Failed":
            icon = "🔴";
            break;

    }

    addActivity(`${icon} ${selectedKiller.name} ${result}`);

    // Remove gold border
    const card = document.getElementById(
        `killer-${selectedKiller.id}`
    );

    if (card) {
        card.classList.remove("current-challenge");
    }

    currentKillerChallenge = null;

    // Apply border
    applyKillerStatus(
        selectedKiller.id,
        result.toLowerCase()
    );

    // Save killer result
    progress.killers[selectedKiller.id] = {
        status: result.toLowerCase()
    };

    // Update Dashboard
    document.getElementById("currentResult").textContent = result;

    // Save randomizer progress
    progress.randomizer.killer = null;
    progress.randomizer.result = result;

    saveProgress();

    // Update Killer Adept Progress
    updateKillerAdeptProgress();

    updateDashboard();

    closePortraitMenu();

}
// ==========================================
// Killer Adept Progress
// ==========================================

function updateKillerAdeptProgress() {

    const completed = Object.values(progress.killers)
        .filter(killer => killer.status === "adept")
        .length;

    const total = 30;
    const percentage = Math.min((completed / total) * 100, 100);

    const count = document.getElementById("killerAdeptCount");
    const bar = document.getElementById("killerAdeptProgressBar");

    if (count) {
        count.textContent = `${completed} / ${total}`;
    }

    if (bar) {
        bar.style.width = `${percentage}%`;
    }
}

function applyKillerStatus(killerId, status) {

    const card = document.getElementById(
        `killer-${killerId}`
    );

    if (!card) return;

    card.classList.remove(
        "adept",
        "failed"
    );

    card.classList.add(status);

}

function setCurrentKillerChallenge(killer) {

    selectedKiller = killer;
    
    // Update Current Killer card
const display = document.getElementById("currentKillerDisplay");

if (display) {
    display.innerHTML = `
        <img
            src="assets/killers/${killer.image}"
            alt="${killer.name}"
            class="current-character-image">

        <h3>${killer.name}</h3>
    `;
}

    // Remove previous gold border
    if (currentKillerChallenge !== null) {

        const previous = document.getElementById(
            `killer-${currentKillerChallenge}`
        );

        if (previous) {

            previous.classList.remove("current-challenge");

        }

    }

    currentKillerChallenge = killer.id;

   const card = document.getElementById(
    `killer-${killer.id}`
);

if (card) {
    card.classList.add("current-challenge");
}

    document.getElementById("currentCharacter").textContent =
        killer.name;

    document.getElementById("currentChallengeType").textContent =
        "Killer Adept";

    document.getElementById("currentResult").textContent =
        "In Progress";
}

function renderKillers(killers) {

    const grid = document.getElementById("killerGrid");

    if (!grid) return;

    grid.innerHTML = "";

    killers.forEach(killer => {

        const card = document.createElement("div");

        card.className = "portrait-card";

        card.id = `killer-${killer.id}`;

        card.dataset.id = killer.id;

        card.innerHTML = `
    <img src="assets/killers/${killer.image}" alt="${killer.name}">
`;

        card.addEventListener("click", () => {

    killerClicked(killer);

});

        grid.appendChild(card);

    });

}

// ==========================================
// Killer Search
// ==========================================

function initializeKillerSearch() {

    const search = document.getElementById("killerSearch");

    search.addEventListener("input", () => {

        const text = search.value.toLowerCase();

        const filtered = gameData.killers.filter(killer =>

            killer.name.toLowerCase().includes(text)

        );

        renderKillers(filtered);

    });

}
