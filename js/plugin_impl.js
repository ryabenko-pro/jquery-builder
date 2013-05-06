/**
 * Конфигурация плагина, добавленного на страницу
 */
function PluginImpl(id, plugin, name, values) {
  this.id = id;
  this.plugin = plugin;
  this.name = name;
  this.values = values;
}

PluginImpl.prototype.render = function() {
  var template = this.plugin.templateJs;
  
  var value;
  for (var p in this.values) {
    value = this.values[p];
//    template = template.replace('%' + value.name + '%', value.value)
    template = template.replace('%' + p + '%', value)
  }
  
  return template.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
}
