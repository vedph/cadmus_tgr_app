import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { HistoricalDateModel } from '@myrmidon/cadmus-core';
import { MsLocationService } from '@myrmidon/cadmus-itinera-core';
import { MsPalimpsest } from '../ms-units-part';

@Component({
  selector: 'tgr-ms-palimpsest',
  templateUrl: './ms-palimpsest.component.html',
  styleUrls: ['./ms-palimpsest.component.css'],
})
export class MsPalimpsestComponent implements OnInit {
  @Input()
  public model: MsPalimpsest | undefined;
  @Output()
  public modelChange: EventEmitter<MsPalimpsest>;
  @Output()
  public editorClose: EventEmitter<any>;

  public form: FormGroup;
  public locations: FormControl;
  public date: HistoricalDateModel | undefined;
  public note: FormControl;

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
    this.updateForm(this.model);
  }

  private updateForm(model: MsPalimpsest | undefined): void {
    if (!model) {
      this.form.reset();
      return;
    }

    this.locations.setValue(
      model.locations
        ? model.locations.map((l) => {
            return this._locService.locationToString(l);
          })
        : []
    );
    this.note.setValue(model.note);
    this.form.markAsPristine();
  }

  private getModel(): MsPalimpsest | null {
    const model: MsPalimpsest = {
      locations: this.locations.value.split().map((t: string) => {
        return this._locService.parseLocation(t);
      }),
      date: this.date,
      note: this.note.value?.trim(),
    };
    if (model.locations?.some((l) => !l)) {
      this.locations.setErrors({ invalid: true });
      return null;
    }
    return model;
  }

  private locationsVal(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      const err = control.value.split().map((t: string) => {
        return this._locService.parseLocation(t);
      });
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
    const model = this.getModel();
    if (!model) {
      return;
    }
    this.modelChange.emit(model);
  }
}
