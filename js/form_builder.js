function FormBuilder(params, templater) {
  this.params = params;
  this.templater = templater;
  
  this.paramNodes = {};
  
  this.types = {
    text: {
      tag: 'input',
      attr: {type: 'text'}
    }, 
    textarea: {
      tag: 'textarea',
    }
  };
}

/**
 * Строим HTML представление формы
 */
FormBuilder.prototype.buildForm = function(add_listener) {
  this.paramNodes = {};
  this.rootNode = $('<div></div>');
  
  var param;
  for (var p in this.params) {
    param = this.params[p];
    this.addParam(param);
  }
  
  var ok = $('<input type="button" value="Добавить" />');
  ok.click(function(fb, rn){
    return function() {
      add_listener(fb.getValues());
      rn.dialog('close');
    }
  }(this, this.rootNode));
  this.rootNode.append(ok);
  
  this.rootNode.dialog();
}

FormBuilder.prototype.getValues = function() {
  var values = {};
  for (var v in this.paramNodes) {
    values[v] = this.paramNodes[v].val();
  }
  
  return values;
}

FormBuilder.prototype.addParam = function(param) {
  var type = this.types[param.type];
  if (!type) {
    alert('No type "' + param.type + '"');
    return;
  }
  
  var attr = [];
  for (var a in type.attr)
    attr.push(a + '="' + type.attr[a] + '"');
  
  var label = '<label for="' + param.name + '">' + (param.description ? param.description : param.name) + '</label>';
  this.rootNode.append(label);
  
  var node = $('<' + type.tag + ' ' + attr.join(' ') + ' />');
  this.rootNode.append(node);
  
  this.paramNodes[param.name] = node;
}
