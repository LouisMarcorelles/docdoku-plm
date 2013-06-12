#!/bin/sh

cd /home/morgan/gitsrc/docdoku-plm/docdoku-cli;
/home/morgan/apps/apache-maven-2.2.1/bin/mvn clean install;

cp /home/morgan/gitsrc/docdoku-plm/docdoku-cli/target/*.jar /home/morgan/gitsrc/docdoku-plm/docdoku-cli-gui/dplm/;