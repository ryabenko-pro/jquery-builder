function FormBuilder(params, templater) {
  this.params = params;
  this.templater = templater;
  
  this.paramNodes = {};
  
  this.types = {
    text: {
      tag: 'input',
      attr: {type: 'text'}
    }, 
    integer: {
      tag: 'input',
      attr: {type: 'text', 'data-type': 'integer'}
    }, 
    boolean: {
      tag: 'select',
      'options': {
        'true': 'TRUE',
        'false': 'FALSE'
      }
    }, 
    textarea: {
      tag: 'textarea'
    }
  };
};

/**
 * Строим HTML представление формы
 */
FormBuilder.prototype.buildForm = function(impl, add_listener) {
  this.paramNodes = {};
  this.rootNode = $('<div></div>');
  
  var param;
  for (var p in this.params) {
    param = this.params[p];
    this.addParam(impl, param);
  }
  
  var ok = $('<input type="button" value="Добавить" />');
  ok.click(function(fb, rn){
    return function() {
      add_listener(fb.getValues());
      rn.dialog('close');
    }
  }(this, this.rootNode));
  this.rootNode.append(ok);
  
  this.rootNode.dialog({
    modal: true
  });
}

FormBuilder.prototype.getValues = function() {
  var values = {};
  for (var v in this.paramNodes) {
    values[v] = this.paramNodes[v].val();
  }
  
  return values;
};

FormBuilder.prototype.addParam = function(impl, param) {
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
  if ('select' === type.tag) {
    for (var o in type.options) {
      node.append('<option value="' + o + '">' + type.options[o] + "</option>");
    }
  }
  if (impl.values[param.name]) {
    node.val(impl.values[param.name]);
  }
  
  this.rootNode.append(node);
  
  this.rootNode.find('[data-type=integer]').spinner();
  
  this.paramNodes[param.name] = node;
};
