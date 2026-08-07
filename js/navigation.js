// ==========================================
// Page Configuration
// ==========================================

const pageData = {
    dashboard: {
        title: "Dashboard",
        subtitle: "Track your overall Adept progress."
    },

    survivors: {
        title: "Survivors",
        subtitle: "View and update Survivor Adept challenges."
    },

    killers: {
        title: "Killers",
        subtitle: "View and update Killer Adept challenges."
    },

    collectionPage: {
        title: "Collection",
        subtitle: "Manage which chapters you own."
    },

    statistics: {
        title: "Statistics",
        subtitle: "Analyze your progress and completion rates."
    },

    settings: {
        title: "Settings",
        subtitle: "Customize your tracker experience."
    }
};

// ==========================================
// Initialize Navigation
// ==========================================

function initializeNavigation() {

    const buttons = document.querySelectorAll(".nav-button");
    const pages = document.querySelectorAll(".page");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const pageName = button.dataset.page;

            // Remove active classes
            buttons.forEach(btn => btn.classList.remove("active"));
            pages.forEach(page => page.classList.remove("active"));

            // Activate selected button
            button.classList.add("active");

            // Show selected page
document
        .getElementById(pageName)
        .classList.add("active");

         // Update page title
          updateHeader(pageName);

        });

    });

}

// ==========================================
// Update Header
// ==========================================

function updateHeader(viewName) {

    const page = pageData[viewName];

    document.getElementById("pageTitle").textContent = page.title;

    document.getElementById("pageSubtitle").textContent = page.subtitle;

}