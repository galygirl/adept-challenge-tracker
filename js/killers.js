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

  // Restore current killer challenge
if (progress.randomizer.killer !== null) {

    const killer = gameData.killers.find(
        k => k.id === progress.randomizer.killer
    );

    if (killer) {

        setCurrentKillerChallenge(killer);

    }

}
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

    card.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}

function randomKiller() {

    const button = document.getElementById(
        "randomKillerBtn"
    );

    button.disabled = true;

    button.textContent = "🎲 Randomizing...";

    // Don't pick completed killers
    const killers = gameData.killers.filter(killer => {

        
        const saved = progress.killers[killer.id];

        return !saved || saved.status !== "adept";

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

    // First click
    if (currentKillerChallenge !== killer.id) {

        setCurrentKillerChallenge(killer);

        return;

    }

      // Second click
    document.getElementById("menuTitle").textContent =
        killer.name;

    currentMenuType = "killer";

    // Hide Escape button for killers
    document.querySelector(".menu-btn.escape").style.display = "none";

    document
        .getElementById("portraitMenu")
        .classList.remove("hidden");

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

    card.classList.remove("current-challenge");

    currentKillerChallenge = null;

    // Apply border
    applyKillerStatus(
        selectedKiller.id,
        result.toLowerCase()
    );

    // Save progress
    progress.killers[selectedKiller.id] = {

        status: result.toLowerCase()

    };

    saveProgress();

    updateDashboard();

    closePortraitMenu();

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

    card.classList.add("current-challenge");

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
            <div class="portrait-name">${killer.name}</div>
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