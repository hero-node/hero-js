
/*
  log.js
  Created by gpliu on 14/10/16.
  Copyright (c) 2015年 GPLIU. All rights reserved.
*/
//  log
var logs = [];

function writeLog() {
    if (logs.length > 0) {
        xhr({
            url: ('/api/v2/monitor/behavior'),
            async: true,
            method: 'POST',
            data: {
                user: localStorage.username,
                path: window.location.href,
                logs: logs
            },
            error: function() {}
        });
        logs = [];
    };
    setTimeout(function() {
        writeLog();
    }, 10000)
}

function log(log) {
    logs.push(JSON.stringify(log));
}
var log_in = Hero.in;
Hero.in = function(data) {
    if (typeof(data) === 'string') {
        data = JSON.parse(data);
    }
    log_in(data);
    data.timestamp = Date.parse(new Date());
    log(data);

}
var log_out = Hero.out;
Hero.out = function(data) {
    if (typeof(data) === 'string') {
        data = JSON.parse(data);
    }
    log_out(data);
    data.timestamp = Date.parse(new Date());
    log(data);
}
writeLog(); 