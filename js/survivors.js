// ==========================================
// Survivor Tracker v2.0
// ==========================================

let selectedSurvivor = null;
let currentChallenge = null;
let currentMenuType = null;

// ==========================================
// Initialize
// ==========================================

function initializeSurvivors() {

      renderSurvivors(gameData.survivors);

    // Restore survivor borders
    Object.entries(progress.survivors).forEach(([id, data]) => {

        applySurvivorStatus(id, data.status);

    });

    updateSurvivorAdeptProgress();
}

// ==========================================
// Render Portraits
// ==========================================

function renderSurvivors(survivors) {

    const grid = document.getElementById("survivorGrid");

    grid.innerHTML = "";

    survivors.forEach(survivor => {

        const card = document.createElement("div");

        card.className = "portrait-card";

        card.dataset.id = survivor.id;

        card.id = `survivor-${survivor.id}`;

       card.innerHTML = `
    <img src="assets/survivors/${survivor.image}" alt="${survivor.name}">
`;

        card.addEventListener("click", () => {

            portraitClicked(survivor);

        });

        grid.appendChild(card);

    });

}

// ==========================================
// Current Challenge
// ==========================================

function setCurrentChallenge(survivor, save = true) {

    // Remove previous gold border
    if (currentChallenge !== null) {

        const previous = document.getElementById(
            `survivor-${currentChallenge}`
        );

        if (previous) {

            previous.classList.remove("current-challenge");

        }

    }

    currentChallenge = survivor.id;

    selectedSurvivor = survivor;

    // Update Current Survivor card
const display = document.getElementById("currentSurvivorDisplay");

if (display) {
    display.innerHTML = `
        <img
            src="assets/survivors/${survivor.image}"
            alt="${survivor.name}"
            class="current-character-image">

        <h3>${survivor.name}</h3>
    `;
}

    const card = document.getElementById(
        `survivor-${survivor.id}`
    );

    if (card) {

        card.classList.add("current-challenge");

    }

    // Dashboard
    document.getElementById("currentCharacter").textContent =
        survivor.name;

    document.getElementById("currentChallengeType").textContent =
        "Survivor Adept";

    document.getElementById("currentResult").textContent =
        "In Progress";

    
    // Save
     progress.randomizer.currentSurvivor = survivor.id;
     progress.randomizer.lastSurvivor = survivor.id;
     progress.randomizer.result = "In Progress";

    if (save) {

        saveProgress();

    }

}

// ==========================================
// Portrait Click
// ==========================================

function portraitClicked(survivor) {

    selectedSurvivor = survivor;

    // Select this survivor as the current challenge
    setCurrentChallenge(survivor);

}

// ==========================================
// Portrait Menu
// ==========================================

function closePortraitMenu() {

    document
        .getElementById("portraitMenu")
        .classList.add("hidden");

}

function initializePortraitMenu() {

    document.querySelector(".menu-btn.adept").onclick = () => {

        if (currentMenuType === "survivor") {

            selectResult("Adept");

        } else {

            selectKillerResult("Adept");

        }

    };

    document.querySelector(".menu-btn.escape").onclick = () => {

        if (currentMenuType === "survivor") {

            selectResult("Escaped");

        }

    };

    document.querySelector(".menu-btn.failed").onclick = () => {

        if (currentMenuType === "survivor") {

            selectResult("Failed");

        } else {

            selectKillerResult("Failed");

        }

    };

    document.querySelector(".menu-btn.cancel").onclick =
        closePortraitMenu;

}

// ==========================================
// Result Selection
// ==========================================

