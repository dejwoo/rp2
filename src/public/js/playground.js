function Playground(config) {
	var self = this;
	_.forOwn(config, function(value,key) {
		self[key] = value;
	});
  this.rootElement = document.createElement ('div');
  this.rootElement.id = this.id;
  let textDiv = document.createElement('div');
  textDiv.id = this.id + "_text_div";
  textDiv.style.width = this.width + 'px';
  textDiv.style.position = "absolute";

  this.rootElement.appendChild(textDiv);
  this.rootElement.class = this.class;
  this.rootElement.style.width = this.width + 'px';
  this.rootElement.style.height = this.height + 'px';
  this.rootElement.style.float = 'left';
  this.rootElement.style.marginLeft = "10px";
  this.rootElement.addEventListener ('mouseup', function (e) {
    	console.log ('mouseup', e, this);
    	if (_.isUndefined(e.source)) {
    		return;
    	}
    	if (self.divider == 1) {
    		let animalId = "animal_" + e.source.getName() + "_" + e.source.getId()
    		self.addAnimal(animalId,undefined, e.source);
    	} else {
			  let avgHeight = Math.round((self.height-(self.divider-1)*10)/self.divider);
    		let groupId = Math.floor((e.pageY-self.height/9)/avgHeight);
    		if (groupId > self.groups.length-1 && e.pageY-self.height/9 < self.height ) {
    			groupId--;
    		}
    		console.log(groupId, avgHeight, self.height, e.pageY-self.height/9);
    		let animalId = "animal_" + e.source.getName() + "_" + e.source.getId()
    		self.addAnimal(animalId,groupId, e.source);
    	}
    	e.stopPropagation();
      e.preventDefault();
  	},true);
  if (this.divider == 1) {
  	this.name = "woods";
  	this.rootElement.class = "woods";
  	this.animals = _.isUndefined(this.animals) ? [] : this.animals;
  	this.animalsPower = 0;
  	this.rootElement.style.backgroundColor = this.colors[0];
  } else {
  	this.groups = [];
  	this.groupPower = [];
  	for (var i = 0; i < this.divider; i++) {
  		this.groups.push({});
  		this.groups[i].animals = [];
  		this.groups[i].dom = document.createElement('div');
  		this.groups[i].dom.id = this.id+"_group_"+i
  		this.groups[i].dom.style.width = this.width + 'px';
  		this.groups[i].dom.style.height = Math.round((this.height-(this.divider-1)*10)/this.divider) + 'px';
  		if (i != this.divider-1) {
  			this.groups[i].dom.style.marginBottom = 10 + "px";
  		}
  		this.groups[i].dom.style.backgroundColor = this.colors[i];
  		this.rootElement.appendChild(this.groups[i].dom);
  		this.groupPower.push(0);
  	}
  }
  if (_.isUndefined(this.animals)) {
  	this.animals = [];
  }
}
Playground.prototype.toggleName = function() {
  let textDiv = document.getElementById(this.id + "_text_div");
  let nadpis = document.querySelector("#" + this.id + "_text_div" + " h2");
  if (!nadpis) {
    nadpis = document.createElement('h2');
    if (this.divider == 1) {
      nadpis.innerHTML = "Woods"
    } else {
      nadpis.innerHTML = "Group of " + this.divider + "s";
    }
    nadpis.style.textAlign = "center";
    textDiv.insertBefore(nadpis, textDiv.firstChild);
  } else {
    nadpis.parentNode.removeChild(nadpis);
  }
}
Playground.prototype.togglePower = function() {
  let textDiv = document.getElementById(this.id + "_text_div");
  let sila = document.querySelector("#" + this.id + "_text_div" + " h3");
  if (!sila) {
    sila = document.createElement('h3');
    if (this.divider == 1) {
      sila.innerHTML = this.animalsPower;
    } else {
      sila.innerHTML = this.groupPower.toString();
    }
    sila.style.textAlign = "center";
    textDiv.appendChild(sila, textDiv.firstChild);
  } else {
    sila.parentNode.removeChild(sila);
  }
}

