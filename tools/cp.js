var path = require('path');
var cp = require('child_process');
var fs = require('fs');

fs.readdir('../src/projects/', function(err, files) {
  for (let i = 0; i < files.length; i++) {
    // console.log(files[i]);
    fs.readdir(`../src/projects/${files[i]}/app/`, function(err, folder) {
      cp.exec(
        `cp -r ../src/dist/hero.js ../src/projects/${
          files[i]
        }/app/dist/ && cp -r ../src/hero.js ../src/projects/${files[i]}/app/`
      );
    });
  }
});
