// ==========================================
// Adept Tracker Storage
// ==========================================

const STORAGE_KEY = "galygirlAdeptTracker";

let progress = {

    survivors: {},

    killers: {},

    activity: [],

    randomizer: {

    currentSurvivor: null,

    currentKiller: null,

    lastSurvivor: null,

    lastKiller: null,

    result: "Waiting..."

}

};

// ==========================================
// Save Progress
// ==========================================

function saveProgress() {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(progress)

    );

    console.log("💾 Progress Saved");

}

// ==========================================
// Load Progress
// ==========================================

function loadProgress() {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {

        console.log("📂 No Save Found");

        return;

    }

    const loaded = JSON.parse(saved);

    progress = {

        survivors: loaded.survivors || {},

        killers: loaded.killers || {},

        activity: loaded.activity || [],

        randomizer: {

    currentSurvivor: loaded.randomizer?.currentSurvivor ?? null,

    currentKiller: loaded.randomizer?.currentKiller ?? null,

    lastSurvivor: loaded.randomizer?.lastSurvivor ?? null,

    lastKiller: loaded.randomizer?.lastKiller ?? null,

    result: loaded.randomizer?.result ?? "Waiting..."

}

    };

    // Reset current challenge every time the app starts
      progress.randomizer.survivor = null;
      progress.randomizer.killer = null;

      saveProgress();

    console.log("📂 Progress Loaded");

}

// ==========================================
// Recent Activity
// ==========================================

function addActivity(message) {

    console.log("📝 Activity Added:", message);

    progress.activity.unshift(message);

    if (progress.activity.length > 10) {

        progress.activity.pop();

    }

    saveProgress();

}