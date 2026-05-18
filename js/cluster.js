/*

    IlluminAI SUI Cluster
 
=============================*/

class Cluster extends ATON.Node {

constructor(id){
    super(id, ATON.NTYPES.UI);

    this._id = parseInt(id);

    this.gBands = ATON.createUINode();
    this.gBands.attachTo(this);

    this.gItems = ATON.createUINode();
    this.gItems.attachTo(this);
}

setPosition(p){
    this.position.copy(p);

    for (let i in this.gItems) this.gItems[i].setClusterOrigin(p);

    return this;
}

addItem(I){
    I.setClusterOrigin(this.position);
    I.attachTo(this.gItems);
    I.load(128);

    return this;
}

realize(){
    const D = APP.db["main"];

    for (let iid in D){
        let item = D[iid];
        let cid = parseInt(item["id_cluster"]);
        
        if (cid === this._id){
            let P = new APP.Item(iid, "main");
            P.setClusterOrigin( this.position );

            P.attachTo( this.gItems );
            P.load(64);

            //console.log(P)
        }
    }

    let arrange = (N,i)=>{
        const data = N.data;
        //console.log(data)

        let y = 0.5;
        if (data && data.icat !== undefined) y += data.icat;

        //let y = 0.3 + (i * 0.03);
/*
        let c = 0;
        if (N.data && N.data.century) c = N.data.century;

        c -= 10; //18;
        c *= 0.5;
*/
        let r = 0;
        if (data && data["id_ring"]) r = parseInt( data["id_ring"] );
        r /= 6.0;
        r += 1.0; // min distance

/*
        let x = r * Math.cos(i*0.3);
        let z = r * Math.sin(i*0.3);
*/
        let slice = 0;
        if (data && data["id_slice"]) slice = parseInt( data["id_slice"] );

        let a = parseFloat( slice / (APP.CLUSTER_NUM_SLICES-1) );
        a = a * Math.PI * 2.0;

        let x = r * Math.cos(a);
        let z = r * Math.sin(a);

        // Local
        const randRad = Math.random() * 0.3 * (r+0.5);
        const vRand   = new THREE.Vector3();
        vRand.randomDirection();
        vRand.multiplyScalar(randRad);

        x += vRand.x;
        y += vRand.y;
        z += vRand.z;

        N.setPosition(x,y,z).orientToLocation(0,y,0).setScale(APP.ITEM_SCALE);
    };

    ATON.SUI.createLayout(this.gItems, arrange);
    return this;
}

setActive(){
    APP.activeClusterID = this._id;
    APP.activeCluster   = this;

    // TODO: update base here

    this.filter();

    console.log("Active cluster #"+this._id);
    return this;
}

filter(){
    for (let i in this.gItems.children){
        let I = this.gItems.children[i];

        I.hide();

        let data = I.data;

        if (data){
            for (let f in APP.filters){
                //console.log(APP.filters[f])
                //console.log(data[f])

                if (APP.filters[f] && parseInt(data[f])) I.show();
            }
        }
    }
}

}

export default Cluster;