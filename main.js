$( document ).ready( function() {
    console.log("ready");
    
    actualCMD = "";
    cursorPos = 0;
    historyCMD = [];
    historyPos = -1;
    outputsCMD = [];
    
    myCopyPaste = null;

    inputCMD = document.getElementById("cmdInput");
    outputCMD = document.getElementById("cmdOutput");
    debugCMD = document.getElementById("debug");
    GLOBALNETWORK = new GlobalNetwork(); //GLOBAL
    loadGame();
    
    
    
    
    
    $('#webNavModal').draggable({
                  handle: ".modal-header"
              });
              
              $('#geditModal').draggable({
                  handle: ".modal-header"
              });
    
});

$( window ).on( "load", function() {
    console.log("loaded");
    

    //document.getElementById('browserAlert').hidden = isChrome;
    //document.getElementById("loadingModalTitle").hidden = !isChrome;
    
    
    
    
    setTimeout(function(){
        if(isChrome){
            
            //document.getElementById("main").hidden = false;
            
              
            $( "#loadingModal" ).fadeOut( "slow" );
            
            setTimeout(function(){
                $( "#main" ).fadeIn( "slow" );
                $('#loadingModal').modal('hide');
                //showWebNav();
                showPrompt();
                inputCMD.focus();
            },700);
            
            
        }
        else{
            
        }
        
    },400);
    


});



function onresize(){
    console.log("onresize");
    var height = $(window).height()
    if(height < 600){
        
    }
}

function lockTerm(){
    inputCMD.readOnly = true;
}
function releaseTerm(){
    inputCMD.readOnly = false;
}
function openEffect(name){
    document.getElementById("effect"+name).hidden = false;
}
function closeEffect(i){
    document.getElementById("effect"+i).hidden = true;
}

function openEffectIframe(name){
    document.getElementById("iframeEffect"+name).src = "effects/effect"+name+"/index.html";
    openEffect(name);
}
function closeEffectIframe(name){
    document.getElementById("iframeEffect"+name).src = "";
    closeEffect(name);
}

function print(str,prompt_){  //add a line in the output terminal, and specify to user that he can write down (>)
    outputsCMD.push(str);
    showPrompt(prompt_);
}

function println(str,prompt_){  //add a line in the output terminal, and specify to user that he can write down (>)
    print(str,prompt_);
}

function showPrompt(prompt_){
    var end = "";
    //console.log(prompt_);
    if(prompt_){
        end += prompt_;
    }
    else{
        end += currentComputer.ip+":"+getNormalPrompt();
    }
    outputCMD.innerHTML = outputsCMD.reduce(function(acc,val){return(acc+val+"\n");},"")+end;  //array repr split by \n, plus '>' at end
    outputCMD.scrollTop = outputCMD.scrollHeight;   //scroll back to bottom
}

function getNormalPrompt(){
    return currentComputer.currentDirectory.pwd()+">";
}


function debug(str){
    debugCMD.innerHTML += "\n"+str;
}




function initComputers(){  // never called, used for dev
    var myNetwork = new Network();
    var myPC = new Computer("myComputer","144.155.524.233",myNetwork,"mdp");
    initStandartComputer(myPC);
    var readme = new File("README");
    myPC.rootFolder.addFile(readme);
    
    readme.setText(`
        Hello, welcome in datTerm.

        You can view the help by typing \"help\" or \"man\" in the terminal.

        The game is about to begin, but before, I'll make sure you well understand the basic commands you'll need.

        You can view the name of the folder you'r in by typing \"pwd\".
        You can list the files in by typing \"ls\".
        You can see a file by typing \"cat \" -> ex: cat README

        You can view the MANUAL by typing \"man\", or \"help\".

        When you'r ready to begin the game, just send me an email filled with the content of the file \"/tmp/sendMeThatFile.txt\" 
        I'll responds to your mail box (<computer>/mails) as soon as  you send me that file.
        My name is kuzco, bye =)
    `);
    
    var toSendFile = new File("sendMeThatFile.txt");
    var kuzcoNeededFile1 = "I'm ready kuzco !";
    toSendFile.setText(kuzcoNeededFile1);
    var tmpFolder = myPC.rootFolder.getFileByName("tmp");
    if(tmpFolder){ tmpFolder.addFile(toSendFile) }
    
    
    
    var hackingNeighbour = new Computer("pr4nk573r","144.155.30.200",myNetwork,"admin");
    initStandartComputer(hackingNeighbour);
    
    var myDumpNeighbourNetwork = new Network();
    var myDumpNeighbourPC = new Computer("user1","1.2.3.4",myDumpNeighbourNetwork,"mdp");
    initStandartComputer(myDumpNeighbourPC);
    
    var kuzcoNetwork = new Network();
    var kuzcoPC = new Computer("kuzco","124.26.48.95",kuzcoNetwork,"mdp");
    initStandartComputer(kuzcoPC);
    
    
    GLOBALNETWORK.addNetwork(myDumpNeighbourNetwork);
    GLOBALNETWORK.addNetwork(myNetwork);
    GLOBALNETWORK.addNetwork(kuzcoNetwork);
    
    currentComputer = GLOBALNETWORK.getMyComputer(); //GLOBAL

}

