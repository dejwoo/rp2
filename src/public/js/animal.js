/*jshint esversion:6*/
"use strict";
const animalMixin = function () {
  const attrs = {};
  if (_.has(this, "power")) {
    if (typeof this.power == 'number') {
      attrs.power = this.power;
    }
    _.unset(this, "power");
  }
  if (_.has(this, "name")) {
    if (typeof this.name == 'string') {
      attrs.name = this.name;
    }
    _.unset(this, "name");
  }
  if (_.has(this, "avatar")) {
    if (typeof this.avatar == 'object') {
      if (_.has(this.avatar, "path") &&
        typeof this.avatar.path == 'string' &&
        _.has(this.avatar, "width") &&
        typeof this.avatar.width == 'number' &&
        _.has(this.avatar, "height") &&
        typeof this.avatar.height == 'number') {
        attrs.avatar = this.avatar;
    }
  }
  _.unset(this, "avatar");
  this.x = 0;
  this.y = 0;
}
return Object.assign(this, {
  info() {
    console.log(this);
  },
  setPower(value) {
    if (typeof value != 'number' || _.isUndefined(value)) {
      return undefined;
    }
    attrs.power = value;
    return attrs.power;
  },
  getPower() {
    if (typeof attrs.power == 'undefined') {
      return undefined;
    }
    return attrs.power;
  },
  setName(value) {
    if (_.isUndefined(value) || typeof value != 'string') {
      return undefined;
    }
    attrs.name = value;
    return attrs.name;
  },
  getName() {
    if (typeof attrs.name == 'undefined') {
      return undefined;
    }
    return attrs.name;
  },
  setId(value) {
    if (_.isUndefined(value)) {
      return undefined;
    }
    attrs.id = value;
    return attrs.id;
  },
  getId() {
    if (typeof attrs.id == 'undefined') {
      return undefined;
    }
    return attrs.id;
  },
  setAvatar(value) {
    if (_.isUndefined(value)) {
      return undefined;
    }
    if (typeof value != 'object' || _.isUndefined(value.path) ||
      _.isUndefined(value.width) || _.isUndefined(value.height) ||
      typeof value.path != 'string' ||
      typeof value.width != 'number' ||
      typeof value.height != 'number') {
      return undefined;
  }
  attrs.avatar = value;
  return attrs.avatar;
},
getAvatar() {
  if (typeof attrs.avatar == 'undefined') {
    return undefined;
  }
  return attrs.avatar;
},
reset() {
  for (let key in attrs) {
    if (attrs.hasOwnProperty(key)) {
      delete attrs[key];
    }
  }
},
choosen(x,y) {
  // console.log(x,y,this.x,this.y);
  var dx = x - this.x;
  var dy = y - this.y;
  // console.log(Math.sqrt (dx*dx + dy*dy), attrs.avatar.width);
  if (Math.sqrt (dx*dx + dy*dy)-30<= attrs.avatar.width) {
    return true;
  }
  else {
    return false;
  }
},
move(x,y) {
  this.x = x;
  this.y = y;
  this.rootElem.style.left = Math.round(this.x - attrs.avatar.width)+'px';
  this.rootElem.style.top = Math.round(this.y - attrs.avatar.height)+'px';
},
createDom(staticAnimal) {
  var self = this;
  if(_.isUndefined(this.rootElem)) {
    this.rootElem = document.createElement ('div');
    this.rootElem.style.width = attrs.avatar.width + 'px';
    this.rootElem.style.height = attrs.avatar.height + 'px';
    this.rootElem.style.borderRadius = '50%';
    this.rootElem.setAttribute ('draggable', 'false');
    this.rootElem.style.cursor = 'grab';
    this.rootElem.style.cursor = '-webkit-grab';
    this.rootElem.setAttribute('class', attrs.name+"Class");
    this.rootElem.setAttribute('id', "animal_" + attrs.name + "_" + attrs.id);
    if (!staticAnimal) {
      this.rootElem.style.position = "absolute";
      this.rootElem.addEventListener ('mousedown', function (e) {
        console.log("mousedown",self.choosen(e.pageX, e.pageY));
        if (self.choosen(e.pageX, e.pageY)) {
          var par = self.rootElem.parentNode;
          if (par && par.lastChild != self.rootElem) {
            par.appendChild (self.rootElem);
          }
          self.rootElem.style.cursor = 'grabbing';
          self.rootElem.style.cursor = '-webkit-grabbing';
          self.originalX = self.x;
          self.originalY = self.y;
          self.move(e.pageX+30,e.pageY+30);
          app.setAnimalDragging(self, self.x-e.pageX, self.y-e.pageY);
          e.preventDefault ();
          e.stopPropagation ();
        } else {
          app.checkOtherAnimalsOnMouseDown(e);
        }
      });
    } else {
      //todo osetrit creation level mode
      this.rootElem.addEventListener ('mousedown', function (e) {
        app.addAnotherAnimal(self.type, self.x, self.y,e);
        e.preventDefault();
        e.stopPropagation();
      });
    }
    if (_.has(attrs.avatar, "color")) {
      this.rootElem.style.backgroundColor = attrs.avatar.color;
    }
    if (! _.isUndefined(attrs.avatar.id)) {
      attrs.avatar.id = id;
      this.rootElem.id = id;
    }
    this.draw = SVG(this.rootElem);
    this.image = this.draw.use("Layer_1",attrs.avatar.path).size(attrs.avatar.width, attrs.avatar.height);
  }
},
resize(x,y) {
  attrs.avatar.width = x;
  attrs.avatar.height = x;
  this.image.size(x,y);
  this.rootElem.style.width = attrs.avatar.width + 'px';
  this.rootElem.style.height = attrs.avatar.height + 'px';
},
getDom() {
  return this.rootElem;
}});
  };

  const animalModel = (target) => animalMixin.call(target);

// const model = animalModel({});
// model.on('error', data => console.error(data));
// console.log(model.getPower());
// model.setPower('Sam');
// model.setPower(5);
// console.log(model.getPower());
// model.setPower(3);
// console.log(model.getPower());
/*
{
  prop: 'name',
  value: 'Sam'
}
*/