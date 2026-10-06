/*

    IlluminAI SUI Item
 
=============================*/

class Item extends ATON.Node {

    constructor(id, db){
        super(id, ATON.NTYPES.UI);

        this._id = id;

        // Inizializzazione sicura
        this._bInspection = false;
        this._origLoc = new THREE.Vector3();
        this._origin = null;
        this._activeAMaskIndex = undefined;

        if (!db || !APP.db || !APP.db[db]) return;

        this.setData( APP.db[db][id] );

        this.panel = new ATON.SUI.MediaPanel("panel-"+id);
        this.panel.setTitle( id );

        this.panel.attachTo(this);
        this.panel.enablePicking();

        this.enablePicking();
        this.setupEvents();
    }
    
    setData(data){
        if (!data){
            //this.data = {};
            this.data = { path: "", amaps: {} };
            return;
        }

        this.data = data;

        let icat = undefined;
        if (Array.isArray(APP.CATS_LIST)) {
            for (let c = 0; c < APP.CATS_LIST.length; c++){
                if ( parseInt(data[ APP.CATS_LIST[c]]) > 0 ) icat = c;
            }
        }

        this.data.icat = icat;

        // Activation Maps
        this.data.amaps = {};
        if (Array.isArray(APP.ACTMAPS)) {
            for (let a = 0; a < APP.ACTMAPS.length; a++){
                let A = APP.ACTMAPS[a];
                if (this.data[A] === "1" || this.data[A] === 1 || this.data[A] === true) {
                    this.data.amaps[A] = true;
                }
            }
        }
    }

    setupEvents(){
        if (!this.panel) return;
        
        this.panel.onHover = () => {
            if (this._bInspection) return;
            this.setScale(APP.ITEM_SCALE * 1.2);
            
            //ATON.AudioHub.playOnceGlobally(ATON.PATH_RES+"audio/blop.mp3"); <--- da sostituire
            console.log(this._id);
        };

        this.panel.onLeave = () => {
            if (this._bInspection) return;
            this.setScale(APP.ITEM_SCALE);
        };

        this.panel.onSelect = () => {
            if (!this._bInspection){
                this.load(APP.ITEM_RES_HIGH, true);
                this.arrangeForInspection();
            } else {
                this.reset();
            }
        };
    }

    // Utility interna per mostrare/nascondere i nodi UI in sicurezza
    _setNodeVisible(node, visible) {
        if (!node) return;
        
        node.visible = visible;

        // Propaga la visibilità su tutti i figli Three.js / ThreeMeshUI
        if (typeof node.traverse === "function") {
            node.traverse((child) => {
                child.visible = visible;
            });
        }
    }

    reset() {
        // Rimuove l'oggetto dal tracciamento dell'ispezione
        if (APP.inspectedItems) {
            let idx = APP.inspectedItems.indexOf(this);
            if (idx !== -1) {
                APP.inspectedItems.splice(idx, 1);
            }
        }

        this.position.copy(this._origLoc);

        let clusterY = APP.activeCluster ? APP.activeCluster.position.y : 0;
        let targetLook = new THREE.Vector3(0, this._origLoc.y + clusterY, 0);
    
        if (typeof this.orientToLocation === "function") {
            this.orientToLocation(0, targetLook.y, 0);
        } else if (typeof this.lookAt === "function") {
            this.lookAt(targetLook);
        }
    
        this.unloadActivationMask();
        this._activeAMaskIndex = undefined;

        this.load(APP.ITEM_RES_BASE, false);
        this._bInspection = false;
    
        if (typeof ATON.Nav.setFirstPersonControl === "function") {
            ATON.Nav.setFirstPersonControl();
        }

        if (APP._itemToolbar)   this._setNodeVisible(APP._itemToolbar, false);
        if (APP._itemInfoPanel) this._setNodeVisible(APP._itemInfoPanel, false);
    }

