function Game () {
  this.rootElement = document.createElement ('div');
  this.rootElement.id = "rootElement";
  this.rootElement.style.position = 'absolute';
  this.rootElement.style.width = 640+'px';
  this.rootElement.style.height = 480+'px';
}
/* Zobrazí rootElement v dokumente */
Game.prototype.show = function (){
  document.body.appendChild (this.rootElement);
};
/* Schová rootElement z dokumentu */
Game.prototype.hide = function (){
  document.body.removeChild (this.rootElement);
};