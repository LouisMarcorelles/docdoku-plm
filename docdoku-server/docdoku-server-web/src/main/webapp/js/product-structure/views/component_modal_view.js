define(['text!templates/component_modal.html', 'i18n!localization/nls/product-structure-strings', "common-objects/views/attributes/attribute_list"], function(template, i18n,ComponentAttributeListView) {

    var ComponentModalView = Backbone.View.extend({

        template: Mustache.compile(template),

        events: {
            "submit #form-component":"onSubmitForm",
            "hidden #component-modal": "onHidden",
            "click #add-attributes" : "addAttribute"
        },

        render: function() {
            this.$el.html(this.template({
                component: this.model,
                i18n: i18n
            }));
            this.$modal = this.$('.modal');
            this.$authorLink = this.$('.author-popover');
            this.bindUserPopover();
            this.initAttributesView();

            console.log(this);

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
        },

        initAttributesView:function(){

            var that = this ;

            this.attributes = new Backbone.Collection();

            this.attributesView = new ComponentAttributeListView({
                collection: this.attributes
            });

            _.each(this.model.get("attributes"),function(item){
                that.attributes.add({
                    name: item.name,
                    type: item.type,
                    value: item.value
                });
            });

            //this.attributesView.addAndFillAttribute(item);

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

            /*saving component*/
            this.model.save({
                instanceAttributes: this.attributesView.collection.toJSON()
            });

            e.preventDefault();
            e.stopPropagation();
            return false ;
        }

    });

    return ComponentModalView;

});