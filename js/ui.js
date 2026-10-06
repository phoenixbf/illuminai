let UI = {};
//***************************************************************************
//MAIN DOCK
//***************************************************************************
UI.setup = ()=>{
    UI._elDock = ATON.UI.get("dock");
    if (UI._elDock) {
        UI._elDock.append(
            UI.createButtonCluster(),
            UI.createButtonFilters(),
            //ATON.UI.createButtonHome({ classes: "illuminai-dock-btn", icon: APP.pathResIcons+"home.png" }),
            UI.createButtonHome(),
            UI.createButtonSearch(),
            UI.createButtonInfo(),
            UI.createButtonFullscreen()
        );
    }
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

UI.createButtonSearch = () => {
    let btn = ATON.UI.createButton({
        icon: APP.pathResIcons + "search.png",
        classes: "illuminai-dock-btn",
        onpress: () => {
            let existingFloatingBar = document.querySelector('.search-floating-wrapper');

            if (existingFloatingBar) {
                existingFloatingBar.remove();
                if (APP.filters) APP.filters["search_query"] = "";
                
                if (typeof applySearchFilterToClusterMain === "function") {
                    applySearchFilterToClusterMain(""); 
                }
                
                if (btn?.classList) btn.classList.remove("dock-btn-active");
            } else {
                if (typeof UI.createFloatingSearch === "function") {
                    UI.createFloatingSearch();
                    if (btn?.classList) btn.classList.add("dock-btn-active");
                } else {
                    console.error("Funzione UI.createFloatingSearch non trovata.");
                }
            }
        }
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

UI.createButtonFullscreen = (options = {}) => {
    let btn = ATON.UI.createButton({
        icon:"fullscreen",
        classes: "illuminai-dock-btn",
        onpress: ATON.toggleFullScreen
    });
    if (btn && btn.setAttribute) {
        btn.setAttribute("data-label", "Full Screen");
    }
    return btn;
};
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// INFO PAGE
UI.modalInfo = ()=>{
    let elBody = ATON.UI.createContainer();

    // Stile helper per le icone inserite nel testo
    const inlineIconStyle = "height: 1.8em; width: auto; vertical-align: -0.6em; margin: 0 4px;";

    elBody.append(
        ATON.UI.elem(`
            <div class="info-container">
                <b class="info-title">🚀 Discover IlluminAI</b>
                <div class="info-description">
                    <p>Welcome! Here what you can do:</p>
                    <div class="instruction-step">
                        <span>1️⃣</span>
                        <p>Select a cluster or change it from the Welcome Page using the <img src="${APP.pathResIcons}/change-cluster.png" style="${inlineIconStyle}" alt="change"> <b>Dropdown Menu</b>.</p>
                    </div>
                    <div class="instruction-step">
                        <span>2️⃣</span>
                        <p>Apply <b>Filters</b> using the Sidebar <img src="${APP.pathResIcons}/filter.png" style="${inlineIconStyle}" alt="filter"> to make the images appear and refine the search.</p>
                    </div>
                    <div class="instruction-step">
                        <span>3️⃣</span>
                        <p>Select an <b>Item</b> to view the image in high resolution and to explore the related data.</p>
                    </div>
                    <div class="instruction-step">
                        <span>4️⃣</span>
                        <p>Use the <b>Search Bar</b> <img src="${APP.pathResIcons}/search.png" style="${inlineIconStyle}" alt="search"> to find what you are looking for!</p>
                    </div>
                    <p style="margin-top: 15px; margin-bottom: 0px; text-align: center;">
                        Still have questions? 
                        <a href="#" id="btn-open-tutorial" style="color: #007bff; text-decoration: underline; font-weight: bold; cursor: pointer;">
                            Watch a short tutorial.
                        </a>
                    </p>
                </div>
                <hr class="info-divider">
                <button class="info-btn" onclick="ATON.UI.hideModal()">READY!</button>
            </div>
        `),
    );

    // Aggancia l'evento direttamente sull'elemento prima di mostrare il modal
    let tutorialBtn = elBody.querySelector("#btn-open-tutorial");
    if (tutorialBtn) {
        tutorialBtn.onclick = (e) => {
            e.preventDefault();
            ATON.UI.openVideoTutorial();
        };
    }

    ATON.UI.showModal({
        header: `<div style="display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; text-align: center;">
                    <img src="${APP.basePath}/appicon.png" style="height: 30px; width: auto; vertical-align: middle;">
                    <span>Getting Started</span>
                 </div>`,
        body: elBody
    });
};

//***************************************************************************
//PAGE VIDEO TUTORIAL
//***************************************************************************
ATON.UI.openVideoTutorial = () => {
    let videoBody = ATON.UI.createContainer();
    
    videoBody.append(
        ATON.UI.elem(`
            <div style="text-align: center;">
                <video controls autoplay playsinline style="width: 100%; max-width: 640px; border-radius: 8px;">
                    <source src="${APP.basePath}/tutorial.mp4" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
        `)
    );

    ATON.UI.showModal({
        header: `<div style="display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; text-align: center;">
            <img src="${APP.basePath}/appicon.png" style="height: 30px; width: auto; vertical-align: middle;">
            <span>Tutorial</span>
        </div>`,
        body: videoBody
    });
};

//***************************************************************************
//WELCOME PAGE
//***************************************************************************
UI.modalWelcome = ()=>{
    let elBody = ATON.UI.createContainer();

    elBody.append(
        ATON.UI.elem(`
            <div style='text-align:center; margin:8px'>
                <img src='${APP.basePath}/appicon.png' style='width:100px; height:auto'>
                <br><br>
                <span style='text-align:left'>
                     IlluminAI is a Web3D/WebXR application for the iconographic exploration of late-medieval illuminated manuscripts. Select one of the clusters, set the filters and start discovering!
                </span>
            </div>
        `),
    );
    // *****************************************************************
    let separator = ATON.UI.elem(`
        <hr class='filter-modal-separator'>
    `);
    elBody.append(separator);
    // *****************************************************************
    // MENU SCELTA CLUSTER
    let dropdownElement;
    let loadedConfig = APP.confdata || {};
    
    let descrElement = document.createElement("p");
    descrElement.className = "illuminaai-dropdown-description";
    
    let clusterItems = [];

    clusterItems.push({
        title: "Where to start",
        disabled: true,
        onselect: (e) => {
            // Blocca l'azione se viene cliccato
            if (e && e.stopPropagation) e.stopPropagation();
            return false;
        }
    });
    
    for (let i = 0; i <= 9; i++) {
        // Estrae "title" e "descr" da APP.confdata.clusters[i]
        let nameFromConfig = "";
        let descrFromConfig = "";
        
        if (loadedConfig.clusters && loadedConfig.clusters[i]) {
            nameFromConfig = loadedConfig.clusters[i].title || "";
            descrFromConfig = loadedConfig.clusters[i].descr || "";
        }

        // Formattazione cluter "X - Titolo"
        let clusterLabel = nameFromConfig ? `${i} - ${nameFromConfig}` : `Cluster ${i}`;

        clusterItems.push({
            title: clusterLabel,
            description: descrFromConfig,
            
            onselect: () => {
                if (dropdownElement) {
                    // Aggiorna il testo del bottone principale
                    const btnText = dropdownElement.querySelector(".aton-btn-text");
                   
                    if (btnText) {
                        btnText.innerText = clusterLabel;
                    }

                    // Chiude la tendina dopo la selezione
                    let menu = dropdownElement.querySelector('.aton-dropdown-menu');
                    if (menu) {
                        menu.classList.remove("show");
                    }
                }
                // Aggiorna la descrizione sotto
                descrElement.innerText = descrFromConfig;
                
                // Cambia dataset
                APP.changeCluster(i.toString());
                 
                // Sincronizza nuovamente il menu
                updateDropdownLabel();
            }
        });
    }

    dropdownElement = ATON.UI.createDropdown({
        title: "Where to start?", 
        classes: "cluster-dropdown-container",
        btnclasses: "w-100", 
        items: clusterItems
    });

    // Disabilita graficamente la prima voce del menu "Where to start"
    let dropdownMenu = dropdownElement.querySelector('.aton-dropdown-menu');
    if (dropdownMenu) {
        // Il primo elemento della lista
        let firstItem = dropdownMenu.querySelector('.dropdown-item, a, li');
        if (firstItem) {
            firstItem.classList.add('disabled');
            firstItem.style.pointerEvents = 'none';
            firstItem.style.opacity = '0.5';
            firstItem.style.cursor = 'not-allowed';
        }
    }

    // aggiorna il testo menù 
    function updateDropdownLabel() {

        if (!APP.params || !dropdownElement) return;

        const currentUrlCluster = APP.params.get("c");

        // Nessun cluster selezionato: mantieni il testo iniziale
        if (currentUrlCluster === null || currentUrlCluster === "") {
            const btnText = dropdownElement.querySelector(".aton-btn-text");

            if (btnText) {
                btnText.innerText = "Where to start?";
            }

            descrElement.innerText = "";
            return;
        }
        const index = parseInt(currentUrlCluster, 10);

        if (Number.isNaN(index)) {
            return;
        }

        // Dataset corrente preso da APP.confdata.clusters
        const currentCluster = loadedConfig.clusters && loadedConfig.clusters[index];
        
        // Nome del cluster
        const label = currentCluster && currentCluster.title
            ? `${index} - ${currentCluster.title}`
            : `Cluster ${index}`;

        // Aggiorna il testo del bottone
        const currentBtnText = dropdownElement.querySelector(".aton-btn-text");

        if (currentBtnText) {
            currentBtnText.innerText = label;
        }

        // Aggiorna la descrizione
        if (currentCluster) {
            descrElement.innerText = currentCluster.descr || "";
        } else {
            descrElement.innerText = "";
        }
    }
    // *****************************************************************
    // Assemblaggio Wrapper e Label
    let wrapperElement = ATON.UI.createContainer({ 
        classes: "dropdown-wrapper" 
    });
    wrapperElement.style.marginBottom = "15px";

    let labelElement = document.createElement("label");
    labelElement.className = "illuminaai-dropdown-label";
    labelElement.innerText = "Select a Cluster";
    labelElement.style.display = "block"; 
    labelElement.style.marginBottom = "8px";

    wrapperElement.append(labelElement);
    wrapperElement.append(dropdownElement);
    wrapperElement.append(descrElement);

    updateDropdownLabel();

    elBody.append(wrapperElement);
    
    // *****************************************************************
    // Tasti VR e AR
    let btnVR = ATON.UI.createButtonVR();
    let btnAR = ATON.UI.createButtonAR();

    if (btnVR?.classList) btnVR.classList.add("btn-vr-rect");
    if (btnAR?.classList) btnAR.classList.add("btn-ar-rect");
    
    UI._elVR = btnVR;
    UI._elAR = btnAR;

    if (UI._elTB) {
        if (btnVR) UI._elTB.push(btnVR);
        if (btnAR) UI._elTB.push(btnAR);
    }
    
    //Container affianca i due bottoni
    let buttonsContainer = ATON.UI.elem(`
        <div class='modal-buttons-container'>
            <div id='vr-btn-placeholder'></div>
            <div id='ar-btn-placeholder'></div>
        </div>
    `);

    // Inserimento nei placeholder con verifica di esistenza
    if (btnVR) buttonsContainer.querySelector('#vr-btn-placeholder')?.append(btnVR);
    if (btnAR) buttonsContainer.querySelector('#ar-btn-placeholder')?.append(btnAR);

    elBody.append(buttonsContainer);
    
    //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    //START Button
    let btnStart = ATON.UI.createButton({
        label: "START",
        icon: "",
        tooltip: "Start Exploration",
        onpress: () => ATON.UI.hideModal()
    });

    if (btnStart.classList) {
        btnStart.classList.add("btn-start-rect");
    } 

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

//***************************************************************************
// LIVE FILTER COMPONENT
//***************************************************************************
UI.createLiveFilter = function(options = {}) {
    const baseid  = ATON.Utils.generateID("filter");
    const inputid = `${baseid}-input`;

    // Elemento Form contenitore
    const el = document.createElement("form");
    el.id = baseid;
    el.classList.add("d-flex");
    el.setAttribute("role", "search");
    el.onsubmit = (e) => e.preventDefault(); // Previene il Submit di default

    const placeholder = options.placeholder || "Search";
    
    // Input di ricerca
    const elInput = ATON.UI.elem(
        `<input class="form-control aton-input" type="search" placeholder="${placeholder}" aria-label="Search" id="${inputid}" spellcheck="false">`
    );

    if (typeof ATON.UI.registerElementAsComponent === "function") {
        ATON.UI.registerElementAsComponent(elInput, "input");
    }

    // Gruppo di input inline con icona di ricerca
    const elInGroup = document.createElement("div");
    elInGroup.classList.add("input-group", "aton-inline");
    
    const searchIcon = ATON.UI.elem("<span class='input-group-text aton-input'><i class='bi bi-search'></i></span>");
    elInGroup.append(searchIcon, elInput);

    // Helper per mostrare/nascondere elementi HTML nel DOM
    const toggleItem = (item, show) => {
        if (typeof ATON.UI.showElement === "function" && typeof ATON.UI.hideElement === "function") {
            show ? ATON.UI.showElement(item) : ATON.UI.hideElement(item);
        } else {
            item.classList.toggle("d-none", !show);
        }
    };

    // *****************************************************************
    // Gestione Evento Input (Live Search)
    elInput.oninput = () => {
        const v = elInput.value.trim().toLowerCase();

        // Invocazione callback custom usata da floating search per debouncing e sync filtri 3D
        if (typeof options.oninput === "function") {
            options.oninput(v);
        }

        if (typeof options.customfilter === "function") {
            options.customfilter(v);
            return;
        }

        // Filtraggio elementi DOM classici
        if (!options.filterclass) return;

        const filterItems = document.querySelectorAll(`.${options.filterclass}`);

        if (v.length < 3) {
            filterItems.forEach(item => toggleItem(item, true));
            return;
        }    

        filterItems.forEach(item => {
            const attr = item.getAttribute('data-search-term');
            const match = attr && attr.toLowerCase().includes(v);
            toggleItem(item, match);
        });
    };

    // Datalist opzionale per autocompletamento
    if (Array.isArray(options.list)) {
        const datalistId = `${baseid}-list`;
        elInput.setAttribute("list", datalistId);

        const elDatalist = ATON.UI.elem(`<datalist id='${datalistId}'></datalist>`);
        
        if (typeof ATON.UI.registerElementAsComponent === "function") {
            ATON.UI.registerElementAsComponent(elDatalist, "datalist");
        }

        options.list.forEach((val, i) => {
            const label = (options.listnames && options.listnames[i]) ? options.listnames[i] : val;
            const opt = document.createElement("option");
            opt.value = val;
            if (label !== val) opt.label = label;
            elDatalist.append(opt);
        });

        el.append(elDatalist);
    }

    // Blocco controlli 3D al focus per evitare intercettazione WASD / Frecce
    elInput.onfocus = () => {
        if (typeof ATON.UI !== "undefined") ATON.UI._bInput = true;
        if (typeof options.onfocus === "function") options.onfocus();
    };

    elInput.onblur = () => {
        if (typeof ATON.UI !== "undefined") ATON.UI._bInput = false;
        if (typeof options.onblur === "function") options.onblur();
    };

    el.append(elInGroup);
    return el;
};

//***************************************************************************
// SEARCH BAR - LIVE FILTER
//***************************************************************************
UI.createFloatingSearch = () => {
    // Evita duplicati se la barra già presente nel DOM
    if (document.querySelector('.search-floating-wrapper')) return;

    let searchWrapper = document.createElement('div');
    searchWrapper.className = 'search-floating-wrapper';
    searchWrapper.setAttribute('role', 'search');

    // Dimensione popup compatto compatto
    searchWrapper.style.maxWidth = '400px';
    searchWrapper.style.width = '85%';

    // Funzione di chiusura unificata
    const closeSearch = () => {
        document.removeEventListener('keydown', handleKeyDown);
        if (typeof ATON !== 'undefined' && ATON.UI) {
            ATON.UI._bInput = false;
        }
        searchWrapper.remove();
    };

    // Chiusura tramite ESC
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') closeSearch();
    };
    document.addEventListener('keydown', handleKeyDown);

    // Timer per il debounce del live filtering
    let debounceTimer;

    // Helper per l'esecuzione unificata del filtro sul cluster ATON
    const executeFilter = (queryVal) => {
        const query = queryVal.trim().toLowerCase();
        if (!APP.filters) APP.filters = {};
        APP.filters["search_query"] = query;
        APP.filters["text"] = query;

        if (typeof applySearchFilterToClusterMain === "function") {
            applySearchFilterToClusterMain(query);
        } else if (APP.activeCluster && typeof APP.activeCluster.filter === "function") {
            APP.activeCluster.filter();
        }
    };

    // Creazione del layout interno ATON compreso il pulsante di chiusura ✕
    let searchContainer = ATON.UI.elem(`
        <div class="search-popup-container" style="padding: 4px 8px; display: flex; align-items: center;">
            <button class="btn-search-close" aria-label="Close Searchbar" style="padding: 4px 8px; font-size: 14px; background: transparent; border: none; cursor: pointer;">✕</button>
            <input type="text" id="search-input" class="search-input-field" placeholder="Search by subject, source..." autocomplete="off" style="font-size: 1.15rem; padding: 8px 10px; flex: 1; min-width: 0; width: 100%;">
            <div id="search-submit-placeholder"></div>
        </div>
    `);

    // Event listener per la chiusura tramite pulsante ✕
    const closeBtn = searchContainer.querySelector('.btn-search-close');
    if (closeBtn) closeBtn.onclick = closeSearch;

    // Gestione dell'invio e chiusura premendo il tasto INVIO dall'input
    const inputField = searchContainer.querySelector('#search-input');
    if (inputField) {

        // Integrazione delle flag di focus/blur di UI.createLiveFilter per bloccare i controlli 3D
        inputField.onfocus = () => {
            if (typeof ATON !== "undefined" && ATON.UI) ATON.UI._bInput = true;
        };

        inputField.onblur = () => {
            if (typeof ATON !== "undefined" && ATON.UI) ATON.UI._bInput = false;
        };

        // Esegue la ricerca in tempo reale durante la digitazione
        inputField.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                executeFilter(e.target.value);
            }, 200); // 200ms debounce
        });

        // Esegue subito il filtro e chiude la barra
        inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                clearTimeout(debounceTimer);
                executeFilter(inputField.value);
                closeSearch();
            }
        });
    }
    
    // *****************************************************************
    // Creazione del pulsante GO via ATON.UI
    let btnSubmitSearch = ATON.UI.createButton({
        label: "GO",
        icon: "",
        tooltip: "Execute Search",
        onpress: () => {
            clearTimeout(debounceTimer);
            if (inputField) {
                executeFilter(inputField.value);
            }
            // Chiude la barra alla pressione del tasto GO
            closeSearch();
        }
    });

    let targetDomBtn = btnSubmitSearch.element || btnSubmitSearch.dom || btnSubmitSearch;
    if (targetDomBtn) {
        targetDomBtn.innerHTML = "GO";
        targetDomBtn.style.padding = '6px 12px';
        targetDomBtn.style.fontSize = '0.9rem';
    }

    if (btnSubmitSearch.classList) {
        btnSubmitSearch.classList.add("btn-search-submit");
    } else if (btnSubmitSearch.node?.classList) {
        btnSubmitSearch.node.classList.add("btn-search-submit");
    }

    searchContainer.querySelector('#search-submit-placeholder').append(targetDomBtn);
    searchWrapper.append(searchContainer);
    document.body.append(searchWrapper);

    // Focus automatico e ripristino ultimo filtro attivo
    setTimeout(() => {
        if (inputField) {
            inputField.focus();
            if (APP.filters && APP.filters["search_query"]) {
                inputField.value = APP.filters["search_query"];
            }
        }
    }, 50);
};

