/*****************************************************
 * Before modifying the code here below, please      *
 * follow the instructions here:                     *
 * https://github.com/pagopa/docs-redirect/README.md *
 *****************************************************/
var devPortalBaseURL = "https://developer.pagopa.it";

var stringToRegex = function(strToRegex) {
    return strToRegex.replaceAll("/", "\\/").replaceAll(".", "\\.")
}

var simpleHelper = function(base) {
    var stringRegex = stringToRegex(base) + "(.*)";
    var regex = new RegExp(stringRegex);
    regex._helper = "simpleHelper";
    return regex;
}

var versionedHelper = function(base, versionPrefix) {
    var stringRegex = stringToRegex(base) + "(\\/)?";
    if (typeof versionPrefix !== 'undefined' && versionPrefix !== null ) {
        stringRegex += "(?:" + stringToRegex(versionPrefix) + ")?";
    }
    stringRegex += "(v?\\d+(?:\\.\\d+)*)?(?:\\-\\d+)?(.*)";
    var regex = new RegExp(stringRegex);
    regex._helper = "versionedHelper";
    return regex;
};

var regexPatterns = [
    {
        regex: versionedHelper("/io-guida-tecnica/io-guida-tecnica-2.3"), redirectTo: "/app-io/guides/io-guida-tecnica/v2.3"
    },
    {
        regex: versionedHelper("/io-guida-tecnica/io-guida-tecnica-2.2"), redirectTo: "/app-io/guides/io-guida-tecnica/v2.2"
    },
    {
        regex: versionedHelper("/io-guida-tecnica/io-guida-tecnica-1.3"), redirectTo: "/app-io/guides/io-guida-tecnica/v1.3"
    },
    {
        regex: versionedHelper("/io-guida-tecnica/guida-tecnica-1.2"), redirectTo: "/app-io/guides/io-guida-tecnica/v1.2"
    },
    {
        regex: versionedHelper("/io-guida-tecnica"), redirectTo: "/app-io/guides/io-guida-tecnica"
    },
    {
        regex: versionedHelper("/manuale-servizi/manuale-servizi-"), redirectTo: "/app-io/guides/manuale-servizi"
    },
    {
        regex: versionedHelper("/manuale-servizi"), redirectTo: "/app-io/guides/manuale-servizi"
    },
    {
        regex: versionedHelper("/manuale-operativo-di-firma-con-io"), redirectTo: "/firma-con-io/guides/manuale-operativo"
    },
    {
        regex: versionedHelper("/guida-alla-scelta-di-firma-con-io"), redirectTo: "/firma-con-io/guides/guida-scelta-firma"
    },
    {
        regex: versionedHelper("/saci","saci-"), redirectTo: "/pago-pa/guides/saci"
    },
    {
        regex: versionedHelper("/sanp", "sanp-"), redirectTo: "/pago-pa/guides/sanp"
    },    
    {
        regex: versionedHelper("/manuale-operativo"), redirectTo: "/send/guides/manuale-operativo"
    },
    {
        regex: versionedHelper("/f.a.q.-per-integratori"), redirectTo: "/send/guides/knowledge-base"
    }
];

function handler(event) {
    if (!event || !event.request || typeof event.request.uri !== 'string') {
        return {
            statusCode: 400,
            statusDescription: "Bad Request",
            body: "Invalid URI"
        };
    }

    var uri = event.request.uri;

    for (var i = 0; i < regexPatterns.length; i++) {
        var pattern = regexPatterns[i];
        var match = pattern.regex.exec(uri);

        if (match) {
            var preVersionPath = null, version = null, path = null;

            if (pattern.regex._helper == "versionedHelper") {
                preVersionPath = match[1];
                version = match[2];
                path = match[3];
            }

            if (pattern.regex._helper == "simpleHelper") {
                path = match[1];
            }

            var targetUri = devPortalBaseURL + pattern.redirectTo;

            if (version) {
                targetUri += "/" + version;
            } else {
                if (preVersionPath) {
                    targetUri += "/";
                }
            }

            if (path) {
                targetUri += path ;
            }

            return {
                statusCode: 301,
                statusDescription: "Moved Permanently",
                headers: {
                    location: { value: targetUri }
                }
            };
        }
    }

    return event.request;
}