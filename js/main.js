

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

        ATON.fireEvent("APP_ConfigLoaded");
    });
};

APP.setup = ()=>{

};

// Run the App
window.addEventListener('load', ()=>{
	APP.run();
});

