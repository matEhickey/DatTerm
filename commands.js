class Commande {
  constructor(name, callback) {
    this.name = name;
    this.callback = callback;
  }
  run(calledCMD){ this.callback(calledCMD); }
}



var CMDS = []; //cmd library

CMDS.push(new Commande("ls", function(){
        currentComputer.currentDirectory.show();
}));

CMDS.push(new Commande("pwd", function(){
        println(currentComputer.currentDirectory.pwd());
}));

CMDS.push(new Commande("cd", function(calledCMD){
        var re = / *cd +([\S]+)/;
        var res = calledCMD.match(re);
        //console.log(calledCMD);
        if(res){
            //console.log(res[1]);
            var file = currentComputer.currentDirectory.getFileByName(res[1]);
            if(file){
                if(file.hasOwnProperty('files')){
                    currentComputer.currentDirectory = file;
                    //console.log("changing curren dir");
                }
                else{
                    println(file.name+" is not a directory");
                }
            }
            else{
                if(res[1] == ".."){ currentComputer.currentDirectory = currentComputer.currentDirectory.getParent(); }
                else if(res[1] == ".") {} 
                else{ println(res[1]+" not found")};
            }
        }
        else {
            currentComputer.currentDirectory = currentComputer.rootFolder;
        }
}));

CMDS.push(new Commande("cat", function(calledCMD){
        var re = / *cat +([\S]+)/;
        var res = calledCMD.match(re);
        if(res){
            //console.log(res[1]);
            var file = currentComputer.currentDirectory.getFileByName(res[1]);
            
            if(file){
                if(!file.hasOwnProperty('files')){
                    file.show();
                }
                else{
                    println(res[1]+" is a directory");
                }
            }
            else{
                println(res[1]+" not found");
            }
        }
        else{
            println("cat arguments not reconized");
        }
}));

CMDS.push(new Commande("echo", function(calledCMD){
        //println(actualCMD);
        var re = / *echo +([\S\s]*)/;
        var res = calledCMD.match(re);
        if(res){
            println(res[1]);
        }
}));

CMDS.push(new Commande("ssh", function(calledCMD){
        var re = / *ssh +(\S+)@(\d{1,3}\.\d{1,3}.\d{1,3}.\d{1,3})/;
        var res = calledCMD.match(re);
        if(res){
            var name = res[1]
            var ip = res[2];
            println("connecting to "+ip);
            var computer = GLOBALNETWORK.getComputer(ip);
            
            
            if(computer){
                if(computer.name == name){
                    println("Waiting password for "+name,"Password:");
                    currentComputer.waitFor = "ssh";
                    currentComputer.waitForFunction = function(pass){
                        //println("ssh psw = "+pass);
                        //println("ssh user = "+name);
                        if(computer.mdp == pass){
                            setTimeout(function(){
                                currentComputer = computer;
                                println("Connection ok");
                                addLog("sshConnection","A user is connecting via SSH");
                                closeEffect(6);
                                releaseTerm();
                            },4400);

                            openEffectIframe(6);
                            lockTerm();
                            
                            var i = 0;
                            var progress = document.getElementById("progressSSH");
                            progress.style.width = i+"%";
                            
                            var inter = setInterval(function(){
                                i+= 10;
                                if(i >= 100){
                                    clearInterval(inter);
                                }
                                progress.style.width = i+"%";
                            },400);
                        }
                        else{
                            println("Wrong password");
                        }
                    };
                }
                else{
                    println("Username not allowed");
                }
            }
            else{
                println(ip+" not found");
            }
        }
        else{
            println("ssh arguments not reconized");
        }
}));

CMDS.push(new Commande("exit", function(){
    currentComputer = GLOBALNETWORK.getMyComputer();
    println("ssh disconnected");
}));

CMDS.push(new Commande("nmap", function(){
        //console.log(currentComputer.network.computers[0]);
        openEffectIframe(4);
        lockTerm();
        setTimeout(function(){
            currentComputer.network.computers.forEach(function(comp){
            println(comp.name+" : "+comp.ip);
            closeEffect(4);
            releaseTerm();
        });
        },5500);
        
        var i = 0;
        var progress = document.getElementById("progressNMap");
        progress.style.width = i+"%";
        
        var inter = setInterval(function(){
            i+= 10;
            if(i >= 100){
                clearInterval(inter);
            }
            progress.style.width = i+"%";
        },500);
        
}));

