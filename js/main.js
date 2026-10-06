/*
    IlluminAI app

==========================================*/

import Item from "./item.js";
import Cluster from "./cluster.js";
import UI from "./ui.js";

let APP = ATON.App.realize();
//APP.requireFlares(["myFlare"]);
window.APP = APP;

APP.Item = Item;
APP.Cluster = Cluster;
APP.UI   = UI;

APP.bgColor = new THREE.Color(0.1,0.1,0.1);

APP.pathConfig       = APP.basePath + "config/";
APP.pathDB           = APP.pathConfig + "db/";
APP.pathConfigFile   = APP.pathConfig + "config.json";
APP.pathResAssets    = APP.basePath + "assets/";
APP.pathResIcons     = APP.pathResAssets + "icons/";

APP.ITEM_SCALE = 0.1;
APP.ITEM_INSPECT_RAD = 0.5;

APP.ITEM_RES_BASE = 128;
APP.ITEM_RES_HIGH = 4096;

APP.CAT_HEIGHT = 2.0;

// *****************************************************************
// VARIABILI E GESTIONE SCORRIMENTO FLUIDO (LERP)
// *****************************************************************
APP._targetClusterY = 0;
APP._isScrolling = false;

APP.updateClusterScroll = () => {
    if (!APP.activeCluster) return;

    const diff = APP._targetClusterY - APP.activeCluster.position.y;
    
    if (Math.abs(diff) > 0.001) {
        const lerpFactor = 0.1; // 0.1 = fluido/morbido, 0.2 = reattivo
        const deltaY = diff * lerpFactor;

        APP.activeCluster.position.y += deltaY;

        // Shift sincronizzato delle etichette Categorie
        if (Array.isArray(APP.catLabelNodes)) {
            APP.catLabelNodes.forEach(node => { 
                node.position.y += deltaY; 
            });
        }

        if (window.ThreeMeshUI) ThreeMeshUI.update();
        requestAnimationFrame(APP.updateClusterScroll);
    } else {
        // Allineamento finale al target
        const finalDelta = APP._targetClusterY - APP.activeCluster.position.y;
        APP.activeCluster.position.y = APP._targetClusterY;

        if (Array.isArray(APP.catLabelNodes)) {
            APP.catLabelNodes.forEach(node => { 
                node.position.y += finalDelta; 
            });
        }

        APP._isScrolling = false;
        if (window.ThreeMeshUI) ThreeMeshUI.update();
    }
};
// *****************************************************************

APP.CATS_LIST = [
    "P.01", "P.02", "A.01", "A.02", "A.03", 
    "A.04", "A.05", "A.06", "A.07", "A.08"
];

APP.CENTS_LIST = [
    "8", "9", "10", "11", "12", "13", 
    "14", "15", "16", "17", "18", "19"
];

APP.ACTMAPS = [
	"info_annotation",
    "Text_annotation",
    "Fig_annotation",
    "Deco_annotation",
    "Mus_annotation",
    "Let_annotation"
];

APP.ACTMAPS_EXT = [
    "-AM-Text.jpg",
    "-AM-Fig.jpg",
    "-AM-Deco.jpg",
    "-AM-Mus.jpg",
    "-AM-Let.jpg"
];

APP.ACTMAPS_EXT_MAP = {
    "Text_annotation": "-AM-Text.jpg",
    "Fig_annotation":  "-AM-Fig.jpg",
    "Deco_annotation": "-AM-Deco.jpg",
    "Mus_annotation":  "-AM-Mus.jpg",
    "Let_annotation":  "-AM-Let.jpg"
};

APP.CLUSTER_NUM_SLICES = 6;

APP.confdata  = undefined;
APP.cloudbase = undefined;
APP.db        = {};

APP.activeClusterID = undefined;
APP.activeCluster   = undefined;

