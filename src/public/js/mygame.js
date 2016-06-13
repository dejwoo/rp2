/* Konštruktor, ktorý vytvoríte a zdedí vlastnosti triedy Game.*/
function myGame (cfg) {
  Game.call (this);
  /* Hra sa vytvorí podľa konfigurácie v objekte cfg.
     cfg bude externe uložené v JSON formáte v databáze a tak v ňom posúvate iba dáta.
     */
  let self = this;
  this.animals = [];
  this.animalCounter = {};
  this.animalTypes = {};
  this.playgrounds = [];
  this.cheatModeIndex = 0;
  this.godMode = false;
  this.getJSON();

  document.addEventListener ('keypress', function (e) {
    let keyPressed = e.which || e.keyCode;
    keyPressed = String.fromCharCode(keyPressed);
    // console.log("KEYPRESS", keyPressed, self.cheat[self.cheatModeIndex],self.cheat[self.cheatModeIndex] == keyPressed );
    if (keyPressed == self.cheat[self.cheatModeIndex]) {
      if (self.cheatModeIndex == self.cheat.length-1) {
        self.godMode = self.godMode ? false : true;
        if (self.godMode) {
          console.log("GOD MODE!");
        } else {
          console.log("GOD DOES NOT EXIST!");
        }
        self.cheatModeIndex=0;
        return;
      }
      self.cheatModeIndex++
    } else {
      self.cheatModeIndex=0;
    }
  });
  document.addEventListener ('mousemove', function (e) {
    if (self.animalDragging) {
      self.animalDragging.move(e.pageX + self.animalX, e.pageY + self.animalY);
      // Dalsie spracovanie udalosti sa zrusi.
      e.preventDefault ();
      e.stopPropagation ();
    }
  }, true);
  document.addEventListener ('mouseup', function (e) {//{{{
    if (self.animalDragging) {
      console.log("animal_" + self.animalDragging.getName() + "_" + self.animalDragging.getId());
      self.animalDragging.rootElem.style.cursor = 'grab';
      self.animalDragging.rootElem.style.cursor = '-webkit-grab';
      let avgWidth = Math.round((self.width*0.75-self.playgrounds.length*10)/self.playgrounds.length);
      if (Math.floor(e.pageX/avgWidth) > 0 && 
        Math.floor(e.pageX/avgWidth)-1 < self.playgrounds.length &&
        e.pageY < self.height &&
        e.pageY > self.height*0.1) {

        var ev = new MouseEvent ('mouseup', e);
        ev.source = self.animalDragging;
        if (_.has(self.animalDragging, "belongs")) {
          let targetPlayground = _.find(self.playgrounds, _.matches({"id":self.animalDragging.belongs.playground}));
          targetPlayground.removeAnimal(self.animalDragging.belongs);
        }
        var destinatedPlayeground = self.playgrounds[Math.floor(e.pageX/avgWidth)-1];
        var el = document.getElementById(destinatedPlayeground.id);
        self.animalX = self.animalY = 0;
        self.animalDragging = null;
        el.dispatchEvent(ev);
      } else {
        if (self.godMode) {
          if (_.has(self.animalDragging, "belongs")) {
            let targetPlayground = _.find(self.playgrounds, _.matches({"id":self.animalDragging.belongs.playground}));
            targetPlayground.removeAnimal(self.animalDragging.belongs);
          }
          let targetAnimal = document.getElementById("animal_" + self.animalDragging.getName() + "_" + self.animalDragging.getId());
          targetAnimal.parentElement.removeChild(targetAnimal);
        } else {
          self.animalDragging.move(self.animalDragging.originalX, self.animalDragging.originalY);
        }
      }
      self.animalX = self.animalY = 0;
      self.animalDragging = null;
      e.stopPropagation();
      e.preventDefault();
      self.checkWin();
    }
  },false);
}

/* Vytvorenie prototypu.*/
//function Tmp(){}; Tmp.prototype = Game.prototype; myGame.prototype = new Tmp();
myGame.prototype = Object.create(Game.prototype);
myGame.prototype.constructor = Game;

