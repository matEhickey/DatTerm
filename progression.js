progression = 0;
function checkProgression(){
    //console.log("checkProgression "+progression);
    switch(progression){
        case 0: 
            //make sure kuzco have a mail with kuzcoNeededFile1
            var fileMail = GLOBALNETWORK.getComputerByName("kuzco").rootFolder.getFileByName("mails").getFileByName("from_myComputer");
            if(fileMail){
                //console.log(fileMail.text);
                //console.log(kuzcoNeededFile1);
                //console.log(fileMail.text == kuzcoNeededFile1);
                if(fileMail.text == GLOBALNETWORK.getMyComputer().rootFolder.getFileByName("tmp").getFileByName("sendMeThatFile.txt").text){
                    console.log("Progression 1 achieved");
                    progression += 1;
                    sendMail(GLOBALNETWORK.getMyComputer().name,"kuzco",
`
Well done buddy, I saw that you get the base to navigate through the filesystem.

Before starting real stuf, you need to be able to remove the logs from computer you explore.
Try to remove the log on you'r computer by typing "cd logs ; rm *".

Other thing, I think their is a hacker in your network, but in local, so I can't connect to him.
As you'r on the same network, you could scan it, find the hacker computer, and kick it. He is probably a noob, and he's password maybe the contructor one ("admin").
Send me a mail when you'r lonely on your personnal network !
`,true                   );
                }
            }
            break;
        case 1:
            //make sure noob hacker pc is outside the personnal network (shutdownded)
            if(!GLOBALNETWORK.getComputerByName("pr4nk573r")){
                console.log("Progression 2 achieved");
                progression += 1;
                sendMail(GLOBALNETWORK.getMyComputer().name,"kuzco",
`
Well done buddy, now you'r alone on your network,I could learn you a little more !
`,true);
            }
            break;
        default:
            println("Problem checking progression");
            println("That mean you probably ended the game");
    }
}

function avanceToProgression(prog){
    switch(prog){
        case 1:
            println("avance n1");
            avanceFirstNiveau();
            break;
        case 2:
            println("avance n2");
            avanceFirstNiveau();
            avanceSecondNiveau();
            break;
    }
    
}

function avanceFirstNiveau(){
    sendMail("kuzco",GLOBALNETWORK.getMyComputer().name,"I'm ready kuzco !",true);
    checkProgression();
}
function avanceSecondNiveau(){
    var prankster = GLOBALNETWORK.getComputer("144.155.30.200");
    if(prankster){
        prankster.network.removeComputer(prankster);
    }
    sendMail("kuzco",GLOBALNETWORK.getMyComputer().name,"",true);
    checkProgression();
}