APP.clusterLabelNodes = APP.clusterLabelNodes || []; // Inizializzazione nodi per etichette spicchi
APP.catLabelNodes = APP.catLabelNodes || []; // Registro nodi etichetta dei livelli categorie
APP.scrollButtonNodes = APP.scrollButtonNodes || [];

// Fallback texture vuota pre-allocata per il reset delle maschere
const emptyData = new Uint8Array([0, 0, 0, 0]);
APP._emptyMaskTex = new THREE.DataTexture(emptyData, 1, 1, THREE.RGBAFormat);
APP._emptyMaskTex.needsUpdate = true;
APP._infoPanelVisible = false;

APP.filters = {
    "max_visible_ring": 6,
    "P.01_annotation": true,
    "P.02_annotation": false,
    "A.01_annotation": false,
    "A.02_annotation": false,
    "A.03_annotation": false,
    "A.04_annotation": false,
    "A.05_annotation": false,
    "A.06_annotation": false,
    "A.07_annotation": false,
    "A.08_annotation": false,
    "8": false, "9": false, "10": false, "11": false, "12": false, "13": false,
    "14": true, "15": false, "16": false, "17": false, "18": false, "19": false
};

// *****************************************************************
// HELPER PER LA GESTIONE RISORSE GPU (DISPOSE)
// *****************************************************************
APP.disposeNodeResources = (node) => {
    if (!node) return;
    if (node.geometry) node.geometry.dispose();
    if (node.material) {
        if (node.material.map) node.material.map.dispose();
        node.material.dispose();
    }
    if (node.children && Array.isArray(node.children)) {
        node.children.forEach(child => APP.disposeNodeResources(child));
    }
};

//***************************************************************************
// CARICAMENTO ED INIZIALIZZAZIONE
//***************************************************************************
APP.loadConfig = ()=>{
    return $.getJSON( APP.pathConfigFile, ( data )=>{
        console.log("Loaded config");

        APP.confdata = data;
        APP.cloudbase = data.ncdata;

        if (data.db){
            let keys = Object.keys(data.db);
            let numCSVs = keys.length;
            let dbloaded = 0;

			// Gestisce il caso limite di database senza chiavi
            if (numCSVs === 0) {
                ATON.fire("APP_DB_READY");
            }
			
			keys.forEach((e) => {
                const E = data.db[e];
                let csv = E.file;
                let pi  = E.primary;

                if (!APP.db[e]) APP.db[e] = {};

                ATON.ASCII.loadCSV(APP.pathDB + csv, pi, (d) => {
                    APP.db[e] = d;
                    dbloaded++;
                    if (dbloaded >= numCSVs) ATON.fire("APP_DB_READY");
                });
            });
        }
        ATON.fire("APP_ConfigLoaded");
    });
};

APP.setup = ()=>{
    ATON.realize();
    ATON.UI.addBasicEvents();

    ATON.Nav.setFirstPersonControl();

    ATON.Nav.setAndRequestHomePOV(
        new ATON.POV().setPosition(0, 1.0, 0).setTarget(2, 1.0, 0).setFOV(70.0)
    );

    APP.setupScene();
    APP.loadConfig();
    APP.setupEvents();

     APP.matCatsCluster = new THREE.MeshBasicMaterial({
        color: ATON.MatHub.colors.white,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        opacity: 0.3
    });

    if (ATON.SUI && typeof ATON.SUI.showSelector === "function") {
        ATON.SUI.showSelector(false); 
    }
};

APP.realizeBaseCluster = (size)=>{
    let g = new THREE.PlaneGeometry( size, size );
    g.rotateX(-Math.PI*0.5); // 1.0472

    APP.matBaseCluster = new THREE.MeshBasicMaterial({
        color: ATON.MatHub.colors.white,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide
    });

    ATON.Utils.loadTexture(APP.pathResAssets+ "base-cluster.png", (tex)=>{
        APP.matBaseCluster.map = tex;
        APP.matBaseCluster.needsUpdate = true;
    });

    APP.baseCluster = ATON.createSceneNode("basecluster")
        .rotateY(Math.PI / APP.CLUSTER_NUM_SLICES)
        .attachToRoot();
    APP.baseCluster.add(new THREE.Mesh(g, APP.matBaseCluster));
    APP.baseCluster.enablePicking();
};

