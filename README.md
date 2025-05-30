# Rewriter Project

Questo progetto permette di reindirizzare dinamicamente determinate URL verso nuovi endpoint, sia versionati che non versionati, utilizzando espressioni regolari. 

Il codice è scritto per essere eseguito come [CloudFront Function](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-functions.html) (AWS). 

## Teoria delle operazioni

- La URI in ingresso viene testata sulle regex elencate nell'array `regexPatterns` con flag `active` valorizzato a _true_. 

- Al primo match, viene restituito il redirect (301) alla URL ottenuta combinando la proprietà `redirectTo` ed eventuali informazioni presenti nell'URI originale ed estratte dalla regex stessa.

- Se non è stata trovata alcuna regola, la richiesta viene restituita senza modifiche.

## Struttura del Progetto

- **`src/`**: Contiene il file `rewriter.js` con la logica di redirect.
- **`tests/`**: Contiene i test per validare il comportamento del rewriter.

## Flusso di lavoro per l’aggiunta di nuove regole

1. **Aggiornamento del Codice**

   Modifica `src/rewriter.ts` per aggiungere la nuova regola di rewrite. La nuova regola va inserita all'interno dell'array `regexPatterns`. 

2. **Creazione dei Test**

   Aggiungi o aggiorna i test nella cartella `tests/` per verificare la nuova regola.

3. **Esecuzione dei Test**

   Esegui:
   ```bash
   npm test
    ```

   Assicurati che tutti i test, inclusi quelli per la nuova regola, vengano superati.

4. **Creazione del file di distribuzione**

   Esegui:
   ```bash
   npm run dist
    ```

## Helper per la scrittura di regex
Per facilitare la scrittura delle regex di riconoscimento sono disponibili gli _helper_: `simpleHelper` e `versionedHelper`. 

### simpleHelper
Riconosce semplici path identificati da una stringa iniziale statica.

Il _builder_ accetta due parametri:
- _base_: stringa iniziale dell'URI
- _usePath_ : indica alla regex se riconoscere come gruppo la stringa che segue _base_

La regex crea un gruppo:

- 1: (opzionale) contiene il path se _usePath_ è _true_

Ad esempio invocando l'helper `simpleHelper("/path_molto_esteso/sotto-path/path_finale")` otteniamo una regex che restituirà i seguenti valori:

| URI | gruppo 1 |
| --- | ------- |
| /path_molto_esteso/sotto_path/path_finale | /path_finale

Mentre se invochiamo lo stesso helper `simpleHelper("/path_molto_esteso/sotto-path/path_finale", false)` otteniamo

| URI | gruppo 1 |
| --- | ------- |
| /path_molto_esteso/sotto_path/path_finale | _null_

### versionedHelper
Riconosce path in cui sono presenti informazioni di versione, come ad es. in `/saci/saci-1.2.3`.

Il _builder_ accetta due parametri:
- _base_: stringa iniziale dell'URI
- _versionPrefix_: (opzionale) prefisso di versione da scartare

La regex crea infatti i seguenti gruppi:

- 1: (opzionale) contiene la versione (ad eccezione di quanto specificato nel parametro _versionPrefix_)
- 2: (opzionale) contiene il path

La combinazione di queste informazioni è utilizzata nella costruzione dell'URL di redirect.

Ad esempio invocando l'helper `versionedHelper("saci", "saci-")` otteniamo una regex che restituirà i seguenti valori:

| URI | gruppo 1 | gruppo 2
| --- | ------- | ----
| /saci | | 
| /saci/ | | /
| /saci/mypath | | /mypath
| /saci/saci-1.2.3 | 1.2.3 |
| /saci/saci-1.2.3/mypath | 1.2.3 | /mypath

## Distribuzione
Una volta eseguito il comando `npm run dist`, copia il file **[dist/rewriter.js](/dist/rewriter.js)** all'interno della CloudFront Function, in modo che l’ambiente di produzione utilizzi la versione testata.
