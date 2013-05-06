function Builder() {
  this.plugins = {};
  this.pluginImpls = {};

  this.addPluginListener = null;
  this.addPluginImplListener = null;
}

Builder.prototype.addPlugin = function(plugin) {
  this.plugins[plugin.id] = plugin;

  if (this.addPluginListener)
    this.addPluginListener(plugin);
}

Builder.prototype.addPluginImpl = function(impl) {
  this.pluginImpls[impl.id] = impl;

  if (this.addPluginImplListener)
    this.addPluginImplListener(impl);
}