/*

    IlluminAI SUI Item
 
=============================*/

class Item extends ATON.Node {

constructor(id, db){
    super(id, ATON.NTYPES.UI);

    this._id = id;

    if (!db) return;

    this.setData( APP.db[db][id] );

    this.panel = new ATON.SUI.MediaPanel("panel-"+id);
    this.panel.setTitle( id );
    //this.panel.setBackdrop(0.5);

    this.panel.attachTo(this);
    this.panel.enablePicking();

    this.enablePicking();
    this.setupEvents();

    this._bIspection = false;

    this._origLoc = new THREE.Vector3();
    
    this.cardUI = null; //add per CARD
}

setData(data){
    if (!data){
        this.data = {};
        return;
    }

    this.data = data;

    let icat = undefined;
    for (let c=0; c<APP.CATS_LIST.length; c++){
        if ( parseInt(data[ APP.CATS_LIST[c] ]) > 0 ) icat = c;
    }

    this.data.icat = icat;

    // Activation Maps
    this.data.amaps = {};
    for (let a=0; a<APP.ACTMAPS.length; a++){
        let A = APP.ACTMAPS[a];

        if (this.data[A] === "1") this.data.amaps[A] = true;
    }

    //console.log(this.data.amaps)
}

setupEvents(){
    this.panel.onHover = ()=>{
        if (this._bIspection) return;

        ///this.setBackgroundOpacity(1.0);
        this.setScale(APP.ITEM_SCALE * 1.2);
        //this.position.x *= 0.9;
        //this.position.z *= 0.9;

        //ATON.AudioHub.playOnceGlobally(ATON.PATH_RES+"audio/blop.mp3");
        console.log(this._id);
    };

    this.panel.onLeave = ()=>{
        if (this._bIspection) return;

        //this.setBackgroundOpacity(0.5);
        this.setScale(APP.ITEM_SCALE);
    };

    this.panel.onSelect = ()=>{
        if (!this._bIspection){
            this.load(APP.ITEM_RES_HIGH, true);

            this.arrangeForInspection();
        }
        else this.reset();
    };
}

// CARD INFO **************************************************
buildCardUI(){
    if (this.cardUI) return this.cardUI;

    // Creazione del Footer
    const footerDiv = document.createElement("div");
    footerDiv.innerHTML = `<button class="btn-close-card">Chiudi</button>`;

    // Creazione della Card
    this.cardUI = ATON.UI.createCard({
        size: "small",
        cover: this.data.cover || this.data.thumb || null,
        //stdcover: APP.PATH_RES + "images/default_cover.jpg",
        useblurtint: true,
        classes: "inspection-item-card",
        title: this.data.title || this._id,
        onactivate: () => {}, 
        keywords: this.data.amaps || {},
        footer: footerDiv
    });

    if (!this.cardUI) return null;

    const cardBody = this.cardUI.querySelector(".aton-card-body");
    if (cardBody) {
        const fieldsContainer = document.createElement("div");
        fieldsContainer.className = "card-custom-fields";
        
        // Campi della Card
        let htmlContent = "";
        if (this.data.author) {
            htmlContent += `<div class="field-row"><strong>Autore:</strong> <span>${this.data.author}</span></div>`;
        }
        if (this.data.century) {
            htmlContent += `<div class="field-row"><strong>Secolo:</strong> <span>${this.data.century}</span></div>`;
        }
        if (this.data.subject_1) {
            htmlContent += `<div class="field-row"><strong>Soggetto:</strong> <span>${this.data.subject_1}</span></div>`;
        }
        if (this.data.prov) {
            htmlContent += `<div class="field-row"><strong>Provenienza:</strong> <span>${this.data.prov}</span></div>`;
        }
        if (this.data.description) {
            htmlContent += `<div class="field-desc">${this.data.description}</div>`;
        }
        
        // Interpreta il codice HTML senza stampare i tag a schermo
        fieldsContainer.innerHTML = htmlContent;
        
        // Inserisce i campi subito prima del Footer
        const footerEl = cardBody.querySelector(".card-footer");
        if (footerEl) {
            cardBody.insertBefore(fieldsContainer, footerEl);
        } else {
            cardBody.appendChild(fieldsContainer);
        }
    }

    // Gestione chiusura ed eventi
    const closeBtn = this.cardUI.querySelector(".btn-close-card");
    if (closeBtn) {
        closeBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleCard(false);
        };
    }

