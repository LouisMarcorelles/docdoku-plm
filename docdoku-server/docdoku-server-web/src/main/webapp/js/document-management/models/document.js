define(["collections/document_iteration"], function(DocumentIterationList) {

    var Document = Backbone.Model.extend({

        parse: function(data) {
            this.iterations = new DocumentIterationList(data.documentIterations);
            this.iterations.setDocument(this);
            delete data.documentIterations;
            delete data.lastIteration;
            return data;
        },

        getReference : function(){
            var id = this.get("id");
            return id.substr(0,id.lastIndexOf("-"));
        },

        getVersion: function() {
            return this.get("version");
        },

        getWorkspace: function() {
            return this.get("workspaceId");
        },

        getCheckoutUser: function() {
            return this.get('checkOutUser');
        },

        isCheckoutByConnectedUser: function() {
            return this.isCheckout() ? this.getCheckoutUser().login == APP_CONFIG.login : false;
        },

        getUrl: function() {
            return this.url();
        },

        hasIterations: function() {
            return !this.getIterations().isEmpty();
        },

        getLastIteration: function() {
            return this.getIterations().last();
        },

        getIterations: function() {
            return this.iterations;
        },

        isIterationChangedSubscribed:function(){
            return this.get("iterationSubscription");
        },

        isStateChangedSubscribed:function(){
            return this.get("stateSubscription");
        },

        getTags:function(){
            return this.tags;
        },

        checkout: function() {
            $.ajax({
                context: this,
                type: "PUT",
                url: this.url() + "/checkout",
                success: function() {
                    this.fetch();
                }
            });
        },

        undocheckout: function() {
            $.ajax({
                context: this,
                type: "PUT",
                url: this.url() + "/undocheckout",
                success: function() {
                    this.fetch();
                }
            });
        },

        checkin: function() {
            $.ajax({
                context: this,
                type: "PUT",
                url: this.url() + "/checkin",
                success: function() {
                    this.fetch();
                }
            });
        },

        toggleStateSubscribe:function(oldState){

            var action = oldState ? "unsubscribe" : "subscribe" ;

            $.ajax({
                context: this,
                type: "PUT",
                url: this.url() + "/notification/stateChange/"+action,
                success: function() {
                    this.fetch();
                }
            });
        },

        toggleIterationSubscribe:function(oldState){

            var action = oldState ? "unsubscribe" : "subscribe" ;

            $.ajax({
                context: this,
                type: "PUT",
                url: this.url() + "/notification/iterationChange/"+action,
                success: function() {
                    this.fetch();
                }
            });

        },

        isCheckout: function() {
            return !_.isNull(this.attributes.checkOutDate);
        },

        getPermalink : function(){
            return encodeURI(
                window.location.origin
                + "/documents/"
                + this.getWorkspace()
                + "/"
                + this.getReference()
                + "/"
                + this.getVersion()
            );
        },

        addTags:function(tags){

            $.ajax({
                context: this,
                type: "POST",
                url: this.url() + "/tags",
                data : JSON.stringify(tags),
                contentType: "application/json; charset=utf-8",
                success: function() {
                   this.fetch();
                }
            });

        },

        removeTags:function(tags,callback){

            $.ajax({
                context: this,
                type: "DELETE",
                async:false,
                url: this.url() + "/tags",
                data : JSON.stringify(tags),
                contentType: "application/json; charset=utf-8",
                success: function() {
                   this.fetch();
                   callback();
                }
            });

        }


    });

    return Document;

});