/* Zavolá sa, ak sa zmení veľkosť rootElementu. */
myGame.prototype.resize = function() {
  return;
}
myGame.prototype.setAnimalDragging = function(animal, x, y) {
  if (_.isUndefined(animal)) {
    return;
  }
  this.animalDragging = animal;
  this.animalX = x;
  this.animalY = y;
}
myGame.prototype.addAnimal = function(type,x,y) {
  if (_.has(this.animalTypes, type)) {
    let newAnimal = Object.assign({}, this.animalTypes[type]);
    animalModel(newAnimal);
    if (_.isUndefined(this.animalCounter[type])) {
      this.animalCounter[type] = 0;
    }
    newAnimal.setId(this.animalCounter[type]++);
    newAnimal.createDom();
    newAnimal.move(x,y);
    try {
      this.animals.push(newAnimal);
      this.rootElement.appendChild(newAnimal.getDom());
    } catch (err) {
      console.error(err);
    }
    console.log("myGame.prototype.addAnimal", newAnimal);
    return newAnimal;
  }
}
myGame.prototype.togglePlaygroundNames = function() {
  this.gameState.toggledNames = this.gameState.toggledNames ? false : true;
  _.forEach(this.playgrounds, function(value, key) {
    value.toggleName();
  });
}
myGame.prototype.togglePlaygroundPowers = function() {
  this.gameState.toggledPowers = this.gameState.toggledPowers ? false : true;
  _.forEach(this.playgrounds, function(value, key) {
    value.togglePower();
  });
}
myGame.prototype.selectLevel = function(dom) {
  let choosenLevel = dom.value;
  if (choosenLevel == this.currentLevel) {
    return;
  }
  let levelsDiv = document.getElementById('rootElement');
  while(levelsDiv.firstChild) {
    levelsDiv.removeChild(levelsDiv.firstChild);
  }
  this.gameState.currentLevel = choosenLevel;
  this.setState(this.gameState);
  console.log(dom.value, this.currentLevel);
}
myGame.prototype.createMenu = function() {
  var self = this;
  let mainDiv = document.createElement('div');
  mainDiv.id = 'idMenu';
  let rightDiv = document.createElement('div');
  rightDiv.id = "idControlPanel"

  let leftDiv = document.createElement('div');
  leftDiv.id = "idControlPanel"

  let saveGameButton = document.createElement('button');
  saveGameButton.innerHTML = "Ulož hru";
  saveGameButton.setAttribute("onClick", "saveGame();");
  saveGameButton.style.marginLeft = "1em";
  saveGameButton.style.marginRight = "1em";
  let loadGameButton = document.createElement('button');
  loadGameButton.innerHTML = "Načítaj hru";
  loadGameButton.setAttribute("onClick", "app.loadSavedLevel();");
  let toggleNameCheckboxLabel = document.createElement('label');
  toggleNameCheckboxLabel.setAttribute("for", "idToggleName");
  toggleNameCheckboxLabel.innerHTML = "Zobraz nazvy ihrisk:"
  toggleNameCheckboxLabel.style.marginRight = "1em";
  let toggleNameCheckbox = document.createElement('input');
  toggleNameCheckbox.setAttribute("type", "checkbox");
  toggleNameCheckbox.checked = this.gameState.toggledNames ? true : false;
  toggleNameCheckbox.id = "idToggleName";
  toggleNameCheckbox.style.marginRight = "2em";
  toggleNameCheckbox.setAttribute("onChange", "app.togglePlaygroundNames()");

  let togglePowerCheckboxLabel = document.createElement('label');
  togglePowerCheckboxLabel.setAttribute("for", "idTogglePower");
  togglePowerCheckboxLabel.innerHTML = "Zobraz silu ihrisk:"
  togglePowerCheckboxLabel.style.marginRight = "1em";
  let togglePowerCheckbox = document.createElement('input');
  togglePowerCheckbox.setAttribute("type", "checkbox");
  togglePowerCheckbox.checked = this.gameState.toggledPowers ? true : false;
  togglePowerCheckbox.id = "idTogglePower";
  togglePowerCheckbox.style.marginRight = "2em";
  togglePowerCheckbox.setAttribute("onChange", "app.togglePlaygroundPowers()");

  let levelsComboBoxLabel = document.createElement('label');
  levelsComboBoxLabel.setAttribute("for", "idChooseLevel");
  levelsComboBoxLabel.innerHTML = "Vyber si level:"
  levelsComboBoxLabel.style.marginRight = "1em";
  let levelsComboBox = document.createElement('select');
  levelsComboBox.id = "idChooseLevel";
  levelsComboBox.setAttribute("onChange", "app.selectLevel(this)");
  _.forEach(this.levels, function(value,key) {
    let levelOption = document.createElement('option');
    levelOption.value = key;
    levelOption.innerHTML = _.isUndefined(value.name) ? "Level " + key : value.name;
    levelsComboBox.appendChild(levelOption);
  });
  levelsComboBox.selectedIndex = ""+this.currentLevel;
  mainDiv.style.height = "10%";
  let nadpis = document.createElement('h1');
  nadpis.innerHTML = "Zvieratká Deda Lesoňa"
  nadpis.style.textAlign = "center";
  nadpis.style.marginTop = 0;
  rightDiv.style.float = "right";
  leftDiv.style.float = "left";
  mainDiv.appendChild(nadpis);
  leftDiv.appendChild(saveGameButton);
  leftDiv.appendChild(loadGameButton);
  rightDiv.appendChild(toggleNameCheckboxLabel);
  rightDiv.appendChild(toggleNameCheckbox);
  rightDiv.appendChild(togglePowerCheckboxLabel);
  rightDiv.appendChild(togglePowerCheckbox);
  rightDiv.appendChild(levelsComboBoxLabel);
  rightDiv.appendChild(levelsComboBox);
  mainDiv.appendChild(leftDiv);
  mainDiv.appendChild(rightDiv);
  self.rootElement.appendChild(mainDiv);
}
myGame.prototype.createLegend = function() {
  var self = this;
  let mainDiv = document.createElement('div');
  let mainUl = document.createElement('ul');
  _.forOwn(this.animalLegend, function(value,key) {
    // if (! _.includes(self.levels[self.currentLevel].allowedAnimals, key)) {
    //   console.log("OUT:", key);
    //   return;
    // }
    let animalLi = document.createElement('li');
    //key animal creation
    let newAnimal = Object.assign({}, self.animalTypes[key]);
    let minVal = Math.min(self.width, self.height);
    newAnimal.avatar.width = Math.round(minVal/16);
    newAnimal.avatar.height = Math.round(minVal/16);
    animalModel(newAnimal);
    newAnimal.createDom(true);
    animalLi.appendChild(newAnimal.getDom());
    animalLi.style.display = "inline-flex";
    animalLi.style.width = self.width*0.25 + "px";
    animalLi.style.listStyleType = "none";
    animalLi.style.textAlign = "center";
    let eq = document.createElement('p');
    eq.innerHTML = "=>";
    eq.style.marginTop="auto";
    eq.style.marginBottom="auto";
    eq.draggable = false;
    eq.style.marginLeft = "10px";
    eq.style.marginRight = "10px";
    animalLi.appendChild(eq);
    mainUl.appendChild(animalLi);
    _.forEach(self.animalLegend[key], function(value, index) {
      for (var index = 0; index < value.multiplier; index++) {
        let newAnimal1 = Object.assign({}, self.animalTypes[value.animal]);
        newAnimal1.avatar.width = Math.round(minVal/16);
        newAnimal1.avatar.height = Math.round(minVal/16);
        animalModel(newAnimal1);
        newAnimal1.createDom(true);
        animalLi.appendChild(newAnimal1.getDom());
      }
    })
  });
  mainUl.style.display = "block";
  mainUl.style.width = self.width*0.25 + "px";
  mainUl.style.padding = "0";
  mainUl.draggable = false;
  mainUl.style.height = this.rootElement.style.height;
  let nadpis = document.createElement('h2');
  nadpis.innerHTML = "Legenda"
  nadpis.style.textAlign = "center";
  mainDiv.appendChild(nadpis);
  mainDiv.id = "idLegend";
  mainDiv.draggable = false;
  mainDiv.style.backgroundColor = "cornsilk";
  mainDiv.appendChild(mainUl);
  mainDiv.style.float = "left";
  mainDiv.style.width = "25%";
  mainDiv.style.height = Math.round(self.height*0.90) + 'px';
  this.rootElement.appendChild(mainDiv);

}
myGame.prototype.addAnotherAnimal = function(type,x,y,e) {
  console.log(this.godMode);
  if (this.godMode) {
    this.addAnimal(type,e.pageX+30,e.pageY+30);
    this.setAnimalDragging(_.last(this.animals),x+30, y+30);
  }
}
myGame.prototype.checkOtherAnimalsOnMouseDown = function(e) {
  var el, i, ball, ev;
  for (var index = 0 ; index < this.animals.length; index++) {
    if (this.animals[index].choosen(e.clientX, e.clientY)) {
      var ev = new MouseEvent ('mousedown', e);
      var el = document.getElementById(this.animals[index].getId());
      el.dispatchEvent(ev);
      e.stopPropagation();
      e.preventDefault();
      break;
    }
  }
}
myGame.prototype.createLevel = function(index, saved) {
  if (_.isUndefined(saved) && 0 > index && index > this.levels.length) {
    console.error("myGame.prototype.createLevel: index out of bounds");
  }
  let mainDiv = document.createElement('div');
  mainDiv.id = "idPlaygrounds"
  var levelObjArray = _.isUndefined(saved) ? this.levels[index] : this.gameState.savedLevel;
  var self = this;
  _.forEach(levelObjArray.playgrounds, function(value,key) {
    value.width = Math.round((self.width*0.75-levelObjArray.playgrounds.length*10)/levelObjArray.playgrounds.length);
    value.height = Math.round(self.height*0.90);
    var newPlayground = new Playground(value);
    self.playgrounds.push(newPlayground);
    mainDiv.appendChild(newPlayground.getDom());
  });
  self.rootElement.appendChild(mainDiv);
  _.forEach(self.playgrounds, function(o) {
    o.createAnimals();
  })
}
myGame.prototype.checkWin = function() {
  var self = this;
  for (var index = 0; index < this.playgrounds.length; index++) {
    if (this.playgrounds[index].isBalanced() == false) {
      console.log("CHECKWIN NO",this.playgrounds[index].isBalanced());
      return;
    }
  };
  if (this.currentLevel < this.levels.length-1) {
    console.log("CHECKWIN NEXT");
    let levelsDiv = document.getElementById('rootElement');
    while(levelsDiv.firstChild) {
      levelsDiv.removeChild(levelsDiv.firstChild);
    }
    this.gameState.currentLevel++;
    this.setState(this.gameState);
  } else {
    let mainDiv = document.createElement('div');
    mainDiv.id = "winner";
    let winDiv = document.createElement('div');
    let winNapis = document.createElement('h1');
    winNapis.innerHTML = "Vyhral si!";
    winNapis.style.textAlign = "center";
    winDiv.appendChild(winNapis);
    mainDiv.style.position = "absolute";
    mainDiv.style.top = "25%";
    mainDiv.style.right = 0;
    mainDiv.style.bottom = 0;
    mainDiv.style.left = 0;
    mainDiv.style.zIndex = 99999;
    let playDiv = document.getElementById('idPlaygrounds');
    playDiv.style.zIndex = 1;
    playDiv.style.filter = "blur(5px)";
    playDiv.style.webkitFilter = "blur(5px)";
    winDiv.style.width = Math.round(this.width/2)+"px";
    winDiv.style.position = "relative";
    winDiv.style.margin = "10% auto";
    mainDiv.appendChild(winDiv);
    document.body.appendChild(mainDiv);
    console.log("VYHRAL SI");
  }
}
myGame.prototype.getJSON = function() {
  var self = this;
  var http_request = new XMLHttpRequest();
  try{
    // Opera 8.0+, Firefox, Chrome, Safari
    http_request = new XMLHttpRequest();
  }catch (e){
   // Internet Explorer Browsers
    try{
      http_request = new ActiveXObject("Msxml2.XMLHTTP");
    }catch (e) {
      try{
        http_request = new ActiveXObject("Microsoft.XMLHTTP");
      }catch (e){
       // Something went wrong
       alert("Your browser broke!");
       return false;
      }
    }
  }

  http_request.onreadystatechange = function(){
    if (http_request.readyState == 4  ){
      // Javascript function JSON.parse to parse JSON data
      var jsonObj = JSON.parse(http_request.responseText);
      self.setState(jsonObj);
    } else {
      console.log(http_request.responseText);
    }
  }
  http_request.open("GET", "/configuration", true);
  http_request.send();
}
myGame.prototype.loadSavedLevel = function () {
  let levelsDiv = document.getElementById('rootElement');
  while(levelsDiv.firstChild) {
    levelsDiv.removeChild(levelsDiv.firstChild);
  }
  this.setState(this.gameState, true);

}
/* Nastaví situáciu hry podľa (JSON) objektu. */
myGame.prototype.setState = function (gameState, fromSave) {
  this.animals = [];
  this.animalCounter = {};
  this.animalTypes = {};
  this.playgrounds = [];
  let winDiv = document.getElementById('winner');
  if (winDiv) {
    winDiv.parentNode.removeChild(winDiv);
  }
  //todo reset
  this.gameState = gameState;
  this.width = gameState.width;
  this.height = gameState.height;
  this.rootElement.style.position = 'absolute';
  this.rootElement.style.width = this.width+'px';
  this.rootElement.style.height = this.height+'px';
  this.animalPowers = gameState.animalPowers;
  this.animalTypes = gameState.animalTypes;
  this.animalLegend = gameState.animalLegend;
  this.levels = gameState.levels;
  this.savedLevel = gameState.savedLevel;
  this.currentLevel = fromSave ? this.savedLevel.currentLevel : gameState.currentLevel;
  this.cheat = gameState.cheat;
  this.createMenu();
  this.createLegend();
  if (fromSave) {
    this.createLevel(-1, true);
  } else {
    this.createLevel(this.currentLevel);
  }
  if (gameState.toggledPowers || (fromSave && this.savedLevel.toggledPowers)) {
    this.togglePlaygroundPowers();
    this.gameState.toggledPowers = true;
  }
  if (gameState.toggledNames || (fromSave && this.savedLevel.toggledNames)) {
    this.togglePlaygroundNames();
    this.gameState.toggledNames = true;

  }
}
/* Vráti situáciu hry ako (JSON) objekt. */
myGame.prototype.getState = function () {
  let gameState = this.gameState;
  gameState.currentLevel = this.currentLevel;
  let savedLevel = {};
  savedLevel.playgrounds = [];
  _.forEach(this.playgrounds, function(value,key) {
    savedLevel.playgrounds.push(value.getState());
  });
  savedLevel.name = this.levels[this.currentLevel].name;
  savedLevel.toggledPowers = this.gameState.toggledPowers;
  savedLevel.toggledNames = this.gameState.toggledNames;
  savedLevel.currentLevel = this.gameState.currentLevel;
  gameState.savedLevel  = savedLevel;
  this.gameState.savedLevel = gameState.savedLevel;
  gameState.currentLevel = 0;
  return gameState}

myGame.prototype.start = function () {};
myGame.prototype.stop = function () {};

/* Samostatná funkcia na výpočet skóre, ktorá bude využitá aj na strane servera.*/
function computeScore (cfg, gameState) {
  /* Vrati reálne číslo z intervalu <0,100> t.j. percentuálnu úspešnosť. */
  /* Prípadne -1 ak skóre ešte nemožno spočítať. */
}