    this.cardUI.addEventListener("pointerdown", (e) => e.stopPropagation());
    this.cardUI.addEventListener("mousedown", (e) => e.stopPropagation());
    this.cardUI.addEventListener("click", (e) => e.stopPropagation());

    document.body.appendChild(this.cardUI);
    return this.cardUI;
}

toggleCard(show){
    if (!this.cardUI) {
        this.buildCardUI();
    }

    if (!this.cardUI) return;

    const isHidden = (this.cardUI.style.display === "none" || this.cardUI.style.display === "");
    const shouldShow = (show === undefined) ? isHidden : show;

    if (shouldShow) {
        this.cardUI.style.display = "block";
        
        // Avvia il ciclo di posizionamento dinamico in tempo reale
        //this.updateCardPosition();
    } else {
        this.cardUI.style.display = "none";
    }
}
//updateCardPosition(){}
    
// Reset item to its original location in the cluster
reset(){
    if (this._origLoc) this.position.copy(this._origLoc);

    this.orientToLocation(
        0, 
        this._origLoc.y + APP.activeCluster.position.y, 
        0
    );

    this.load(APP.ITEM_RES_BASE);

    this._bIspection = false;

    APP._itemToolbar.hide();
    
/*
    // Reset della toolbar *****************************
    //let triggerBtn = document.getElementById("inspection-trigger-btn");
    //if (triggerBtn) triggerBtn.remove();
    
    //let toolbar = document.getElementById("inspection-tools-bar");
    //if (toolbar) toolbar.remove();
    
    //Evita sovrapposizione delle toolbar
    if (APP.currentInspectedItem === this) {
        APP.currentInspectedItem = null;
    }

    let uiContainer = document.getElementById("global-inspection-container");
    if (uiContainer) uiContainer.remove();
*/
}

