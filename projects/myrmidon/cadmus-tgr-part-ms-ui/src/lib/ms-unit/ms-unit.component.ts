import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { MsLocationService } from '@myrmidon/cadmus-itinera-core';
import { MsUnit } from '../ms-units-part';

@Component({
  selector: 'lib-ms-unit',
  templateUrl: './ms-unit.component.html',
  styleUrls: ['./ms-unit.component.css'],
})
export class MsUnitComponent implements OnInit {
  @Input()
  public model: MsUnit | undefined;
  @Input()
  public matEntries: ThesaurusEntry[] | undefined;
  @Output()
  public modelChange: EventEmitter<MsUnit>;
  @Output()
  public editorClose: EventEmitter<any>;

  public form: FormGroup;
  public start: FormControl;
  public end: FormControl;
  public material: FormControl;
  public sheetCount: FormControl;
  public guardSheetCount: FormControl;
  public groupId: FormControl;
  public groupOrdinal: FormControl;
  public quires: FormControl;
  public sheetNumbering: FormControl;
  public quireNumbering: FormControl;
  public state: FormControl;
  public binding: FormControl;

  constructor(private _formBuilder: FormBuilder,
    private _msLocation: MsLocationService) {
    this.modelChange = new EventEmitter<MsUnit>();
    this.editorClose = new EventEmitter<any>();
    // form - general
    this.start = _formBuilder.control(null, [
      Validators.required,
      Validators.pattern(MsLocationService.locRegexp),
    ]);
    this.end = _formBuilder.control(null, [
      Validators.required,
      Validators.pattern(MsLocationService.locRegexp),
    ]);
    this.material = _formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.sheetCount = _formBuilder.control(0);
    this.guardSheetCount = _formBuilder.control(0);
    this.groupId = _formBuilder.control(null, Validators.maxLength(50));
    this.groupOrdinal = _formBuilder.control(0);
    this.quires = _formBuilder.control(null, Validators.maxLength(500));
    this.sheetNumbering = _formBuilder.control(null, Validators.maxLength(500));
    this.quireNumbering = _formBuilder.control(null, Validators.maxLength(500));
    this.state = _formBuilder.control(null, Validators.maxLength(500));
    this.binding = _formBuilder.control(null, Validators.maxLength(500));
    // form
    this.form = _formBuilder.group({
      start: this.start,
      end: this.end,
      material: this.material,
      sheetCount: this.sheetCount,
      guardSheetCount: this.guardSheetCount,
      groupId: this.groupId,
      groupOrdinal: this.groupOrdinal,
      quires: this.quires,
      sheetNumbering: this.sheetNumbering,
      quireNumbering: this.quireNumbering,
      state: this.state,
      binding: this.binding
    });
  }

  ngOnInit(): void {
    this.updateForm(this.model);
  }

  private updateForm(model: MsUnit | undefined): void {
    if (!model) {
      this.form.reset();
      return;
    }

    // general
    this.start.setValue(this._msLocation.locationToString(model.start));
    this.end.setValue(this._msLocation.locationToString(model.end));
    this.material.setValue(model.material);
    this.sheetCount.setValue(model.sheetCount);
    this.guardSheetCount.setValue(model.guardSheetCount);
    this.groupId.setValue(model.groupId);
    this.groupOrdinal.setValue(model.groupOrdinal);
    this.quires.setValue(model.quires);
    this.sheetNumbering.setValue(model.sheetNumbering);
    this.quireNumbering.setValue(model.quireNumbering);
    this.state.setValue(model.state);
    this.binding.setValue(model.binding);

    this.form.markAsPristine();
  }

  private getModel(): MsUnit | null {
    return {
      // general
      start: this._msLocation.parseLocation(this.start.value),
      end: this._msLocation.parseLocation(this.end.value),
      material: this.material.value?.trim(),
      sheetCount: this.sheetCount.value,
      guardSheetCount: this.guardSheetCount.value,
      groupId: this.groupId.value?.trim(),
      groupOrdinal: this.groupOrdinal.value,
      quires: this.quires.value?.trim(),
      sheetNumbering: this.sheetNumbering.value?.trim(),
      quireNumbering: this.quireNumbering.value?.trim(),
      state: this.state.value?.trim(),
      binding: this.binding.value?.trim()
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
