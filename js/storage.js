// ==========================================
// Adept Tracker Storage
// ==========================================

const STORAGE_KEY = "galygirlAdeptTracker";

let progress = {

    survivors: {},

    killers: {},

    activity: [],

    randomizer: {

    survivor: null,

    killer: null,

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

        randomizer: loaded.randomizer || {

            survivor: null,

            killer: null

        }

    };

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