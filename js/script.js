var builder, templater;
var implCounter = 1;

$(function(){
  builder = new Builder();
  templater = getTemplater(builder);
  
  builder.addPluginListener = function(plugin) {
    console.log("Add plugin: '" + plugin.id  +"'");
    var node = templater.render('plugin-menu', {name: plugin.name}, {}, {plugin: plugin});
    $('#plugin-menu').append(node);
  };
  
  builder.addPluginImplListener = function(impl) {
    console.log("Add plugin impl: '" + impl.id  +"'");
//    var node = $('<pre></pre>');
    var node = templater.render('plugin-js-content', {id: impl.id, content: impl.render()}, {}, {plugin: plugin, impl: impl});
//    node.append(impl.render());
    $('#plugins-container').append(node);
  };
  
  builder.editPluginImplListener = function(impl) {
    console.log("Edit plugin impl: '" + impl.id  +"'");
    templater.updateTemplate('plugin-js-content', {id: impl.id, content: impl.render()});
  };
  
  builder.deletePluginImplListener = function(impl) {
    console.log("Edit plugin impl: '" + impl.id  +"'");
    templater.deleteTemplate('plugin-js-content', {id: impl.id, content: impl.render()});
  };
  
  var params = [];
  params.push(new Param('selector', 'text', ''));
  params.push(new Param('modal', 'boolean', 'false'));
  params.push(new Param('width', 'integer', ''));
  
  var plugin = new Plugin('dialog', 'Dialog', params, '$("%selector%").dialog(%options%);', function(values) {
    var template = this.templateJs;
    
    var width = parseInt(values.width);
    var options = ['{modal: ', values.modal, ', width: ', isNaN(width) ? 0 : width, '}'].join('');
    
    var renderValues = {
      'selector': values.selector,
      'options': options
    };
    
    var value;
    for (var p in renderValues) {
      value = renderValues[p];
      template = template.replace('%' + p + '%', value);
    }

    return template.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
  });
  builder.addPlugin(plugin);
//  plugin.
});

function addPlugin(plugin) {
  var fb = new FormBuilder(plugin.params, templater);
  var impl = new PluginImpl(implCounter++, plugin, plugin.name, {});
  fb.buildForm(impl, function(values) {
    impl.values = values;
    builder.addPluginImpl(impl);
  });
}

function editPluginImpl(plugin, impl) {
  var fb = new FormBuilder(plugin.params, templater);
  fb.buildForm(impl, function(values) {
    impl.values = values;
    builder.editPluginImpl(impl);
  });
}

function deletePluginImpl(impl) {
  builder.deletePluginImpl(impl);
}


function getTemplater(builder) {
  var templater = new Templater({builder: builder});
  templater.addTemplate('plugin-menu', {
    locator: '#template-plugin-menu',
    placeholders: {
      'a': 'name'
    },
    listeners: {
      'a': function(el) {
        console.log("Add plugin " + this.object.name);
        addPlugin(this.context.plugin);
      }
   }
  });
  
  templater.addTemplate('plugin-js-content', {
    locator: '#template-plugin-js-content',
    placeholders: {
      '[data-container=plugin-container]': 'content'
    },
    listeners: {
      '[data-action=edit]': function(el) {
        console.log("Edit plugin " + this.context.plugin.name);
        editPluginImpl(this.context.plugin, this.context.impl);
      },
      '[data-action=delete]': function(el) {
        console.log("Delete plugin " + this.context.plugin.name);
        deletePluginImpl(this.context.impl);
      }
   }
  });
  
  return templater;
}