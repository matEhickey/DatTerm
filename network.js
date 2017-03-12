class GlobalNetwork{
    constructor(networks = []){
        this.networks = networks;
        this.myPC = "144.155.524.233";
    }
    getComputer(ip){
        var res = null;
        this.networks.forEach(function(net){
            var pc = net.getComputer(ip);
            if(pc){
                res = pc;
            }
        });
        return(res);
    }
    getMyComputer(){
        return(this.getComputer(this.myPC));
    }
    getComputerByName(name){
        var res = null;
        this.networks.forEach(function(net){
            var pc = net.getComputerByName(name);
            if(pc){
                res = pc;
            }
        });
        return(res);
    }
    addNetwork(network){
        this.networks.push(network);
    }
    toJson(){
        var nets = [];
        this.networks.forEach(function(net){
            nets.push(net.toJson()); 
        });
        
        return( {GlobalNetwork : { nets } });
    }
    
    static fromJSON(json){
        var data = JSON.parse(json);
        
        var nets = [];
        //console.log(data.GlobalNetwork.nets);
        data.GlobalNetwork.nets.forEach(function(net){
            nets.push(Network.fromJSON(net));
        });
        
        var newGlobal = new GlobalNetwork(nets);
        return(newGlobal);
    }
}

class Network{
    constructor(){
        this.computers = [];
    }
    addComputer(computer){
        this.computers.push(computer);
    }
    getComputer(ip){
        var res = null;
        this.computers.forEach(function(comp){
            if(comp.ip == ip){
                res = comp;
            }
        });
        return(res);
    }
    getComputerByName(name){
        var res = null;
        this.computers.forEach(function(comp){
            if(comp.name == name){
                res = comp;
            }
        });
        return(res);
    }
    removeComputer(computer){
        var res = null;
        var i = 0;
        this.computers.forEach(function(comp){
            //console.log(comp);
            //console.log(computer);
            //console.log(comp.name == computer.name);
            
            if(comp.name == computer.name){
                res = i;
            }
            i+=1;
        });
        
        if(res != null){
            this.computers.splice(res,1);
            currentComputer = GLOBALNETWORK.getMyComputer();
            println(computer.ip +"  down");
        }
        else{
            console.log("Cant find computer to remove of the network");
        }
    }
    
    toJson(){
        var comps = [];
        this.computers.forEach(function(comp){
            comps.push(comp.toJson());
        });
        return ( { network : { comps }} );
    }
    static fromJSON(obj){
        var net = new Network();
        obj.network.comps.forEach(function(comp){
            Computer.fromJSON(comp,net);
        });
        return(net);
    }
}

class Computer {
    constructor(name,ip,network,mdp){
        this.name = name;
        this.ip = ip;
        this.mdp = mdp;
        this.waitFor = false;

        this.rootFolder = null;
        this.currentDirectory = this.files;
        this.network = network;
        this.network.addComputer(this);
    }
    setRootFolder(rootFolder){
        this.rootFolder = rootFolder;
        this.currentDirectory = rootFolder;
    }
    
    toJson(){
        return( { name: this.name , ip : this.ip, mdp : this.mdp ,rootFolder : this.rootFolder.toJson() } );
    }
    
    static fromJSON(obj,network){
        //console.log("loadFromJSON : "+obj.name);
        //console.log(Folder.fromJSON(obj.rootFolder));
        var comp = new Computer(obj.name,obj.ip,network,obj.mdp);
        comp.setRootFolder(Folder.fromJSON(obj.rootFolder));
        return(comp);
    }
}

function initStandartComputer(computer){
    
    var FILESYSTEM = new Folder("/",null);
    //FILESYSTEM
    var tmp = new Folder("tmp");
    var mails = new Folder("mails");
    var sys = new Folder("sys");
    var logs = new Folder("logs");
    FILESYSTEM.addFile(tmp);
    FILESYSTEM.addFile(mails);
    FILESYSTEM.addFile(sys);
    FILESYSTEM.addFile(logs);

    //tmp folder
    var a = new File("tmp1");
    var b = new File("tmp2");
    a.setText(Math.random().toString());
    b.setText(Math.random().toString());
    tmp.addFile(a);
    tmp.addFile(b);
    
    //sys folder
    var boot = new Folder("boot");
    var data = new Folder("data");
    var etc = new Folder("etc");
    var usr = new Folder("usr");
    var vaar = new Folder("var");
    sys.addFile(boot);
    sys.addFile(data);
    sys.addFile(etc);
    sys.addFile(usr);
    sys.addFile(vaar);
    
    computer.setRootFolder(FILESYSTEM);
    
    
}