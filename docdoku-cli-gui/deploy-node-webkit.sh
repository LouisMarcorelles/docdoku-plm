#!/bin/sh
killall nw;
echo "Cleaning old app";
rm -f app.nw;
echo "Creating new app archive";
zip -r ../app.zip *;
cd ..;
mv app.zip app.nw;
echo "Run the app";
/home/morgan/apps/node-webkit-v0.4.2-linux-x64/nw app.nw;