// seeing what i can get away with...

var o = {},
    HashP = require("hashp").HashP,
    JSON = require("json"),
    URL = require("url");

Object.defineProperty(o, "url", (function () {
    var toString = function () {
            return this.url;
        },
        url = {url:"", toString:toString};
    return {
        set : function (u) {
            if (typeof u === "string") u = URL.parse(u);
            ["protocol", "domain", "path", "url"].forEach(function (part) {
                if (!(part in u)) throw new Error(
                    "Supplied URL does not appear to have a "+i+". "+
                    "Please supply a valid string or a URL object."
                );
            });
            url = u;
            url.toString = toString;
        },
        get : function () {
            return url;
        }
    };
})());

o.url = "http://foo.com/bar/baz";

print(JSON.stringify(o.url));

o.url += "/asdf/quux";

print(JSON.stringify(o.url));