APP.setupScene = ()=>{
    ATON.setBackgroundColor(APP.bgColor);
    ATON.setMainPanorama(APP.pathResAssets + "4k.jpeg");

    ATON._bqScene = true;
    APP.realizeBaseCluster(4.0); // diameter in meters
};

APP.setupEvents = ()=>{
    ATON.on("APP_DB_READY", () => {
        if (typeof APP.onReadyDB === "function") {
            APP.onReadyDB();
        }
    });

    ATON.on("APP_ConfigLoaded", () => {
        APP.UI.setup();
        APP.UI.modalWelcome();
        APP.setupCategoryScrollUI();
    });

    ATON.on("KeyPress", k => {
        if (k==='ArrowUp')   APP.shiftActiveCluster(0.05);
        if (k==='ArrowDown') APP.shiftActiveCluster(-0.05);
    });
	/*
    ATON.on("Tap", ()=>{
        //
    });
	*/
};

//***************************************************************************
// SPATIAL UI CON PASSO ADATTATO PER SCORRIMENTO FLUIDO
//***************************************************************************
APP.setupCategoryScrollUI = () => {
    // Se esiste già una UI precedente, la stacca prima di ricrearla o riposizionarla
    if (APP._catScrollUI) {
        if (typeof APP._catScrollUI.detachFromParent === "function") {
            APP._catScrollUI.detachFromParent();
        } else if (APP._catScrollUI.parent) {
            APP._catScrollUI.parent.remove(APP._catScrollUI);
        }
    }

    // Creazione del nodo UI
    APP._catScrollUI = typeof ATON.createUINode === "function" 
        ? ATON.createUINode("cat-scroll-ui-root") 
        : ATON.createSceneNode("cat-scroll-ui-root");
    
    APP._catScrollUI.attachToRoot(); // <- IMP! ANCORATO ALLA RADICE
    
    // *****************************************************************
    // LOGICA DI POSIZIONAMENTO DERIVATA DA realize()
    const r = 2.4; // Posiziona UI esterna per evitare sovrapposizioni
    
    const angleOffset = -Math.PI / 6; // Sposta l'interfaccia verso destra
    const sliceIndex = 0; // Posiziona la UI su spicchio/angolo specifico
    const a = ((sliceIndex / APP.CLUSTER_NUM_SLICES) * Math.PI * 2.0) + angleOffset;

    // Posizione Scroll calcolata stessa trigonometria di arrange()
    const x = r * Math.cos(a);
    const z = r * Math.sin(a);
    const y = APP.CAT_HEIGHT * 0.5; // UI all'altezza della prima categoria

    // Impostazione posizione e orientamento
    APP._catScrollUI.setPosition(x, y, z);
    
    if (typeof APP._catScrollUI.orientToLocation === "function") {
        APP._catScrollUI.orientToLocation(0, y, 0); // Orientato verso l'asse central Y
    }

    // Scale e step di scorrimento
    const btnScale = APP.ITEM_SCALE * 9.5; 
    const stepY = APP.CAT_HEIGHT; // Usa il passo esatto dell'altezza categoria per lo scorrimento

    // *****************************************************************
    // PULSANTI DELLO SCROLL
    
    // Pulsante Scroll SU
    let btnUp = new ATON.SUI.Button("btn-scroll-cat-up");
    if (typeof btnUp.setIcon === "function") {
        btnUp.setIcon(APP.pathResIcons + "scroll-up.png");
    }
    btnUp.setScale(btnScale);
    btnUp.position.set(0, 0.28, 0);
    btnUp.setBaseColor(new THREE.Color(0x3388ff));

    btnUp.onHover = () => btnUp.setScale(btnScale * 1.15);
    btnUp.onLeave = () => btnUp.setScale(btnScale);
    btnUp.onSelect = () => {
        APP.shiftActiveCluster(-stepY);
    };
    btnUp.attachTo(APP._catScrollUI);

    // Pulsante Scroll RESET
    let btnReset1 = new ATON.SUI.Button("btn-scroll-cat-reset");
    btnReset1.setScale(btnScale * 0.85);
    btnReset1.position.set(0, 0.0, 0);
    if (typeof btnReset1.setIcon === "function") {
        btnReset1.setIcon(APP.pathResIcons + "home.png");
    }
    btnReset1.setBaseColor(new THREE.Color(0xC0C0C0)); //0xffffff

    btnReset1.onHover = () => btnReset1.setScale(btnScale * 1.0);
    btnReset1.onLeave = () => btnReset1.setScale(btnScale * 0.85);
    btnReset1.onSelect = () => {
        APP.shiftActiveCluster(); // Reset Y a 0
    };
    btnReset1.attachTo(APP._catScrollUI);

    // Pulsante Scroll GIÙ
    let btnDown = new ATON.SUI.Button("btn-scroll-cat-down");
    if (typeof btnDown.setIcon === "function") {
        btnDown.setIcon(APP.pathResIcons + "scroll-down.png");
    }
    btnDown.setScale(btnScale);
    btnDown.position.set(0, -0.28, 0);
    btnDown.setBaseColor(new THREE.Color(0x3388ff));

    btnDown.onHover = () => btnDown.setScale(btnScale * 1.15);
    btnDown.onLeave = () => btnDown.setScale(btnScale);
    btnDown.onSelect = () => {
        APP.shiftActiveCluster(stepY);
    };
    btnDown.attachTo(APP._catScrollUI);
};

