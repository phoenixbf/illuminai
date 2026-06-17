let UI = {};

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

// SIDE PANEL (FILTERS)
UI.openSideFilters = ()=>{
    let elBody = ATON.UI.createContainer();

    // 1 Block - CLASSES
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

    // Linea divisoria - tra blocco 1 e 2
    let separator = document.createElement("hr");
    separator.className = "filter-block-separator";
    elBody.append(separator);

    //Blocco 2 - CHRONOLOGY 
    //Blocco 2 - RINGS (Slidebar)
    APP.filters["max_visible_ring"] = 6;
    
    let elSliderBlock = ATON.UI.createContainer();

    let titleSlider = document.createElement("h3");
    titleSlider.innerText = "Chronology";
    titleSlider.className = "filter-block-title";
    elSliderBlock.append(titleSlider);

    let sliderWrapper = document.createElement("div");
    sliderWrapper.className = "filter-slider-wrapper";

    let elSliderContainer = ATON.UI.createContainer();
    elSliderContainer.append(
        ATON.UI.createSlider({
            label: "Max Ring Visible",
            min: 0,
            max: 6,
            value: 6, // Valore iniziale
            step: 1,   // Incremento dello slider
            onchange: (v) => {
                // 'v' è il valore numerico ritornato dallo slider
                APP.filters["max_visible_ring"] = parseInt(v);
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        })
    );

    elSliderBlock.append(elSliderContainer);
    elBody.append(elSliderBlock);

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
            //value: true,
            onchange: (b)=>{
                APP.filters["9"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        
        ATON.UI.createSwitch({
            label: "XI Century",
            //value: true,
            onchange: (b)=>{
                APP.filters["10"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        
        ATON.UI.createSwitch({
            label: "XII Century",
            //value: true,
            onchange: (b)=>{
                APP.filters["11"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        
        ATON.UI.createSwitch({
            label: "XIII Century",
            //value: true,
            onchange: (b)=>{
                APP.filters["12"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),

        ATON.UI.createSwitch({
            label: "XIV Century",
            //value: true,
            onchange: (b)=>{
                APP.filters["13"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),

        ATON.UI.createSwitch({
            label: "XV Century",
            //value: true,
            onchange: (b)=>{
                APP.filters["14"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),

        ATON.UI.createSwitch({
            label: "XVI Century",
            //value: true,
            onchange: (b)=>{
                APP.filters["15"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),

        ATON.UI.createSwitch({
            label: "XVII Century",
            //value: true,
            onchange: (b)=>{
                APP.filters["16"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        
    );

    //elCenturiesBlock.append(elCenturies);
    collapsibleWrapper.append(elCenturies);
    elBody.append(collapsibleWrapper);

    ATON.UI.showSidePanel({
        header: "Filters",
        body: elBody
    });
};

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
