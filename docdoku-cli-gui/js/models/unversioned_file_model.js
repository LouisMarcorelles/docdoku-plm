define([] , function() {
    var UnVersionedFileModel = Backbone.Model.extend({

        initialize:function() {
            _.bindAll(this);
        },

        getName:function() {
            return this.get("name");
        },

        getFullPath:function() {
            return this.get("path") + "/" + this.getName();
        },

        getMTime:function() {
            return this.get("mtime");
        },

        getMTimeParsed:function() {
            return moment(this.getMTime()).format("YYYY-MM-DD HH:MM:ss");
        },

        setMTime:function(mTime) {
            this.set("mtime", mTime);
        },

        setPartNumber:function(partNumber) {
            this.set("partNumber", partNumber);
        }
    });

    return UnVersionedFileModel;
});