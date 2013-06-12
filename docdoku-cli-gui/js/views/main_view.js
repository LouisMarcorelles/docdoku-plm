define(["text!templates/main_save.html"], function(template) {

    var MainView =  Backbone.View.extend({

        template: Handlebars.compile(template),

        render:function() {
            this.$el.html(this.template({}));

            return this;
        }
    });

    return MainView;
});