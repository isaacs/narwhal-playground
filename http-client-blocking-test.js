// This demonstrates how the HttpClient can handle multiple concurrent requests,
// only blocking once you decide you want to read the request body stream,
// and letting other requests finish in the background while doing so.

var HttpClient = require("http-client").HttpClient;

var noop = function () {}

var timer = (function () {
    var tick, tock, laps = [];
    return {
        start : function () { 
            laps = [];
            tock = tick = new Date().getTime()
        },
        lap : function (name) {
            now = new Date().getTime();
            tock = now - tock;
            laps.push([name, now - tick, tock]);
            tock = now;
        },
        print : function () { laps.forEach(function (o) { print(o.join("\t")) }) }
    };
})();

timer.start();
var sleeper1 = HttpClient({url:"http://foohack.com/tests/sleep.php?sleep=5"});
var sleeper2 = HttpClient({url:"http://foohack.com/tests/sleep.php?sleep=6"});
// this one never gets read, so we don't have to wait 15 seconds.
var sleeper3 = HttpClient({url:"http://foohack.com/tests/sleep.php?sleep=15"});
var sleeper4 = HttpClient({url:"http://google.com"});


timer.lap("\n\ninit\t");

sleeper1 = sleeper1.connect(true).body;
timer.lap("sleep5 connect");

sleeper2 = sleeper2.connect(true).body;
timer.lap("sleep6 connect");

sleeper3 = sleeper3.connect(true).body;
timer.lap("sleep15 connect");

sleeper4 = sleeper4.connect(true).body;
timer.lap("google connect");

sleeper1.forEach(noop);
timer.lap("sleep5 output");

sleeper2.forEach(noop);
timer.lap("sleep6 output");

sleeper4.forEach(noop);
timer.lap("google output");

timer.print();
