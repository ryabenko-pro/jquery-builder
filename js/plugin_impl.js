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
  if (this.plugin.renderer) {
    return this.plugin.renderer(this.values);
  } else {
    var template = this.plugin.templateJs;

    var value;
    for (var p in this.values) {
      value = this.values[p];
      template = template.replace('%' + p + '%', value)
    }

    return template.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
  }
}
