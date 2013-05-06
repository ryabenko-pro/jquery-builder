var builder, templater;

$(function(){
  builder = new Builder();
  templater = getTemplater(builder);
  
  builder.addPluginListener = function(plugin) {
    console.log("Add plugin: '" + plugin.id  +"'");
    var node = templater.render('plugin-menu', {name: plugin.name}, {}, {plugin: plugin});
    $('#plugin-menu').append(node);
  }
  
  builder.addPluginImplListener = function(impl) {
    console.log("Add plugin impl: '" + impl.id  +"'");
    var node = $('<pre></pre>');
    node.append(impl.render());
    $('#plugins-container').append(node);
  }
  
  var params = [];
  params.push(new Param('class', 'text', 'default'));
  params.push(new Param('content', 'textarea', ''));
  var plugin = new Plugin('test', 'Test', params, '<div class="%class%">%content%</div>');
  builder.addPlugin(plugin);
//  plugin.
});

function addPlugin(plugin) {
  var fb = new FormBuilder(plugin.params, templater);
  fb.buildForm(function(values) {
    var impl = new PluginImpl(plugin.id, plugin, plugin.name, values);
    builder.addPluginImpl(impl);
  });
}


function getTemplater(builder) {
  var templater = new Templater({builder: builder});
  templater.addTemplate('plugin-menu', {
    locator: '#template-plugin-menu',
    placeholders: {
      'a': 'name',
    },
    listeners: {
      'a': function(el) {
        console.log("Add plugin " + this.object.name);
        addPlugin(this.context.plugin);
      }
   }
  });
  
  return templater;
}