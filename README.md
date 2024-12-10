# Rewriter Project

Questo progetto permette di reindirizzare dinamicamente determinate URL verso nuovi endpoint, sia versionati che non versionati, utilizzando espressioni regolari.

## Funzionalità Principali

- **Risorse Versionate**:  
  Se l’URL contiene un pattern con versione (ad es. `/saci/saci-3.2.0`), la richiesta viene reindirizzata verso l’endpoint corretto su `developer.pagopa.it`, includendo la versione rilevata.

- **Risorse Non Versionate**:  
  Se l’URL corrisponde a un pattern non versionato (ad es. `/unversioned`), la richiesta viene reindirizzata all’endpoint predefinito.

- **Fallback**:  
  Se l’URL non corrisponde ad alcuna regola, la richiesta viene restituita senza modifiche.

## Struttura del Progetto

- **`src/`**: Contiene il file `rewriter.js` con la logica di redirect.
- **`tests/`**: Contiene i test per validare il comportamento del rewriter.

## Flusso di Lavoro per l’Aggiunta di Nuove Regole

1. **Aggiornamento del Codice**:  
   Modifica `src/rewriter.js` per aggiungere la nuova regola di rewrite.

2. **Creazione del Test**:  
   Aggiungi o aggiorna il test nella cartella `tests/` per verificare la nuova regola.

3. **Esecuzione dei Test**:  
   Esegui:
   ```bash
   npm test
    ```

   Assicurati che tutti i test, inclusi quelli per la nuova regola, vengano superati.

## Distribuzione
Una volta verificata la nuova regola, copia il file rewriter.js aggiornato nella Lambda, in modo che l’ambiente di produzione utilizzi la versione testata.