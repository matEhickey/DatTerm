function Sign(posx, posy) {
  this.x = posx;
  this.y = posy;
  this.letter;
  
  this.speed = int(random(2,6));
  this.charTiming = 3;
  
  this.initialize = function() {
    this.letter = this.randomChar();
  }

  this.update = function() {
    if (frameCount%this.charTiming == 0) {
      this.letter = this.randomChar();
    }
    
    this.y += this.speed;

    if (this.y >= height) {
      this.y *= 0;
    }
  }

  this.display = function() {
    textAlign(CENTER, CENTER);
    text(this.letter, this.x, this.y);
  }

  this.randomChar = function() {
    return String.fromCharCode(0x30A0 + round(random(96)));
  }
}