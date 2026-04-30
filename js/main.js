/*
    IlluminAI app

==========================================*/
import Item from "./item.js";


let APP = ATON.App.realize();
//APP.requireFlares(["myFlare"]);
window.APP = APP;

APP.Item = Item;

APP.bgColor = new THREE.Color(0.1,0.1,0.1);
APP.pathConfigFile   = APP.basePath + "config.json";
APP.pathResAssets    = APP.basePath + "assets/";

APP.ITEM_SCALE = 0.25;

APP.confdata  = undefined;
APP.cloudbase = undefined;
APP.db        = {};


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

                ATON.ASCII.loadCSV(APP.basePath +"db/"+csv, pi, (d)=>{
                    APP.db[e] = d;
                    dbloaded++;

                    if (dbloaded>= numCSVs) ATON.fire("APP_DB_READY");
                }); 
            }
        }

        ATON.fire("APP_ConfigLoaded");
    });
};

// MODIFICA: visualizza pagina Landing
window.startApp = function() {
    const landing = document.getElementById("idLandingPage");
    landing.classList.add("landing-hidden");
    
    landing.style.pointerEvents = "none";

    if (typeof APP !== 'undefined') APP.setup();

    setTimeout(() => {
        landing.style.display = "none";
        landing.style.zIndex = "-1000";
    }, 850);
};

APP.setup = ()=>{

    ATON.realize();
    ATON.UI.addBasicEvents();

    ATON.Nav.setAndRequestHomePOV(
        new ATON.POV().setPosition(-1,1.5,0).setTarget(0,1.5,0)
    );

    APP.setupScene();

    APP.loadConfig();

    APP.setupEvents();
};

APP.setupScene = ()=>{
    ATON.setBackgroundColor(APP.bgColor);
    ATON._bqScene = true;

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

};


APP.setupEvents = ()=>{
    ATON.on("APP_DB_READY", APP.onReadyDB );

    //Effetto HOVER ANELLI (DA RIVEDERE!!!) -------------------------------------------------
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

};

// DA MODIFICARE!!! --------------------------------------------------
APP.onReadyDB = ()=>{
    console.log("DB ready")

    // Cluster
    let C = ATON.createUINode("C0");
    C.attachToRoot();

    let count = 0;
    for (let e in APP.db["main"]){

        if (count < 200){
            let P = new APP.Item(e, "main");
            P.setClusterOrigin(C.position);

            P.attachTo(C);
            P.load(128);

            count++;
        }
    }

    let spiral = (N,i)=>{
        let y = 0.3 + (i * 0.03);

        let c = N.data.century;
        c -= 18;
        c *= 0.5;

        let x = (2.0 + c) * Math.cos(i*0.3);
        let z = (2.0 + c) * Math.sin(i*0.3);

        N.setPosition(x,y,z).orientToLocation(0,y,0).setScale(APP.ITEM_SCALE);
    };

    ATON.SUI.createLayout(C, spiral);
};

// Funzioni della Toolbar ----> DA COMPLETARE !!! ----------------------------
window.toggleSidebar = function() {
    const sidebar = document.getElementById("idSidebar");
    
    if (sidebar.style.width === "400px") {
        sidebar.style.width = "0";
    } else {
        sidebar.style.width = "400px";
    }
};
// DA MODIFICARE!!! --------------------------------------------------
// https://<nccloud-addr>/apps/files_sharing/publicpreview/iq2623RQzQbe33E?x=1024&y=1024&a=true&file=/A_Art/A.01_Painting/A.01_A_18GRmGFN-B000237.jpg
APP.getImageURL = (path, res)=>{
    if (!APP.cloudbase) return undefined;

    if (!res) res = 2048;

    return APP.cloudbase+"?x="+res+"&y="+res+"&a=true&file=/"+path;
};
