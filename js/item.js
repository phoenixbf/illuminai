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
}

setupEvents(){
    this.panel.onHover = ()=>{
        if (this._bIspection) return;

        ///this.setBackgroundOpacity(1.0);
        this.setScale(APP.ITEM_SCALE * 1.2);
        //this.position.x *= 0.9;
        //this.position.z *= 0.9;

        ATON.AudioHub.playOnceGlobally(ATON.PATH_RES+"audio/blop.mp3");
        console.log(this._id);
    };

    this.panel.onLeave = ()=>{
        if (this._bIspection) return;

        //this.setBackgroundOpacity(0.5);
        this.setScale(APP.ITEM_SCALE);
    };

    this.panel.onSelect = ()=>{
        if (!this._bIspection){
            this.load(4096);

            this.arrangeForInspection();
        }
        else this.reset();
    };
}

// Reset item to its original location in the cluster
reset(){
    if (this._origLoc) this.position.copy(this._origLoc);
    this.orientToLocation(0, this._origLoc.y, 0);

    this.load(128);

    this._bIspection = false;
}

arrangeForInspection(){
    let eye = ATON.Nav.getCurrentEyeLocation();
    let dir = ATON.Nav.getCurrentDirection();
    
    this.position.x = eye.x + (dir.x * APP.ITEM_INSPECT_RAD);
    this.position.y = eye.y + (dir.y * APP.ITEM_INSPECT_RAD);
    this.position.z = eye.z + (dir.z * APP.ITEM_INSPECT_RAD);
    
    this.orientToCamera();
    
    this.setScale(APP.ITEM_SCALE * 2.0);

    this._bIspection = true;
}

load(res){
    if (!res) res = 4096;

    this.panel.load( APP.getImageURL(this.data.path, res) );
    
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