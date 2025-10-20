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

    // Base Scene
    let g = new THREE.PlaneGeometry( 4, 4 );
    let matBase = new THREE.MeshStandardMaterial({
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
    });

    ATON.Utils.textureLoader.load(APP.pathResAssets+"base2.png", (tex)=>{
        tex.colorSpace = ATON._stdEncoding;
        matBase.map = tex;

        matBase.needsUpdate = true;
    });

    let mBase = new THREE.Mesh(g,matBase);
    mBase.rotateX(-Math.PI * 0.5);

    let nBase = ATON.createSceneNode();
    nBase.add(mBase);
    nBase.enablePicking().attachToRoot();
};

APP.setupEvents = ()=>{
    ATON.on("APP_DB_READY", APP.onReadyDB );
};

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

        let x = 2.0 * Math.cos(i*0.3);
        let z = 2.0 * Math.sin(i*0.3);

        N.setPosition(x,y,z).orientToLocation(0,y,0).setScale(APP.ITEM_SCALE);
    };

    ATON.SUI.createLayout(C, spiral);
};

// https://<nccloud-addr>/apps/files_sharing/publicpreview/iq2623RQzQbe33E?x=1024&y=1024&a=true&file=/A_Art/A.01_Painting/A.01_A_18GRmGFN-B000237.jpg
APP.getImageURL = (path, res)=>{
    if (!APP.cloudbase) return undefined;

    if (!res) res = 2048;

    return APP.cloudbase+"?x="+res+"&y="+res+"&a=true&file=/"+path;
};