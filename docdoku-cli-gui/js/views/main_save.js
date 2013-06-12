define(["text!templates/main.html"], function(template, nav_view) {

    var AppView =  Backbone.View.extend({

        events : {
          "click #dplm":"onDplmButtonClicked"
        },

        render:function(){
            var tpl = Handlebars.compile(template).call();
            var $tpl = $(tpl);
            this.$el.html($tpl);
        },

        onDplmButtonClicked:function(e){
           require(["views/configuration_view, "],function(ConfigView){
               new ConfigView({el:"#document-content"}).render();
           });
        }
    });

    return AppView;
});