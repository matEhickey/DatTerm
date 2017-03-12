class AbstractFile {
    constructor(name){
        this.name = name;
    }
    setParent(parent){
        this.parent = parent;
    }
    getParent(){
        if(this.parent){
            return(this.parent);
        }
        else{
            return(currentComputer.currentDirectory);
        }
    }
}
class File extends AbstractFile{
    constructor(name,text=""){
        super(name);
        this.text = text;
        this.parent = null;
    }
    setText(text){
        this.text = text;
        debug(this.name+".setText(\""+text+"\")");
        
    }
    show(){
        println(this.text);
    }
    
    toJson(){
        //var filesJson = this.files.forEach(function(file){ filesJson.push(file); });
        return({ file : this.name , text : this.text.replace(/[\"]/g, '\\"').replace(/[\n]/g, '\\n')});
    }
    
    static fromJSON(obj){
        //console.log(obj.file);
        return(new File(obj.file,obj.text.replace(/\\n/g, `\n`).replace(/\\"/g,"\"")));
    }
    
}
class Folder extends AbstractFile{
    constructor(name){
        super(name);
        this.files = [];
    }
    
    addFile(file){
        var search = this.getFileByName(file.name);
        if(!search){
            file.setParent(this);
            this.files.push(file);
        }
        else{
            //println("There is already a file named "+file.name);
            this.removeFile(search);
            //file.name += "#";
            this.addFile(file);
        }
    }
    show(){
        this.files.forEach(function(file){
            print(file.name);
        });
    }
    
    clearFiles(){
        this.files = [];
    }
    
    getFileByName(name){
        var res = null;
        
        this.files.forEach(function(file){
            if(file.name == name) {
                res = file;
            }
        });
    
        //console.log(res);
        return(res);
    }
    
    removeFile(f){
        var i = 0;
        var res = null;
        this.files.forEach(function(file){
            //console.log(file==f);
            if(file == f) {
                res = i;
            }
            i+=1;
        });
        //console.log(res);
        if(res !== null){
            //console.log("remove "+res);
            this.files.splice(res,1);
        }
    }
    
    pwd(){
        var chaine = "";
        if(this.parent){
            chaine = this.parent.pwd();
            if(this.parent.name != "/"){ chaine += "/"; }
        }
        chaine += this.name;
        return(chaine);
    }
    
    toJson(){
        var filesJson = [];
        this.files.forEach(function(file){ 
            if(file != file.getParent()){ filesJson.push(file.toJson()); }
        });
        return({ folder : this.name , files : filesJson });
    }
    
    static fromJSON(obj){
        //console.log(obj.folder);
        var files = new Folder(obj.folder);
        
        obj.files.forEach(function(file){
            if(file.hasOwnProperty('files')){
                files.addFile(Folder.fromJSON(file));
            }else{
                files.addFile(File.fromJSON(file));
            }
        });
        
        
        return(files);
    }
}



