# CadmusTgrApp

Quick Docker image build:

1. `npm run build-all`
2. `ng build --prod`
3. `docker build . -t vedph2020/cadmus-tgr-app:1.0.5 -t vedph2020/cadmus-tgr-app:latest` (replace with the current version).

Web application frontend for Cadmus _TGR_. This application is built by packing together a number of components:

- _frontend_: the app includes the application and its specific libraries; shared Cadmus libraries (as defined in [Cadmus shell](https://github.com/vedph/cadmus_shell)) are used from NPM.

- _backend_: the corresponding backend API is [Cadmus TGR API](https://github.com/vedph/cadmus_tgr_api), depending on [Cadmus TGR](https://github.com/vedph/cadmus_tgr) for its specific parts.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.1:

```bash
ng new cadmus-tgr-app --prefix cadmus
```

Each library is added like this:

```bash
ng generate library @myrmidon/cadmus-tgr-core --prefix cadmus
```
