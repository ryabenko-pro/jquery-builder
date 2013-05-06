/**
 * Описание содержимого какого-либо плагина
 * Когда пользователь добавляет плагин на страницу, создается PluginConfiguration
 */
function Plugin(id, name, params, templateJs) {
  this.id = id;
  this.name = name;
  this.params = params;
  this.templateJs = templateJs;
}