CMDS.push(new Commande("gcc", function(){
        println("wanna compile ?");
}));

CMDS.push(new Commande("mkdir", function(calledCMD){
        var re = / *mkdir +([\S]+)/;
        var res = calledCMD.match(re);
        if(res){
            var folderName = res[1];
            currentComputer.currentDirectory.addFile(new Folder(folderName));
            addLog("folderCreation","A folder was created \ncommand = "+calledCMD);
            debug("var "+folderName+" = new Folder(\""+folderName+"\");");
            debug(currentComputer.currentDirectory.name+".addFile(\""+folderName+"\");");
        }
}));

CMDS.push(new Commande("touch", function(calledCMD){
        var re = / *touch +([\S]+)/;
        var res = calledCMD.match(re);
        if(res){
            var fileName = res[1];
            
            console.log(currentComputer.currentDirectory);
            currentComputer.currentDirectory.addFile(new File(fileName));
            //console.log(currentComputer.currentDirectory);
            addLog("fileCreation","A file was created \ncommand = "+calledCMD);
            debug("var "+fileName+" = new File(\""+fileName+"\")");
            debug(currentComputer.currentDirectory.name+".addFile(\""+fileName+"\");");
        }
        else{
            println("you need to specify the name of the new file");
        }
}));

CMDS.push(new Commande("history", function(){
        println(historyCMD.reduce(function(acc,val){return(acc+"\n"+val);}));
}));

CMDS.push(new Commande("mail", function(calledCMD){
        var re = / *mail +([\S]+) +([\S\s]+)/; 
        var res = calledCMD.match(re);
        if(res){
            //console.log(res);
            var to = res[1];
            var message = res[2];
            var from = currentComputer.name;
            sendMail(to,from,message);
            addLog("mailSending","A mail was send to "+to);
            checkProgression();
        }
        else{
            println("mail command arguments not reconized");
        }
}));

function sendMail(to,from,message,hide){
    var compFrom = GLOBALNETWORK.getComputerByName(from);
    var compTo = GLOBALNETWORK.getComputerByName(to);
    if(compFrom && compTo){
        //println("From and To Ok");
        var mailDir = compTo.rootFolder.getFileByName("mails");
        if(mailDir){ 
            var mail = new File("from_"+from);
            mail.setText(message);
            mailDir.addFile(mail);
            if(!hide){ println("message sent") };
        }
        else{ if(!hide){println("Receiver don't have email box") }; }
    }
    else{
        if(compFrom){ if(!hide){println("Adress invalid");} }
        else{ if(!hide){println("Problem with your adress");} }
    }
}

CMDS.push(new Commande("rm", function(calledCMD){
        var re = / *rm +([\S]+)/; 
        var res = calledCMD.match(re);
        if(res){
            
            var filename = res[1];
            println("remove "+filename);
            
            var file = currentComputer.currentDirectory.getFileByName(filename);
            if(file){
                currentComputer.currentDirectory.removeFile(file);
                addLog("remove","removed "+filename+"\n"+"command: "+calledCMD);
            }
            else{
                if(filename == "*"){
                    currentComputer.currentDirectory.clearFiles();
                }
                else{
                    println(filename+" not found");
                }
            }
        }
        else{
            println("Error in the rm command");
        }
}));

CMDS.push(new Commande("apt-get", function(){
        println("wanna install ?");
        addLog("aptGet","tried to install via apt-get");
        
}));

CMDS.push(new Commande("python", function(){
        println("wanna python ? Bro");
}));

CMDS.push(new Commande("ping", function(calledCMD){
        var re = / *ping +(\d{1,3}\.\d{1,3}.\d{1,3}.\d{1,3})/;
        var res = calledCMD.match(re);
        if(res){
            var ip = res[1];
            println("ping to "+ip);
            var computer = GLOBALNETWORK.getComputer(ip);
            if(computer){
                println("Found computer:");
                println("\t"+computer.name+" : "+computer.ip);
            }
            else{
                println(ip+" not found");
            }
        }
        else{
            println("ip not reconized");
        }
}));

