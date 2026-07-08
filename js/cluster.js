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
    I.load(APP.ITEM_RES_BASE);

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
            P.load(APP.ITEM_RES_BASE);

            //console.log(P)
        }
    }

    let arrange = (N,i)=>{
        const data = N.data;
        //console.log(data)

        let y = APP.CAT_HEIGHT * 0.5; // Baseline
        if (data && data.icat !== undefined) y += (data.icat * APP.CAT_HEIGHT);

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

        let a = parseFloat( slice / APP.CLUSTER_NUM_SLICES );
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
        N.setOriginalLocation( N.position );
    };

    ATON.SUI.createLayout(this.gItems, arrange);

    const tickness = 0.02;
    for (let c=0; c<APP.CATS_LIST.length; c++){

        let gR = new THREE.CylinderGeometry(2,2, tickness, 64,1, true);

        let R = new THREE.Mesh(gR, APP.matCatsCluster);

        R.position.y = c * APP.CAT_HEIGHT;

        this.add(R);
    }

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

filter() {
    for (let i in this.gItems.children) {
        let I = this.gItems.children[i];
        let data = I.data;

        if (!data) {
            I.show();
            continue; 
        }

        let keepVisible = true;

        for (let f in APP.filters) {
            let filterValue = APP.filters[f];

            // GESTIONE SLIDER
            if (f === "max_visible_ring") {
                let objRing = data["max_visible_ring"] !== undefined ? data["max_visible_ring"] : data["id_ring"];
                if (objRing !== undefined && parseInt(objRing) > filterValue) {
                    keepVisible = false;
                    break;
                }
            } 
            
            // GESTIONE SWITCH (Object Classes e Century)
            else {
                // Estraiamo i codici identificativi dal database
                let classCode = f.split("_")[0];
                let centuryCode = f; //+ "C"; 

                let isThisClass = data.path && data.path.includes(classCode);
                let isThisCentury = (data.path && data.path.includes(centuryCode)) || (data.original && data.original.includes(centuryCode));

                if (isThisClass || isThisCentury) {
                    // visibile SOLO se filtro esiste e ATTIVO
                    if (filterValue !== true) {
                        keepVisible = false;
                        break;
                    }
                }
            }
        }

        if (keepVisible) {
            I.show();
        } else {
            I.hide();
        }
    }
}
    
}

export default Cluster;