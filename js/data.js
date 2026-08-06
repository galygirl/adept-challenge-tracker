// ==========================================
// Game Data
// ==========================================

const gameData = {
    survivors: [],
    killers: [],
};

// ==========================================
// Load JSON Files
// ==========================================

async function loadGameData() {

    try {

        const survivorResponse = await fetch("data/survivors.json");
        gameData.survivors = await survivorResponse.json();

        console.log("✔ Survivors loaded");

        const killerResponse = await fetch("data/killers.json");
        gameData.killers = await killerResponse.json();

        console.log("✔ Killers loaded");

    }

    catch(error){

        console.error(error);

    }

}