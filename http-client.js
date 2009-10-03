var HttpClient = require("http-client").HttpClient;


var result = HttpClient({
        // these can be set on the ctor, or by calling set() later, as we'll see.
        // headers (object), and body (forEach()able) could also be put here.
        // body can also be push()ed onto using the write() sugar method below.
        method: "GET",
        url : "http://example.com/"
    })
    .setOption("method", "PUT") // changed my mind
    .setHeader("X-Some-Header", "some value") // add headers like this
    .setOption("headers", { "X-Favorite-Movie" : "Forrest Gump" }) // or like this
    .setOption({headers : { "X-Favorite-Movie" : "Unbreakable" }}) // This works, too, and overwrites.
    .write("foo=bar&") // add request body, assuming body implements push()
    .write("a=b") // write can be called multiple times
    .setOptions({ method : "POST" }) // changed my mind again, this time with an object.
    .setHeader("X-Set-After-Writing", "and it works!") // anything goes before the connect()
    .connect(); // writes and sets are now meaningless, but doesn't block until we forEach on the body.

print(JSON.stringify(result));

print(result.statusText);
for (var i in result.headers) {
    print(i+": "+result.headers[i]);
}
print("");

// HttpClient.decode() decodes a response object into a new response object
// whose bytes are interpreted as strings according to a best guess as to
// the encoding the server intended.  Just a little sweetener for text data.

// need to use stdout.write, because print() adds a \n after each bit.
// the body gets iterated in blocks of 1024 bytes, making it possible
// to save big files or whatever without having the whole request read
// memory at once.
HttpClient.decode(result).body.forEach(system.stdout.write);
system.stdout.flush();

