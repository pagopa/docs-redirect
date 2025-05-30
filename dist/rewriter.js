"use strict";
/*****************************************************
 * Before modifying the code here below, please      *
 * follow the instructions here:                     *
 * https://github.com/pagopa/docs-redirect/README.md *
 *****************************************************/
var DEV_PORTAL_BASE_URL = "https://developer.pagopa.it";
var escapeRegexString = function (input) {
    return input.replace(/[.]/g, "\\$&");
};
var createSimpleRegex = function (basePath, capturePath) {
    if (capturePath === void 0) { capturePath = true; }
    var pattern = escapeRegexString(basePath) + (capturePath ? "(.*)" : "");
    var regex = new RegExp("^".concat(pattern, "$"));
    regex._helper = "simple";
    return regex;
};
var createVersionedRegex = function (basePath, versionPrefix) {
    var escapedBase = escapeRegexString(basePath);
    var escapedPrefix = versionPrefix ? escapeRegexString(versionPrefix) : "";
    var pattern = [
        "^".concat(escapedBase),
        "(\\/)?",
        versionPrefix ? "(?:".concat(escapedPrefix, ")?") : "",
        "v?(\\d+(?:\\.\\d+)*)?",
        "(?:\\-\\d+)?",
        "(.*)",
        "$"
    ].join("");
    var regex = new RegExp(pattern);
    regex._helper = "versioned";
    return regex;
};
var REDIRECT_PATTERNS = [
    {
        regex: createVersionedRegex("/io-guida-tecnica/v5.2-preview"),
        redirectTo: "/app-io/guides/io-guida-tecnica/v6.0"
    },
    {
        regex: createVersionedRegex("/io-guida-tecnica/guida-tecnica-1.2"),
        redirectTo: "/app-io/guides/io-guida-tecnica/v1.2"
    },
    {
        regex: createVersionedRegex("/io-guida-tecnica", "io-guida-tecnica-"),
        redirectTo: "/app-io/guides/io-guida-tecnica"
    },
    {
        regex: createVersionedRegex("/io-guida-tecnica"),
        redirectTo: "/app-io/guides/io-guida-tecnica"
    },
    {
        regex: createVersionedRegex("/manuale-servizi", "manuale-servizi-"),
        redirectTo: "/app-io/guides/manuale-servizi"
    },
    {
        regex: createVersionedRegex("/manuale-servizi"),
        redirectTo: "/app-io/guides/manuale-servizi"
    },
    {
        regex: createVersionedRegex("/manuale-operativo-di-firma-con-io"),
        redirectTo: "/firma-con-io/guides/manuale-operativo"
    },
    {
        regex: createVersionedRegex("/guida-alla-scelta-di-firma-con-io"),
        redirectTo: "/firma-con-io/guides/guida-scelta-firma"
    },
    {
        regex: createVersionedRegex("/saci", "saci-"),
        redirectTo: "/pago-pa/guides/saci",
        redirectVersionPrefix: ""
    },
    {
        regex: createVersionedRegex("/sanp", "sanp-"),
        redirectTo: "/pago-pa/guides/sanp",
        redirectVersionPrefix: ""
    },
    {
        regex: createVersionedRegex("/manuale-operativo"),
        redirectTo: "/send/guides/manuale-operativo"
    },
    {
        regex: createVersionedRegex("/f.a.q.-per-integratori"),
        redirectTo: "/send/guides/knowledge-base"
    }
];
var parseMatch = function (match, helperType) {
    if (helperType === "simple") {
        return {
            hasTrailingSlash: false,
            version: null,
            remainingPath: match[1] || null
        };
    }
    return {
        hasTrailingSlash: Boolean(match[1]),
        version: match[2] || null,
        remainingPath: match[3] || null
    };
};
var buildTargetUrl = function (redirectTo, matchResult, versionPrefix) {
    var target = "".concat(DEV_PORTAL_BASE_URL).concat(redirectTo);
    if (matchResult.version) {
        var prefix = versionPrefix !== null && versionPrefix !== void 0 ? versionPrefix : "v";
        target += "/".concat(prefix).concat(matchResult.version);
    }
    else if (matchResult.hasTrailingSlash) {
        target += "/";
    }
    if (matchResult.remainingPath) {
        target += matchResult.remainingPath;
    }
    return target;
};
function handler(event) {
    var _a;
    var uri = (_a = event === null || event === void 0 ? void 0 : event.request) === null || _a === void 0 ? void 0 : _a.uri;
    if (!uri || typeof uri !== "string") {
        return {
            statusCode: 400,
            statusDescription: "Bad Request",
            body: "Invalid or missing URI"
        };
    }
    for (var _i = 0, REDIRECT_PATTERNS_1 = REDIRECT_PATTERNS; _i < REDIRECT_PATTERNS_1.length; _i++) {
        var pattern = REDIRECT_PATTERNS_1[_i];
        var match = pattern.regex.exec(uri);
        if (match) {
            var matchResult = parseMatch(match, pattern.regex._helper);
            var targetUrl = buildTargetUrl(pattern.redirectTo, matchResult, pattern.redirectVersionPrefix);
            return {
                statusCode: 301,
                statusDescription: "Moved Permanently",
                headers: {
                    location: { value: targetUrl }
                }
            };
        }
    }
    return event.request;
}