function loadGame(reset){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
    var init = `{"GlobalNetwork":{"nets":[{"network":{"comps":[{"name":"user1","ip":"1.2.3.4","mdp":"mdp","rootFolder":{"folder":"/","files":[{"folder":"tmp","files":[{"file":"tmp1","text":"0.6914791499797186"},{"file":"tmp2","text":"0.34644155864990345"}]},{"folder":"mails","files":[]},{"folder":"sys","files":[{"folder":"boot","files":[]},{"folder":"data","files":[]},{"folder":"etc","files":[]},{"folder":"usr","files":[]},{"folder":"var","files":[]}]},{"folder":"logs","files":[]}]}}]}},{"network":{"comps":[{"name":"myComputer","ip":"144.155.524.233","mdp":"mdp","rootFolder":{"folder":"/","files":[{"folder":"tmp","files":[{"file":"tmp1","text":"0.9374491427197225"},{"file":"tmp2","text":"0.9999550790963128"},{"file":"sendMeThatFile.txt","text":"I'm ready kuzco !"}]},{"folder":"mails","files":[]},{"folder":"sys","files":[{"folder":"boot","files":[]},{"folder":"data","files":[]},{"folder":"etc","files":[]},{"folder":"usr","files":[]},{"folder":"var","files":[]}]},{"folder":"logs","files":[{"file":"log_modifingFile0","text":"2/1 23:9:23\\nSaved File (/web/index.html)"}]},{"file":"README","text":"Hello, welcome in datTerm.\\n\\nYou can view the help by typing \\\"help\\\" or \\\"man\\\" in the terminal.\\nThe game is about to begin, but before, I'll make sure you well understand the basic commands you'll need.\\n\\nYou can view the name of the folder you'r in by typing \\\"pwd\\\".\\nYou can list the files in by typing \\\"ls\\\".\\nYou can see a file by typing \\\"cat \\\" -> ex: cat README\\nYou can view the MANUAL by typing \\\"man\\\", or \\\"help\\\".\\n\\nWhen you'r ready to begin the game, just send me an email filled with the content of the file \\\"/tmp/sendMeThatFile.txt\\\"\\nI'll responds to your mail box (<computer>/mails) as soon as  you send me that file.\\n\\nAlso, my name is kuzco, bye =)"},{"folder":"web","files":[{"file":"index.html","text":"\\n<!DOCTYPE html>\\n<html lang=\\\"en\\\">\\n<head>\\n\\n</head>\\n<body>\\nHello in the web server application\\n</div>\\n</div>\\n\\n</body>\\n</html>\\n"}]}]}},{"name":"pr4nk573r","ip":"144.155.30.200","mdp":"admin","rootFolder":{"folder":"/","files":[{"folder":"tmp","files":[{"file":"tmp1","text":"0.2571366804991664"},{"file":"tmp2","text":"0.5421219127044794"}]},{"folder":"mails","files":[]},{"folder":"sys","files":[{"folder":"boot","files":[]},{"folder":"data","files":[]},{"folder":"etc","files":[]},{"folder":"usr","files":[]},{"folder":"var","files":[]}]},{"folder":"logs","files":[]}]}}]}},{"network":{"comps":[{"name":"kuzco","ip":"124.26.48.95","mdp":"mdp","rootFolder":{"folder":"/","files":[{"folder":"tmp","files":[{"file":"tmp1","text":"0.3856929955513957"},{"file":"tmp2","text":"0.19420347775928382"}]},{"folder":"mails","files":[]},{"folder":"sys","files":[{"folder":"boot","files":[]},{"folder":"data","files":[]},{"folder":"etc","files":[]},{"folder":"usr","files":[]},{"folder":"var","files":[]}]},{"folder":"logs","files":[]}]}}]}}]}}`;

    var saved = localStorage.getItem("saved");
    if(saved && !reset){
        var newGlobal = GlobalNetwork.fromJSON(saved);
        avanceToProgression(localStorage.getItem("progression"));
    }
    else{
        var newGlobal = GlobalNetwork.fromJSON(init);
        progression = 0;
    }
    
    notes = new AppliNotes();
    AppliNotes.addNote("Welcome to datTerm");
    AppliNotes.addNote("Try to type \"cat README\" ");
    
    GLOBALNETWORK = newGlobal;
    currentComputer = GLOBALNETWORK.getMyComputer();
}





