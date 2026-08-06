function initializeDashboard() {
    updateDashboard();

    updateRecentActivity();
}

function updateDashboard() {

    const totalSurvivors = gameData.survivors.length;
    const totalKillers = gameData.killers.length;

        const survivorsCompleted = Object.values(progress.survivors)
    .filter(s => s.status === "adept")
    .length;

const killersCompleted = Object.values(progress.killers)
    .filter(k => k.status === "adept")
    .length;

    const overallCompleted = survivorsCompleted + killersCompleted;
    const overallTotal = totalSurvivors + totalKillers;

    const overallPercent =
        overallTotal > 0
            ? Math.round((overallCompleted / overallTotal) * 100)
            : 0;

    document.getElementById("survivorCount").textContent =
        `${survivorsCompleted} / ${totalSurvivors}`;

    document.getElementById("killerCount").textContent =
        `${killersCompleted} / ${totalKillers}`;

    document.getElementById("overallPercent").textContent =
        `${overallCompleted} / ${overallTotal} Characters Completed`;

    document.getElementById("overallProgress").style.width =
        `${overallPercent}%`;
}

function updateRecentActivity() {

    const list = document.querySelector(".activity-list");

    if (!list) return;

    list.innerHTML = "";

if (progress.activity.length === 0) {

    const li = document.createElement("li");

    li.textContent = "No activity yet.";

    list.appendChild(li);

    return;

}

progress.activity.forEach(item => {

    const li = document.createElement("li");

    li.textContent = item;

    list.appendChild(li);

});

}