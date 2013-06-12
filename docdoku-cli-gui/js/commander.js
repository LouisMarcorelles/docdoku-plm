define(["storage"], function(Storage) {

    var Commander = {

        chooseDirectory:function(callback) {
            var child = exec('sh '+ window.process.cwd() + '/dplm/dplm dc ',
                function (error, stdout, stderr) {
                    if (error || stderr) {
                        console.log('exec error: ' + error);
                    } else {
                        Storage.setDirectory(stdout);
                    }
                    // Méthode de callback appelée par configuration_view.js
                    callback(stdout);
                });
        },

        getStatusForFile:function(file, callback) {
            var child = exec('sh '+ window.process.cwd() + '/dplm/dplm st' + this.getParams() + ' -j ' + file,
                function (error, stdout, stderr) {
                    if (error || stderr) {
                        console.log('exec error  : ' + file);
                    } else {
                        callback(stdout);
                    }
                });
        },

        getStatusForPartNumber:function(file, callback) {},

        checkin:function(file, callback) {
            var child = exec('sh '+ window.process.cwd() + '/dplm/dplm ci' + this.getParams() + file,
                function (error, stdout, stderr) {
                    if (error || stderr) {
                        console.log('exec error: ' + file);
                    }
                    callback();
                });
        },

        checkout:function(file, callback) {
            var child = exec('sh '+ window.process.cwd() + '/dplm/dplm co' + this.getParams() + file,
                function (error, stdout, stderr) {
                    if (error || stderr) {
                        console.log('exec error: ' + file);
                    }
                    callback();
                });
        },

        undoCheckout:function(file, callback) {
            var child = exec('sh '+ window.process.cwd() + '/dplm/dplm uco' + this.getParams() + file,
                function (error, stdout, stderr) {
                    if (error || stderr) {
                        console.log('exec error: ' + file);
                    }
                    callback();
                });
        },

        get:function(file, callback) {
            var child = exec('sh '+ window.process.cwd() + '/dplm/dplm get' + this.getParams() + file,
                function (error, stdout, stderr) {
                    if (error || stderr) {
                        console.log('exec error: ' + file);
                    }
                    callback();
                });
        },

        getParams:function() {

            var params = " -h " + Storage.getHost()
                + " -P " +  Storage.getPort()
                + " -w " + Storage.getWorkspace()
                + " -u " + Storage.getUser()
                + " -p " + Storage.getPwd()
                + " ";

            return params;
        }
     };

    return Commander;
});