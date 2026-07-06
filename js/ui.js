let UI = {};

// MAIN DOCK
UI.setup = ()=>{
    UI._elDock = ATON.UI.get("dock");
    if (UI._elDock) {
        UI._elDock.append(
            UI.createButtonCluster(),
            UI.createButtonFilters(),
            ATON.UI.createButtonHome({ classes: "illuminai-dock-btn", icon: APP.pathResIcons+"home.png" }),
            UI.createButtonSearch(),
            UI.createButtonInfo(),
        );
    }
};

//MAIN DOCK - Buttons
//UI.createButtonFilters = ()=>{
    //return ATON.UI.createButton({
        //icon: APP.pathResIcons+"filter.png", // "bi-sliders",
        //classes: "illuminai-dock-btn",
        //onpress: UI.openSideFilters
    //});
//};

//UI.createButtonSearch = ()=>{
    //return ATON.UI.createButton({
        //icon: APP.pathResIcons+"search.png", // "bi-sliders",
        //classes: "illuminai-dock-btn",
        //onpress: UI.openSideFilters
    //}); 
//};

//UI.createButtonInfo = ()=>{
    //return ATON.UI.createButton({
        //icon: APP.pathResIcons+"info.png", // "bi-sliders",
        //classes: "illuminai-dock-btn",
        //onpress: UI.modalInfo
    //}); 
//};

//UI.createButtonTools = ()=>{
    //return ATON.UI.createButton({
        //icon: APP.pathResIcons+"tools.png", // "bi-sliders",
        //classes: "illuminai-dock-btn",
        //onpress: UI.modalWelcome
        //onpress: UI.sideTools
    //});
    
//UI._elTB.push(UI._elTools);
//return UI._elTools;
//};

UI.createButtonFilters = ()=>{
    let btn = ATON.UI.createButton({
        icon: APP.pathResIcons + "filter.png",
        classes: "illuminai-dock-btn",
        onpress: UI.openSideFilters
    });
    if (btn && btn.setAttribute) {
        btn.setAttribute("data-label", "Filters");
    }
    return btn;
};

UI.createButtonSearch = ()=>{
    let btn = ATON.UI.createButton({
        icon: APP.pathResIcons + "search.png",
        classes: "illuminai-dock-btn"
        // onpress: UI.openSearch
    }); 
    if (btn && btn.setAttribute) {
        btn.setAttribute("data-label", "Search");
    }
    return btn;
};

UI.createButtonHome = ()=>{
    let btn = ATON.UI.createButtonHome({
        classes: "illuminai-dock-btn", 
        icon: APP.pathResIcons + "home.png",
        // onpress:
    });
    if (btn && btn.setAttribute) {
        btn.setAttribute("data-label", "Home");
    }
    return btn;
};

UI.createButtonInfo = ()=>{
    let btn = ATON.UI.createButton({
        icon: APP.pathResIcons + "info.png",
        classes: "illuminai-dock-btn",
        onpress: UI.modalInfo
    }); 
    if (btn && btn.setAttribute) {
        btn.setAttribute("data-label", "Info");
    }
    return btn;
};

