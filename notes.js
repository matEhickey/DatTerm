class AppliNotes{
    constructor(notes = []) {
        this.notes = notes;
        this.domComponent = document.getElementById("listNotes");
        this.display();
    }
    
    display(){
        var chaine = "";
        this.notes.forEach(function(note){
            chaine += note.toHTML();
        });
        this.domComponent.innerHTML = chaine;
    }
    
    static addNote(txt){
        var value = null;
        
        if(txt){value = txt;}
        else{ 
            var input = document.getElementById("AppliNote_input")
            value = input.value; 
            input.value = "";
        }
        
        notes.notes.push(new Note(value)); //    global object
        
        notes.display();
    }
    
    static deleteNote(n){
        var i = 0;
        var res = null;
        notes.notes.forEach(function(note){
            if(note.num == n){
                res = i;
            }
            i+=1;
        });
        
        notes.notes.splice(res,1);
        notes.display();
    }
}

class Note{
    
    constructor(text) {
        
        if(text){this.text = text;}
        else{ this.text = "Note"+Note.n; }
        
        this.num = Note.n;
        Note.n += 1;
    }
    
    toHTML(){
        return("<li><button class='btn btn-primary btn-sm' onclick='AppliNotes.deleteNote("+this.num+")'><i class=\"fa fa-times\" aria-hidden=\"true\"></i></button> - "+this.text+"</li>");
    }
}

Note.n = 0;