// =============================================
// Collection 2.0
// Character-Based Collection
// =============================================

// ==============================
// Initialize Collection
// ==============================

async function initializeCollection() {

    loadCollection();

    renderCollection();

}

// ==============================
// Render Collection
// ==============================

function renderCollection() {

    const container = document.getElementById("collectionList");

    if (!container) return;

    container.innerHTML = "";

    // ==============================
    // Base Game
    // ==============================

    renderBaseGame(container);

    // ==============================
    // Survivors
    // ==============================

    renderSectionHeading(container, "👤 Survivors");

renderCharacterSection(
    container,
    "Survivors",
    gameData.survivors.filter(s =>
        s.chapter !== "Base Game" &&
        s.available !== false
    )
);
    renderCharacterSection(
        container,
        "🚫 Unavailable Survivors",
        gameData.survivors.filter(s =>
            s.available === false
        )
    );

    // ==============================
    // Killers
    // ==============================

    renderSectionHeading(container, "🔪 Killers");

renderCharacterSection(
    container,
    "Killers",
    gameData.killers.filter(k =>
        k.chapter !== "Base Game" &&
        k.available !== false
    )
);

    renderCharacterSection(
        container,
        "🚫 Unavailable Killers",
        gameData.killers.filter(k =>
            k.available === false
        )
    );

}

// ==============================
// Main Section Heading
// ==============================

function renderSectionHeading(container, title) {

    const heading = document.createElement("h2");

    heading.className = "collection-main-heading";

    heading.textContent = title;

    container.appendChild(heading);

}

// ==============================
// Character Section
// ==============================

function renderCharacterSection(container, title, characters) {

    const section = document.createElement("div");
    section.className = "collection-section base-game-section";

    const ownedCount = characters.filter(c => c.owned).length;
    const totalCount = characters.length;

    section.innerHTML = `

        <div class="collection-section-header">

            <div>

                <h3>

                    ${title}

                    <span class="section-count">
                        (${ownedCount}/${totalCount})
                    </span>

                </h3>

            </div>

            <input
                type="checkbox"
                class="section-checkbox"
            >

        </div>

        <div class="collection-grid"></div>

    `;

    const grid = section.querySelector(".collection-grid");

   const sectionCheckbox =
    section.querySelector(".section-checkbox");

sectionCheckbox.checked =
    ownedCount === totalCount;

sectionCheckbox.indeterminate =
    ownedCount > 0 &&
    ownedCount < totalCount;

// ==============================
// Section Select All
// ==============================

sectionCheckbox.addEventListener("change", () => {

    console.log("Section checkbox:", title, sectionCheckbox.checked);

    characters.forEach(character => {

        console.log(character.name);

        character.owned = sectionCheckbox.checked;

    });

    saveCollection();

    renderCollection();

});

characters.forEach(character => {

    const card = createCharacterCard(character);

    grid.appendChild(card);

});

container.appendChild(section);

}

// ==============================
// Character Card
// ==============================

function createCharacterCard(character) {

    const card = document.createElement("div");

    card.className = "collection-card";

    if (character.owned) {
        card.classList.add("owned");
    }

    card.innerHTML = `

        <div class="chapter-header">

            <div class="chapter-name">
                ${character.name}
            </div>

            <input
                class="chapter-checkbox"
                type="checkbox"
                ${character.owned ? "checked" : ""}
            >

        </div>

    `;

    const checkbox =
        card.querySelector(".chapter-checkbox");

    // ==============================
    // Click anywhere on the card
    // ==============================

    card.addEventListener("click", (e) => {

    if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
    }

    character.owned = checkbox.checked;

    card.classList.toggle(
        "owned",
        character.owned
    );

    saveCollection();

    renderCollection();

});

    // ==============================
    // Click directly on checkbox
    // ==============================

    checkbox.addEventListener("click", (e) => {

    e.stopPropagation();

    character.owned = checkbox.checked;

    card.classList.toggle(
        "owned",
        character.owned
    );

    saveCollection();

    renderCollection();

});

    return card;

}

sectionCheckbox.addEventListener("change", () => {

    console.log("Section checkbox:", title, sectionCheckbox.checked);

    characters.forEach(character => {

        console.log(character.name);

        character.owned = sectionCheckbox.checked;

    });

    saveCollection();

    renderCollection();

});

// ==============================
// Base Game
// ==============================

function renderBaseGame(container) {

    const baseSurvivors = gameData.survivors.filter(
        survivor => survivor.chapter === "Base Game"
    );

    const baseKillers = gameData.killers.filter(
        killer => killer.chapter === "Base Game"
    );

    const section = document.createElement("div");
    section.className = "collection-section base-game-section";

    section.innerHTML = `

        <div class="collection-section-header">

            <h3>🎮 Base Game</h3>

            <span class="always-owned">
                ✔ Always Owned
            </span>

        </div>

        <div class="collection-grid"></div>

    `;

    const grid = section.querySelector(".collection-grid");

    const card = document.createElement("div");
  card.className = "chapter-card base-game base-game-card owned";
    
    card.innerHTML = `

        <div class="chapter-header">

            <div class="chapter-name">
                Base Game
            </div>

        </div>

        <div class="base-game-columns">

            <div class="base-column">

                <h4 class="base-heading">👤 Survivors</h4>

                <div class="base-list">

                    ${baseSurvivors
                        .map(s => s.name)
                        .join("<br>")}

                </div>

            </div>

            <div class="base-column">

                <h4 class="base-heading">🔪 Killers</h4>

                <div class="base-list">

                    ${baseKillers
                        .map(k => k.name)
                        .join("<br>")}

                </div>

            </div>

        </div>

    `;

    grid.appendChild(card);

    container.appendChild(section);

}

// ==============================
// Save Collection
// ==============================

function saveCollection() {

    const collection = {

        survivors: gameData.survivors.map(survivor => ({
            id: survivor.id,
            owned: survivor.owned
        })),

        killers: gameData.killers.map(killer => ({
            id: killer.id,
            owned: killer.owned
        }))

    };

    localStorage.setItem(
        "dbdCollection",
        JSON.stringify(collection)
    );

}

// ==============================
// Load Collection
// ==============================

function loadCollection() {

    const saved = localStorage.getItem("dbdCollection");

    if (!saved) return;

    const collection = JSON.parse(saved);

    // Old chapter save detected
    if (!collection.survivors || !collection.killers) {

        console.log("Old collection save detected. Resetting...");

        localStorage.removeItem("dbdCollection");

        return;

    }

    collection.survivors.forEach(savedSurvivor => {

        const survivor = gameData.survivors.find(
            s => s.id === savedSurvivor.id
        );

        if (survivor) {
            survivor.owned = savedSurvivor.owned;
        }

    });

    collection.killers.forEach(savedKiller => {

        const killer = gameData.killers.find(
            k => k.id === savedKiller.id
        );

        if (killer) {
            killer.owned = savedKiller.owned;
        }

    });

}