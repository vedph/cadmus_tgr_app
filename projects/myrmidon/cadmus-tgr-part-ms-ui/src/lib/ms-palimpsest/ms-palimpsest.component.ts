import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { HistoricalDateModel } from '@myrmidon/cadmus-refs-historical-date';
import { MsLocation, MsLocationService } from '@myrmidon/cadmus-tgr-core';
import { MsPalimpsest } from '../ms-units-part';

@Component({
  selector: 'tgr-ms-palimpsest',
  templateUrl: './ms-palimpsest.component.html',
  styleUrls: ['./ms-palimpsest.component.css'],
})
export class MsPalimpsestComponent implements OnInit {
  private _model: MsPalimpsest | undefined;

  @Input()
  public get model(): MsPalimpsest | undefined {
    return this._model;
  }
  public set model(value: MsPalimpsest | undefined) {
    if (this._model === value) {
      return;
    }
    this._model = value;
    this.updateForm(this._model);
  }

  @Output()
  public modelChange: EventEmitter<MsPalimpsest>;
  @Output()
  public editorClose: EventEmitter<any>;

  public form: FormGroup;
  public locations: FormControl<string | null>;
  public date: HistoricalDateModel | undefined;
  public note: FormControl<string | null>;

  constructor(
    formBuilder: FormBuilder,
    private _locService: MsLocationService
  ) {
    this.modelChange = new EventEmitter<MsPalimpsest>();
    this.editorClose = new EventEmitter<any>();
    // form
    this.locations = formBuilder.control(null, [
      Validators.maxLength(100),
      this.locationsVal,
    ]);
    this.note = formBuilder.control(null, Validators.maxLength(500));
    this.form = formBuilder.group({
      locations: this.locations,
      note: this.note,
    });
  }

  ngOnInit(): void {
    // this.updateForm(this.model);
  }

  private updateForm(model: MsPalimpsest | undefined): void {
    if (!model) {
      this.form.reset();
      return;
    }

    this.locations.setValue(
      model.locations
        ? model.locations
            .map((l) => {
              return this._locService.locationToString(l);
            })
            .join(',')
        : ''
    );
    this.note.setValue(model.note || null);
    this.form.markAsPristine();
  }

  private getModel(): MsPalimpsest {
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
    this._model = this.getModel();
    this.modelChange.emit(this._model);
  }
}
