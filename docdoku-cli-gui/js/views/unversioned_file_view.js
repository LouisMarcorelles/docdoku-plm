define(["text!templates/unVersioned_file.html", "views/part_creation_view", "commander", "storage"], function(template, PartCreationView, Commander, Storage) {

    var UnVersionedlFileView = Backbone.View.extend({

        template: Handlebars.compile(template),

        events: {
            "click .icon-plus" : "newPart"
        },

        render:function() {this.$el.html(this.template({model: this.model}));

            return this;
        },

        newPart:function(e){
            var partCreationView = new PartCreationView();
            this.listenTo(partCreationView, 'part:created', this.fetchPartAndAdd);
            $("body").append(partCreationView.render().el);
            partCreationView.openModal();
        }
    });

    return UnVersionedlFileView;
});