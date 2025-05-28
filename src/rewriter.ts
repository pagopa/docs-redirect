/*****************************************************
 * Before modifying the code here below, please      *
 * follow the instructions here:                     *
 * https://github.com/pagopa/docs-redirect/README.md *
 *****************************************************/
const devPortalBaseURL = "https://developer.pagopa.it";

type HelperType = "simpleHelper" | "versionedHelper";

interface HelperRegExp extends RegExp {
  _helper: HelperType;
}

interface RegexPattern {
  regex: HelperRegExp;
  redirectTo: string;
  redirectVersionPrefix?: string;
}

declare namespace handler {
  export interface CloudFrontRequest {
    uri: string;
  }

  export interface RedirectResponse {
    statusCode: 301;
    statusDescription: "Moved Permanently";
    headers: { location: { value: string } };
  }

  export interface ErrorResponse {
    statusCode: 400;
    statusDescription: "Bad Request";
    body: string;
  }

  export interface CloudFrontEvent {
    request: CloudFrontRequest;
  }
}

const stringToRegex = (s: string): string =>
  s.replace(/\//g, "\\/").replace(/\./g, "\\.");

const simpleHelper = (base: string, usePath = true): HelperRegExp => {
  let pattern = stringToRegex(base);
  if (usePath) pattern += "(.*)";

  const re = new RegExp(pattern) as HelperRegExp;
  re._helper = "simpleHelper";
  return re;
};

const versionedHelper = (
  base: string,
  versionPrefix?: string
): HelperRegExp => {
  let pattern = `${stringToRegex(base)}(\\/)?`;
  if (versionPrefix != null) {
    pattern += `(?:${stringToRegex(versionPrefix)})?`;
  }
  pattern += "v?(\\d+(?:\\.\\d+)*)?(?:\\-\\d+)?(.*)";

  const re = new RegExp(pattern) as HelperRegExp;
  re._helper = "versionedHelper";
  return re;
};

const regexPatterns: RegexPattern[] = [
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

function handler( event: handler.CloudFrontEvent): handler.CloudFrontRequest | handler.RedirectResponse | handler.ErrorResponse {
  const uri = event?.request?.uri;

  if (typeof uri !== "string") {
    return {
      statusCode: 400,
      statusDescription: "Bad Request",
      body: "Invalid URI"
    };
  }

  for (const { regex, redirectTo, redirectVersionPrefix } of regexPatterns) {
    const match = regex.exec(uri);
    if (!match) continue;

    let preVersionPath: string | null = null;
    let version: string | null = null;
    let path: string | null = null;

    if (regex._helper === "versionedHelper") {
      preVersionPath = match[1] ?? null;
      version = match[2] ?? null;
      path = match[3] ?? null;
    } else {
      path = match[1] ?? null;
    }

    let target = `${devPortalBaseURL}${redirectTo}`;

    if (version) {
      target += `/${redirectVersionPrefix ?? "v"}${version}`;
    } else if (preVersionPath) {
      target += "/";
    }

    if (path) target += path;

    return {
      statusCode: 301,
      statusDescription: "Moved Permanently",
      headers: { location: { value: target } }
    };
  }

  return event.request;
}

export = handler;