# CadmusTgrApp

Quick Docker image build:

1. `npm run build-all`
2. `ng build --prod`
3. `docker build . -t vedph2020/cadmus-tgr-app:1.0.3 -t vedph2020/cadmus-tgr-app:latest` (replace with the current version).

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

## Snippets

Just to save some typing.

### Sub-Model Editor Template

```ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';

@Component({
  selector: 'tgr-...',
  templateUrl: './...component.html',
  styleUrls: ['./...component.css'],
})
export class __NAME__Component implements OnInit {
  @Input()
  public model: __TYPE__ | undefined;
  @Output()
  public modelChange: EventEmitter<__TYPE__>;
  @Output()
  public editorClose: EventEmitter<any>;

  public form: FormGroup;
  // TODO: controls

  constructor(formBuilder: FormBuilder) {
    this.modelChange = new EventEmitter<__TYPE__>();
    this.editorClose = new EventEmitter<any>();
    // form
    // TODO: controls
    this.form = formBuilder.group({
      // TODO
    });
  }

  ngOnInit(): void {
    this.updateForm(this.model);
  }

  private updateForm(model: __TYPE__ | undefined): void {
    if (!model) {
      this.form.reset();
      return;
    }

    // TODO set controls values

    this.form.markAsPristine();
  }

  private getModel(): __TYPE__ | null {
    return {
      // TODO get values from controls
    };
  }

  public cancel(): void {
    this.editorClose.emit();
  }

  public save(): void {
    if (this.form.invalid) {
      return;
    }
    const model = this.getModel();
    if (!model) {
      return;
    }
    this.modelChange.emit(model);
  }
}
```

```html
<form [formGroup]="form" (submit)="save()">
  TODO
  <!-- buttons -->
  <div>
    <button
      type="button"
      color="warn"
      mat-icon-button
      matTooltip="Discard changes"
      (click)="cancel()"
    >
      <mat-icon>clear</mat-icon>
    </button>
    <button
      type="submit"
      color="primary"
      mat-icon-button
      matTooltip="Accept changes"
      [disabled]="form.invalid || form.pristine"
    >
      <mat-icon>check_circle</mat-icon>
    </button>
  </div>
</form>
```
