var assert = require('chai').assert;
var animalModel = require('../animal');
describe('Animal', function() {
  describe('#setPower(value)', function () {
  	let animal = animalModel({});
    it('should return undefined when the value is not number', function () {
      assert.equal(undefined, animal.setPower());
      assert.equal(undefined, animal.setPower({"a":1}));
      assert.equal(undefined, animal.setPower([1,2]));
      assert.equal(undefined, animal.setPower(["1"]));
      assert.equal(undefined, animal.setPower('a'));
      assert.equal(undefined, animal.setPower("test"));
    });
    it('should return correct value of power when value is a number', function() {
    	assert.equal(5, animal.setPower(5));
    	assert.equal(50, animal.setPower(50));
    	assert.equal(500, animal.setPower(500));
    	assert.equal(500.5, animal.setPower(500.5));
    })
  });
  describe('#getPower()', function() {
  	let animal = animalModel({});
  	it('should return undefined when the power value is not set', function() {
  		assert.equal(undefined, animal.getPower());
  	});
  	it('should return correct value after setting power', function() {
  		animal.setPower(5)
  		assert.equal(5, animal.getPower());
  		animal.setPower(500)
  		assert.equal(500, animal.getPower());
  	});
  });
  describe('#implicit power attr from creation', function() {
  	it('should return undefined when the power value is NOT a number in object creation', function() {
  		let animal = animalModel({"power":"lala"});
  		assert.equal(undefined, animal.getPower());
  		animal = animalModel({"power":[]});
  		assert.equal(undefined, animal.getPower());
  		animal = animalModel({"power":{}});
  		assert.equal(undefined, animal.getPower());
  	});
  	it('should return correct value when the power value is a number in object creation', function() {
  		let animal = animalModel({"power":5});
  		assert.equal(5, animal.getPower());
  		animal = animalModel({"power":50});
  		assert.equal(50, animal.getPower());
  		animal = animalModel({"power":500});
  		assert.equal(500, animal.getPower());
  		animal = animalModel({"power":500.5});
  		assert.equal(500.5, animal.getPower());
  	});
  });
  describe('#setName()', function() {
  	let animal = animalModel({});
  	it('should return undefined when the name value is empty or wrong type', function() {
  		assert.equal(undefined, animal.setName());
  		assert.equal(undefined, animal.setName(5));
  		assert.equal(undefined, animal.setName([]));
  		assert.equal(undefined, animal.setName({}));
  	});
  	it('should return correct value after setting name', function() {
  		animal.setName("Cat")
  		assert.equal("Cat", animal.getName());
  		animal.setName("Cow")
  		assert.equal("Cow", animal.getName());
  	});
  });
  describe('#getName()', function() {
  	let animal = animalModel({});
  	it('should return undefined when the name value is not set', function() {
  		assert.equal(undefined, animal.getName());
  	});
  	it('should return correct value after setting name', function() {
  		animal.setName("Cat");
  		assert.equal("Cat", animal.getName());
  		animal.setName("Cow");
  		assert.equal("Cow", animal.getName());
  	});
  });
   describe('#implicit name attr from creation', function() {
  	it('should return undefined when the name value is NOT a string in object creation', function() {
  		let animal = animalModel({"name":132});
  		assert.equal(undefined, animal.getPower());
  		animal = animalModel({"name":[]});
  		assert.equal(undefined, animal.getPower());
  		animal = animalModel({"name":{}});
  		assert.equal(undefined, animal.getPower());
  	});
  	it('should return correct value when the name value is a string in object creation', function() {
  		let animal = animalModel({"name":"5"});
  		assert.equal("5", animal.getPower());
  		animal = animalModel({"name":"Cat"});
  		assert.equal("Cat", animal.getPower());
  		animal = animalModel({"name":"Dog"});
  		assert.equal("Dog", animal.getPower());
  		animal = animalModel({"name":"Goose"});
  		assert.equal("Goose", animal.getPower());
  	});
  });
   describe('#setAvatar()', function() {
  	let animal = animalModel({});
  	it('should return undefined when the avatar value is empty or wrong type', function() {
  		assert.equal(undefined, animal.setAvatar());
  		assert.equal(undefined, animal.setAvatar({}));
  		assert.equal(undefined, animal.setAvatar("ads"));
  		assert.equal(undefined, animal.setAvatar(6));
  		assert.equal(undefined, animal.setAvatar({"path":5}));
  		assert.equal(undefined, animal.setAvatar({"path":"ahoj"}));
  		assert.equal(undefined, animal.setAvatar({"width":"ahoj"}));
  		assert.equal(undefined, animal.setAvatar({"width":6}));
  		assert.equal(undefined, animal.setAvatar({"width":[]}));
  		assert.equal(undefined, animal.setAvatar({"width":{}}));
  		assert.equal(undefined, animal.setAvatar({"height":6}));
  		assert.equal(undefined, animal.setAvatar({"height":"ahoj"}));
  		assert.equal(undefined, animal.setAvatar({"height":[]}));
  		assert.equal(undefined, animal.setAvatar({"height":{}}));
  		assert.equal(undefined, animal.setAvatar({"height":{}, "width":{}}));
  		assert.equal(undefined, animal.setAvatar({"height":{}, "width":5}));
  		assert.equal(undefined, animal.setAvatar({"height":{}, "width":[]}));
  		assert.equal(undefined, animal.setAvatar({"height":{}, "width":"ahoj"}));
  		assert.equal(undefined, animal.setAvatar({"height":5, "width":{}}));
  		assert.equal(undefined, animal.setAvatar({"height":5, "width":5}));
  		assert.equal(undefined, animal.setAvatar({"height":5, "width":[]}));
  		assert.equal(undefined, animal.setAvatar({"height":5, "width":"ahoj"}));
  		assert.equal(undefined, animal.setAvatar({"height":[], "width":{}}));
  		assert.equal(undefined, animal.setAvatar({"height":[], "width":5}));
  		assert.equal(undefined, animal.setAvatar({"height":[], "width":[]}));
  		assert.equal(undefined, animal.setAvatar({"height":[], "width":"ahoj"}));
  		assert.equal(undefined, animal.setAvatar({"height":"test", "width":{}}));
  		assert.equal(undefined, animal.setAvatar({"height":"test", "width":5}));
  		assert.equal(undefined, animal.setAvatar({"height":"test", "width":[]}));
  		assert.equal(undefined, animal.setAvatar({"height":"test", "width":"ahoj"}));
  		assert.equal(undefined, animal.setAvatar({"path":5,"height":5, "width":5}));
  		assert.equal(undefined, animal.setAvatar({"path":[],"height":5, "width":5}));
  		assert.equal(undefined, animal.setAvatar({"path":{},"height":5, "width":5}));

  	});
  	it('should return correct value after setting avatar', function() {
  		let returnTest = animal.setAvatar({"path":"test", "width":5, "height":6});
  		assert.property(returnTest,"path"); assert.equal("test", returnTest.path);
  		assert.property(returnTest,"width"); assert.equal(5, returnTest.width);
  		assert.property(returnTest,"height"); assert.equal(6, returnTest.height);
  		returnTest = animal.setAvatar({"path":"12312312312", "width":532, "height":5321});
  		assert.property(returnTest,"path"); assert.equal("12312312312", returnTest.path);
  		assert.property(returnTest,"width"); assert.equal(532, returnTest.width);
  		assert.property(returnTest,"height"); assert.equal(5321, returnTest.height);
  		returnTest = animal.setAvatar({"path":"oooooo", "width":532.1, "height":5321.2});
  		assert.property(returnTest,"path"); assert.equal("oooooo", returnTest.path);
  		assert.property(returnTest,"width"); assert.equal(532.1, returnTest.width);
  		assert.property(returnTest,"height"); assert.equal(5321.2, returnTest.height);
  	});
  });
  describe('#getAvatar()', function() {
  	let animal = animalModel({});
  	it('should return undefined when the avatar value is not set', function() {
  		assert.equal(undefined, animal.getAvatar());
  	});
  	it('should return correct value after setting avatar', function() {
  		animal.setAvatar({"path":"test", "width":5, "height":6});
  		let returnTest = animal.getAvatar();
  		assert.property(returnTest,"path"); assert.equal("test", returnTest.path);
  		assert.property(returnTest,"width"); assert.equal(5, returnTest.width);
  		assert.property(returnTest,"height"); assert.equal(6, returnTest.height);
  		animal.setAvatar({"path":"12312312312", "width":532, "height":5321});
  		returnTest = animal.getAvatar();
  		assert.property(returnTest,"path"); assert.equal("12312312312", returnTest.path);
  		assert.property(returnTest,"width"); assert.equal(532, returnTest.width);
  		assert.property(returnTest,"height"); assert.equal(5321, returnTest.height);
  		animal.setAvatar({"path":"oooooo", "width":532.1, "height":5321.2});
  		returnTest = animal.getAvatar();
  		assert.property(returnTest,"path"); assert.equal("oooooo", returnTest.path);
  		assert.property(returnTest,"width"); assert.equal(532.1, returnTest.width);
  		assert.property(returnTest,"height"); assert.equal(5321.2, returnTest.height);
  	});
  });
   describe('#implicit avatar attr from creation', function() {
  	it('should return undefined when the avatar value is not set or wrong type', function() {
  		let animal = animalModel({"avatar":{}});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":[]});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":[]});
  		assert.equal(undefined, animal.setAvatar());
  		animal = animalModel({"avatar":"ads"});
  		assert.equal(undefined, animal.setAvatar());
  		animal = animalModel({"avatar":6});
  		assert.equal(undefined, animal.setAvatar());
  		animal = animalModel({"avatar":{"path":5}});
  		assert.equal(undefined, animal.setAvatar());
  		animal = animalModel({"avatar":{"path":"ahoj"}});
  		assert.equal(undefined, animal.setAvatar());
  		animal = animalModel({"avatar":{"width":{"width":"ahoj"}}});
  		assert.equal(undefined, animal.setAvatar());
  		animal = animalModel({"avatar":{"width":6}});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":{"width":[]}});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":{"width":{}}});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":{"height":6}});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":{"height":"ahoj"}});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":{"height":[]}});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":{"height":{}}});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":{"height":{}, "width":{}}});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":{"height":{}, "width":5}});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":{"height":{}, "width":[]}});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":{"height":{}, "width":"ahoj"}});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":{"height":5, "width":{}}});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":{"height":5, "width":5}});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":{"height":5, "width":[]}});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":{"height":5, "width":"ahoj"}});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":{"height":[], "width":{}}});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":{"height":[], "width":5}});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":{"height":[], "width":[]}});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":{"height":[], "width":"ahoj"}});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":{"height":"test", "width":{}}});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":{"height":"test", "width":5}});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":{"height":"test", "width":[]}});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":{"height":"test", "width":"ahoj"}});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":{"path":5,"height":5, "width":5}});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":{"path":[],"height":5, "width":5}});
  		assert.equal(undefined, animal.getAvatar());
  		animal = animalModel({"avatar":{"path":{},"height":5, "width":5}});
  		assert.equal(undefined, animal.getAvatar());
  	});
  	it('should return correct value when the name value is a string in object creation', function() {
  		let animal = animalModel({"avatar":{"path":"test", "width":5, "height":6}});
  		let returnTest = animal.getAvatar();
  		assert.property(returnTest,"path"); assert.equal("test", returnTest.path);
  		assert.property(returnTest,"width"); assert.equal(5, returnTest.width);
  		assert.property(returnTest,"height"); assert.equal(6, returnTest.height);
  		animal = animalModel({"avatar":{"path":"12312312312", "width":532, "height":5321}});
  		returnTest = animal.getAvatar();
  		assert.property(returnTest,"path"); assert.equal("12312312312", returnTest.path);
  		assert.property(returnTest,"width"); assert.equal(532, returnTest.width);
  		assert.property(returnTest,"height"); assert.equal(5321, returnTest.height);
  		animal = animalModel({"avatar":{"path":"oooooo", "width":532.1, "height":5321.2}});
  		returnTest = animal.getAvatar();
  		assert.property(returnTest,"path"); assert.equal("oooooo", returnTest.path);
  		assert.property(returnTest,"width"); assert.equal(532.1, returnTest.width);
  		assert.property(returnTest,"height"); assert.equal(5321.2, returnTest.height);
  	});
  });
  describe('#reset()', function() {
  	let animal = animalModel({});
  	it('should return undefined when the animal was reset', function() {
  		animal.reset();
  		assert.equal(undefined, animal.getPower());
  	});
  	it('should return undefined when the animal was reset after setting power value', function() {
  		animal.setPower(5)
  		animal.reset();
  		assert.equal(undefined, animal.getPower());
  	});
  });
});