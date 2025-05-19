const handler = require('./rewriter');

const buildRequest = (path: string) => {
    return {
        request: {
            uri: path
        } 
    }
}

const buildResponse = (path: string) => {
    return {
        statusCode: 301,
        statusDescription: "Moved Permanently",
        headers: {
            location: { value: path }
        }
    }
}

describe('Unexisting resources', () => {
    it('Should not intercept these resources', () => {
        expect(handler(buildRequest("/not-mapped/")).uri).toBe( "/not-mapped/" )
        expect(handler(buildRequest("/not-mapped/subpath/1.2.3")).uri).toBe( "/not-mapped/subpath/1.2.3" )
    })
});

describe('Active rules', () => {

    it('Should intercept these resources', () => {
        expect(handler(buildRequest("/sanp/sanp-2.5.1"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/sanp/2.5.1"));
    })

    it('Should intercept manuale-operativo-di-firma-con-io resources that must be redirected', () => {
        expect(handler(buildRequest("/manuale-operativo-di-firma-con-io"))).toEqual(buildResponse( "https://developer.pagopa.it/firma-con-io/guides/manuale-operativo"));
        expect(handler(buildRequest("/manuale-operativo-di-firma-con-io/changelog"))).toEqual(buildResponse( "https://developer.pagopa.it/firma-con-io/guides/manuale-operativo/changelog"));
    });

    it('Should intercept guida-alla-scelta-di-firma-con-io resources that must be redirected', () => {
        expect(handler(buildRequest("/guida-alla-scelta-di-firma-con-io"))).toEqual(buildResponse( "https://developer.pagopa.it/firma-con-io/guides/guida-scelta-firma"));
        expect(handler(buildRequest("/guida-alla-scelta-di-firma-con-io/v1.0"))).toEqual(buildResponse( "https://developer.pagopa.it/firma-con-io/guides/guida-scelta-firma/v1.0"));
    });

    it('Should intercept SEND\'s manuale-operativo resources that must be redirected', () => {
        expect(handler(buildRequest("/manuale-operativo"))).toEqual(buildResponse( "https://developer.pagopa.it/send/guides/manuale-operativo"));
        expect(handler(buildRequest("/manuale-operativo/piattaforma-notifiche-digitali-manuale-operativo/glossario"))).toEqual(buildResponse( "https://developer.pagopa.it/send/guides/manuale-operativo/piattaforma-notifiche-digitali-manuale-operativo/glossario"));
        expect(handler(buildRequest("/manuale-operativo/v1.0"))).toEqual(buildResponse( "https://developer.pagopa.it/send/guides/manuale-operativo/v1.0"));
        expect(handler(buildRequest("/manuale-operativo/v1.0.1"))).toEqual(buildResponse( "https://developer.pagopa.it/send/guides/manuale-operativo/v1.0.1"));
        expect(handler(buildRequest("/manuale-operativo/v1.1"))).toEqual(buildResponse( "https://developer.pagopa.it/send/guides/manuale-operativo/v1.1"));
        expect(handler(buildRequest("/manuale-operativo/v1.1-1"))).toEqual(buildResponse( "https://developer.pagopa.it/send/guides/manuale-operativo/v1.1"));
        expect(handler(buildRequest("/manuale-operativo/v1.1.3"))).toEqual(buildResponse( "https://developer.pagopa.it/send/guides/manuale-operativo/v1.1.3"));
    });

    it('Should intercept SEND\'s knowledge-base resources that must be redirected', () => {
        expect(handler(buildRequest("/f.a.q.-per-integratori"))).toEqual(buildResponse( "https://developer.pagopa.it/send/guides/knowledge-base"));
        expect(handler(buildRequest("/f.a.q.-per-integratori/v1.0"))).toEqual(buildResponse( "https://developer.pagopa.it/send/guides/knowledge-base/v1.0"));
        expect(handler(buildRequest("/f.a.q.-per-integratori/v1.0-1"))).toEqual(buildResponse( "https://developer.pagopa.it/send/guides/knowledge-base/v1.0"));
        expect(handler(buildRequest("/f.a.q.-per-integratori/v2.0-2"))).toEqual(buildResponse( "https://developer.pagopa.it/send/guides/knowledge-base/v2.0"));
        expect(handler(buildRequest("/f.a.q.-per-integratori/v2.1-2"))).toEqual(buildResponse( "https://developer.pagopa.it/send/guides/knowledge-base/v2.1"));
        expect(handler(buildRequest("/f.a.q.-per-integratori/v2.3-1"))).toEqual(buildResponse( "https://developer.pagopa.it/send/guides/knowledge-base/v2.3"));
        expect(handler(buildRequest("/f.a.q.-per-integratori/v2.4-1"))).toEqual(buildResponse( "https://developer.pagopa.it/send/guides/knowledge-base/v2.4"));
        expect(handler(buildRequest("/f.a.q.-per-integratori/v2.5"))).toEqual(buildResponse( "https://developer.pagopa.it/send/guides/knowledge-base/v2.5"));
    });

    it('Should intercept SACI resources that must be redirected', () => {
        expect(handler(buildRequest("/saci"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/saci"));
        expect(handler(buildRequest("/saci/"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/saci/"));
        expect(handler(buildRequest("/saci/specifiche-attuative-dei-codici-identificativi-di-versamento-riversamento-e-rendicontazione/generazione-dellidentificativo-univoco-di-versamento"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/saci/specifiche-attuative-dei-codici-identificativi-di-versamento-riversamento-e-rendicontazione/generazione-dellidentificativo-univoco-di-versamento"));
        expect(handler(buildRequest("/saci/saci-3.2.0"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/saci/3.2.0"));
        expect(handler(buildRequest("/saci/saci-3.2.0/"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/saci/3.2.0/"));
        expect(handler(buildRequest("/saci/saci-3.2.0/specifiche-attuative-dei-codici-identificativi-di-versamento-riversamento-e-rendicontazione/generazione-dellidentificativo-univoco-di-versamento"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/saci/3.2.0/specifiche-attuative-dei-codici-identificativi-di-versamento-riversamento-e-rendicontazione/generazione-dellidentificativo-univoco-di-versamento"));
        expect(handler(buildRequest("/saci/saci-3.2.1"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/saci/3.2.1"));
    });

    it('Should intercept SANP resources that must be redirected', () => {
        expect(handler(buildRequest("/sanp"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/sanp"));
        expect(handler(buildRequest("/sanp/specifiche-attuative-del-nodo-dei-pagamenti-spc/changelog"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/sanp/specifiche-attuative-del-nodo-dei-pagamenti-spc/changelog"));
        expect(handler(buildRequest("/sanp/sanp-2.5.1"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/sanp/2.5.1"));
        expect(handler(buildRequest("/sanp/sanp-3.0.0"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/sanp/3.0.0"));
        expect(handler(buildRequest("/sanp/sanp-3.8.0"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/sanp/3.8.0"));
        expect(handler(buildRequest("/sanp/sanp-3.8.0/specifiche-attuative-del-nodo-dei-pagamenti-spc/changelog"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/sanp/3.8.0/specifiche-attuative-del-nodo-dei-pagamenti-spc/changelog"));
        expect(handler(buildRequest("/sanp/sanp-3.9.0"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/sanp/3.9.0"));
        expect(handler(buildRequest("/sanp/sanp-3.9.1"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/sanp/3.9.1"));
    });

    it('Should intercept manuale-servizi resources that must be redirected', () => {
        expect(handler(buildRequest("/manuale-servizi"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/manuale-servizi"));
        expect(handler(buildRequest("/manuale-servizi/storico-delle-modifiche"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/manuale-servizi/storico-delle-modifiche"));
        expect(handler(buildRequest("/manuale-servizi/v2.4"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/manuale-servizi/v2.4"));
        expect(handler(buildRequest("/manuale-servizi/v2.4/storico-delle-modifiche"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/manuale-servizi/v2.4/storico-delle-modifiche"));
        expect(handler(buildRequest("/manuale-servizi/v1.1-2"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/manuale-servizi/v1.1"));
        expect(handler(buildRequest("/manuale-servizi/v1.1-2/storico-delle-modifiche"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/manuale-servizi/v1.1/storico-delle-modifiche"));
        expect(handler(buildRequest("/manuale-servizi/manuale-servizi-v1.0"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/manuale-servizi/v1.0"));
        expect(handler(buildRequest("/manuale-servizi/manuale-servizi-v1.0/changelog"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/manuale-servizi/v1.0/changelog"));
        });

    it('Should intercept io-guida-tecnica resources that must be redirected', () => {
        expect(handler(buildRequest("/io-guida-tecnica"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/io-guida-tecnica"));
        expect(handler(buildRequest("/io-guida-tecnica/changelog"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/io-guida-tecnica/changelog"));
        expect(handler(buildRequest("/io-guida-tecnica/v5.0"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/io-guida-tecnica/v5.0"));
        expect(handler(buildRequest("/io-guida-tecnica/v5.0/changelog"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/io-guida-tecnica/v5.0/changelog"));
        expect(handler(buildRequest("/io-guida-tecnica/guida-tecnica-1.2"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/io-guida-tecnica/v1.2"));
    });

    it('Should not intercept these resources', () => {
        expect(handler(buildRequest("/")).uri).toBe( "/" );
    })

});

