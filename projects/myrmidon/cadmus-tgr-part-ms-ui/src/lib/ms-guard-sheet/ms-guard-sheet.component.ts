import { Component, effect, input, model, output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

import { ThesaurusEntry } from '@myrmidon/cadmus-core';

import { MsGuardSheet, MsWatermark } from '../ms-units-part';

@Component({
  selector: 'tgr-ms-guard-sheet',
  templateUrl: './ms-guard-sheet.component.html',
  styleUrls: ['./ms-guard-sheet.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCheckbox,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInput,
    MatError,
    MatButton,
    MatIcon,
    MatIconButton,
    MatTooltip,
  ],
})
export class MsGuardSheetComponent {
  public readonly sheet = model<MsGuardSheet>();

  /**
   * Manuscript materials entries.
   */
  public readonly matEntries = input<ThesaurusEntry[]>();

  public readonly editorClose = output();

  public form: FormGroup;
  public back: FormControl<boolean>;
  public material: FormControl<string | null>;
  public note: FormControl<string | null>;
  public watermarks: FormArray;

  constructor(private _formBuilder: FormBuilder) {
    this.back = _formBuilder.control(false, { nonNullable: true });
    this.material = _formBuilder.control(null, Validators.maxLength(50));
    this.note = _formBuilder.control(null, Validators.maxLength(1500));
    this.watermarks = _formBuilder.array([]);
    this.form = _formBuilder.group({
      back: this.back,
      material: this.material,
      note: this.note,
      watermarks: this.watermarks,
    });

    effect(() => {
      this.updateForm(this.sheet());
    });
  }

  private updateForm(sheet: MsGuardSheet | undefined): void {
    if (!sheet) {
      this.form.reset();
      return;
    }

    this.back.setValue(sheet.isBack ? true : false);
    this.material.setValue(sheet.material || null);
    this.note.setValue(sheet.note || null);

    // watermarks
    this.watermarks.clear();
    if (sheet.watermarks?.length) {
      for (const watermark of sheet.watermarks) {
        this.watermarks.push(this.getWatermarkGroup(watermark));
      }
    }

    this.form.markAsPristine();
  }

  private getSheet(): MsGuardSheet {
    const model: MsGuardSheet = {
      isBack: this.back.value,
      material: this.material.value?.trim(),
      note: this.note.value?.trim(),
    };
    // watermarks
    if (this.watermarks.length) {
      model.watermarks = [];
      for (let i = 0; i < this.watermarks.controls.length; i++) {
        const g = this.watermarks.at(i) as FormGroup;
        model.watermarks.push({
          value: g.controls['value'].value?.trim(),
          description: g.controls['description'].value?.trim(),
        });
      }
    }
    return model;
  }

  //#region Watermarks
  private getWatermarkGroup(item?: MsWatermark): FormGroup {
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
    this.sheet.set(this.getSheet());
  }
}
