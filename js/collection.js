// ==============================
// Collection
// ==============================

let chapters = [];

// ==============================
// Load Chapters
// ==============================

async function loadChapters() {

    try {

        const response = await fetch("data/chapters.json");

        chapters = await response.json();

        loadCollectionSave();

        console.log("✔ Chapters loaded");

        renderCollection();

    }

    catch (err) {

        console.error("Failed to load chapters:", err);

    }

}

// ==============================
// Render Collection
// ==============================

function renderCollection() {

    const container = document.getElementById("collectionList");

    if (!container) return;

    container.innerHTML = "";

    const groups = {
        base: [],
        original: [],
        licensed: []
    };

    chapters.forEach(chapter => {

        if (groups[chapter.type]) {
            groups[chapter.type].push(chapter);
        }

    });

    createSection("🎮 Base Game", groups.base);

    createSection("🌿 Original Chapters", groups.original);

    createSection("🎭 Licensed Chapters", groups.licensed);

}

// ==============================
// Helper Functions
// ==============================

function getSurvivorNames(ids, showIcon = true) {

    return ids
        .map(id => {

            const survivor = gameData.survivors.find(s => s.id === id);

            if (!survivor) return null;

            return showIcon
                ? `👤 ${survivor.name}`
                : survivor.name;

        })
        .filter(Boolean);

}

function getKillerNames(ids, showIcon = true) {

    return ids
        .map(id => {

            const killer = gameData.killers.find(k => k.id === id);

            if (!killer) return null;

            return showIcon
                ? `🔪 ${killer.name}`
                : killer.name;

        })
        .filter(Boolean);

}

// ==============================
// Create Collection Section
// ==============================

function createSection(title, list) {

    const container = document.getElementById("collectionList");

    const section = document.createElement("div");
    section.className = "collection-section";

    const ownedCount = list.filter(chapter => chapter.owned).length;
    const totalCount = list.length;

    section.innerHTML = `

        <div class="collection-section-header">

            <div>

                <h3>

                    ${title}

                    ${
                        title !== "🎮 Base Game"
                            ? `<span class="section-count">
                                    (${ownedCount}/${totalCount})
                               </span>`
                            : ""
                    }

                </h3>

            </div>

            ${
                title !== "🎮 Base Game"

                    ? `<input
                            type="checkbox"
                            class="section-checkbox"
                       >`

                    : `<span class="always-owned">
                            ✔ Always Owned
                       </span>`
            }

        </div>

        <div class="collection-grid"></div>

    `;

    const grid =
        section.querySelector(".collection-grid");

    const sectionCheckbox =
        section.querySelector(".section-checkbox");

    if (sectionCheckbox) {

        sectionCheckbox.checked =
            ownedCount === totalCount;

        sectionCheckbox.indeterminate =
            ownedCount > 0 &&
            ownedCount < totalCount;

    }
   list.forEach(chapter => {

    const card = document.createElement("div");
    card.className = "chapter-card";

    if (chapter.key === "base-game") {
        card.classList.add("base-game");
    }

    if (chapter.owned) {
        card.classList.add("owned");
    }

    const showIcons = chapter.key !== "base-game";

    const survivorNames = getSurvivorNames(
        chapter.survivors,
        showIcons
    );

    const killerNames = getKillerNames(
        chapter.killers,
        showIcons
    );

    let members = "";

    // ==============================
    // Base Game Layout
    // ==============================

    if (chapter.key === "base-game") {

        members = `

            <div class="base-game-columns">

                <div class="base-column">

                    <h4 class="base-heading">👤 Survivors</h4>

                    <div class="base-list">
                        ${survivorNames.join("<br>")}
                    </div>

                </div>

                <div class="base-column">

                    <h4 class="base-heading">🔪 Killers</h4>

                    <div class="base-list">
                        ${killerNames.join("<br>")}
                    </div>

                </div>

            </div>

        `;

    }

    else {

        members = [

            ...survivorNames,
            ...killerNames

        ].join("<br>");

    }

    card.innerHTML = `

        <div class="chapter-header">

            <div class="chapter-name">

                ${chapter.name}

            </div>

            ${
                chapter.type === "base"

                    ? `<span class="always-owned">
                            ✔
                       </span>`

                    : `<input
                            class="chapter-checkbox"
                            type="checkbox"
                            ${chapter.owned ? "checked" : ""}
                       >`
            }

        </div>

        <div class="chapter-members">

            ${members}

        </div>

    `;

    // Base Game doesn't need checkbox events
    if (chapter.type === "base") {

        grid.appendChild(card);

        return;

    }

    const checkbox =
        card.querySelector(".chapter-checkbox");

    card.addEventListener("click", (e) => {

        if (e.target !== checkbox) {
            checkbox.checked = !checkbox.checked;
        }

        chapter.owned = checkbox.checked;

        saveCollection();

        renderCollection();

    });

    checkbox.addEventListener("click", (e) => {

        e.stopPropagation();

        chapter.owned = checkbox.checked;

        saveCollection();

        renderCollection();

    });

    grid.appendChild(card);

});

       // ==============================
    // Section Select All
    // ==============================

    if (sectionCheckbox) {

        sectionCheckbox.addEventListener("change", () => {

            list.forEach(chapter => {

                chapter.owned = sectionCheckbox.checked;

            });

            saveCollection();

            renderCollection();

        });

    }

    container.appendChild(section);

}

// ==============================
// Save Collection
// ==============================

function saveCollection() {

    localStorage.setItem(
        "dbdCollection",
        JSON.stringify(chapters)
    );

}

function loadCollectionSave() {

    const saved = localStorage.getItem("dbdCollection");

    if (!saved) return;

    const ownedData = JSON.parse(saved);

    chapters.forEach(chapter => {

        const savedChapter = ownedData.find(c => c.id === chapter.id);

        if (savedChapter) {
            chapter.owned = savedChapter.owned;
        }

    });

}

// ==============================
// Collection Helpers
// ==============================

function isChapterOwned(character) {

    const chapter = chapters.find(c =>
        c.survivors.includes(character.id) ||
        c.killers.includes(character.id)
    );

    return chapter ? chapter.owned : true;

}

// ==============================
// Initialize Collection
// ==============================

async function initializeCollection() {

    await loadChapters();

}