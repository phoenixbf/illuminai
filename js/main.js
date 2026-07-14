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

APP.CATS_LIST = [
    "P.01",
    "P.02",
    "A.01",
    "A.02",
    "A.03",
    "A.04",
    "A.05",
    "A.06",
    "A.07",
    "A.08"
];

APP.CENTS_LIST = [
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19"
];

APP.ACTMAPS = [
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

APP.CLUSTER_NUM_SLICES = 6;


APP.confdata  = undefined;
APP.cloudbase = undefined;
APP.db        = {};

APP.activeClusterID = undefined;
APP.activeCluster   = undefined;

APP.filters = {
    "max_visible_ring": 5,
    "P.01_annotation": false,
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
    "14": false, "15": false, "16": false, "17": false, "18": false, "19": false
};

APP.loadConfig = ()=>{
    return $.getJSON( APP.pathConfigFile, ( data )=>{
        //console.log(data);
        console.log("Loaded config");

        APP.confdata = data;
        APP.cloudbase = data.ncdata;

        if (data.db){
            let numCSVs = Object.keys(data.db).length;
            let dbloaded=0;

            for (let e in data.db){
                const E = data.db[e];

                let csv = E.file;
                let pi  = E.primary;

                if (!APP.db[e]) APP.db[e] = {};

                ATON.ASCII.loadCSV(APP.pathDB + csv, pi, (d)=>{
                    APP.db[e] = d;
                    dbloaded++;

                    if (dbloaded>= numCSVs) ATON.fire("APP_DB_READY");
                }); 
            }
        }

        ATON.fire("APP_ConfigLoaded");
    });
};


APP.setup = ()=>{

    ATON.realize();
    ATON.UI.addBasicEvents();

    ATON.Nav.setFirstPersonControl();

    ATON.Nav.setAndRequestHomePOV(
        //new ATON.POV().setPosition(-2.0,1.6,0).setTarget(0,0,0)
        new ATON.POV().setPosition(0,1.0,0).setTarget(2,1.0,0).setFOV(60.0)
    );

    APP.setupScene();

    APP.loadConfig();

    APP.setupEvents();

    APP.matCatsCluster = new THREE.MeshBasicMaterial({
        color: ATON.MatHub.colors.white,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        opacity: 0.3,
		//blending: THREE.MultiplyBlending,
        //premultipliedAlpha: true
    });

    ATON.SUI.showSelector(false);
};

APP.realizeBaseCluster = (size)=>{
    let g = new THREE.PlaneGeometry( size, size );
    g.rotateX(-Math.PI*0.5); // 1.0472

    APP.matBaseCluster = new THREE.MeshBasicMaterial({
        color: ATON.MatHub.colors.white,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        //opacity: 0.2,
		//blending: THREE.MultiplyBlending,
        //premultipliedAlpha: true
    });

    ATON.Utils.loadTexture(APP.pathResAssets+ "base-cluster.png", (tex)=>{
        APP.matBaseCluster.map = tex;
        APP.matBaseCluster.needsUpdate = true;
    });

    APP.baseCluster = ATON.createSceneNode("basecluster").rotateY(Math.PI / APP.CLUSTER_NUM_SLICES).attachToRoot();
    APP.baseCluster.add( new THREE.Mesh(g, APP.matBaseCluster) );
    APP.baseCluster.enablePicking();

    //APP.baseCluster = ATON.createSceneNode("basecluster").load(APP.pathResAssets+"base.glb").rotateY(Math.PI / APP.CLUSTER_NUM_SLICES).attachToRoot();
    //APP.baseCluster.enablePicking();
};

APP.setupScene = ()=>{
    ATON.setBackgroundColor(APP.bgColor);
    ATON.setMainPanorama(APP.pathResAssets+"4k.jpeg");

    ATON._bqScene = true;

    APP.realizeBaseCluster(4.0); // diameter in meters


/*
    // --- Configurazione 6 ANELLI (CENTURY) ---
    APP.baseRings = []; 
    const baseRingsLayers = [
        { 
            id_ring: 5,
            name_ring: "outer_border",
            geometry: { in: 0, out: 2.1, segments: 80 },
            texture: "baseprova13.png",
            opacity: 0.3,
            //items: 50
        },
        { 
            id_ring: 4,
            name_ring: "mid_ring4",
            geometry: { in: 0, out: 1.8, segments: 72 },
            texture: "baseprova13.png",
            opacity: 0.4,
            //items: 50
        },
        { 
            id_ring: 3,
            name_ring: "mid_ring3",
            geometry: { in: 0, out: 1.5, segments: 64 },
            texture: "baseprova12.png",
            opacity: 0.5,
            //items: 40 
        },
        { 
            id_ring: 2,
            name_ring: "mid_ring2",
            geometry: { in: 0, out: 1.2, segments: 56 },
            texture: "baseprova9.png",
            opacity: 0.6,
            //items: 30
        },
        { 
            id_ring: 1,
            name_ring: "mid_ring1",
            geometry: { in: 0, out: 0.9, segments: 48 },
            texture: "baseprova10.png",
            opacity: 0.8,
            //items: 20
        },
        {
            id_ring: 0,
            name_ring: "inner_core",
            geometry: { in: 0, out: 0.6, segments: 32 },
            texture: "baseprova.png", //"base5.1.png",
            opacity: 0.9,
            //items: 10
        }
    ];

// --- Ciclo di creazione: 6 ANELLI -----------------------
    baseRingsLayers.forEach((layer, index) => {
        let g = new THREE.RingGeometry(
            layer.geometry.in, 
            layer.geometry.out, 
            layer.geometry.segments
        );

        let mat = new THREE.MeshStandardMaterial({
            transparent: true,
            side: THREE.DoubleSide,
            opacity: layer.opacity,
            depthWrite: false,
            color: new THREE.Color(0xffffff)
        });

        ATON.Utils.textureLoader.load(APP.pathResAssets + layer.texture, (tex) => {
            tex.colorSpace = ATON._stdEncoding;
            mat.map = tex;
            mat.needsUpdate = true;
        });

        let mRing = new THREE.Mesh(g, mat);
        mRing.rotateX(-Math.PI * 0.5);
        mRing.position.y = 0.02 + (index * 0.005);
        mRing.renderOrder = 10 + index;

        let nRing = ATON.createSceneNode().add(mRing);
        
        // DA RIVEDERE: Hover non funzionante
        nRing.userData.tipo = "ring_century";
        nRing.userData.nome = layer.name_ring;
        nRing.userData.id_ring = layer.id_ring;
        nRing.userData.material = mat; 
        nRing.userData.opacityOriginal = layer.opacity;
        //nRing.userData.coloreHover = new THREE.Color(0xffff00); // Giallo per l'effetto hover

        nRing.enablePicking().attachToRoot(); // IMP! Per rendere il nodo cliccabile
        APP.baseRings.push(nRing);
    });
    
    // --- Configurazione 6 SPICCHI (SUBJECT) ---
    APP.sliceConfig = [
        { 
            id_slice: 0, 
            name_slice: "Nord",       
            color: 0xff4444, 
            //texture: "",   
            opacity: 0.3, //0.4 
        },
        { 
            id_slice: 1, 
            name_slice: "Nord-Est",   
            color: 0xffa500, 
            //texture: "", 
            opacity: 0.3, //0.4 
        },
        { 
            id_slice: 2, 
            name_slice: "Sud-Est",    
            color: 0xffff44, 
            //texture: "",  
            opacity: 0.3, //0.4 
        },
        { 
            id_slice: 3, 
            name_slice: "Sud",        
            color: 0x44ff44, 
            //texture: "",     
            opacity: 0.3, //0.4 
        },
        { 
            id_slice: 4, 
            name_slice: "Sud-Ovest",  
            color: 0x4444ff, 
            //texture: "",
            opacity: 0.3, //0.4 
        },
        { 
            id_slice: 5, 
            name_slice: "Nord-Ovest", 
            color: 0x6290eb, //0x9400d3
            //texture: "",
            opacity: 0.3, //0.4 
        }
    ];
    
    const numSlices = 6;
    //const objectsPerSlice = 50; // Quanti oggetti per ogni fetta su ogni anello - modificare !!!
    const maxRadius = 2.1;

    // --- Ciclo di creazione: 6 SPICCHI -----------------------
    APP.createSeparateSlice = (config, maxRadius, numSlices) => {
        const angleWidth = (Math.PI * 2) / numSlices; // 360 / 6 = 60 gradi
        const startAngle = config.id_slice * angleWidth;

        const sliceGeometry = new THREE.RingGeometry(
            0,              
            maxRadius,      // Raggio esterno (2.1)
            64,             
            1,              
            startAngle,   // IMP! punto di partenza
            angleWidth  // IMP! larghezza
        );
        

        const sliceMaterial = new THREE.MeshStandardMaterial({
            color: config.color, // Colore base unico
            transparent: true,
            side: THREE.DoubleSide,
            opacity: config.opacity,
            depthWrite: false, // Impedisce allo spicchio di "coprire" oggetti nel buffer di profondità
            depthTest: false,
            //emissive: new THREE.Color(0x000000),
            //emissiveIntensity: 0 // Inizialmente spento
        });

        const sliceMesh = new THREE.Mesh(sliceGeometry, sliceMaterial);
        sliceMesh.rotateX(-Math.PI * 0.5); // Sdraia
        sliceMesh.position.y = 0.01; // Livello "zero" della grafica sotto cerchi
        sliceMesh.renderOrder = 1; // IMP! Ordine rendering

        const sliceNode = ATON.createSceneNode().add(sliceMesh);
        sliceNode.userData.id = config.id_slice;
        sliceNode.userData.name = config.name_slice;
        sliceNode.userData.type = "base_sector1";
        sliceNode.userData.color = config.color;

        sliceNode.enablePicking().attachToRoot(); //IMP! Per avere spicchio cliccabile
        return sliceNode;
    };   
    
    APP.sliceConfig.forEach(config => {
        APP.createSeparateSlice(config, maxRadius, numSlices);
    });
*/
};


APP.setupEvents = ()=>{
    ATON.on("APP_DB_READY", APP.onReadyDB );

    ATON.on("APP_ConfigLoaded", ()=>{
        APP.UI.setup();

        APP.UI.modalWelcome();
    });

    ATON.on("KeyPress", k => {
        if (k==='ArrowUp')   APP.shiftActiveCluster(0.05);
        if (k==='ArrowDown') APP.shiftActiveCluster(-0.05);
    });

    ATON.on("Tap", ()=>{
        //
    });

    //Effetto HOVER ANELLI (DA RIVEDERE!!!) -------------------------------------------------
/*
    //1. INGRESSO
    ATON.on("pick", (node) => {
        if (node && node.userData.tipo === "ring_century") {
            // Cambia colore o aumenta opacità al passaggio
            node.userData.material.color.set(0xffff00); // Diventa giallo
            node.userData.material.opacity = 1.0;
            
            //serve per label
            const label = document.getElementById("ring-label");
            label.style.display = "block";
            label.innerText = node.userData.nome.toUpperCase();
            // Segui il mouse
            window.onmousemove = (e) => {
                label.style.left = e.clientX + "px";
                label.style.top = (e.clientY - 20) + "px";
            };
        
        }
    });
    
    // 2. RIPRISTINO
    ATON.on("unpick", (node) => {
        if (node && node.userData.tipo === "ring_century") {
            // Torna al colore originale (bianco) e opacità originale
            node.userData.material.color.set(0xffffff);
            node.userData.material.opacity = node.userData.opacityOriginal;

            document.getElementById("ring-label").style.display = "none";
            window.onmousemove = null;
        }
    });
    
    // 3. CLICK (Azione alla selezione)
    ATON.on("select", (node) => {
        if (node && node.userData.tipo === "ring_century") {
            console.log("Century selected: " + node.userData.nome);
        
            // ATON.Nav.fitToNode(node); //Sposta la telecamera sull'anello cliccato
        }
    });
*/
};
//***************************************************************************
// FUNZIONE CAMBIO CLUSTER 
APP.changeCluster = (clusterId) => {
    const id = parseInt(clusterId);
    console.log(`[Cluster Switch] Avvio transizione verso il Cluster #${id}`);

    // Rimuove vecchio cluster
    if (APP.activeCluster) {
        if (APP.activeCluster.parent) {
            APP.activeCluster.parent.removeChild(APP.activeCluster);
        } else if (typeof APP.activeCluster.detachFrom === 'function') {
            APP.activeCluster.detachFrom();
        }
        APP.activeCluster = undefined;
    }

    // Istanza nuovo cluster
    let C = new APP.Cluster(id);
    
    C.attachToRoot();

    C.realize();   // Carica i dati e dispone gli oggetti
    C.setActive(); // Imposta APP.activeCluster e lancia internamente C.filter()

    // Aggiorna parametro URL
    if (APP.params && typeof APP.params.set === 'function') {
        APP.params.set("c", id);
    }
    
    //console.log(`[Cluster Switch] Cluster #${id} caricato e filtrato con successo.`);
};

APP.shiftActiveCluster = (h)=>{
    if (!APP.activeCluster) return;

    if (!h){
        APP.activeCluster.position.set(0,0,0);
        return;
    }

    APP.activeCluster.position.y += h;
};

/*
// Funzioni della Toolbar ----> DA COMPLETARE !!! ----------------------------
window.toggleSidebar = function() {
    const sidebar = document.getElementById("idSidebar");
    
    if (sidebar.style.width === "400px") {
        sidebar.style.width = "0";
    } else {
        sidebar.style.width = "400px";
    }
};
*/

// https://<nccloud-addr>/apps/files_sharing/publicpreview/iq2623RQzQbe33E?x=1024&y=1024&a=true&file=/A_Art/A.01_Painting/A.01_A_18GRmGFN-B000237.jpg
APP.getImageURL = (path, res)=>{
    if (!APP.cloudbase) return undefined;

    //if (!res) res = APP.ITEM_RES_HIGH;

    let url = APP.cloudbase+"?";
    url += "a=true&file=/"+path;

    if (res) url += "&x="+res+"&y="+res;

    return url;
    //return APP.cloudbase+"?x="+res+"&y="+res+"&a=true&file=/"+path;
};

// Custom material for item inspection
APP.matBaseItem = new THREE.ShaderMaterial({
        uniforms: {
            tBase: { type:'t' /*, value: 0*/ },
            tAMask: { type:'t' /*, value: 0*/ },
            tDepth: { type:'t' /*, value: 0*/ },
        },

        vertexShader: ATON.MatHub.getDefVertexShader(),

        fragmentShader:`
            uniform sampler2D tBase;
            uniform sampler2D tAMask;
            uniform sampler2D tDepth;

            varying vec2 vUv;

		    void main(){
		        vec4 frag   = texture2D(tBase, vUv);
                vec4 fragAM = texture2D(tAMask, vUv);

                vec4 orig = frag;

                // Gradient
                vec4 amBase   = vec4(0,2,0,0);
                vec4 amTarget = vec4(2,0,0,1);

                vec4 amCol = mix(amBase, amTarget, fragAM);

                frag = mix(frag, amCol, fragAM*0.8);

		        gl_FragColor = frag;
		    }
        `,

        //side: THREE.DoubleSide
});

APP.setupToolbarForItem = (I)=>{
    if (!APP._itemToolbar){
        APP._itemToolbar = ATON.createUINode();
        APP._itemToolbar.attachToRoot();

        const bScale = APP.ITEM_SCALE * 3.0;

        for (let i=0; i<APP.ACTMAPS.length; i++){
            let A = APP.ACTMAPS[i];
            //console.log(A)

            let b = new ATON.SUI.Button("btn-"+A);

            //b.setText(A);
            b.setIcon(APP.pathResIcons + A + "-sf.png");
            b.setScale(bScale);

            b.position.x = -0.15; // Left
            b.position.y = 0.1 - (i * 0.5 * APP.ITEM_SCALE);

            b.onHover = ()=>{
                b.setScale(bScale * 1.2);
            };
            b.onLeave = ()=>{
                b.setScale(bScale);
            };

            b.attachTo(APP._itemToolbar);
        }
    }

    if (I.data){
        for (let i=0; i<APP.ACTMAPS.length; i++){
            let A = APP.ACTMAPS[i];
            let btn = ATON.getUINode("btn-"+A);

            if (I.data.amaps[A]){    
                btn.setBaseColor(ATON.MatHub.colors.white); // Active
                btn.onSelect = ()=>{
                    console.log("Select")
                    I.loadActivationMask(i);
                }
            }
            else {
                btn.setBaseColor(ATON.MatHub.colors.black);
            }
        }
    }

    APP._itemToolbar.position.copy(I.position);
    APP._itemToolbar.position.y += APP.activeCluster.position.y;
    
    APP._itemToolbar.rotation.copy(I.rotation);

    ThreeMeshUI.update();
};