var clear = function (){
    console.log("clear");
    var i = 0; 
    while(i<30){
        println("");
        i+=1;
    }
}
CMDS.push(new Commande("clear", clear));


CMDS.push(new Commande("shutdown", function(){
    println("trying to shutdown "+currentComputer.ip);
    if(currentComputer == GLOBALNETWORK.getMyComputer()){
        println("restarting self computer");
    }
    else{
        currentComputer.network.removeComputer(currentComputer);
    }
}));

CMDS.push(new Commande("cmds", function(){
    //println("trying to shutdown "+currentComputer.ip);
    println(CMDS.reduce(function(acc,val){return(acc + val.name+"\n");},""));
    CMDS.forEach(function(cmd){ console.log(cmd); });
}));


function storeFilesystem(){
    console.log (JSON.stringify( GLOBALNETWORK.toJson()));
    
    window.localStorage.setItem("saved",JSON.stringify( GLOBALNETWORK.toJson()));
    window.localStorage.setItem("progression",progression);
    console.log(window.localStorage);
}
CMDS.push(new Commande("store", function(){
   storeFilesystem();
    
}));




CMDS.push(new Commande("load", function(){
    loadGame();
}));

CMDS.push(new Commande("reset", function(){
    loadGame(true);
}));


CMDS.push(new Commande("avance", function(calledCMD){
    var re = / *avance +(\d*)/;
    var res = calledCMD.match(re);
    if(res){
        var n = parseInt(res[1]);
        avanceToProgression(n);
    } else{
        println("avance arguments not reconized");
    }
}));

CMDS.push(new Commande("notes", function(){
    document.getElementById("effectNote").hidden = false;
    notes.display();
}));

CMDS.push(new Commande("effects", function(){
    var effectsStandart = ["Map","Note"];
    var effectsIframe = [1,2,3,4,5,6,7,8];
    
    effectsIframe.forEach(function(e){
        openEffectIframe(e);
    });
    
    effectsStandart.forEach(function(e){
        openEffect(e);
    });
    
}));

function showWebNav(){
    
    $('#webNavModal').modal('show');  
    
    
    
    try{
        $('#webNavHTML').html(currentComputer.rootFolder.getFileByName("web").getFileByName("index.html").text); 
    }
    catch(e){
        $('#webNavHTML').text("Le serveur ne fonctionne pas");
        console.log(e);
    }
}
CMDS.push(new Commande("navWeb", showWebNav));


CMDS.push(new Commande("gedit", function(calledCMD){
    var re = / *gedit +([\S]+)/; 
    var res = calledCMD.match(re);
    var res = calledCMD.match(re);
    if(res){
        
        var filename = res[1];
        var file = currentComputer.currentDirectory.getFileByName(filename);
        if(file){
            if(!file.hasOwnProperty('files')){
                OPEN_GEDIT_FILE = file;
                document.getElementById("geditTitle").innerHTML = file.name;
                document.getElementById("geditTextArea").value = file.text;
                
                $('#geditModal').modal('show');
                
            }
            else{
                println("can't gedit a folder");
            }
        }
        else{
            println(filename+" not found");
        }
    }
    else{
        println("You have to specify a file to gedit");
    }
}));

function saveGeditFile(){
    var titre = OPEN_GEDIT_FILE.name;
    OPEN_GEDIT_FILE.setText(document.getElementById("geditTextArea").value);
    OPEN_GEDIT_FILE = null;
    
    var path = currentComputer.currentDirectory.pwd();
    if(path == "/"){path ="";}
    addLog("modifingFile","Saved File ("+path+"/"+titre+")");
}

var closeGeditFile = function(){
    var dialog = document.querySelector('dialog');
    dialog.close();
    $(".mdl-layout__obfuscator-right").removeClass("ob-active");
    //$(".mdl-dialog_gedit").addClass("active");
}



