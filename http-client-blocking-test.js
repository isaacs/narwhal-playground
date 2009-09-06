// might want to pipe 2>/dev/null when running this script.  It's noisy.
// It demonstrates how the HTTPClient can handle multiple concurrent requests,
// only blocking once you decide you want to read the request body stream.

var HTTPClient = require("http-client").HTTPClient;

var writer = function (stream) {
    return function (m) {
        stream.write(m);
        stream.flush();
    };
};

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
var sleeper1 = HTTPClient({url:"http://localhost/sandbox/sleep.php?sleep=5"});
var sleeper2 = HTTPClient({url:"http://localhost/sandbox/sleep.php?sleep=6"});
// this one never gets read, so we don't have to wait 15 seconds.
var sleeper3 = HTTPClient({url:"http://localhost/sandbox/sleep.php?sleep=15"});
var sleeper4 = HTTPClient({url:"http://google.com"});


timer.lap("\n\ninit\t");

sleeper1 = sleeper1.connect(true).body;
timer.lap("sleep5 connect");

sleeper2 = sleeper2.connect(true).body;
timer.lap("sleep6 connect");

sleeper3 = sleeper3.connect(true).body;
timer.lap("sleep15 connect");

sleeper4 = sleeper4.connect(true).body;
timer.lap("google connect");

sleeper1.forEach(writer(system.stderr));
timer.lap("sleep5 output");

sleeper2.forEach(writer(system.stderr));
timer.lap("sleep6 output");

sleeper4.forEach(writer(system.stderr));
timer.lap("google output");

timer.print();
