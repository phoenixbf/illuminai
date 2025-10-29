/*

    IlluminAI SUI Item
 
=============================*/

class Item extends ATON.Node {

constructor(id, db){
    super(id, ATON.NTYPES.UI);

    this._id = id;

    if (!db) return;
    this.data = APP.db[db][id];

    this.panel = new ATON.SUI.MediaPanel("panel-"+id);
    this.panel.setTitle( id );
    //this.panel.setBackdrop(0.5);

    this.panel.attachTo(this);
    this.panel.enablePicking();

    this.enablePicking();
    this.setupEvents();

    this._bIspection = false;

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
            this._bIspection = true;
            
            this.load(4096);

            // distance 0.6
            this.position.x = THREE.MathUtils.lerp(this.position.x,this._origin.x, 0.5);
            this.position.z = THREE.MathUtils.lerp(this.position.z,this._origin.z, 0.5);

            this.setScale(APP.ITEM_SCALE * 2.0);
        }
    };
}

load(res){
    if (!res) res = 4096;

    this.panel.load( APP.getImageURL(this.data.path, res) );
    
    this.enablePicking();
}

setClusterOrigin(p){
    this._origin = p;
}

}

export default Item;