function Param(name, type, def) {
  this.name = name;
  this.type = type;
  this.value = def;
  this.def = def;
  
  this.validator = null;
}

Param.prototype.setValidator = function(validator) {
  this.validator = validator;
}