function selectResult(result) {

    if (!selectedSurvivor) return;

    let icon = "";

    switch (result) {

        case "Adept":
            icon = "🟢";
            break;

        case "Escaped":
            icon = "🔵";
            break;

        case "Failed":
            icon = "🔴";
            break;

    }

        // Update border
    applySurvivorStatus(
        selectedSurvivor.id,
        result.toLowerCase()
    );

    // Save survivor result
    progress.survivors[selectedSurvivor.id] = {

        status: result.toLowerCase()

    };

    // Activity Feed
    addActivity(
        `${icon} ${selectedSurvivor.name} ${result}`
    );

    // Dashboard
    document.getElementById("currentResult").textContent =
        result;

    // Remove gold border
    const card = document.getElementById(
        `survivor-${selectedSurvivor.id}`
    );

    if (card) {

        card.classList.remove("current-challenge");

    }

    // Clear challenge
    currentChallenge = null;

    progress.randomizer.currentSurvivor = null;
    progress.randomizer.result = result;

    saveProgress();

    updateSurvivorAdeptProgress();

    updateDashboard();

    closePortraitMenu();

}
// ==========================================
// Survivor Adept Progress
// ==========================================

function updateSurvivorAdeptProgress() {

    const completed = Object.values(progress.survivors)
        .filter(survivor => survivor.status === "adept")
        .length;

    const total = 30;
    const percentage = Math.min((completed / total) * 100, 100);

    const count = document.getElementById("survivorAdeptCount");
    const bar = document.getElementById("survivorAdeptProgressBar");

    if (count) {
        count.textContent = `${completed} / ${total}`;
    }

    if (bar) {
        bar.style.width = `${percentage}%`;
    }
}
// ==========================================
// Survivor Borders
// ==========================================

function applySurvivorStatus(survivorId, status) {

    const card = document.getElementById(
        `survivor-${survivorId}`
    );

    if (!card) return;

    card.classList.remove(
        "adept",
        "escaped",
        "failed"
    );

    card.classList.add(status);

}

// ==========================================
// Random Survivor
// ==========================================

function initializeRandomSurvivor() {

    const button = document.getElementById(
        "randomSurvivorBtn"
    );

    button.onclick = randomSurvivor;

}

function randomSurvivor() {

    const button = document.getElementById(
        "randomSurvivorBtn"
    );

    button.disabled = true;

    button.textContent = "🎲 Randomizing...";

    // Exclude Adept survivors
   // Exclude survivors from unowned chapters

const survivors = gameData.survivors.filter(survivor => {

    const saved = progress.survivors[survivor.id];

    if (saved && saved.status === "adept") {
        return false;
    }

    return survivor.owned;

});

    // Everything completed
    if (survivors.length === 0) {

        alert(
            "🎉 Congratulations!\n\nEvery Survivor Adept has been completed!"
        );

        button.textContent = "🎲 Random Survivor";

        button.disabled = false;

        return;

    }

    let spins = 0;

    let previousCard = null;

    const animation = setInterval(() => {

        if (previousCard) {

            previousCard.classList.remove("randomizing");

        }

        const survivor =
            survivors[Math.floor(Math.random() * survivors.length)];

     // Update the Current Survivor display while spinning
    const display = document.getElementById("currentSurvivorDisplay");

if (display) {
    display.innerHTML = `
        <img src="assets/survivors/${survivor.image}" alt="${survivor.name}">
        <h3>${survivor.name}</h3>
    `;
}

        const card = document.getElementById(
            `survivor-${survivor.id}`
        );

        previousCard = card;

        card.classList.add("randomizing");

        spins++;

        if (spins >= 18) {

            clearInterval(animation);

            card.classList.remove("randomizing");

            finishRandomSelection(survivor);

            button.textContent = "🎲 Random Survivor";

            button.disabled = false;

        }

    }, 90);

}

// ==========================================
// Finish Random Selection
// ==========================================

function finishRandomSelection(survivor) {

    // Use the same logic as manual selection
    setCurrentChallenge(survivor);

    const card = document.getElementById(
        `survivor-${survivor.id}`
    );

   }

// ==========================================
// Survivor Search
// ==========================================

function initializeSurvivorSearch() {

    const search = document.getElementById("survivorSearch");

    search.addEventListener("input", () => {

        const text = search.value.toLowerCase();

        const filtered = gameData.survivors.filter(survivor =>

            survivor.name.toLowerCase().includes(text)

        );

        renderSurvivors(filtered);

    });

}