//***************************************************************************
// CREAZIONE E GESTIONE LABEL SLICES
//***************************************************************************
// Mesh 3D orientabile
APP.createTextMesh = (text) => {
    let canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    let ctx = canvas.getContext('2d');

    // Sfondo etichetta
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.roundRect(8, 8, 496, 112, 12);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    // Testo
    ctx.fillStyle = "#ffffff";
    ctx.font = "Bold 32px Sans-Serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 256, 64);

    let texture = new THREE.CanvasTexture(canvas);
    let mat = new THREE.MeshBasicMaterial({ 
        map: texture, 
        transparent: true,
        depthTest: true,
        depthWrite: false,
        side: THREE.DoubleSide
    });

    let geom = new THREE.PlaneGeometry(0.75, 0.1875);
    return new THREE.Mesh(geom, mat);
};

// Funzione di pulizia con gestione smaltimento risorse WebGL
APP.clearClusterLabels = () => {
    APP.clusterLabelNodes.forEach(node => {
        APP.disposeNodeResources(node);
        if (typeof node.detachFromRoot === 'function') {
            node.detachFromRoot();
        } else if (node.parent) {
            node.parent.remove(node);
        }
    });
    APP.clusterLabelNodes = [];
};

// Posizionamento vicino al bordo del baseCluster
APP.updateClusterLabels = (clusterId) => {
    APP.clearClusterLabels(); // Rimuove e smaltisce le label precedenti

    const clusterData = (APP.confdata && APP.confdata.clusters && APP.confdata.clusters[clusterId]) 
        ? APP.confdata.clusters[clusterId] 
        : null;

    const labels = (clusterData && Array.isArray(clusterData.slice)) 
        ? clusterData.slice 
        : ["Spicchio 1", "Spicchio 2", "Spicchio 3", "Spicchio 4", "Spicchio 5", "Spicchio 6"];

    const NUM_SLICES = APP.CLUSTER_NUM_SLICES || 6;
    const radius = 2; // Pone etichetta su bordo
    const y = 0.15; 

    labels.forEach((labelText, sliceIndex) => {
        let a = (sliceIndex / NUM_SLICES) * Math.PI * 2.0;
        let x = radius * Math.cos(a);
        let z = radius * Math.sin(a);

        let labelMesh = APP.createTextMesh(labelText);
        let labelNode = ATON.createSceneNode(`cluster_label_${clusterId}_${sliceIndex}`)
            .attachToRoot();

        labelNode.add(labelMesh);
        labelNode.setPosition(x, y, z).orientToLocation(0, y, 0);

        APP.clusterLabelNodes.push(labelNode);
    });
};

