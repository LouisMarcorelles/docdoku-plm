define(["models/component_module", "views/component_views"], function (ComponentModule, ComponentViews) {

    var PartsTreeView = Backbone.View.extend({

        el:$('#product_nav_list'),

        events: {
            "change input": "checkChildrenInputs",
            "change li": "checkParentsInputs"
        },

        render: function() {
            var rootCollection = new ComponentModule.Collection([], { isRoot: true });
            new ComponentViews.Components({
                collection: rootCollection,
                parentView: this.$el,
                parentChecked: false
            });
        },

        checkChildrenInputs: function(event) {
            var inputs = event.target.parentNode.querySelectorAll('input');
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].checked = event.target.checked;
            }
        },

        checkParentsInputs: function(event) {
            var relativeInput = event.currentTarget.querySelector('input');
            relativeInput.checked = event.target.checked;

            if (event.target.checked) {
                var childrenUl = event.currentTarget.querySelector('ul');
                if (childrenUl != null) {
                    var inputsChecked = 0;
                    for (var i = 0; i < childrenUl.childNodes.length; i++) {
                        var li = childrenUl.childNodes[i];
                        if (li.querySelector('input').checked) {
                            inputsChecked++;
                        }
                    }
                    if (inputsChecked != childrenUl.childNodes.length) {
                        relativeInput.checked = false;
                    }
                }
            }
        }

    });

    return PartsTreeView;

});