var helpCmd = function(){
        println("-------- Display Help --------");
        println("                              ");
        println("     Welcome in datTerm       ");
        println("   WIP Project by matEhickey  ");
        println("                              ");
        println("                              ");
        println(" pwd : view current directory ");
        println(" ls : display dir content     ");
        println(" cat : display file content   ");
        println(" cd : change directory        ");
        println(" echo : display the command   ");
        println(" clear : clear the console    ");
        println(" history : show last commands ");
        println(" mkdir : create a directory   ");
        println(" touch : create a file        ");
        println(" mail <user> <message> : send a mail ");
        println(" rm : remove a file           ");
        println(" gedit : text editor          ");
        println(" apt-get install <program> : install a program WIP");
        println(" cmds : display all cmds installed");
        println(" nmap : scan network          ");
        println(" shutdown : shutdown a computer   ");
        println(" ping : checking computer     ");
        println(" ssh : connect to a distant computer ");
        println(" man/help : display this help ");
        println("                              ");
        println("------------------------------");
};
CMDS.push(new Commande("help",helpCmd ));
CMDS.push(new Commande("man",helpCmd ));





//------------------------------------------------------------------------------

function kd(event){ //onkeydown
    //if(event.ctrlKey && event.key == "v") { return; }
    event.preventDefault();
    //console.log(event.key);
    
    if(!inputCMD.readOnly){
        switch(event.key.length) {
            case 1: //if simple char, put it on inputCMD, after the cursor
                if(event.ctrlKey == true){
                    keyCtrl(event);
                }
                else{
                    addKey(event.key);
                }
                break;
            default:// else, process it in traitementCMD
                traitementCMD(event);
        }
        
        actualiseInput();
    }
}

function actualiseInput(){
    //console.log(actualCMD);
    if(cursorPos > actualCMD.length) {cursorPos = actualCMD.length;}
    else if(cursorPos < 0) {cursorPos = 0;}
    inputCMD.innerHTML = actualCMD;
    inputCMD.selectionStart = inputCMD.selectionEnd = cursorPos;
}

function addKey(key){
    var l = actualCMD.length;
    var left = actualCMD.slice(0,cursorPos);
    var right = actualCMD.slice(cursorPos,l);
    actualCMD = left+key+right;
    cursorPos += 1;
}

function keyCtrl(event){
    //console.log(event);
    switch(event.key){
        case 'a':
            //println("go begin");
            cursorPos = 0;
            break;
        case 'e':
            //println("go ending");
            cursorPos = actualCMD.length;
            break;
        case 'c':
            //println("clear prompt");
            actualCMD = "";
            cursorPos = 0;
            break;
        case 'v':
            println("Right click and press copy");
            break;
        
        case '@':
            addKey("@");
            break;
        
    }
}

function onPasteHandler(e){
    e.preventDefault();
    
    var paste = e.clipboardData.getData('Text');
    //console.log(paste);
    
    var spl = paste.split('');
    spl.forEach(function(char_){
        //println(char_);
        addKey(char_);
    });
    actualiseInput();
}


function navigueHistory(add){
    if(historyCMD.length){
        historyPos += add;
        if(historyPos>=historyCMD.length){
            historyPos = historyCMD.length -1;
            actualCMD = historyCMD[historyPos];
            actualCMD = "";
        }
        else if(historyPos<0){
            historyPos = -1;
            actualCMD = "";
        }
        else{
            actualCMD = historyCMD[historyPos];
        }
        
        cursorPos = actualCMD.length;
    }
}