// *****************************************************************
// CREAZIONE E GESTIONE LABEL LIVELLI CATEGORIES
// Pulizia e smaltimento risorse GPU per le etichette dei livelli
APP.clearCategoryLabels = () => {
    APP.catLabelNodes.forEach(node => {
        APP.disposeNodeResources(node);

        if (typeof node.detachFromRoot === 'function') {
            node.detachFromRoot();
        } else if (node.parent) {
            node.parent.remove(node);
        }
    });
    APP.catLabelNodes = [];
};

// Genera le 10 etichette corrispondenti ai livelli verticali
APP.updateCategoryLabels = () => {
    APP.clearCategoryLabels();

    if (!APP.CATS_LIST || APP.CATS_LIST.length === 0) return;

    // Posizionamento etichetta
    const radius = 2.1; 
    const angle = 0; 
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const currentY = APP.activeCluster ? APP.activeCluster.position.y : 0;
    const topOffset = APP.CAT_HEIGHT - 0.2; // Posiziona la label nella parte alta

    APP.CATS_LIST.forEach((catName, c) => {
        // Quota Y: base del livello + offset di sommità + offset del cluster
        let y = (c * APP.CAT_HEIGHT) + topOffset + currentY;
        let labelMesh = APP.createTextMesh(catName);

        let labelNode = ATON.createSceneNode(`cat_label_${c}`)
            .attachToRoot();

        labelNode.add(labelMesh);
        labelNode.setPosition(x, y, z).orientToLocation(0, y, 0);

        APP.catLabelNodes.push(labelNode);
    });
};

//***************************************************************************
// FUNZIONE CAMBIO CLUSTER 
//***************************************************************************
APP.changeCluster = (clusterId) => {
    const id = parseInt(clusterId);
	if (isNaN(id)) return;

	// Nasconde ed azzera i pannelli UI fluttuanti 3D per evitare residui
    if (APP._itemInfoPanel) {
        APP._itemInfoPanel.visible = false;
        APP._itemInfoPanel._targetItemID = null;
    }
    if (APP._itemToolbar) {
        APP._itemToolbar.visible = false;
    }
    
    // Rimuove vecchio cluster
    if (APP.activeCluster) {
        // Se il cluster o i suoi oggetti dispongono di un metodo di pulizia/dispose risorse
        if (typeof APP.activeCluster.dispose === 'function') {
            APP.activeCluster.dispose();
        } else if (typeof APP.disposeNodeResources === 'function') {
            APP.disposeNodeResources(APP.activeCluster);
        }
        // Distacco del nodo dal grafico di scena ATON / Three.js
        if (typeof APP.activeCluster.detachFromRoot === 'function') {
            APP.activeCluster.detachFromRoot();
        } else if (APP.activeCluster.parent) {
            APP.activeCluster.parent.remove(APP.activeCluster);
        }
        APP.activeCluster = undefined;
    }

	// Ripulisce ed aggiorna le etichette dei 6 spicchi
    APP.updateClusterLabels(id);
    APP.updateCategoryLabels();

    // Istanza nuovo cluster
    let C = new APP.Cluster(id);
    C.attachToRoot();

    C.realize(); // Carica i dati e dispone gli oggetti
    C.setActive(); // Imposta APP.activeCluster e lancia internamente C.filter()

	APP.setupCategoryScrollUI();

	// Reset quota target e azzeramento posizione
    APP._targetClusterY = 0;
    APP.shiftActiveCluster(); // Chiamata senza argomenti per forzare il reset a Y=0

    // Aggiorna parametro URL
    if (APP.params && typeof APP.params.set === 'function') {
        APP.params.set("c", id);
    }
};

