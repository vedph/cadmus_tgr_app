# Cadmus TGR App

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.6.

🐋 Quick Docker image build:

1. `npm run build-lib`;
2. update `env.js` version, and `ng build --configuration production`;
3. `docker build . -t vedph2020/cadmus-tgr-app:6.0.3 -t vedph2020/cadmus-tgr-app:latest` (replace with the current version).

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

(3) `docker build . -t vedph2020/cadmus-tgr-app:6.0.2-prod` and then push the image.

CORS Note: in `docker-compose.yml`, ensure that your web app IP is found in the `AllowedOrigins` of the API layer, e.g.:

```yml
- ALLOWEDORIGINS__0=http://90.147.166.176
```

## Setup

This workspace has been created with these commands:

```sh
ng new cadmus-tgr-app
cd cadmus-tgr-app
ng add @angular/material
ng add @angular/localize
ng g library @myrmidon/cadmus-tgr-core --prefix cadmus --force
ng g library @myrmidon/cadmus-tgr-part-gr-pg --prefix cadmus --force
ng g library @myrmidon/cadmus-tgr-part-gr-ui --prefix cadmus --force
ng g library @myrmidon/cadmus-tgr-part-ms-pg --prefix cadmus --force
ng g library @myrmidon/cadmus-tgr-part-ms-ui --prefix cadmus --force
```

## History

### 9.0.0

- 2025-01-30:
  - ⚠️ migrated to signals.
  - updated Angular and packages.
  - minor aesthetic UI improvements.

### 8.0.0

- 2025-01-07:
  - ⚠️ standalone components.
  - refactored app for modern Angular.

### 7.0.0

- 2024-11-29: ⚠️ upgraded to Angular 19.
- 2024-06-10:
  - updated Angular and packages.
  - added `class="mat-X"` for each `color="X"` (e.g. `class="mat-primary"` wherever there is a `color="primary"`) to allow transitioning to Angular Material M3 from M2. This also implies adding it directly to the target element, so in the case of `mat-icon` inside a `button` with `color` the class is added to `mat-icon` directly (unless the button too has the same color). This allows to keep the old M2 clients while using the new M3, because it seems that the compatibility mixin is not effective in some cases like inheritance of `color`, and in the future `color` will be replaced by `class` altogether.
  - applied [M3 theme](https://material.angular.io/guide/theming).

### 6.0.3

- 2024-05-23:
  - ⚠️ updated to Angular 18.
  - updated to new control flow syntax.

### 6.0.0

- 2024-05-21:
  - updated Angular and packages ([bricks V2](https://github.com/vedph/cadmus-bricks-shell-v2/tree/master)).
  - replaced Monaco editor with newer, lighter wrapper.
  - added [text plugins](https://github.com/vedph/cadmus-bricks-shell-v2/tree/master/projects/myrmidon/cadmus-text-ed) and [lookup services](https://github.com/vedph/cadmus-bricks-shell-v2/tree/master/projects/myrmidon/cadmus-refs-lookup).
  - updated libraries peer dependencies and bumped all versions to 5.x.x.

### 5.0.4

- 2023-12-07:
  - updated flow syntax.
  - set 50K limit for hand description.

### 5.0.3

- 2023-12-05:
  - allow editors to access profile menu.
  - updated Angular and packages.

### 5.0.2

- 2023-11-21:
  - refactored work in ms content (back to editable, equal to entry ID if from thesaurus, else free).
  - hand description max length up to 50k.

### 5.0.1

- 2023-11-20: refactored work in ms-content (non-editable, selected thesaurus entry).

### 5.0.0

- 2023-11-17:
  - updated Angular and packages.
- 2023-11-10: ⚠️ upgraded to Angular 17.
- 2023-11-05:
  - updated Angular and packages.
  - removed hash in routing config.

### 4.0.0

- 2023-10-04:
  - updated Angular and packages.
  - ⚠️ removed ELF.
  - increased max length for note fields in `MsContent`, `MsGuardSheet`, `MsHistoryPart`, `MsOrnament`, `MsPalimpsest`.
- 2023-09-24:
  - updated Angular and packages.
  - opted in thesauri import.
- 2023-09-19: updated Angular and packages.

### 3.1.3

- 2023-08-17: refactored ms scripts editor.

### 3.1.2

- 2023-08-10: fix to `MsScriptComponent` undefined `langChecks`.

### 3.1.1

- 2023-08-10: fix to `MsScriptComponent` undefined `langChecks`.

### 3.1.0

- 2023-08-09:
  - added `p` to `MsLocation` to represent pagination instead of foliation. This is represented as a final `%` in the location string (`@myrmidon/cadmus-tgr-core` version 3.1.0).
  - added support for metadata part.
  - reordered routes.
  - updated Angular and packages.

### 3.0.1

- 2023-07-17: added missing bound thesaurus in ms component editor.
- 2023-07-08:
  - updated Angular and packages.
  - minor UI adjustments.
- 2023-07-06: increased ms formal description size limit from 500 to 50000.

### 3.0.0

- 2023-06-22: updated Angular and moved to PostgreSQL.
- 2023-06-07: updated packages.
- 2023-05-12: updated to Angular 16.

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
