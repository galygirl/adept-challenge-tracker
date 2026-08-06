// ==========================================
// Settings
// ==========================================

function initializeSettings() {

    document
        .getElementById("resetProgressBtn")
        .onclick = resetProgress;

    document
        .getElementById("exportProgressBtn")
        .onclick = exportProgress;

    document
        .getElementById("importProgressBtn")
        .onclick = importProgress;

    document
        .getElementById("aboutBtn")
        .onclick = showAbout;

    document
       .getElementById("closeAboutBtn")
       .onclick = closeAbout;

    document
       .getElementById("confirmResetBtn")
       .onclick = confirmReset;

    document
      .getElementById("cancelResetBtn")
      .onclick = cancelReset;   

}
// ==========================================
// Reset Progress
// ==========================================

function resetProgress() {

    document
        .getElementById("resetModal")
        .classList.remove("hidden");

}

 function confirmReset() {

    // Reset all saved progress
    progress = {

        survivors: {},

        killers: {},

        randomizer: {

            survivor: null,
            killer: null,
            result: null

        },

        activity: []

    };

   document.getElementById("currentCharacter").textContent =
        "None Selected";

    document.getElementById("currentChallengeType").textContent =
        "Waiting...";

    document.getElementById("currentResult").textContent =
        "Waiting...";

    saveProgress();

    location.reload();

}

function cancelReset() {

    document
        .getElementById("resetModal")
        .classList.add("hidden");

}

// ==========================================
// Export Progress
// ==========================================

function exportProgress() {

    // Convert progress to JSON
    const json = JSON.stringify(progress, null, 4);

    // Create a file
    const blob = new Blob([json], {

        type: "application/json"

    });

    // Create download link
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    // Today's date
    const today = new Date().toISOString().split("T")[0];

    link.href = url;

    link.download = `AdeptTracker-${today}.json`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}

// ==========================================
// Import Progress
// ==========================================

function importProgress() {

    const input = document.createElement("input");

    input.type = "file";
    input.accept = ".json";

    input.onchange = (event) => {

        const file = event.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {

    try {

        progress = JSON.parse(e.target.result);

        saveProgress();

        location.reload();

    }

    catch {

        alert("Invalid Adept Tracker backup.");

    }

};

        reader.readAsText(file);

    };

    input.click();

}

// ==========================================
// About
// ==========================================

function showAbout() {

    document
        .getElementById("aboutModal")
        .classList.remove("hidden");

}

function closeAbout() {

    document
        .getElementById("aboutModal")
        .classList.add("hidden");

}