UI.createButtonCluster = ()=>{
    let btn = ATON.UI.createButton({
        icon: APP.pathResIcons + "change-cluster.png",
        classes: "illuminai-dock-btn",
        onpress: UI.modalWelcome
    });
    if (btn && btn.setAttribute) {
        btn.setAttribute("data-label", "Change cluster");
    }
    return btn;
};
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    let separator = ATON.UI.elem(`
        <hr class='filter-modal-separator'>
    `);
    elBody.append(separator);
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    // MENU SCELTA CLUSTER
    let dropdownElement = ATON.UI.elem(`
        <div id="cluster-dropdown-container" class="dropdown-container">
            <label for="aton-dropdown" class="illuminaai-dropdown-label">
                Select a Cluster
            </label>
            <select id="aton-dropdown" class="dropdown-select">
                <option value="" selected disabled hidden>Where to start?</option>
                <option value="scene0">Cluster 0</option>    
                <option value="scene1">Cluster 1</option>
                <option value="scene2">Cluster 2</option>
                <option value="scene3">Cluster 3</option>
                <option value="scene4">Cluster 4</option>
                <option value="scene5">Cluster 5</option>
                <option value="scene6">Cluster 6</option>
                <option value="scene7">Cluster 7</option>
                <option value="scene8">Cluster 8</option>
                <option value="scene9">Cluster 9</option>
            </select>
        </div> 
    `);
    
    const dropdown = dropdownElement.querySelector('#aton-dropdown');
    
    //let currentUrlCluster = (APP.params && APP.params.get("c")) || "0";
    //dropdown.value = "scene" + currentUrlCluster;

    dropdown.addEventListener('change', (event) => {
        const selectedValue = event.target.value;
        let clusterId = selectedValue.replace("scene", "");

        APP.changeCluster(clusterId);
    });

    elBody.append(dropdownElement);
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Tasti VR e AR --------  
    let btnVR = ATON.UI.createButton({
        icon: APP.pathResIcons+"vr.png", // o "xr"
        tooltip: "Virtual Reality (VR)",
        onpress: UI.modalVR
    });

    let btnAR = ATON.UI.createButton({
        icon: APP.pathResIcons+"ar.png",
        tooltip: "Augmented Reality (AR)",
        onpress: UI.modalAR
    });

    btnVR.className += " btn-vr-rect";
    btnAR.className += " btn-ar-rect";

    UI._elVR = btnVR;
    UI._elAR = btnAR;

    //Gestione del supporto hardware
    //const updateXRVisibility = () => {
        //if (ATON.device.xrSupported && ATON.device.xrSupported['immersive-vr']) {
            //ATON.UI.showElement(btnVR);
        //} else {
            //ATON.UI.hideElement(btnVR);
        //}
        //if (ATON.device.xrSupported && ATON.device.xrSupported['immersive-ar']) {
            //ATON.UI.showElement(btnAR);
        //} else {
            //ATON.UI.hideElement(btnAR);
        //}

    //};

    const updateXRVisibility = () => {
        ATON.UI.showElement(btnVR);
        ATON.UI.showElement(btnAR);
    };
    
    updateXRVisibility();

    ATON.on("XR_support", () => {
        updateXRVisibility();
    });

    if (UI._elTB) {
        UI._elTB.push(btnVR);
        UI._elTB.push(btnAR);
    }
    
    //affianca i due bottoni
    let buttonsContainer = ATON.UI.elem(`
        <div class='modal-buttons-container'>
            <div id='vr-btn-placeholder'></div>
            <div id='ar-btn-placeholder'></div>
        </div>
    `);

    buttonsContainer.querySelector('#vr-btn-placeholder').append(btnVR);
    buttonsContainer.querySelector('#ar-btn-placeholder').append(btnAR);

    elBody.append(buttonsContainer);
    //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    //START Button
    let btnStart = ATON.UI.createButton({
        label: "START",
        icon: "",
        tooltip: "Start Exploration",
        onpress: () => {
            //console.log("Starting application with cluster:", dropdown.value);
            ATON.UI.hideModal(); 
            
            // Qui logica di inizializzazione della scena 
            // basata sul cluster (dropdown.value)
        }
    });

    btnStart.className += " btn-start-rect"; 

    let startContainer = ATON.UI.elem(`
        <div class='start-button-container' style='text-align: center; margin-top: 20px;'>
            <div id='start-btn-placeholder'></div>
        </div>
    `);

    startContainer.querySelector('#start-btn-placeholder').append(btnStart);
    btnStart.innerHTML = "START";
    elBody.append(startContainer);
    
    ATON.UI.showModal({
        header: "IlluminAI",
        body: elBody
    });
};
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// SIDE PANEL - FILTERS
UI.openSideFilters = ()=>{
    let elBody = ATON.UI.createContainer();
    
    //Block 1 - CLASSES <---------
    let elClassesBlock = ATON.UI.createContainer(); 

    let titleClasses = document.createElement("h3");
    titleClasses.innerText = "Object Types";
    titleClasses.className = "filter-block-title"; 
    elClassesBlock.append(titleClasses);
 
    let elClasses = ATON.UI.createContainer();

    elClasses.append(
        ATON.UI.createSwitch({
            label: "Manuscript Sheets",
            value: APP.filters["P.01_annotation"],
            onchange: (b)=>{
                APP.filters["P.01_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Printed Pages",
            value: APP.filters["P.02_annotation"],
            onchange: (b)=>{
                APP.filters["P.02_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Paintings",
            value: APP.filters["A.01_annotation"],
            onchange: (b)=>{
                APP.filters["A.01_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Engravings",
            value: APP.filters["A.02_annotation"],
            onchange: (b)=>{
                APP.filters["A.02_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Drawings",
            value: APP.filters["A.03_annotation"],
            onchange: (b)=>{
                APP.filters["A.03_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Sculpture",
            value: APP.filters["A.04_annotation"],
            onchange: (b)=>{
                APP.filters["A.04_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Stained-Glass Windows",
            value: APP.filters["A.05_annotation"],
            onchange: (b)=>{
                APP.filters["A.05_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Tapestries",
            value: APP.filters["A.06_annotation"],
            onchange: (b)=>{
                APP.filters["A.06_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Prints",
            value: APP.filters["A.07_annotation"],
            onchange: (b)=>{
                APP.filters["A.07_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Objects",
            value: APP.filters["A.08_annotation"],
            onchange: (b)=>{
                APP.filters["A.08_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        })
    );
    elClassesBlock.append(elClasses);
    elBody.append(elClassesBlock);
//******************************************************************/
    //Linea divisoria --- tra blocco 1 e 2
    let separator = document.createElement("hr");
    separator.className = "filter-block-separator";
    elBody.append(separator);
//******************************************************************/
    //Blocco 2 - CHRONOLOGY 
    //Blocco 2.1 - RINGS (Slidebar)
    if (APP.filters["max_visible_ring"] === undefined) {
        APP.filters["max_visible_ring"] = 5;
    }
    
    let elSliderBlock = ATON.UI.createContainer();

    let titleSlider = document.createElement("h3");
    titleSlider.innerText = "Chronology";
    titleSlider.className = "filter-block-title";
    elSliderBlock.append(titleSlider);

    let sliderTimeout;

    let elSliderContainer = ATON.UI.createContainer();
    elSliderContainer.append(
        ATON.UI.createSlider({
            label: "Max Ring Visible",
            min: 0,
            max: 5,
            value: APP.filters["max_visible_ring"],
            step: 1,
            ticks: [0, 1, 2, 3, 4, 5],
            onchange: (v) => {

                let currentRing = Math.round(parseFloat(v));
                
                // Forza il pallino a saltare sulla tacca esatta nel DOM
                let domPanel = elBody.element || elBody.dom || elBody;
                if (domPanel) {
                    let rangeInput = domPanel.querySelector("input[type='range']");
                    if (rangeInput && parseInt(rangeInput.value) !== currentRing) {
                        rangeInput.value = currentRing;
                    }
                }

                if (APP.filters["max_visible_ring"] === currentRing) return;
                
                APP.filters["max_visible_ring"] = currentRing;
                
                clearTimeout(sliderTimeout);
                sliderTimeout = setTimeout(() => {
                    if (APP.activeCluster) {
                        APP.activeCluster.filter();
                    }
                }, 100);
            }
        })
    );

    // UPDATE DEL DOM - risolve Bug di Persistenza
    // Forza lo slider a spostarsi sul valore in memoria
    setTimeout(() => {
        let domPanel = elSliderContainer.element || elSliderContainer.dom || elSliderContainer;
        if (domPanel) {
            let rangeInput = domPanel.querySelector("input[type='range']");
            if (rangeInput) {
    
                rangeInput.value = APP.filters["max_visible_ring"];
                
                rangeInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    }, 50);

    elSliderBlock.append(elSliderContainer);
    elBody.append(elSliderBlock);
//******************************************************************/ 
    //Blocco 2.2 - CENTURY (Filter - comprimibile)
    let collapsibleWrapper = document.createElement("details");
    collapsibleWrapper.className = "filter-collapsible";

    let titleCenturies = document.createElement("summary");
    titleCenturies.innerText = "Centuries";
    titleCenturies.className = "filter-block-title filter-collapsible-summary";
    collapsibleWrapper.append(titleCenturies);

    let elCenturies = ATON.UI.createContainer();
    elCenturies.append(
        ATON.UI.createSwitch({
            label: "IX Century",
            value: APP.filters["8"],
            onchange: (b)=>{
                APP.filters["8"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "X Century",
            value: APP.filters["9"],
            onchange: (b)=>{
                APP.filters["9"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "XI Century",
            value: APP.filters["10"],
            onchange: (b)=>{
                APP.filters["10"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "XII Century",
            value: APP.filters["11"],
            onchange: (b)=>{
                APP.filters["11"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "XIII Century",
            value: APP.filters["12"],
            onchange: (b)=>{
                APP.filters["12"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "XIV Century",
            value: APP.filters["13"],
            onchange: (b)=>{
                APP.filters["13"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "XV Century",
            value: APP.filters["14"],
            onchange: (b)=>{
                APP.filters["14"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "XVI Century",
            value: APP.filters["15"],
            onchange: (b)=>{
                APP.filters["15"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "XVII Century",
            value: APP.filters["16"],
            onchange: (b)=>{
                APP.filters["16"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "XVIII Century",
            value: APP.filters["17"],
            onchange: (b)=>{
                APP.filters["17"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "XIX Century",
            value: APP.filters["18"],
            onchange: (b)=>{
                APP.filters["18"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "XX Century",
            value: APP.filters["19"],
            onchange: (b)=>{
                APP.filters["19"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),   
    );

    collapsibleWrapper.append(elCenturies);
    elBody.append(collapsibleWrapper);
//******************************************************************/
    //Linea divisoria --- tra blocco 2 e reset
    let separator2 = document.createElement("hr");
    separator2.className = "filter-block-separator";
    elBody.append(separator2);
//******************************************************************/
    // RESET BUTTON
    // Reset Container
    let elResetBlock = ATON.UI.createContainer();
    elResetBlock.style.padding = "20px 0px";
    elResetBlock.style.textAlign = "center";

    //Reset Button
    let btnReset = ATON.UI.createButton({
        classes: "illuminai-reset-btn", 
        onpress: () => {
            let keysToReset = [
                "P.01_annotation", "P.02_annotation", "A.01_annotation", "A.02_annotation", 
                "A.03_annotation", "A.04_annotation", "A.05_annotation", "A.06_annotation", 
                "A.07_annotation", "A.08_annotation", "8", "9", "10", "11", "12", "13", 
                "14", "15", "16", "17", "18", "19"
            ];
            keysToReset.forEach(key => {
                APP.filters[key] = false; // Forza lo stato disattivato iniziale
            });
            APP.filters["max_visible_ring"] = 5;

            let domElement = elBody.element || elBody.dom || elBody; // Reset visivo componenti nel DOM
            if (domElement) {
                // Spegne i checkbox/switch del pannello
                let checkboxes = domElement.querySelectorAll("input[type='checkbox']");
                checkboxes.forEach(cb => {
                    cb.checked = false;
                });

                // Trova lo slider e lo riporta a 5
                let sliders = domElement.querySelectorAll("input[type='range']");
                sliders.forEach(sl => {
                    sl.value = 5;
                    //sl.dispatchEvent(new Event('input'));
                });
            }

            // Aggiorna la scena tridimensionale
            if (APP.activeCluster) {
                APP.activeCluster.filter();
            }
        }
    });

    let el = btnReset.element || btnReset.dom || btnReset;
    if (el) {
        el.innerText = "RESET FILTERS"; 
    }

    elResetBlock.append(btnReset);
    elBody.append(elResetBlock);
//******************************************************************/ 
    ATON.UI.showSidePanel({
        header: "Filters",
        body: elBody
    });
//******************************************************************/ 
//******************************************************************/ 
// funzionamento SLIDER 
   let domPanel = elBody.element || elBody.dom || elBody;
    if (domPanel) {
        let rangeInput = domPanel.querySelector("input[type='range']");
        if (rangeInput) {
            // Genera ID univoco per evitare conflitti se riapri la sidebar
            let datalistId = "ring-steps-list";
            
            // Rimuove eventuali datalist vecchie rimaste appese
            let oldList = domPanel.querySelector("#" + datalistId);
            if (oldList) oldList.remove();

            let datalist = document.createElement("datalist");
            datalist.id = datalistId;
        
            for (let i = 0; i <= 5; i++) {
                let option = document.createElement("option");
                option.value = i;
                option.label = i;
                datalist.appendChild(option);
            }
        
            rangeInput.parentNode.appendChild(datalist);

            rangeInput.setAttribute("list", datalistId);
            rangeInput.setAttribute("min", "0");
            rangeInput.setAttribute("max", "5");
            rangeInput.setAttribute("step", "1");
            //rangeInput.step = "1";
        }
    }
};

export default UI;
