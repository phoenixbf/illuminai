let UI = {};

UI.setup = ()=>{
    UI._elDock = ATON.UI.get("dock");

    UI._elDock.append(
        UI.createButtonTools(),
        UI.createButtonFilters(),
        ATON.UI.createButtonHome({ classes: "illuminai-dock-btn" }),
        UI.createButtonSearch(),
        UI.createButtonInfo(),
    );
};

// Dock buttons
UI.createButtonFilters = ()=>{
    return ATON.UI.createButton({
        icon: APP.pathResIcons+"filter.png", // "bi-sliders",
        classes: "illuminai-dock-btn",
        onpress: UI.openSideFilters
    });
};

UI.createButtonSearch = ()=>{
    return ATON.UI.createButton({
        icon: APP.pathResIcons+"search.png", // "bi-sliders",
        classes: "illuminai-dock-btn",
        //onpress: UI.openSideFilters
    }); 
};

UI.createButtonInfo = ()=>{
    return ATON.UI.createButton({
        icon: APP.pathResIcons+"info.png", // "bi-sliders",
        classes: "illuminai-dock-btn",
        onpress: UI.modalInfo
    }); 
};

UI.createButtonTools = ()=>{
    return ATON.UI.createButton({
        icon: APP.pathResIcons+"tools.png", // "bi-sliders",
        classes: "illuminai-dock-btn",
        onpress: UI.modalWelcome
    });
};

// INFO PAGE
UI.modalInfo = ()=>{
    let elBody = ATON.UI.createContainer();

    elBody.append(
        ATON.UI.elem(`
            <div class="info-container">
                <img src="${APP.basePath}/appicon.png" style='width:100px; height:auto'>
                <br><hr class="info-divider">
                <br><b class="info-title">🚀 Discover IlluminAI</b>
                <div class="info-description">
                    <p>Welcome! Here what you can do:</p>
                    <div class="instruction-step">
                        <span>1️⃣</span>
                        <p>Select one of the clusters to start using <b>Home</b>.</p>
                    </div>
                    <div class="instruction-step">
                        <span>2️⃣</span>
                        <p>Apply <b>Filters</b> to refine your search.</p>
                    </div>
                    <div class="instruction-step">
                        <span>3️⃣</span>
                        <p>Select an <b>Items</b> to view the image in high resolution and to explore the related information.</p>
                    </div>
                </div>
                <br><hr class="info-divider">
                <button class="info-btn" onclick="ATON.UI.hideModal()">READY!</button>
            </div>
        `),
    );

    ATON.UI.showModal({
        header: "Getting Started",
        body: elBody
    });
};

//WELCOME PAGE
UI.modalWelcome = ()=>{
    let elBody = ATON.UI.createContainer();

    elBody.append(
        ATON.UI.elem(`
            <div style='text-align:center; margin:8px'>
                <img src='${APP.basePath}/appicon.png' style='width:100px; height:auto'>
                <br><br>
                <span style='text-align:left'>
                    IlluminAI is a Web3D/WebXR application for exploring late medieval illuminated manuscripts in a 3D space. The users will be able to analyze pages searching for figurative miniatures and compare these with other artworks based on their iconography.
                </span>
            </div>
        `),
    );

    ATON.UI.showModal({
        header: "IlluminAI",
        body: elBody
    });
};

// Side panels
UI.openSideFilters = ()=>{
    let elBody = ATON.UI.createContainer();

    let elClasses = ATON.UI.createContainer();
    elBody.append(elClasses);

    elClasses.append(
        ATON.UI.createSwitch({
            label: "Manuscript Sheets",
            //value: true,
            onchange: (b)=>{
                APP.filters["P.01_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Printed Pages",
            onchange: (b)=>{
                APP.filters["P.02_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Paintings",
            onchange: (b)=>{
                APP.filters["A.01_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Engravings",
            onchange: (b)=>{
                APP.filters["A.02_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Drawings",
            onchange: (b)=>{
                APP.filters["A.03_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Sculpture",
            onchange: (b)=>{
                APP.filters["A.04_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Stained-Glass Windows",
            onchange: (b)=>{
                APP.filters["A.05_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Tapestries",
            onchange: (b)=>{
                APP.filters["A.06_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Prints",
            onchange: (b)=>{
                APP.filters["A.07_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Objects",
            onchange: (b)=>{
                APP.filters["A.08_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        })
    );

    ATON.UI.showSidePanel({
        header: "Filters",
        body: elBody
    });
};

export default UI;