arrangeForInspection(){
    let eye = ATON.Nav.getCurrentEyeLocation();
    let dir = ATON.Nav.getCurrentDirection();
    
    this.position.x = eye.x + (dir.x * APP.ITEM_INSPECT_RAD);
    this.position.y = eye.y + (dir.y * APP.ITEM_INSPECT_RAD);
    this.position.z = eye.z + (dir.z * APP.ITEM_INSPECT_RAD);

    this.position.y -= APP.activeCluster.position.y;
    
    this.orientToCamera();
    
    this.setScale(APP.ITEM_SCALE * 2.0);

    this._bIspection = true;

    // ADD CARD
    this.buildCardUI();
    // ADD CARD

    // 3D Toolbar
    APP.setupToolbarForItem(this);
    APP._itemToolbar.show();

    /*
    // INSPECTION TOOLBAR ********************************************
    //Evita che più toolbar siano aperte contemporaneamente <-----inizio
    let activeGlobalContainer = document.getElementById("global-inspection-container");
    if (activeGlobalContainer) {
        
        // Removibile! Cerca se istanza di ualtro oggetto registrata e resetta lo stato 3D
        if (APP.currentInspectedItem && APP.currentInspectedItem !== this) {
            APP.currentInspectedItem._bIspection = false;
            if (typeof APP.currentInspectedItem.reset === 'function') {
                APP.currentInspectedItem.reset(); // Fa tornare il vecchio oggetto al suo posto
            }
        }
        // Rimuove fisicamente l'elemento HTML dello schermo per non avere duplicati di ID nel DOM
        activeGlobalContainer.remove();
    }
    // Registriamo questo specifico oggetto come "l'oggetto attualmente ispezionato" a livello globale
    APP.currentInspectedItem = this;
    //Evita che più toolbar siano aperte contemporaneamente <------finisce

    // Crea il contenitore principale - fisso
    let uiContainer = document.createElement("div");
    uiContainer.id = "global-inspection-container";
    uiContainer.className = "global-inspection-ui";
    uiContainer.innerHTML = `
        <div id="inspection-tools-bar" class="inspection-toolbar-vertical">
            <button class="tool-btn" data-action="rotate" data-label="Action1">
                <img src="${APP.pathResIcons}tools.png" alt="Tool1" class="btn-icon">
            </button>
            <button class="tool-btn" data-action="zoomin" data-label="Action2">
                <img src="${APP.pathResIcons}tools.png" alt="Tool2" class="btn-icon">
            </button>
            <button class="tool-btn" data-action="zoomout" data-label="Action3">
                <img src="${APP.pathResIcons}tools.png" alt="Tool3" class="btn-icon">
            </button>
            <button class="tool-btn" data-action="info" data-label="Action4">
                <img src="${APP.pathResIcons}tools.png" alt="Tool4" class="btn-icon">
            </button>
            <button class="tool-btn" data-action="zoomout" data-label="Action5">
                <img src="${APP.pathResIcons}tools.png" alt="Tool5" class="btn-icon">
            </button>
            <button class="tool-btn" data-action="info" data-label="Action6">
                <img src="${APP.pathResIcons}tools.png" alt="Tool6" class="btn-icon">
            </button>
        </div>
        
        <button id="inspection-trigger-btn" class="inspection-trigger-btn" data-label="Open Tools">
            <img src="${APP.pathResIcons}tools.png" alt="Tool0" class="btn-icon-trigger">
        </button>
    `;

    document.body.appendChild(uiContainer);

    // Elementi del DOM per la gestione degli eventi
    const triggerBtn = uiContainer.querySelector("#inspection-trigger-btn");
    const toolbar = uiContainer.querySelector("#inspection-tools-bar");

    // Click sul tasto "Tools"
    triggerBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Blocca la propagazione ad ATON
        toolbar.classList.toggle("is-active");
        triggerBtn.classList.toggle("btn-active");
    });

    // Clic sui bottoni della toolbar
    uiContainer.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Protegge l'ispezione 3D
            const action = btn.getAttribute("data-action");
            console.log("Strumento cliccato:", action);
            
            // Logica di esempio (es. Rotazione oggetto ATON)
            if (action === "rotate") {
                if (this.panel && this.panel.object3D) {
                    this.panel.object3D.rotation.y += Math.PI / 4;
                }
            }
        });
    });
    //aggiunta di prova a qui ********************************************
*/
}

load(res, bIspection){
    if (!res) res = APP.ITEM_RES_HIGH;

    if (!bIspection){
        this.panel.load( APP.getImageURL(this.data.path, res) );
    }
    else {
        if (!this.panel._mediamesh.material) return;

        this.panel._mediamesh.material = APP.matBaseItem.clone();

        ATON.Utils.loadTexture( APP.getImageURL(this.data.path, res), tex => {
            this.panel._mediamesh.material.uniforms.tBase.value = tex;
        });

    }

    this.enablePicking();
}

loadActivationMask = (m)=>{
    if (!this.panel._mediamesh) return;
    if (!this.panel._mediamesh.material) return;

    // Clean
    let fpath = this.data.path.replace(".jpeg","");
    fpath = fpath.replace(".jpg","");

    let ext = APP.ACTMAPS_EXT[m];

    ATON.Utils.loadTexture( APP.getImageURL(fpath + ext, 128), tex => {
        this.panel._mediamesh.material.uniforms.tAMask.value = tex;
        console.log("Loaded AM: "+fpath+ext);
    });
};

setOriginalLocation(p){
    this._origLoc.copy(p);
};

setClusterOrigin(p){
    this._origin = p;
}

}

export default Item;
