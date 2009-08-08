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
			"http://twitter.com/statuses/user_timeline.json?screen_name="+user+"&count=10"
		).decodeToString("UTF-8")
	);
} catch (ex) {

	// It made sense to show an error about this, but Twitter's under attack,
	// and getting emails every 5 minutes when the API is down is just not fun.
	// Fucking russian mobsters!

	// system.stderr.print("Error loading tweet data.").print(ex.message);
	os.exit(1);
}

data.forEach(function (data) {
	// @-replies aren't statuses, they're comments.
	// Skip them.
	if (
		data.in_reply_to_screen_name !== null
		|| data.in_reply_to_user_id !== null
		|| data.in_reply_to_status_id !== null
		|| data.text.substr(0,1) === '@'
		// also skip "public" @-replies
		|| data.text.substr(1,1) === '@'
	) return;


	// only handle new tweets, so we don't keep updating over and over again.
	// We can stop scrolling through once we find an old one, since they're in order.
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
	//@TODO Need a cross-platform way to figure out if a program is running?
	// Grep and wc can be simulated in JS, but ps is rather low-level.
	if (+(os.command("ps aux | grep Adium | grep -v grep | wc -l"))) try {
		os.popen('osascript -e '+os.enquote(
			'tell application "Adium" to '+
			'set status message of every account to '+
			'"' + data.text.replace(/([\\"])/g,'\\$1') + '"'
		));
	} catch (ex) {
		// do nothing. it's ok if this fails, no biggie.
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
});

os.exit(0)