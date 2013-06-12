define(["text!templates/versioned_file.html", "views/loader_view",  "commander", "storage"], function(template, Loader, Commander, Storage) {

    var LocalFileView = Backbone.View.extend({

        template: Handlebars.compile(template),

        events: {
            "click .icon-signout"   : "checkin",
            "click .icon-signin"    : "checkout",
            "click .icon-refresh"   : "render",
            "click .icon-download"  : "get",
            "click .icon-undo"      : "undoCheckout"
        },

        render:function() {
            var status = this.model.getStatus();
            status.checkoutDateParsed = moment(status.checkoutDate).format("YYYY-MM-DD HH:MM:ss");
            status.isCheckedOutByMe = this.isCheckoutByConnectedUser(status);
            status.iteration = _.last(status.iterations);

            this.$el.html(this.template({model: this.model, status: status}));
            this.$localFile = this.$(".versionedFile")

            return this;
        },

        loader:function() {
            this.$localFile.html(new Loader());
        },

        isCheckoutByConnectedUser:function(status) {
            return status.checkoutUser == Storage.getUser();
        },

        checkin:function() {
            this.loader();
            var self = this;
            Commander.checkin(this.model.getFullPath(), function() {
               Commander.getStatusForFile(self.model.getFullPath(), function(pStatus) {
                   var status = JSON.parse(pStatus);
                   self.model.setStatus(status);
                   self.render();
               });
            });
        },

        checkout:function() {
            this.loader();
            var self = this;
            Commander.checkout(this.model.getFullPath(), function() {
                Commander.getStatusForFile(self.model.getFullPath(), function(pStatus) {
                    var status = JSON.parse(pStatus);
                    self.model.setStatus(status);
                    self.render();
                });
            });
        },

        undoCheckout:function() {
            this.loader();
            var self = this;
            Commander.undoCheckout(this.model.getFullPath(), function() {
                Commander.getStatusForFile(self.model.getFullPath(), function(pStatus) {
                    var status = JSON.parse(pStatus);
                    self.model.setStatus(status);
                    self.render();
                });
            });
        },

        get:function() {
            this.loader();
            var self = this;
            Commander.get(this.model.getFullPath(), function() {
                Commander.getStatusForFile(self.model.getFullPath(), function(pStatus) {
                    var status = JSON.parse(pStatus);
                    self.model.setStatus(status);
                    self.render();
                });
            });
        }
    });

    return LocalFileView;
});