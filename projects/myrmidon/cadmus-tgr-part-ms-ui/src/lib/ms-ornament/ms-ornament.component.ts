import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  PhysicalSize,
  ThesaurusEntry,
} from '@myrmidon/cadmus-core';
import { MsLocation, MsLocationService } from '@myrmidon/cadmus-itinera-core';
import { MsOrnament } from '../ms-ornaments-part';

@Component({
  selector: 'tgr-ms-ornament',
  templateUrl: './ms-ornament.component.html',
  styleUrls: ['./ms-ornament.component.css'],
})
export class MsOrnamentComponent implements OnInit {
  private _model: MsOrnament | undefined;

  @Input()
  public get model(): MsOrnament | undefined {
    return this._model;
  }
  public set model(value: MsOrnament | undefined) {
    this._model = value;
    this.updateForm(value);
  }
  @Input()
  public ornTypeEntries: ThesaurusEntry[] | undefined;
  @Input()
  public szUnitEntries: ThesaurusEntry[] | undefined;
  @Input()
  public szTagEntries: ThesaurusEntry[] | undefined;
  @Input()
  public szDimTagEntries: ThesaurusEntry[] | undefined;

  @Output()
  public modelChange: EventEmitter<MsOrnament>;
  @Output()
  public editorClose: EventEmitter<any>;

  public form: FormGroup;
  public type: FormControl;
  public start: FormControl;
  public end: FormControl;
  public description: FormControl;
  public hasSize: FormControl;
  public size: PhysicalSize | undefined;

  constructor(
    formBuilder: FormBuilder,
    private _locService: MsLocationService
  ) {
    this.modelChange = new EventEmitter<MsOrnament>();
    this.editorClose = new EventEmitter<any>();
    // form
    this.type = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.start = formBuilder.control(null, [
      Validators.required,
      Validators.pattern(MsLocationService.locRegexp),
    ]);
    this.end = formBuilder.control(null, [
      Validators.required,
      Validators.pattern(MsLocationService.locRegexp),
    ]);
    this.description = formBuilder.control(null, Validators.maxLength(500));
    this.hasSize = formBuilder.control(false);
    this.form = formBuilder.group({
      type: this.type,
      start: this.start,
      end: this.end,
      description: this.description,
      hasSize: this.hasSize,
    });
  }

  ngOnInit(): void {
    this.updateForm(this.model);
  }

  private updateForm(model: MsOrnament | undefined): void {
    if (!model) {
      this.size = undefined;
      this.form.reset();
      return;
    }

    this.type.setValue(model.type);
    this.start.setValue(this._locService.locationToString(model.start));
    this.end.setValue(this._locService.locationToString(model.end));
    this.description.setValue(model.description);

    if (model.size) {
      this.size = model.size;
      this.hasSize.setValue(true);
    } else {
      this.size = undefined;
      this.hasSize.setValue(false);
    }

    this.form.markAsPristine();
  }

  private getModel(): MsOrnament | null {
    return {
      type: this.type.value?.trim(),
      start: this._locService.parseLocation(this.start.value) as MsLocation,
      end: this._locService.parseLocation(this.end.value) as MsLocation,
      size: this.hasSize.value ? this.size : undefined,
      description: this.description.value?.trim(),
    };
  }

  public onSizeChange(size: PhysicalSize): void {
    this.size = size;
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
