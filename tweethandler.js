#!/usr/bin/env narwhal

var user = "izs";

try {
	var data = JSON.parse(
		require("http").read(
			"http://twitter.com/statuses/user_timeline.json?screen_name="+user+"&count=1"
		).decodeToString("UTF-8")
	)[0];
	system.stdout.print(data.text);
	require("os").exit(0);
} catch (e) {
	system.stderr.print("Error loading tweet data.").print(e.message);
	require("os").exit(1);
}
