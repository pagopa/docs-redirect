"use strict";
/*****************************************************
 * Before modifying the code here below, please      *
 * follow the instructions here:                     *
 * https://github.com/pagopa/docs-redirect/README.md *
 *****************************************************/
var devPortalBaseURL = "https://developer.pagopa.it";
var stringToRegex = function (s) {
    return s.replace(/\//g, "\\/").replace(/\./g, "\\.");
};
var simpleHelper = function (base, usePath) {
    if (usePath === void 0) { usePath = true; }
    var pattern = stringToRegex(base);
    if (usePath)
        pattern += "(.*)";
    var re = new RegExp(pattern);
    re._helper = "simpleHelper";
    return re;
};
var versionedHelper = function (base, versionPrefix) {
    var pattern = "".concat(stringToRegex(base), "(\\/)?");
    if (versionPrefix != null) {
        pattern += "(?:".concat(stringToRegex(versionPrefix), ")?");
    }
    pattern += "v?(\\d+(?:\\.\\d+)*)?(?:\\-\\d+)?(.*)";
    var re = new RegExp(pattern);
    re._helper = "versionedHelper";
    return re;
};
var regexPatterns = [
    { regex: versionedHelper("/io-guida-tecnica/v5.2-preview"), redirectTo: "/app-io/guides/io-guida-tecnica/v6.0" },
    { regex: versionedHelper("/io-guida-tecnica/guida-tecnica-1.2"), redirectTo: "/app-io/guides/io-guida-tecnica/v1.2" },
    { regex: versionedHelper("/io-guida-tecnica", "io-guida-tecnica-"), redirectTo: "/app-io/guides/io-guida-tecnica" },
    { regex: versionedHelper("/io-guida-tecnica"), redirectTo: "/app-io/guides/io-guida-tecnica" },
    { regex: versionedHelper("/manuale-servizi/manuale-servizi-"), redirectTo: "/app-io/guides/manuale-servizi" },
    { regex: versionedHelper("/manuale-servizi"), redirectTo: "/app-io/guides/manuale-servizi" },
    { regex: versionedHelper("/manuale-operativo-di-firma-con-io"), redirectTo: "/firma-con-io/guides/manuale-operativo" },
    { regex: versionedHelper("/guida-alla-scelta-di-firma-con-io"), redirectTo: "/firma-con-io/guides/guida-scelta-firma" },
    { regex: versionedHelper("/saci", "saci-"), redirectTo: "/pago-pa/guides/saci", redirectVersionPrefix: "" },
    { regex: versionedHelper("/sanp", "sanp-"), redirectTo: "/pago-pa/guides/sanp", redirectVersionPrefix: "" },
    { regex: versionedHelper("/manuale-operativo"), redirectTo: "/send/guides/manuale-operativo" },
    { regex: versionedHelper("/f.a.q.-per-integratori"), redirectTo: "/send/guides/knowledge-base" }
];
function handler(event) {
    var _a, _b, _c, _d, _e;
    var uri = (_a = event === null || event === void 0 ? void 0 : event.request) === null || _a === void 0 ? void 0 : _a.uri;
    if (typeof uri !== "string") {
        return {
            statusCode: 400,
            statusDescription: "Bad Request",
            body: "Invalid URI"
        };
    }
    for (var _i = 0, regexPatterns_1 = regexPatterns; _i < regexPatterns_1.length; _i++) {
        var _f = regexPatterns_1[_i], regex = _f.regex, redirectTo = _f.redirectTo, redirectVersionPrefix = _f.redirectVersionPrefix;
        var match = regex.exec(uri);
        if (!match)
            continue;
        var preVersionPath = null;
        var version = null;
        var path = null;
        if (regex._helper === "versionedHelper") {
            preVersionPath = (_b = match[1]) !== null && _b !== void 0 ? _b : null;
            version = (_c = match[2]) !== null && _c !== void 0 ? _c : null;
            path = (_d = match[3]) !== null && _d !== void 0 ? _d : null;
        }
        else {
            path = (_e = match[1]) !== null && _e !== void 0 ? _e : null;
        }
        var target = "".concat(devPortalBaseURL).concat(redirectTo);
        if (version) {
            target += "/".concat(redirectVersionPrefix !== null && redirectVersionPrefix !== void 0 ? redirectVersionPrefix : "v").concat(version);
        }
        else if (preVersionPath) {
            target += "/";
        }
        if (path)
            target += path;
        return {
            statusCode: 301,
            statusDescription: "Moved Permanently",
            headers: { location: { value: target } }
        };
    }
    return event.request;
}
