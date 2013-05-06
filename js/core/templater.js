function Templater(context) {
  this.context = context;
  
  this.templates = {};
  this.templatesCache = {};
  
  this.renders = {};
}

Templater.prototype.addTemplate = function(name, params) {
  if (!this.renders[name]) {
    this.renders[name] = {};
  }
  
  var placeholders = {attr: {}, html: {}}, property_name, selector, attr;
  
  
  for (var p in params.placeholders) {
    property_name = params.placeholders[p];
    p = p.split("|");
    selector = p[0];
    
    
    
    if (p.length > 1) {
      attr = p[1];
      if (!placeholders.attr[selector])
        placeholders.attr[selector] = {};
      
      placeholders.attr[selector][attr] = property_name;
    } else {
      placeholders.html[selector] = property_name;
    } 
  }
  
  params.placeholders = placeholders;
  var locator = $(params.locator);
  params.template = $.trim(locator.html());
  locator.remove(); // have to remove origin DOM node due to id's duplicates
  
  this.templates[name] = params;
}

Templater.prototype.getTemplate = function(name, object) {
  if (!this.templatesCache[name]) {
    if (!this.templates[name])
      throw "No template '" + name + "'!"; 
  
    this.templatesCache[name] = this.templates[name].template;
  }
  
  return $(this.templatesCache[name]);
}

Templater.prototype.render = function(name, object, params, context) {
  var object_dom = this.getTemplate(name);
  
  this.renders[name][object.id] = object_dom;
  
  var template = this.templates[name];
  this.updateTemplate(name, object);
  
  this.initListeners(template, object, object_dom, params, context);
  
  if ('function' == typeof template.onInit)
    template.onInit.call({context: context, object: object, container: object_dom}, object, object_dom);
  
  if (template.container)
    $(template.container).append(object_dom);
  
  return object_dom;
}

Templater.prototype.initListeners = function(template, object, object_dom, params, context) {
  if (undefined === context)
    context = this.context;
  
  var listeners = template.listeners;
  // TODO: rempve this terrible code
  if (params && params.listeners) {
    listeners = {};
    for (var selector in template.listeners) {
      listeners[selector] = template.listeners[selector];
    }
    
    for (var p in params.listeners) {
      listeners[p] = params.listeners[p];
    }
  }
  
  // Listener creator for node events
  var listener_creator = function(context, object, object_dom, l) {
    return function(event) {
      var res = l.call({context: context, object: object, container: object_dom}, this);

      if (undefined !== res)
        return res;

      // Stop propogation for A.onclick by default
      if ('a' == this.tagName.toLowerCase() && 'click' == event.type)
        return false;

      return true;
    };
  };
  
  var event_type, listener;
  for (event_type in listeners) {
    listener = listeners[event_type];
    
    if ("function" == typeof listener) {
      // Click listener by default
      $(object_dom).find(event_type).click(listener_creator(context, object, object_dom, listener));
    } else if ("object" == typeof listener) {
      for (var select in listener) {
        $(object_dom).find(select)[event_type](listener_creator(context, object, object_dom, listener[select]));
      }
    }
  }
}

Templater.prototype.updateTemplate = function(name, object) {
  var template = this.templates[name];
  if (!template)
    throw "No template '" + name + "'!";
  
  var object_dom = this.renders[name][object.id];
  
  //console.log(name, object, template.placeholders.attr)
  
  // Fill template's DOM attributes
  var selector, attr, param_name;
  for (selector in template.placeholders.attr) {
    for (attr in template.placeholders.attr[selector]) {
      param_name = template.placeholders.attr[selector][attr];
      if ('function' === typeof object[param_name])
        html = object[param_name]();
      else if (undefined !== object[param_name])
        html = object[param_name];
      else if ('function' === typeof object.getParam)
        html = object.getParam(param_name);
      else 
        html = '';
      
      $(object_dom).find(selector).attr(attr, html);
    }
  }
  
  // Fill template's DOM innerHTMLs
  for (selector in template.placeholders.html) {
    param_name = template.placeholders.html[selector];
    
    //console.log(selector, template.placeholders.html, param_name, object, "--",'function' === typeof object[param_name], undefined !== object[param_name], 'function' === typeof object.getParam)
    if ('function' === typeof object[param_name])
        html = object[param_name]();
      else if (undefined !== object[param_name])
        html = object[param_name];
      else if ('function' === typeof object.getParam){
        html = object.getParam(param_name);
      }else 
        html = '';

    $(object_dom).find(selector).html(html ? html : undefined);
  }
  
  return object_dom;
}

Templater.prototype.deleteTemplate = function(name, object) {
  this.templateDelete(name, object);
}

Templater.prototype.templateDelete = function(name, object) {
  var item_dom = this.renders[name][object.id];
  item_dom.remove();
}

