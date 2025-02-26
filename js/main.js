

let APP = ATON.App.realize();
//APP.requireFlares(["myFlare"]);
window.APP = APP;

APP.pathConfigFile   = APP.basePath + "config.json";
APP.pathResAssets    = APP.basePath + "assets/";

APP.confdata = undefined;



APP.loadConfig = ()=>{
    return $.getJSON( APP.pathConfigFile, ( data )=>{
        //console.log(data);
        console.log("Loaded config");

        APP.confdata = data;

        ATON.fire("APP_ConfigLoaded");
    });
};

APP.setup = ()=>{

    ATON.realize();
    ATON.UI.addBasicEvents();

    APP.loadConfig();

    ATON.ASCII.loadCSV(APP.basePath+"db/PoA_Ver5.1_Gruppo_40k_predicted_labels_v1.0_CorrectedwithAnnotations.csv", 5, (data)=>{
        console.log(data);
    });
};

// Run the App
window.addEventListener('load', ()=>{
	APP.run();
});