function traitementCMD(event){
    //traitement of the complex input event, as Enter, Backspace etc..
    //console.log(event.key);
    switch(event.key){
        case "Enter": 
            sendCMD();
            //check progression (mail in box, or file deleted etc..)
            break;
        case "ArrowLeft": 
            cursorPos -= 1;
            break;
        case "ArrowRight": 
            cursorPos += 1;
            break;
        case "ArrowUp": 
            navigueHistory(-1);
            break;
        case "ArrowDown": 
            navigueHistory(1);
            break;
            
        case "Backspace": //delete char before the caret
        
            var l = actualCMD.length;
            var caretPos = inputCMD.selectionStart;
            var left = actualCMD.slice(0,Math.max(caretPos-1,0));
            var right = actualCMD.slice(caretPos,l);
            //console.log(left);
            //console.log(right);
            actualCMD = left+right;
            cursorPos = caretPos-1;
            break;
            
            
        case "Tab":
            var begin = "";
            try{
                var caretPos = inputCMD.selectionStart;
                var str = actualCMD.slice(0,caretPos).split(" ");
                str = str[str.length-1];
                //println(str);
                begin = str;
            }
            catch(e){
                console.log(e);
            }
            
            //search in files
            var fileProbs = currentComputer.currentDirectory.files.filter(function(el){ 
                //filtrage nom commencant par begin
                var fileReduce = el.name.split("").slice(0,str.length).reduce(function(acc,val){return acc+val;},"");//mm taille
                //console.log(fileReduce);
                if(fileReduce == begin){
                    return(el);
                }
            });
            
            
            
            if(fileProbs.length == 1){
                var filename = fileProbs[0].name.split("");
                var filerest = filename.slice(begin.length,filename.length);
                filerest.push(" ");
                filerest.forEach(function(car){ addKey(car); });
                
                
            }else if(fileProbs.length == 0){
                //search in commands
                var cmdsProbs = CMDS.filter(function(el){ 
                    var cmdNameReduce = el.name.split("").slice(0,str.length).reduce(function(acc,val){return acc+val;},"");
                    //console.log(cmdNameReduce);
                    if(cmdNameReduce == begin){
                        return(el);
                    }
                    
                });
                //console.log(cmdsProbs);
                if(cmdsProbs.length == 1){
                    filename = cmdsProbs[0].name.split("");
                    filerest = filename.slice(begin.length,filename.length);
                    filerest.push(" ");
                    filerest.forEach(function(car){ addKey(car); });
                }
            }
            
            break;
    }
}


function sendCMD(){
    //when user press Enter, and the command is executed
    if(!currentComputer.waitFor){ 
        historyCMD.push(actualCMD);//store cmd in the history
        historyPos = historyCMD.length ;
        
        print(currentComputer.ip+":"+getNormalPrompt()+actualCMD);
        var cmds = actualCMD.split(";");//get the differents command contained in one (sequentially (;))
        //console.log(cmds);
        
        cmds.forEach(function(cmd){
                checkCMD(cmd);//check if the command exist, and execute it if found
        });
        if(!currentComputer.waitFor){
            showPrompt();
        }
        
        
    }
    else{
        var comp = currentComputer;
        switch(comp.waitFor){
            case "ssh": 
                comp.waitForFunction(actualCMD);//callback ensured by the ssh command
                break;
            default: println("Problem with wait for (no solution found)");
        }
        comp.waitFor = null;
        comp.waitForFunction = null;
    }
    
    actualCMD = "";
}

function addLog(name,contenu){
    try{
        var d = new Date();
        var titre = "log"+"_"+name;
        var text_ = d.getDay()+"/"+d.getMonth()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+"\n"+contenu;
        
        if(currentComputer.rootFolder.getFileByName("logs")){
            var logFile = true;
            var nom = null;
            var i = 0;
            while(logFile != null){
                nom = titre+i;
                logFile = currentComputer.rootFolder.getFileByName("logs").getFileByName(nom);
                i+=1;
            }
            currentComputer.rootFolder.getFileByName("logs").addFile(new File(nom,text_));
            console.log("stop to "+nom);
        }
    }
    catch(e){console.log(e);}
}

function checkCMD(command){
    
    var re = /^ *([\S]+)/;  //match any command, which is in the beggining of string, and contain one or more letter
    res = command.match(re)
    //console.log(res);
    if(res){
        var commandName = res[1];
        var found = false;
        CMDS.forEach(
            function(cmd){
                if(cmd.name == commandName){
                    //console.log(command);
                    
                    cmd.run(command);  //run the command if it the good one
                    found = true;
                }
            }
        );
        if(!found){println(commandName+":command not found");}  //else, display that the command is unknown
    }
}