APP.shiftActiveCluster = (h)=>{
    if (!APP.activeCluster) return;

	const numCats = APP.CATS_LIST ? APP.CATS_LIST.length : 1;
    
    const minY = -((numCats - 1) * APP.CAT_HEIGHT);
    const maxY = 2.0;

    // Reset alla quota originaria (Y = 0)
    if (h === undefined || h === null) {
        APP._targetClusterY = 0;

        if (Array.isArray(APP.clusterLabelNodes)) {
            APP.clusterLabelNodes.forEach(node => {
                node.setPosition(node.position.x, 0.15, node.position.z);
            });
        }
    } else { // Incremento target con limite
        let newTargetY = APP._targetClusterY + h;

        if (newTargetY < minY) newTargetY = minY;
        if (newTargetY > maxY) newTargetY = maxY;

        APP._targetClusterY = newTargetY;
    }

    // Avvia il loop di lerp se non è attivo
    if (!APP._isScrolling) {
        APP._isScrolling = true;
        requestAnimationFrame(APP.updateClusterScroll);
    }
};

//***************************************************************************
APP.getImageURL = (path, res)=>{
    if (!APP.cloudbase) return undefined;

    //if (!res) res = APP.ITEM_RES_HIGH;

    let url = APP.cloudbase+"?";
    url += "a=true&file=/"+path;

    if (res) url += "&x="+res+"&y="+res;

    return url;
    //return APP.cloudbase+"?x="+res+"&y="+res+"&a=true&file=/"+path;
};

