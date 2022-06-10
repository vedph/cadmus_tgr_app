import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { MsGuardSheet, MsWatermark } from '../ms-units-part';

@Component({
  selector: 'tgr-ms-guard-sheet',
  templateUrl: './ms-guard-sheet.component.html',
  styleUrls: ['./ms-guard-sheet.component.css'],
})
export class MsGuardSheetComponent implements OnInit {
  @Input()
  public model: MsGuardSheet | undefined;
  /**
   * Manuscript materials entries.
   */
  @Input()
  public matEntries: ThesaurusEntry[] | undefined;
  @Output()
  public modelChange: EventEmitter<MsGuardSheet>;
  @Output()
  public editorClose: EventEmitter<any>;

  public form: UntypedFormGroup;
  public back: UntypedFormControl;
  public material: UntypedFormControl;
  public note: UntypedFormControl;
  public watermarks: UntypedFormArray;

  constructor(private _formBuilder: UntypedFormBuilder) {
    this.modelChange = new EventEmitter<MsGuardSheet>();
    this.editorClose = new EventEmitter<any>();
    // form
    this.back = _formBuilder.control(false);
    this.material = _formBuilder.control(null, Validators.maxLength(50));
    this.note = _formBuilder.control(null, Validators.maxLength(500));
    this.watermarks = _formBuilder.array([]);
    this.form = _formBuilder.group({
      back: this.back,
      material: this.material,
      note: this.note,
      watermarks: this.watermarks,
    });
  }

  ngOnInit(): void {
    this.updateForm(this.model);
  }

  private updateForm(model: MsGuardSheet | undefined): void {
    if (!model) {
      this.form.reset();
      return;
    }

    this.back.setValue(model.isBack? true : false);
    this.material.setValue(model.material);
    this.note.setValue(model.note);

    // watermarks
    this.watermarks.clear();
    if (model.watermarks?.length) {
      for (const watermark of model.watermarks) {
        this.watermarks.push(this.getWatermarkGroup(watermark));
      }
    }

    this.form.markAsPristine();
  }

  private getModel(): MsGuardSheet | null {
    const model: MsGuardSheet = {
      isBack: this.back.value,
      material: this.material.value?.trim(),
      note: this.note.value?.trim(),
    };
    // watermarks
    if (this.watermarks.length) {
      model.watermarks = [];
      for (let i = 0; i < this.watermarks.controls.length; i++) {
        const g = this.watermarks.at(i) as UntypedFormGroup;
        model.watermarks.push({
          value: g.controls.value.value?.trim(),
          description: g.controls.description.value?.trim()
        });
      }
    }
    return model;
  }

  //#region Watermarks
  private getWatermarkGroup(item?: MsWatermark): UntypedFormGroup {
    return this._formBuilder.group({
      value: this._formBuilder.control(item?.value, [
        Validators.required,
        Validators.maxLength(100),
      ]),
      description: this._formBuilder.control(item?.description, [
        Validators.required,
        Validators.maxLength(500),
      ]),
    });
  }

  public addWatermark(item?: MsWatermark): void {
    this.watermarks.push(this.getWatermarkGroup(item));
  }

  public removeWatermark(index: number): void {
    this.watermarks.removeAt(index);
  }

  public moveWatermarkUp(index: number): void {
    if (index < 1) {
      return;
    }
    const item = this.watermarks.controls[index];
    this.watermarks.removeAt(index);
    this.watermarks.insert(index - 1, item);
  }

  public moveWatermarkDown(index: number): void {
    if (index + 1 >= this.watermarks.length) {
      return;
    }
    const item = this.watermarks.controls[index];
    this.watermarks.removeAt(index);
    this.watermarks.insert(index + 1, item);
  }
  //#endregion

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
