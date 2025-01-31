import { Component, Input, OnInit, Output, EventEmitter, model, effect, output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import {
  MatFormField,
  MatLabel,
  MatHint,
  MatError,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';

import {
  HistoricalDateModel,
  HistoricalDateComponent,
} from '@myrmidon/cadmus-refs-historical-date';

import { MsLocation, MsLocationService } from '@myrmidon/cadmus-tgr-core';

import { MsPalimpsest } from '../ms-units-part';

@Component({
  selector: 'tgr-ms-palimpsest',
  templateUrl: './ms-palimpsest.component.html',
  styleUrls: ['./ms-palimpsest.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatHint,
    MatError,
    HistoricalDateComponent,
    MatIconButton,
    MatTooltip,
    MatIcon,
  ],
})
export class MsPalimpsestComponent {
  public readonly palimpsest = model<MsPalimpsest>();

  public readonly editorClose = output();

  public form: FormGroup;
  public locations: FormControl<string | null>;
  public date: HistoricalDateModel | undefined;
  public note: FormControl<string | null>;

  constructor(
    formBuilder: FormBuilder,
    private _locService: MsLocationService
  ) {
    this.locations = formBuilder.control(null, [
      Validators.maxLength(100),
      this.locationsVal,
    ]);
    this.note = formBuilder.control(null, Validators.maxLength(1500));
    this.form = formBuilder.group({
      locations: this.locations,
      note: this.note,
    });

    effect(() => {
      this.updateForm(this.palimpsest());
    });
  }

  private updateForm(palimpsest: MsPalimpsest | undefined): void {
    if (!palimpsest) {
      this.form.reset();
      return;
    }

    this.locations.setValue(
      palimpsest.locations
        ? palimpsest.locations
            .map((l) => {
              return this._locService.locationToString(l);
            })
            .join(',')
        : ''
    );
    this.note.setValue(palimpsest.note || null);
    this.form.markAsPristine();
  }

  private getPalimpsest(): MsPalimpsest {
    const model: MsPalimpsest = {
      locations: this.locations.value?.split(',').map((t: string) => {
        return this._locService.parseLocation(t.trim())!;
      }),
      date: this.date,
      note: this.note.value?.trim(),
    };
    if (model.locations?.some((l) => !l)) {
      this.locations.setErrors({ invalid: true });
    }
    return model;
  }

  private locationsVal(control: AbstractControl): ValidationErrors | null {
    const locService = new MsLocationService();
    if (control.value) {
      const err = control.value
        .split(',')
        .map((t: string) => {
          return locService.parseLocation(t.trim());
        })
        .some((l: MsLocation) => !l);
      if (err) {
        return { invalid: true };
      }
    }
    return null;
  }

  public onDateChange(date: HistoricalDateModel): void {
    this.date = date;
    this.form.markAsDirty();
  }

  public cancel(): void {
    this.editorClose.emit();
  }

  public save(): void {
    if (this.form.invalid) {
      return;
    }
    this.palimpsest.set(this.getPalimpsest());
  }
}
