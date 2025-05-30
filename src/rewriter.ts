/*****************************************************
 * Before modifying the code here below, please      *
 * follow the instructions here:                     *
 * https://github.com/pagopa/docs-redirect/README.md *
 *****************************************************/
const DEV_PORTAL_BASE_URL = "https://developer.pagopa.it" as const;

type HelperType = "simple" | "versioned";

interface HelperRegExp extends RegExp {
  _helper: HelperType;
}

interface RedirectPattern {
  readonly regex: HelperRegExp;
  readonly redirectTo: string;
  readonly redirectVersionPrefix?: string;
}

declare namespace handler {
  export interface CloudFrontRequest {
    readonly uri: string;
  }

  export interface RedirectResponse {
    readonly statusCode: 301;
    readonly statusDescription: "Moved Permanently";
    readonly headers: {
      readonly location: { readonly value: string };
    };
  }

  export interface ErrorResponse {
    readonly statusCode: 400;
    readonly statusDescription: "Bad Request";
    readonly body: string;
  }

  export interface CloudFrontEvent {
    readonly request: CloudFrontRequest;
  }
}

const escapeRegexString = (input: string): string =>
  input.replace(/[.]/g, "\\$&");

const createSimpleRegex = (basePath: string, capturePath = true): HelperRegExp => {
  const escapedBase = escapeRegexString(basePath);
  const pattern = [
    `^(?:${escapedBase}$)|`,
    `(?:${escapedBase}`,
    capturePath ? "(\\/.*)" : "(?:\\/.*)",
    "$)"
  ].join("");

  const regex = new RegExp(pattern) as HelperRegExp;
  regex._helper = "simple";
  return regex;
};

const createVersionedRegex = ( basePath: string, versionPrefix?: string): HelperRegExp => {
  const escapedBase = escapeRegexString(basePath);
  const escapedPrefix = versionPrefix ? escapeRegexString(versionPrefix) : "";  
  const pattern = [
    `^(?:${escapedBase}$)|`,
    `(?:${escapedBase}`,
    "(\\/)" ,
    versionPrefix ? `(?:${escapedPrefix})?` : "",
    "v?(\\d+(?:\\.\\d+)*)?",
    "(?:\\-\\d+)?",
    "(.*)",
    "$)"
  ].join("");

  const regex = new RegExp(pattern) as HelperRegExp;
  regex._helper = "versioned";
  return regex;
};

const REDIRECT_PATTERNS: readonly RedirectPattern[] = [
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
    regex: createSimpleRegex("/manuale-operativo-pn", false),
    redirectTo: "/send/guides/manuale-operativo"
  },
  {
    regex: createVersionedRegex("/manuale-operativo"),
    redirectTo: "/send/guides/manuale-operativo"
  },
  {
    regex: createVersionedRegex("/f.a.q.-per-integratori"),
    redirectTo: "/send/guides/knowledge-base"
  }
] as const;

interface MatchResult {
  readonly hasTrailingSlash: boolean;
  readonly version: string | null;
  readonly remainingPath: string | null;
}

const parseMatch = (match: RegExpExecArray, helperType: HelperType): MatchResult => {
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

const buildTargetUrl = (redirectTo: string, matchResult: MatchResult, versionPrefix?: string): string => {
  let target = `${DEV_PORTAL_BASE_URL}${redirectTo}`;

  if (matchResult.version) {
    const prefix = versionPrefix ?? "v";
    target += `/${prefix}${matchResult.version}`;
  } else if (matchResult.hasTrailingSlash) {
    target += "/";
  }

  if (matchResult.remainingPath) {
    target += matchResult.remainingPath;
  }

  return target;
};

function handler(event: handler.CloudFrontEvent): handler.CloudFrontRequest | handler.RedirectResponse | handler.ErrorResponse {
  
  const uri = event?.request?.uri;

  if (!uri || typeof uri !== "string") {
    return {
      statusCode: 400,
      statusDescription: "Bad Request",
      body: "Invalid or missing URI"
    } as const;
  }

  for (const pattern of REDIRECT_PATTERNS) {
    const match = pattern.regex.exec(uri);
    if (match) {
      const matchResult = parseMatch(match, pattern.regex._helper);
      const targetUrl = buildTargetUrl(
        pattern.redirectTo,
        matchResult,
        pattern.redirectVersionPrefix
      );

      return {
        statusCode: 301,
        statusDescription: "Moved Permanently",
        headers: {
          location: { value: targetUrl }
        }
      } as const;
    }
  }

  return event.request;
}

export = handler;