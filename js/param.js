function Param(name, type, def, params) {
  this.name = name;
  this.type = type;
  this.value = def;
  this.def = def;
  this.params = params ? params : {};
  
  this.validator = null;
}

Param.prototype.setValidator = function(validator) {
  this.validator = validator;
}

