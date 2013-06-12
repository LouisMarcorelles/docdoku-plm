define(["text!templates/menu.html", "storage", "views/sub_content_view"], function(template, Storage, SubContentView) {
    var MenuView = Backbone.View.extend({

        template: Handlebars.compile(template),

        events: {
          "click #repositories" : "onClickRepositories",
          "click #dplm" : "onclick"
        },

        render:function() {
            this.$el.html(this.template({}));

            return this;
        },

        onClickRepositories:function() {
            var subRepoView = new SubContentView({el: "#localRepo"}).render();
        }
    });

    return MenuView;
});