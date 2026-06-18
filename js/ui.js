let UI = {};

//MAIN DOCK
UI.setup = ()=>{
    UI._elDock = ATON.UI.get("dock");
    
    UI._elDock.append(
        UI.createButtonTools(),
        UI.createButtonFilters(),
        ATON.UI.createButtonHome({ classes: "illuminai-dock-btn", icon: APP.pathResIcons+"home.png" }),
        UI.createButtonSearch(),
        UI.createButtonInfo(),
    );
};

//MAIN DOCK - Buttons
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
        //onpress: UI.modalWelcome
        //onpress: UI.sideTools
    });
    
//UI._elTB.push(UI._elTools);
//return UI._elTools;
};
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
    // menu discesa per scelta cluster
    
    let dropdownElement = ATON.UI.elem(`
        <div id="cluster-dropdown-container" class="dropdown-container">
            <label for="aton-dropdown" class="illuminaai-dropdown-label">
                Select a Cluster
            </label>
            <select id="aton-dropdown" class="dropdown-select">
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
    
    dropdown.addEventListener('change', (event) => {
        const selectedValue = event.target.value;
        console.log("Change cluster with:", selectedValue);

        switch(selectedValue) {
            case 'scene0': break;
            case 'scene1': break;
            case 'scene2': break;
            case 'scene3': break;
            case 'scene4': break;
            case 'scene5': break;
            case 'scene6': break;
            case 'scene7': break;
            case 'scene8': break;
            case 'scene9': break;
        }
    });

    elBody.append(dropdownElement);
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Tasti VR e AR --------  
    let btnVR = ATON.UI.createButton({
        icon: "vr", // o "xr"
        tooltip: "Virtual Reality (VR)",
        onpress: UI.modalVR
    });

    let btnAR = ATON.UI.createButton({
        icon: "ar",
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
    
    ATON.UI.showModal({
        header: "IlluminAI",
        body: elBody
    });
};
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// SIDE PANEL (FILTERS)
UI.openSideFilters = ()=>{
    let elBody = ATON.UI.createContainer();

    // 1 Block - CLASSES
    let titleClasses = document.createElement("h3");
    
    // Title "CLASSES"
    let titleClasses = document.createElement("h3");
    titleClasses.innerText = "Object Types";
    titleClasses.className = "filter-block-title"; 
    elClassesBlock.append(titleClasses);
    
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
    elClassesBlock.append(elClasses);
    elBody.append(elClassesBlock);
//******************************************************************/
    // Linea divisoria - tra blocco 1 e 2
    let separator = document.createElement("hr");
    separator.className = "filter-block-separator";
    elBody.append(separator);
//******************************************************************/
    //Blocco 2 - CHRONOLOGY 
    //Blocco 2 - RINGS (Slidebar)
    //if (!APP.filters) APP.filters = {};
    APP.filters["max_visible_ring"] = 6;
    
    let elSliderBlock = ATON.UI.createContainer();

    let titleSlider = document.createElement("h3");
    titleSlider.innerText = "Chronology";
    titleSlider.className = "filter-block-title";
    elSliderBlock.append(titleSlider);

    //let sliderWrapper = document.createElement("div");
    //sliderWrapper.className = "filter-slider-wrapper";

    let elSliderContainer = ATON.UI.createContainer();
    elSliderContainer.append(
        ATON.UI.createSlider({
            label: "Max Ring Visible",
            min: 0,
            max: 6,
            value: 6,
            step: 1,
            onchange: (v) => {
                // 'v' valore numerico ritornato dallo slider
                APP.filters["max_visible_ring"] = parseInt(v);
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        })
    );
    elSliderBlock.append(elSliderContainer);
    elBody.append(elSliderBlock);
//******************************************************************/
    //Blocco 2.2 - CENTURY (Comprimibile) ********************************/
    let collapsibleWrapper = document.createElement("details");
    collapsibleWrapper.className = "filter-collapsible";
    //collapsibleWrapper.open = true per APERTO di default
    
    let titleCenturies = document.createElement("summary");
    titleCenturies.innerText = "Centuries";
    titleCenturies.className = "filter-block-title filter-collapsible-summary";
    collapsibleWrapper.append(titleCenturies);

    let elCenturies = ATON.UI.createContainer();
    elCenturies.append(
        ATON.UI.createSwitch({
            label: "IX Century",
            //value: true,
            onchange: (b)=>{
                APP.filters["8"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "X Century",
            onchange: (b)=>{
                APP.filters["9"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "XI Century",
            onchange: (b)=>{
                APP.filters["10"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "XII Century",
            onchange: (b)=>{
                APP.filters["11"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "XIII Century",
            onchange: (b)=>{
                APP.filters["12"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "XIV Century",
            onchange: (b)=>{
                APP.filters["13"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "XV Century",
            onchange: (b)=>{
                APP.filters["14"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "XVI Century",
            onchange: (b)=>{
                APP.filters["15"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "XVII Century",
            onchange: (b)=>{
                APP.filters["16"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "XVIII Century",
            onchange: (b)=>{
                APP.filters["17"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "XIX Century",
            onchange: (b)=>{
                APP.filters["18"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "XX Century",
            onchange: (b)=>{
                APP.filters["19"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),    
    );

    collapsibleWrapper.append(elCenturies);
    elBody.append(collapsibleWrapper);

    ATON.UI.showSidePanel({
        header: "Filters",
        body: elBody
    });
};
//******************************************************************/
//prova||prova
UI.sideTools = ()=>{
    let elBody = ATON.UI.createContainer();
    let elMeasSection = ATON.UI.createContainer();

    elMeasSection.append(
        UI.createTextBlock("Add text"),
        UI.createBlockGroup({
            items:[
                ATON.UI.createButton({
                    text: "Add text"+ UI.TASK_SYMBOL,
                    classes: "illuminai-dock-btn",
                    onpress: ()=>{
                        //HATHOR.setCurrentTask(HATHOR.TASK_MEASURE_AB);
                        //ATON.UI.setCursorStyle("crosshair");
                    }
                })
            ]
        }),

        //UI.createTextBlock("Remove all"),
        UI.createBlockGroup({
            items:[
                ATON.UI.createButton({
                    text: "Add text",
                    icon: "delete",
                    classes: "illuminai-dock-btn",
                    onpress: ()=>{
                        //HATHOR.ED.removeMeasures();
                    }
                })
            ]
        })
    );

    elBody.append(
        ATON.UI.createTreeGroup({
            items:[
                {
                    title: "Measure",
                    open: true,
                    content: elMeasSection
                }
            ]
        })
    )

    ATON.UI.showSidePanel({
        header: "Filters",
        body: elBody
    });
};

export default UI;
