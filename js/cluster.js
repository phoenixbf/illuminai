/*

    IlluminAI SUI Cluster
 
=============================*/

class Cluster extends ATON.Node {

constructor(id){
    super(id, ATON.NTYPES.UI);

    this._id = id;

    this.gBands = ATON.createUINode();
    this.gBands.attachTo(this);

    this.gItems = ATON.createUINode();
    this.gItems.attachTo(this);
}

setPosition(p){
    this.position.copy(p);

    for (let i in this.gItems) this.gItems[i].setClusterOrigin(p);
}

addItem(I){
    I.setClusterOrigin(this.position);
    I.attachTo(this.gItems);
    I.load(128);

    // TODO: arrange
}

}

export default Cluster;