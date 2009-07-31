#!/usr/bin/env narwhal

// */5 * * * * /Users/isaacs/dev/jack/narwhal-playground/tweethandler.js

var user = "izs",
	servers = [
		'foohack.com',
		'sistertrain.com',
		'visitbread.corp.yahoo.com'
	],
	os = require("os"),
	file = require("file"),
	ex;

try {
	var data = JSON.parse(
		require("http").read(
			"http://twitter.com/statuses/user_timeline.json?screen_name="+user+"&count=1"
		).decodeToString("UTF-8")
	)[0];
} catch (ex) {
	system.stderr.print("Error loading tweet data.").print(e.message);
	os.exit(1);
}


// @-replies aren't statuses, they're comments.
// Skip them.
if (
	data.in_reply_to_screen_name !== null
	|| data.in_reply_to_user_id !== null
	|| data.in_reply_to_status_id !== null
	|| data.text.substr(0,1) === '@'
) exit(0);


// only handle new tweets, so we don't keep updating over and over again.
var created_at = (new Date(data.created_at)).getTime();
var last_tweet;
try {
	last_tweet = +(file.read(system.env.HOME+'/.last_tweet'));
} catch (ex) {} finally {
	if (isNaN(last_tweet)) last_tweet = 0;
}
if (last_tweet >= created_at) os.exit(0);
file.write(system.env.HOME+'/.last_tweet', created_at.toString());


// write the plan, so we're set for fingering.
file.write(system.env.HOME+'/.plan', data.text);



// if adium running, set the chat status with some applescript
//@TODO An applescript module would be pretty tight.
if (+(os.command("ps aux | grep Adium | grep -v grep | wc -l"))) {
	os.popen('osascript -e '+os.enquote(
		'tell application "Adium" to '+
		'set status message of every account to '+
		'"' + data.text.replace(/([\\"])/g,'\\$1') + '"'
	));
}

// just kick off the process, don't bother waiting for the response.
//@TODO Fill out the os-platform stuff to support sending a kill
// signal after a certain amount of time has passed.
servers.forEach(function (server) {
	//@NOTE The popen will let the process keep going as long as it needs to,
	// even if this javascript program ends ahead of time, which it will.
	os.popen('rsync --timeout=1 '+system.env.HOME+'/.plan '+server+':~/');
});


os.exit(0);
