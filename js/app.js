// ==========================================
// Application Entry Point
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {

    console.log("1. DOM Loaded");

    await loadGameData();

    loadProgress();

    console.log("2. Game Data Loaded");

    initializeNavigation();
    console.log("3. Navigation");

    initializeDashboard();
    console.log("4. Dashboard");

    initializeSurvivors();
    console.log("5. Survivors");

    initializeSurvivorSearch();
    console.log("5.1 Survivor Search");

    initializePortraitMenu();
    console.log("6. Portrait Menu");

    initializeRandomSurvivor();
    console.log("7. Random Survivor");

    initializeKillers();
    console.log("8. Killers");

    initializeKillerSearch();
    console.log("8.1 Killer Search");

    initializeRandomKiller();
    console.log("9. Random Killer");

    initializeSettings();
    console.log("10. Settings");

});