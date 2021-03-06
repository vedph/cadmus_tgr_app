# CadmusTgrApp

Quick Docker image build:

1. `npm run build-all`
2. `ng build --configuration production`
3. `docker build . -t vedph2020/cadmus-tgr-app:1.0.24 -t vedph2020/cadmus-tgr-app:latest` (replace with the current version).

Web application frontend for Cadmus _TGR_. This application is built by packing together a number of components:

- _frontend_: the app includes the application and its specific libraries; shared Cadmus libraries (as defined in [Cadmus shell](https://github.com/vedph/cadmus_shell)) are used from NPM.

- _backend_: the corresponding backend API is [Cadmus TGR API](https://github.com/vedph/cadmus_tgr_api), depending on [Cadmus TGR](https://github.com/vedph/cadmus_tgr) for its specific parts.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.1:

```bash
ng new cadmus-tgr-app --prefix cadmus
```

Each library is added like this:

```bash
ng generate library @myrmidon/cadmus-tgr-core --prefix tgr
```

## Production

1. build as explained above.
2. in the `dist` folder, edit the `env.js` file and replace the `localhost` server with the IP address of your API, e.g.:

```js
window.__env.apiUrl = "https://ip-90-147-166-176.ct1.garrservices.it:59591/api/";
```

Swagger at <https://ip-90-147-166-176.ct1.garrservices.it:59591/swagger/index.html>.

(note the API port number; the standard port 80/443 is reserved for this frontend).

3. `docker build . -t vedph2020/cadmus-tgr-app:1.0.25-prod` and then push the image.

CORS Note: in `docker-compose.yml`, ensure that your web app IP is found in the `AllowedOrigins` of the API layer, e.g.:

```yml
- ALLOWEDORIGINS__0=http://90.147.166.176
```
