# Cadmus TGR App

- [Cadmus TGR App](#cadmus-tgr-app)
  - [Production](#production)
  - [History](#history)
    - [2.0.8](#208)
    - [2.0.7](#207)
    - [2.0.6](#206)
    - [2.0.5](#205)
    - [2.0.4](#204)
    - [2.0.3](#203)
    - [2.0.2](#202)
    - [2.0.1](#201)
    - [2.0.0](#200)
    - [1.1.12](#1112)
    - [1.1.11](#1111)
    - [1.1.10](#1110)
    - [1.1.9](#119)
    - [1.1.8](#118)
    - [1.1.7](#117)
    - [1.1.6](#116)
    - [1.1.5](#115)
    - [1.1.4](#114)
    - [1.1.3](#113)
    - [1.1.1](#111)

🐋 Quick Docker image build:

1. `npm run build-lib`;
2. update `env.js` version, and `ng build --configuration production`;
3. `docker build . -t vedph2020/cadmus-tgr-app:2.0.8 -t vedph2020/cadmus-tgr-app:latest` (replace with the current version).

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

(1) build as explained above (1-2).

(2) in the `dist` folder, edit the `env.js` file and replace the `localhost` server with the IP address of your API, e.g.:

```js
window.__env.apiUrl = "http://151.100.184.12:59590/api/";
```

Swagger at <http://151.100.184.12:59590/swagger/index.html>.

(note the API port number; the standard port 80/443 is reserved for this frontend).

(3) `docker build . -t vedph2020/cadmus-tgr-app:2.0.8-prod` and then push the image.

CORS Note: in `docker-compose.yml`, ensure that your web app IP is found in the `AllowedOrigins` of the API layer, e.g.:

```yml
- ALLOWEDORIGINS__0=http://90.147.166.176
```

## History

### 2.0.8

- 2023-03-28:
  - updated Angular and packages.
  - minor refactoring in multiple-entities editors.
  - style improvements.
- 2023-03-07: updated packages.
- 2023-02-21:
  - updated Angular and packages.
  - improved sub-model editors bindings.

### 2.0.7

- 2022-12-28: fixes to interpolations fragment editor (`@myrmex/cadmus-tgr-part-gr-ui`).

### 2.0.6

- 2022-12-22:
  - updated Cadmus packages.
  - updated Monaco editor, which required changing its glob pattern in `angular.json`.

### 2.0.5

- 2022-12-16: updated Cadmus packages.

### 2.0.4

- 2022-12-14:
  - updated packages.
  - updated Angular to 15.0.3.

### 2.0.3

- 2022-12-02: updated packages.

### 2.0.2

- 2022-12-02: updated packages.

### 2.0.1

- 2022-12-01: updated packages.
- 2022-11-30: updated packages.

### 2.0.0

- 2022-11-27:
  - upgraded to Angular 15.
  - replaced Akita with ELF.

### 1.1.12

- 2022-11-11:
  - updated Angular and packages.
  - languages not required in interpolation fragment.
- 2022-11-08: updated Angular.
- 2022-11-06: updated Angular and packages.
- 2022-10-10: updated packages.
- 2022-10-05:
  - updated packages.
  - added preview.

### 1.1.11

- 2022-08-23: fix to witnesses copy.

### 1.1.10

- 2022-08-21: fix to linguistic tags fragment editor.

### 1.1.9

- 2022-08-18: updated packages.

### 1.1.8

- 2022-07-30:
  - added `note` to `QuotationParallel`.
  - raised apparatus length limit to 1000 and updated library.
  - minor fixes.

### 1.1.7

- 2022-07-29: added `note` to `VarQuotation`/`QuotationVariant` and made `value` non-required.
- 2022-06-13: refactored forms to use typed counterparts.
- 2022-06-10: upgraded to Angular 14.

### 1.1.6

- 2022-05-05: fixed a hard to find issue about locale conflicts in some browsers.

### 1.1.5

- 2022-05-02: removed legacy code and updated libraries.

### 1.1.4

- 2022-05-02: fixes to peer dependencies in libraries (these are used by Pura).

### 1.1.3

- 2022-04-24: upgraded packages, removed moment, added witnesses layer.
- 2022-03-06: upgraded Angular and added version number.

### 1.1.1

- 2022-11-29: detached from Itinera. Models and services from itinera core were copied into TGR core. Segnatures were copied into parts. All library versions bumped by their minor number.
- 2022-11-11: upgraded Angular and thesaurus related libraries.
