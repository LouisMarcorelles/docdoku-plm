define([
    "i18n!localization/nls/document-management-strings",
    "text!common-objects/templates/workflow/lifecycle_task_signing.html"

], function(i18n, template) {

    var LifecycleTaskSigningView = Backbone.View.extend({

        tagName: 'div',

        events: {
            "click .lifecycle-task-signing-link-a": "toggleSigningCanvas",
            "click .lifecycle-task-signing-delete-a": "deleteSignature",
            "mousedown .lifecycle-activities-canvas": "canvasMouseDown",
            "mousemove .lifecycle-activities-canvas": "canvasMouseMove",
            "mouseup .lifecycle-activities-canvas": "canvasMouseUp",
            "mouseleave .lifecycle-activities-canvas": "canvasMouseLeave",
            "click .cancel-signing": "cancelSigning",
            "click .delete-signing": "clearBtnClicked",
            "click .save-signing": "saveSigning"
        },

        initialize: function() {
            this.moves = new Array();
            this.pressed;
            this.oppened = false;
            this.signature = null;
        },

        render: function() {
            this.$el.html(Mustache.render(template, {i18n: i18n}));
            this.bindDomElements();
            this.initSigningPopover();
            this.initCanvas();
            return this;
        },

        bindDomElements: function() {
            this.$signingLink = this.$(".lifecycle-task-signing-link");
            this.$signingPopover = this.$(".lifecycle-task-signing-popover");
        },

        initSigningPopover: function() {
            var self = this;
            this.$signingLink.popover({
                html: true,
                placement: "top",
                title: i18n.SIGN_TASK,
                trigger: "manual",
                content: function() {
                    return self.$signingPopover.html();
                }
            });
        },

        initCanvas: function() {

        },

        toggleSigningCanvas: function() {
            this.oppened ? this.closeSigningCanvas() : this.openSigningCanvas();
            this.oppened = !this.oppened;
        },

        openSigningCanvas: function() {
            this.$signingLink.popover('show');
            this.canvas = this.$(".lifecycle-activities-canvas").get(0);
            this.context = this.canvas.getContext("2d");
            this.canvas.width = $(".popover-content").width();
            this.canvas.height = 150;
        },

        closeSigningCanvas: function() {
            this.$signingLink.popover('hide');
        },

        canvasMouseDown: function(e) {
            e.originalEvent.preventDefault();
            this.pressed = true;
            this.moves.push([e.pageX - this.canvas.getBoundingClientRect().left,
                e.pageY - this.canvas.getBoundingClientRect().top,
                false]);
            this.redraw();
        },

        canvasMouseMove: function(e) {
            if (this.pressed) {
                this.moves.push([e.pageX - this.canvas.getBoundingClientRect().left,
                    e.pageY - this.canvas.getBoundingClientRect().top,
                    true]);
                this.redraw();
            }
        },

        canvasMouseUp: function() {
            this.pressed = false;
        },

        canvasMouseLeave: function() {
            this.pressed = false;
        },

        redraw: function() {
            this.context.strokeStyle = "#000000";
            this.context.lineJoin = "round";
            this.context.lineWidth = 3;

            for (var i = 0; i < this.moves.length; i++) {
                this.context.beginPath();
                if (this.moves[i][2] && i) {
                    this.context.moveTo(this.moves[i - 1][0], this.moves[i - 1][1]);
                } else {
                    this.context.moveTo(this.moves[i][0], this.moves[i][1]);
                }
                this.context.lineTo(this.moves[i][0], this.moves[i][1]);
                this.context.closePath();
                this.context.stroke();
            }
        },

        cancelSigning: function(e) {
            e.stopPropagation();
            e.preventDefault();

            this.toggleSigningCanvas();
        },

        clearBtnClicked: function(e) {
            e.stopPropagation();
            e.preventDefault();

            this.clearSigning()
        },

        deleteSignature: function(e) {
            e.stopPropagation();
            e.preventDefault();

            this.signature = null;
            this.$('.lifecycle-task-signing-img img').attr('src', this.signature);
            this.$('.lifecycle-task-signing-img').addClass('hidden');
            this.$('.lifecycle-task-signing-delete-a').addClass('hidden');
        },

        clearSigning: function() {
            // Store the current transformation matrix
            this.context.save();

            // Use the identity matrix while clearing the canvas
            this.context.setTransform(1, 0, 0, 1, 0, 0);
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Restore the transform
            this.context.restore();

            this.moves.length = 0;
        },

        saveSigning: function(e) {
            e.stopPropagation();
            e.preventDefault();

            this.signature = this.canvas.toDataURL();
            this.$('.lifecycle-task-signing-img img').attr('src', this.signature);
            this.$('.lifecycle-task-signing-img').removeClass('hidden');
            this.$('.lifecycle-task-signing-delete-a').removeClass('hidden');

            this.toggleSigningCanvas();
            this.clearSigning();
        }

    });
    return LifecycleTaskSigningView;
});