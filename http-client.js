var HTTPClient = require("http-client").HTTPClient;

var result = HTTPClient({ method: "POST", url : "http://localhost/sandbox/phpinfo.php" })
    .setHeader("X-Some-Header", "some value")
    .write("foo=bar&")
    .write("a=b")
    .finish();

print(result.status);
for (var i in result.headers) {
    print(i+": "+result.headers[i]);
}
print("");

HTTPClient.decode(result).body.forEach(print);
