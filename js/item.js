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

    // 3D Toolbar
    APP.setupToolbarForItem(this);
    APP._itemToolbar.show();

    // INSPECTION TOOLBAR ********************************************
    //OLD part --------
    //let oldTools = document.getElementById("global-inspection-container");
    //if (oldTools) oldTools.remove();
    //OLD part --------
    //Evita che più toolbar siano aperte contemporaneamente <-----inizio
    let activeGlobalContainer = document.getElementById("global-inspection-container");
    if (activeGlobalContainer) {
        console.log("[Toolbar Guard] Trovata un'altra toolbar attiva. Rimozione in corso...");
        
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

setOriginalLocation(p){
    this._origLoc.copy(p);
};

setClusterOrigin(p){
    this._origin = p;
}

}

export default Item;