//***************************************************************************
// SIDE PANEL - FILTERS
//***************************************************************************
UI.openSideFilters = ()=>{
    let elBody = ATON.UI.createContainer();
    
    //Block 1 - CLASSES
    let elClassesBlock = ATON.UI.createContainer(); 

    let titleClasses = document.createElement("h3");
    titleClasses.innerText = "Object Types";
    titleClasses.className = "filter-block-title"; 
 
    let elClasses = ATON.UI.createContainer();

    elClasses.append(
        ATON.UI.createSwitch({
            label: "Manuscript Sheets (P.01)",
            value: APP.filters["P.01_annotation"],
            onchange: (b)=>{
                APP.filters["P.01_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Printed Pages",
            value: APP.filters["P.02_annotation (P.02)"],
            onchange: (b)=>{
                APP.filters["P.02_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Paintings",
            value: APP.filters["A.01_annotation (A.01)"],
            onchange: (b)=>{
                APP.filters["A.01_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Engravings",
            value: APP.filters["A.02_annotation (A.02)"],
            onchange: (b)=>{
                APP.filters["A.02_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Drawings",
            value: APP.filters["A.03_annotation (A.03)"],
            onchange: (b)=>{
                APP.filters["A.03_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Sculpture",
            value: APP.filters["A.04_annotation (A.04)"],
            onchange: (b)=>{
                APP.filters["A.04_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Stained-Glass Windows (A.05)",
            value: APP.filters["A.05_annotation"],
            onchange: (b)=>{
                APP.filters["A.05_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Tapestries",
            value: APP.filters["A.06_annotation (A.06)"],
            onchange: (b)=>{
                APP.filters["A.06_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Prints",
            value: APP.filters["A.07_annotation (A.07)"],
            onchange: (b)=>{
                APP.filters["A.07_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        }),
        ATON.UI.createSwitch({
            label: "Objects",
            value: APP.filters["A.08_annotation (A.08)"],
            onchange: (b)=>{
                APP.filters["A.08_annotation"] = b;
                if (APP.activeCluster) APP.activeCluster.filter();
            }
        })
    );
    elClassesBlock.append(titleClasses,elClasses);
    elBody.append(elClassesBlock);
    
    //******************************************************************/
    //Linea divisoria --- tra blocco 1 e 2
    let separator1 = document.createElement("hr");
    separator1.className = "filter-block-separator";
    elBody.append(separator);
    
    //******************************************************************/
    //Blocco 2 - CHRONOLOGY 
    
    APP.filters["max_visible_ring"] = 6;
    
    let sliderTimeout = null;
    
    let elSliderBlock = ATON.UI.createContainer(); // <--- Inizializzazione del blocco principale del contenitore

    let titleSlider = document.createElement("h3");
    titleSlider.innerText = "Chronology";
    titleSlider.className = "filter-block-title";
    elSliderBlock.append(titleSlider);

    // Label con il valore corrente selezionato
    let labelSlider = document.createElement("div");
    labelSlider.className = "slider-custom-label";
    labelSlider.innerText = "Max Ring Visible: " + APP.filters["max_visible_ring"];
    elSliderBlock.append(labelSlider);

    // Contenitore a LARGHEZZA FISSA
    let elSliderContainer = ATON.UI.createContainer();
    let containerDom = elSliderContainer.element || elSliderContainer.dom || elSliderContainer;

    if (containerDom && containerDom.style) {
        containerDom.style.width = "100%";
        containerDom.style.maxWidth = "260px"; // Blocca la larghezza massima
        containerDom.style.margin = "0 auto";  // Centra il blocco nel pannello
        containerDom.style.position = "relative";
        containerDom.style.paddingBottom = "10px";
    }

    // Valore normalizzato per l'inizializzazione dello slider
    let initialNormalizedValue = 1.0;

    // Funzione centralizzata per aggiornare la UI e i filtri
    function updateRingFilter(rawValue) {
        let normVal = parseFloat(rawValue);
        let realRingValue = Math.round(normVal * 6);
        
        // AGGIORNAMENTO ISTANTANEO DEL TESTO
        labelSlider.innerText = "Max Ring Visible: " + realRingValue;

        if (APP.filters["max_visible_ring"] === realRingValue) return;

        APP.filters["max_visible_ring"] = realRingValue;

        // Debounce per applicare il filtro 3D senza rallentare l'interfaccia (0 e 1)
        if (sliderTimeout) clearTimeout(sliderTimeout);
        sliderTimeout = setTimeout(() => {
            if (APP.activeCluster?.filter) {
                APP.activeCluster.filter();
            }
        }, 100);
    }

    let sliderComponent = ATON.UI.createSlider({
        min: 0,
        max: 1,
        step: 0.2,
        value: initialNormalizedValue,
        onchange: (v) => {
            updateRingFilter(v);
        }
    });

    elSliderContainer.append(sliderComponent);

    //  COLLEGAMENTO EVENTO IN TEMPO REALE SUL DOM NATIVO
    setTimeout(() => {
        let sliderDom = sliderComponent.element || sliderComponent.dom || sliderComponent;
        let rangeInput = sliderDom.querySelector ? sliderDom.querySelector("input[type='range']") : null;
    
        if (rangeInput) {
            rangeInput.setAttribute("min", "0");
            rangeInput.setAttribute("max", "1");
            rangeInput.setAttribute("step", (1 / 6).toString());
        
            // Forziamo il valore dell'input nativo a 1.0 (corrisponde a posizione 6)
            rangeInput.value = "1";
        
            // Sincronizza anche eventuali metodi interni di ATON se presenti
            if (typeof sliderComponent.setValue === "function") {
                sliderComponent.setValue(1.0);
            }
            
            // Intercetta il movimento continuo del mouse/touch
            rangeInput.addEventListener("input", (e) => {
                updateRingFilter(e.target.value);
            });
        }
    }, 0);

    // Generazione Tacche e Numeri
    let ticksContainer = document.createElement("div");
    ticksContainer.style.position = "relative";
    ticksContainer.style.width = "100%";
    ticksContainer.style.height = "24px";
    ticksContainer.style.marginTop = "6px";

    for (let i = 0; i <= 6; i++) {
        let tick = document.createElement("div");
        tick.style.position = "absolute";
        let percent = (i / 6) * 100;
        
        tick.style.left = percent + "%";
        tick.style.transform = "translateX(-50%)";
        tick.style.textAlign = "center";
        tick.style.fontSize = "11px";
        tick.style.color = "#888";
        tick.style.userSelect = "none";

        tick.innerHTML = `<span style="display:block; width:1px; height:4px; background:#888; margin:0 auto 2px auto;"></span>${i}`;
        //tick.innerText = i;
        ticksContainer.appendChild(tick);
    }

    elSliderContainer.append(ticksContainer);
    elSliderBlock.append(elSliderContainer);
    elBody.append(elSliderBlock);
   
    if (typeof elBody !== "undefined" && elBody.append) {
        elBody.append(elSliderBlock);
    }
    
    //******************************************************************/ 
    //Blocco 2.2 - CENTURY
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
    // BUTTONS BLOCK (CONFIRM & RESET)
    let elResetBlock = ATON.UI.createContainer();
    elResetBlock.style.padding = "20px 0px";
    elResetBlock.style.textAlign = "center";
    
    // Confirm Button
    let btnConfirm = ATON.UI.createButton({
        label: "CLOSE",
        classes: "illuminai-confirm-btn",
        onpress: () => ATON.UI.hideSidePanel()
    });
    
    let elConfirm = btnConfirm.element || btnConfirm.dom || btnConfirm;
    if (elConfirm) {
        elConfirm.innerText = "CLOSE";
        elConfirm.style.marginBottom = "12px"; // Aggiunge margine sotto per distanziarlo da Reset
    }
    elResetBlock.append(btnConfirm);

    // Reset Button
    let btnReset = ATON.UI.createButton({
        label: "RESET FILTERS",
        classes: "illuminai-reset-btn", 
        onpress: () => {
            // RIMOZIONE / CANCELLAZIONE ETICHETTE SLICES 3D
            if (typeof APP.clearClusterLabels === "function") {
                APP.clearClusterLabels();
            }
            
            // RESET TOOLBAR 3D & PANNELLI ASSOCIATI
            if (APP._itemToolbar) {
                APP._itemToolbar.visible = false; // <--- Nasconde la toolbar 3D dalla scena ATON
            }

            //  Chiude il pannello INFO HTML se aperto
           if (typeof APP.closeInfoPanel === "function") {
                APP.closeInfoPanel();
            } else {
                let panelElem = document.getElementById("info-panel-html");
                if (panelElem) {
                    panelElem.style.display = "none";
                    panelElem._targetItemID = null;
                }
                APP._infoPanelVisible = false;
            }

            // CHIUSURA ED ELIMINAZIONE BARRA DI RICERCA FLUTTUANTE ---------
            const searchWrapper = document.querySelector('.search-floating-wrapper');
            if (searchWrapper) {
                // Ripristina l'intercettazione dell'input per i comandi 3D WASD
                if (typeof ATON !== 'undefined' && ATON.UI) {
                    ATON.UI._bInput = false;
                }
                searchWrapper.remove();
            }

            // Pulisce lo stato dei pulsanti 3D e scarica le Activation Masks degli oggetti
            if (APP.activeCluster?.items) {
                APP.activeCluster.items.forEach(item => {
                    if (item.node?.classList) {
                        item.node.classList.remove('search-highlight');
                    }
                    
                    // Disattiva e scarica eventuale maschera attiva (AMask)
                    if (item._activeAMaskIndex !== undefined) {
                        if (typeof item.unloadActivationMask === "function") {
                            item.unloadActivationMask();
                        } else {
                            item.traverse((child) => {
                                if (child.isMesh && child.material?.uniforms?.tAMask) {
                                    child.material.uniforms.tAMask.value = APP._emptyMaskTex;
                                    child.material.needsUpdate = true;
                                }
                            });
                        }
                        item._activeAMaskIndex = undefined;
                    }
                
                });
            }

            // Ripristina il colore originale dei pulsanti nella toolbar 3D a Bianco/Giallo
            if (APP.ACTMAPS) {
                const COLOR_YELLOW = new THREE.Color(0xc3ac3c);
                const COLOR_WHITE  = new THREE.Color(0xffffff);

                for (let i = 0; i < APP.ACTMAPS.length; i++) {
                    let A = APP.ACTMAPS[i];
                    let btn = ATON.getUINode("btn-" + A);
                    if (btn) {
                        let isInfo = (A.toLowerCase() === "info_annotation");
                        btn.setBaseColor(isInfo ? COLOR_YELLOW : COLOR_WHITE);
                    }
                }
            }

            if (window.ThreeMeshUI) ThreeMeshUI.update();

            // RESET FILTRI APPLICATIVI
            let keysToReset = [
                "P.01_annotation", "P.02_annotation", "A.01_annotation", "A.02_annotation", 
                "A.03_annotation", "A.04_annotation", "A.05_annotation", "A.06_annotation", 
                "A.07_annotation", "A.08_annotation", "8", "9", "10", "11", "12", "13", 
                "14", "15", "16", "17", "18", "19"
            ];
            
            if (APP.filters) {
                keysToReset.forEach(key => {
                    APP.filters[key] = false;
                });
            
                // RESET COMPLETO RICERCA TESTUALE e SLIDER
                APP.filters["search_query"] = "";
                APP.filters["text"] = "";
                APP.filters["max_visible_ring"] = 6;
            }

            // Reset visivo dell'input di ricerca fluttuante
            let searchInput = document.getElementById("search-input") || document.querySelector('.search-floating-wrapper input');
            if (searchInput) searchInput.value = "";

            // Reset visivo del pannello
            if (elBody && elBody.querySelectorAll) {
                let checkboxes = elBody.querySelectorAll("input[type='checkbox']");
                checkboxes.forEach(cb => { cb.checked = false; });

                let chips = elBody.querySelectorAll('.aton-chip, [class*="chip"]');
                chips.forEach(chip => chip.remove());
                
                // RESET VISIVO DELLO SLIDER NEL DOM
                let sliders = elBody.querySelectorAll("input[type='range']");
                sliders.forEach(sl => { 
                    sl.value = 1; // Posiziona il cursore a 0
                    sl.dispatchEvent(new Event('input', { bubbles: true })); // Notifica eventuali event listener
                });

                labelSlider.innerText = "Max Ring Visible: 6";
            }

           // AGGIORNAMENTO COMPLETO SCENA 3D / CLUSTER
            if (typeof applySearchFilterToClusterMain === "function") {
                applySearchFilterToClusterMain("");
            } else if (APP.activeCluster && typeof APP.activeCluster.filter === "function") {
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

    ATON.UI.showSidePanel({
        header: "Filters",
        body: elBody
    }); 
};

export default UI;
