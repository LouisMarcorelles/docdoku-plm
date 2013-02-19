define(['text!templates/part_modal.html', 'i18n!localization/nls/product-structure-strings', "common-objects/views/attributes/attribute_list"], function(template, i18n, ComponentAttributeListView) {

    var PartModalView = Backbone.View.extend({

        template: Mustache.compile(template),

        events: {
            "submit #form-part":"onSubmitForm",
            "hidden #part-modal": "onHidden",
            "click #add-attributes" : "addAttribute"
        },

        render: function() {
            this.$el.html(this.template({
                part: this.model,
                i18n: i18n
            }));
            this.$modal = this.$('.modal');
            this.$authorLink = this.$('.author-popover');
            this.$checkoutUserLink = this.$('.checkout-user-popover');
            this.bindUserPopover();
            this.initAttributesView();
            return this;
        },

        show: function() {
            this.$modal.modal("show");
        },

        onHidden: function() {
            this.remove();
        },

        bindUserPopover: function() {
            this.$authorLink.userPopover(this.model.getAuthorLogin(), this.model.getNumber(), "right");
            if(this.model.isCheckout()){
                this.$checkoutUserLink.userPopover(this.model.getCheckOutUserLogin(), this.model.getNumber(),"right");
            }
        },

        initAttributesView:function(){

            var that = this ;

            this.attributes = new Backbone.Collection();

            this.attributesView = new ComponentAttributeListView({
                collection: this.attributes
            });

            _.each(this.model.getLastIteration().getAttributes().models ,function(item){
                that.attributes.add({
                    name: item.getName(),
                    type: item.getType(),
                    value: item.getValue()
                });
            });

            this.$("#attributes-list").html(this.attributesView.$el);

        },

        addAttribute: function () {

            this.attributes.add({
                name: "",
                type: "TEXT",
                value: ""
            });
        },

        onSubmitForm:function(e){

            this.model.save({
                instanceAttributes: this.attributesView.collection.toJSON()
            });

            e.preventDefault();
            e.stopPropagation();
            return false ;
        }

    });

    return PartModalView;

});