//***************************************************************************
// Materiale custom per spezione Item (MAPPE ATTIVAZIONE)
//***************************************************************************
APP.matBaseItem = new THREE.ShaderMaterial({
    uniforms: {
        tBase:  { value: null },
        tAMask: { value: APP._emptyMaskTex },
        tDepth: { value: null }

    },
    vertexShader: ATON.MatHub ? ATON.MatHub.getDefVertexShader() : `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
 	fragmentShader: `
        uniform sampler2D tBase;
        uniform sampler2D tAMask;
        uniform sampler2D tDepth;

        varying vec2 vUv;

        void main(){
            vec4 frag   = texture2D(tBase, vUv);
            vec4 fragAM = texture2D(tAMask, vUv);

            vec4 amBase   = vec4(0.0, 2.0, 0.0, 0.0);
            vec4 amTarget = vec4(2.0, 0.0, 0.0, 1.0);

            vec4 amCol = mix(amBase, amTarget, fragAM);
            frag = mix(frag, amCol, fragAM*0.8);

            gl_FragColor = frag;
        }
    `
});

//***************************************************************************
//TOOLBAR
//***************************************************************************
APP.setupToolbarForItem = (I) => {
    // Sposta l'uscita anticipata all'inizio se l'oggetto I non è valido
    if (!I) {
        if (APP._itemToolbar) APP._itemToolbar.visible = false;
        return;
    }

    const COLOR_YELLOW = new THREE.Color(0xc3ac3c);
    const COLOR_GREEN  = new THREE.Color(0x00aa44);
    const COLOR_WHITE  = new THREE.Color(0xffffff);
    const COLOR_BLACK  = new THREE.Color(0x222222);

    if (!APP._itemToolbar) {
        // Fallback per nodi UI di ATON
        APP._itemToolbar = typeof ATON.createUINode === "function" 
            ? ATON.createUINode("itemToolbar-root") 
            : ATON.createSceneNode("itemToolbar-root");
        
        APP._itemToolbar.attachToRoot();

        const bScale = APP.ITEM_SCALE * 3.0;

        for (let i = 0; i < APP.ACTMAPS.length; i++) {
            let A = APP.ACTMAPS[i];
            let b = new ATON.SUI.Button("btn-" + A);
            
            let isInfo = (A.toLowerCase() === "info_annotation");
            let iconPath = isInfo 
                ? APP.pathResIcons + "info.png" 
                : APP.pathResIcons + A + "-sf.png";

            b.setIcon(iconPath);
            b.setScale(bScale);

            b.position.x = -0.15;
            b.position.y = 0.1 - (i * 0.5 * APP.ITEM_SCALE);

            b.onHover = () => b.setScale(bScale * 1.2);
            b.onLeave = () => b.setScale(bScale);

            b.attachTo(APP._itemToolbar);
        }
    }

    APP._itemToolbar.visible = true;

    for (let i = 0; i < APP.ACTMAPS.length; i++) {
        let A = APP.ACTMAPS[i];
        let btn = typeof ATON.getUINode === "function" ? ATON.getUINode("btn-" + A) : null;

        if (!btn) continue;

        if (A.toLowerCase() === "info_annotation") {
            const currentItemID = I.data?.id || I._id;
            let panelElem = document.getElementById("info-panel-html");

            let isPanelOpenForThisItem = (
                APP._infoPanelVisible && 
                panelElem && 
                panelElem.style.display !== "none" && 
                panelElem._targetItemID === currentItemID
            );

            btn.setBaseColor(isPanelOpenForThisItem ? COLOR_GREEN : COLOR_YELLOW);

            btn.onSelect = () => {
                APP.toggleInfoPanel(I);
            };
        }
        else if (I.data && I.data.amaps && I.data.amaps[A]) {
            let maskIndex = i - 1; 
            let isActive = (I._activeAMaskIndex === maskIndex);
            
            btn.setBaseColor(isActive ? COLOR_GREEN : COLOR_WHITE);

            btn.onSelect = () => {
                if (I._activeAMaskIndex === maskIndex) {
                    if (typeof I.unloadActivationMask === "function") {
                        I.unloadActivationMask();
                    } else {
                        I.traverse((child) => {
                            if (child.isMesh && child.material && child.material.uniforms && child.material.uniforms.tAMask) {
                                child.material.uniforms.tAMask.value = APP._emptyMaskTex;
                                child.material.needsUpdate = true;
                            }
                        });
                    }
                    btn.setBaseColor(COLOR_WHITE);
                    I._activeAMaskIndex = undefined;
                } else {
                    if (I._activeAMaskIndex !== undefined) {
                        let prevA = APP.ACTMAPS[I._activeAMaskIndex + 1];
                        let prevBtn = typeof ATON.getUINode === "function" ? ATON.getUINode("btn-" + prevA) : null;
                        if (prevBtn) prevBtn.setBaseColor(COLOR_WHITE);
                    }
                    if (typeof I.loadActivationMask === "function") {
                        I.loadActivationMask(maskIndex);
                    }
                    I._activeAMaskIndex = maskIndex;
                    btn.setBaseColor(COLOR_GREEN);
                }
                if (window.ThreeMeshUI) ThreeMeshUI.update();
            };
        } else {
            btn.setBaseColor(COLOR_BLACK);
            btn.onSelect = null;
        }
    }

    const offsetVerticale = 0.03;
    APP._itemToolbar.position.copy(I.position);
    APP._itemToolbar.position.y += offsetVerticale;

    if (APP.activeCluster) {
        APP._itemToolbar.position.y += APP.activeCluster.position.y;
    }

    APP._itemToolbar.rotation.copy(I.rotation);

    if (window.ThreeMeshUI) ThreeMeshUI.update();
};

//***************************************************************************
// PANNELLO 3D FLUTTUANTE (SUI / ThreeMeshUI)
//***************************************************************************
// Popola e aggiorna il contenitore DOM HTML
APP.setupInfoPanelForItem = (I) => {
    if (!I) return;

    const itemId = I.data?.id || I._id || "unknown";
    let panelElem = document.getElementById("info-panel-html"); // Creazione struttura HTML se non esiste nel DOM
    
    if (!panelElem) {
        panelElem = document.createElement("div");
        panelElem.id = "info-panel-html";
        
        panelElem.innerHTML = `
            <div class="panel-header">
                <h2 class="panel-title">Information Panel</h2>
                <button id="close-info-panel-btn" class="close-btn" aria-label="Chiudi">&times;</button>
            </div>
            <div class="panel-body">
                <div id="fields-container"></div>
            </div>
        `;
        
        document.body.appendChild(panelElem);

        // Chiusura al click sulla 'X'
        const closeBtn = document.getElementById("close-info-panel-btn");
        closeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            APP.closeInfoPanel();
        });

        // Blocco propagazione eventi per evitare interferenze con il Canvas 3D
        panelElem.addEventListener("pointerdown", (e) => e.stopPropagation());
    }

    // Generazione dinamica dei dati
    let fieldsContainer = panelElem.querySelector("#fields-container");
    let htmlContent = "";

    if (I.data) {
        if (I.data.author) htmlContent += `<div class="field-row"><strong>Author:</strong> <span>${I.data.author}</span></div>`;
        if (I.data.century) htmlContent += `<div class="field-row"><strong>Century:</strong> <span>${I.data.century}</span></div>`;
        if (I.data.subject_1) htmlContent += `<div class="field-row"><strong>Subject:</strong> <span>${I.data.subject_1}</span></div>`;
        if (I.data.prov) htmlContent += `<div class="field-row"><strong>Source:</strong> <span>${I.data.prov}</span></div>`;
        if (I.data.description) htmlContent += `<div class="field-desc">${I.data.description}</div>`;
    }

    if (!htmlContent) {
        htmlContent = `<div class="field-desc">No information available for this item.</div>`;
    }

    fieldsContainer.innerHTML = htmlContent;
    panelElem._targetItemID = itemId;
};

// Funzione per aprire e rendere visibile il Pannello
APP.openInfoPanel = () => {
    let panelElem = document.getElementById("info-panel-html");
    if (panelElem) {
        panelElem.style.display = "block";
        APP._infoPanelVisible = true;
    }

    // Aggiorna colore pulsante Info SUI a Verde
    let btnInfo = ATON.getUINode("btn-info_annotation");
    if (btnInfo && typeof btnInfo.setBaseColor === "function") {
        btnInfo.setBaseColor(new THREE.Color(0x00aa44));
    }
};

// Funzione per Chiudere il Pannello
APP.closeInfoPanel = () => {
    let panelElem = document.getElementById("info-panel-html");
    if (panelElem) {
        panelElem.style.display = "none";
    }
    APP._infoPanelVisible = false;

    // Ripristina colore pulsante Info SUI a Giallo
    let btnInfo = ATON.getUINode("btn-info_annotation");
    if (btnInfo && typeof btnInfo.setBaseColor === "function") {
        btnInfo.setBaseColor(new THREE.Color(0xc3ac3c));
    }
};

// Gestione Toggle (Apre se chiuso, chiude se aperto)
APP.toggleInfoPanel = (selectedItem) => {
    let panelElem = document.getElementById("info-panel-html");
    const selectedItemID = selectedItem?.data?.id || selectedItem?._id;
    
    // Se è aperto sullo STESSO elemento lo chiude
    if (APP._infoPanelVisible && panelElem && panelElem.style.display !== "none" && panelElem._targetItemID === selectedItemID) {
        APP.closeInfoPanel();
    } else {
        // Richiamo esplicitamente openInfoPanel()
        if (selectedItem) {
            APP.setupInfoPanelForItem(selectedItem);
        }
        APP.openInfoPanel();
    }
};
