var HTTPClient = require("http-client").HTTPClient;


var result = HTTPClient({
        // these can be set on the ctor, or by calling set() later, as we'll see.
        // headers (object), and body (forEach()able) could also be put here.
        // body can also be push()ed onto using the write() sugar method below.
        method: "GET",
        url : "http://localhost/sandbox/phpinfo.php"
    })
    .set("method", "PUT") // changed my mind
    .setHeader("X-Some-Header", "some value") // add headers like this
    .set("headers", { "X-Favorite-Movie" : "Forrest Gump" }) // or like this
    .set({headers : { "X-Favorite-Movie" : "Unbreakable" }}) // This works, too, and overwrites.
    .write("foo=bar&") // add request body, assuming body implements push()
    .write("a=b") // write can be called multiple times
    .set({ method : "POST" }) // changed my mind again, this time with an object.
    .setHeader("X-Set-After-Writing", "and it works!") // anything goes before the connect()
    .connect() // writes and sets are now meaningless, but doesn't block until we read()
    .read(); // returns a response object. end of the line. (implicitly calls connect() if necessary)
// alternatively, .finish() is an alias for .connect().read()

print(result.statusText);
for (var i in result.headers) {
    print(i+": "+result.headers[i]);
}
print("");

// HTTPClient.decode() decodes a response object into a new response object
// whose bytes are interpreted as strings according to a best guess as to
// the encoding the server intended.  Just a little sweetener for text data.

// need to use stdout.write, because print() adds a \n after each bit.
// the body gets iterated in blocks of 1024 bytes, making it possible
// to save big files or whatever without having the whole request read
// memory at once.
HTTPClient.decode(result).body.forEach(system.stdout.write);
system.stdout.flush();