Playground.prototype.getDom = function (){
  return this.rootElement;
};
Playground.prototype.isBalanced = function() {
	var self = this;
  if (this.divider == 1) {
    for (var index = 0; index < this.animals.length; index++) {
      if (this.animals[index] != undefined) {
        return false
      }
    }
    return true
  } else {
    var constantPower = this.groupPower[0];
    if (constantPower == 0) {
      return false;
    }
    for (var index = 0; index < this.groupPower.length; index++) {
      if (this.groupPower[index] != constantPower) {
        return false
      }
    }
    return true
  }
}
Playground.prototype.createAnimals = function (){
  var self = this;
  if (this.divider == 1) {
    let animalsToCreate = this.animals;
    this.animals = [];
    let xPos = 0,yPos = 0, el;
    el = this.rootElement;
    while(el) {
      xPos += (el.offsetLeft + el.clientLeft);
      yPos += (el.offsetTop  + el.clientTop);
      el = el.offsetParent;
    }
    _.forEach(animalsToCreate, function(value,key) {
      let animaltoAdd;
      let randPosX = Math.random()*(self.width-60)+xPos+60;
      let randPosY = Math.random()*(self.height-60)+yPos+60;
      if (_.isUndefined(value.x) || _.isUndefined(value.y)) {
        animalToAdd = app.addAnimal(value.type,randPosX,randPosY);
      } else {
        animalToAdd = app.addAnimal(value.type,value.x,value.y);
      }
      console.log("playground.createAnimal", animalToAdd);
      self.addAnimal("animal_" + animalToAdd.getName() + "_" + animalToAdd.getId(), undefined, animalToAdd);
    });
  } else {
    let animalsToCreate = this.animals;
    this.animals = [];
    _.forEach(animalsToCreate, function(value,key) {
      let xPos = 0,yPos = 0, el;
      let groupId = value.groupIndex;
      if (groupId > self.groups.length) {
        return
      }
      el = self.groups[groupId].dom;
      while(el) {
        xPos += (el.offsetLeft + el.clientLeft);
        yPos += (el.offsetTop  + el.clientTop);
        el = el.offsetParent;
      }
      let animaltoAdd;
      let avgHeight = Math.round((self.height-(self.divider-1)*10)/self.divider);
      let randPosX = Math.random()*(self.width-60)+xPos+60;
      let randPosY = Math.random()*(avgHeight-60)+yPos+60;
      if (_.isUndefined(value.x) || _.isUndefined(value.y)) {
        animalToAdd = app.addAnimal(value.type,randPosX,randPosY);
      } else {
        animalToAdd = app.addAnimal(value.type,value.x,value.y);
      }
      console.log("playground.createAnimal", animalToAdd);
      self.addAnimal("animal_" + animalToAdd.getName() + "_" + animalToAdd.getId(), groupId, animalToAdd);
    });
  }
}
Playground.prototype.addAnimal = function (animalId,groupIndex,animal){
	console.log(this.groups, animalId,groupIndex);
	let targetAnimalDom = document.getElementById(animalId);
	let targetGroupId;
	if (_.isUndefined(groupIndex) && this.divider == 1) {
  	targetGroupId = this.rootElement.id;
  	if (_.findIndex(this.animals, _.matches(animal)) == -1) {
  		this.animals.push(animal);
			this.animalsPower +=  animal.getPower();
      let sila = document.querySelector("#" + this.id + "_text_div" + " h3");
      if (sila) { sila.innerHTML = this.animalsPower; }
			animal.belongs = {"playground":this.id, "group":undefined, "index":this.animals.length-1};
			console.log("POWER", animal, animal.getPower());
  	}
  	console.log("w", this.animals, this.animalsPower);
	} else {
  	targetGroupId = this.groups[groupIndex].dom.id;
  	if (_.findIndex(this.groups[groupIndex].animals, _.matches(animal)) == -1) {
  		this.groups[groupIndex].animals.push(animal);
			this.groupPower[groupIndex] +=  animal.getPower();
      let sila = document.querySelector("#" + this.id + "_text_div" + " h3");
      if (sila) { sila.innerHTML = this.groupPower.toString(); }
			animal.belongs = {"playground":this.id, "group":groupIndex, "index":this.groups[groupIndex].animals.length-1};
		}
  	console.log("g", this.groups[groupIndex].animals, this.groupPower[groupIndex]);
	}
  let targetGroupDom = document.getElementById(targetGroupId);
  targetGroupDom.appendChild(targetAnimalDom);
};
Playground.prototype.getState = function (){
  if (this.divider == 1) {
    let animalsToReturn = [];
    _.forEach(this.animals, function(value,key) {
      if (_.isUndefined(value)) {
        return;
      }
      let animalObject = {};
      // console.log(value);
      animalObject.type = value.type;
      animalObject.x = value.x;
      animalObject.y = value.y;
      animalsToReturn.push(animalObject);
    });
    return {
      "divider": this.divider,
      "id": this.id,
      "colors": this.colors,
      "animals": animalsToReturn
    }
  } else {
    let animalsToReturn = [];
    for (var index = 0; index < this.groups.length; index++) {
      console.log("i", index);
      _.forEach(this.groups[index].animals, function(value,key) {
        if (_.isUndefined(value)) {
          return;
        }
        let animalObject = {};
        console.log(value);
        animalObject.type = value.type;
        animalObject.x = value.x;
        animalObject.y = value.y;
        animalObject.groupIndex = index;
        animalsToReturn.push(animalObject);
      });
    }
    return {
      "divider": this.divider,
      "id": this.id,
      "colors": this.colors,
      "animals": animalsToReturn
    }
  }
}

Playground.prototype.removeAnimal = function (belongs){
	console.log(belongs, this.animals);
	if (_.isUndefined(belongs.group)) {
		let animalToRemove = this.animals[belongs.index];
		this.animalsPower -= animalToRemove.getPower();
		delete this.animals[belongs.index];
    let sila = document.querySelector("#" + this.id + "_text_div" + " h3");
    if (sila) { sila.innerHTML = this.animalsPower; }
	} else {
		let animalToRemove = this.groups[belongs.group].animals[belongs.index];
		this.groupPower[belongs.group] -= animalToRemove.getPower();
		delete this.groups[belongs.group].animals[belongs.index]
    let sila = document.querySelector("#" + this.id + "_text_div" + " h3");
    if (sila) { sila.innerHTML = this.groupPower.toString(); }
	}
}

