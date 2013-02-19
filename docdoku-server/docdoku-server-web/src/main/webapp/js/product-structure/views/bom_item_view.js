define(['text!templates/bom_item.html', "models/part"], function(template, Part) {

    var BomItemView = Backbone.View.extend({

        tagName: 'tr',

        events: {
            "click .part_number": "onPartClicked"
        },

        template: Mustache.compile(template),

        initialize:function() {
            this.listenTo(this.model, "change",this.render);
        },

        render: function() {
            this.$el.html(this.template(this.model));
            this.$input = this.$("input");
            this.$(".author-popover").userPopover(this.model.getAuthorLogin(),this.model.getName(), "left");
            return this;
        },

        onPartClicked: function() {
            var self = this;
            require(['views/part_modal_view'], function(PartModalView) {
                self.model.fetch().success(function(){
                    var partModalView = new PartModalView({
                        model: self.model
                    });
                    $('body').append(partModalView.render().el);
                    partModalView.show();
                });
            });
        },

        isChecked: function() {
            return this.$input[0].checked;
        },

        setSelectionState: function(state) {
            this.$input[0].checked = state;
        }

    });

    return BomItemView;

});