    arrangeForInspection() {
        let eye = ATON.Nav.getCurrentEyeLocation();
        let dir = ATON.Nav.getCurrentDirection();
    
        // Registra l'oggetto tra quelli in ispezione
        if (!APP.inspectedItems) APP.inspectedItems = [];
        let index = APP.inspectedItems.indexOf(this);
        if (index === -1) {
            APP.inspectedItems.push(this);
            index = APP.inspectedItems.length - 1;
        }

        if (eye && dir) {
            // Parametri per il posizionamento a grappolo
            const depthOffset = index * 0.03;  // Avanza verso l'osservatore
            const sideOffset  = index * 0.05;  // Spostamento laterale sull'asse X local/view
            const heightOffset = index * 0.02; // Minima elevazione verso l'alto
            
            // Raggio base modulato dalla profondità
            const currentRad = APP.ITEM_INSPECT_RAD - depthOffset;

            // Calcolo vettori di vista per lo scostamento laterale (Right Vector)
            let up = new THREE.Vector3(0, 1, 0);
            let right = new THREE.Vector3().crossVectors(dir, up).normalize();

            // Calcolo posizione base lungo la direzione di vista
            this.position.x = eye.x + (dir.x * currentRad) + (right.x * sideOffset);
            this.position.y = eye.y + (dir.y * currentRad) + heightOffset;
            this.position.z = eye.z + (dir.z * currentRad) + (right.z * sideOffset);
        }
    
        if (APP.activeCluster) {
            this.position.y -= APP.activeCluster.position.y;
        }

        if (typeof this.orientToCamera === "function") {
            this.orientToCamera();
        } else if (eye) {
            this.lookAt(new THREE.Vector3(eye.x, eye.y, eye.z));
        }

        this.setScale(APP.ITEM_SCALE * 2.0);
        this._bInspection = true;

        // Configurazione controlli e toolbar
        if (typeof APP.setAllLabelsVisible === "function") APP.setAllLabelsVisible(false);
        if (typeof ATON.Nav.setOrbitControl === "function") ATON.Nav.setOrbitControl();
        if (typeof ATON.Nav.setPivot === "function") ATON.Nav.setPivot(this.position);
        if (typeof ATON.Nav.enableZoom === "function") ATON.Nav.enableZoom(true);
    
        APP.setupToolbarForItem(this);
        if (APP._itemToolbar) this._setNodeVisible(APP._itemToolbar, true);
        APP.setupInfoPanelForItem(this);
        if (APP._itemInfoPanel) this._setNodeVisible(APP._itemInfoPanel, false);
    }

    load(res, bInspection){
        if (!res) res = APP.ITEM_RES_HIGH;
        if (!this.data || !this.data.path) return;

        if (!bInspection){
            if (this.panel && typeof this.panel.load === "function") {
                this.panel.load( APP.getImageURL(this.data.path, res) );
            }
        }
        else {
            if (!this.panel || !this.panel._mediamesh) return;

            const mesh = this.panel._mediamesh;

            // Clona il materiale solo se non è già stato sostituito con quello base personalizzato
            if (!mesh.material || !mesh.material.uniforms || !mesh.material.uniforms.tAMask) {
                if (mesh.material && typeof mesh.material.dispose === "function") {
                    mesh.material.dispose();
                }
                mesh.material = APP.matBaseItem.clone();
            }

            ATON.Utils.loadTexture( APP.getImageURL(this.data.path, res), tex => {
                if (this._bInspection && mesh.material && mesh.material.uniforms) {
                    // Dispose della vecchia texture per prevenire memory leak
                    if (mesh.material.uniforms.tBase.value) {
                        mesh.material.uniforms.tBase.value.dispose();
                    }
                    mesh.material.uniforms.tBase.value = tex;
                    mesh.material.needsUpdate = true;
                } else {
                    // Se lo stato è cambiato durante il download, svuota la Risorsa
                    tex.dispose();
                }
            });
        }
        
        this.enablePicking();
    }
    
    loadActivationMask(m){
        if (!this.panel._mediamesh || !this.panel._mediamesh.material || !this.panel._mediamesh.material.uniforms) return;
        if (!this.data || !this.data.path) return; //Controllo di sicurezza percorso dati

        let fpath = this.data.path.replace(/\.(jpeg|jpg)$/i, "");
        let ext = APP.ACTMAPS_EXT ? APP.ACTMAPS_EXT[m] : undefined;

        if (!ext) return;

        ATON.Utils.loadTexture( APP.getImageURL(fpath + ext, 128), tex => {
            const uniforms = this.panel._mediamesh.material.uniforms;
            if (this._bInspection && uniforms && uniforms.tAMask) {
                let currentTex = uniforms.tAMask.value;
                if (currentTex && currentTex !== APP._emptyMaskTex) {
                    currentTex.dispose();
                }
                uniforms.tAMask.value = tex;
                this.panel._mediamesh.material.needsUpdate = true;
            } else {
                tex.dispose();
            }
        });
    }

    unloadActivationMask(){
        if (this.panel && this.panel._mediamesh && this.panel._mediamesh.material && this.panel._mediamesh.material.uniforms && this.panel._mediamesh.material.uniforms.tAMask) {
            let currentTex = this.panel._mediamesh.material.uniforms.tAMask.value;
            if (currentTex && currentTex !== APP._emptyMaskTex) {
                currentTex.dispose();
            }
            this.panel._mediamesh.material.uniforms.tAMask.value = APP._emptyMaskTex;
            this.panel._mediamesh.material.needsUpdate = true;
        }
    }

    setOriginalLocation(p){
        this._origLoc.copy(p);
    }

    setClusterOrigin(p){
        this._origin = p;
    }
}

export default Item;
