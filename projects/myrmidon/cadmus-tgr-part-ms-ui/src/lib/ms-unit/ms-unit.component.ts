import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PhysicalDimension, PhysicalSize, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { MsLocationService } from '@myrmidon/cadmus-itinera-core';
import { MsRuling, MsUnit, MsWatermark } from '../ms-units-part';

@Component({
  selector: 'lib-ms-unit',
  templateUrl: './ms-unit.component.html',
  styleUrls: ['./ms-unit.component.css'],
})
export class MsUnitComponent implements OnInit {
  @Input()
  public model: MsUnit | undefined;
  /**
   * Manuscript's materials.
   */
  @Input()
  public matEntries: ThesaurusEntry[] | undefined;
  /**
   * Manuscript's ruling: manners of execution.
   */
  @Input()
  public rulManEntries: ThesaurusEntry[] | undefined;
  /**
   * Manuscript's ruling: systems.
   */
  @Input()
  public rulSysEntries: ThesaurusEntry[] | undefined;
  /**
   * Physical size: units.
   */
  @Input()
  public szUnitEntries: ThesaurusEntry[] | undefined;
  /**
   * Physical size: size tags.
   */
  @Input()
  public szTagEntries: ThesaurusEntry[] | undefined;
  /**
   * Physical size: dimensions tags.
   */
  @Input()
  public szDimTagEntries: ThesaurusEntry[] | undefined;

  @Output()
  public modelChange: EventEmitter<MsUnit>;
  @Output()
  public editorClose: EventEmitter<any>;

  public form: FormGroup;
  // general
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
  // leaf sizes
  public leafSizes: PhysicalSize[];
  public editedLeafSize: PhysicalSize | undefined;
  public editedLeafSizeIndex: number;
  // written area size
  public areaSize: PhysicalSize | undefined;
  // rulings
  public rulings: FormArray;
  // watermarks
  public watermarks: FormArray;

  constructor(
    private _formBuilder: FormBuilder,
    private _msLocation: MsLocationService
  ) {
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
    // sizes
    this.leafSizes = [];
    this.editedLeafSizeIndex = -1;
    // rulings
    this.rulings = _formBuilder.array([]);
    // watermarks
    this.watermarks = _formBuilder.array([]);
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
      binding: this.binding,
      // ruling
      rulings: this.rulings,
      // watermarks
      watermarks: this.watermarks,
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
    // leaf sizes
    this.editedLeafSize = undefined;
    this.leafSizes = model.leafSizes || [];
    // written area size
    this.areaSize = model.writtenAreaSize;
    // rulings
    this.rulings.clear();
    if (model.rulings?.length) {
      for (const ruling of model.rulings) {
        this.rulings.push(this.getRulingGroup(ruling));
      }
    }
    // watermarks
    this.watermarks.clear();
    if (model.watermarks?.length) {
      for (const watermark of model.watermarks) {
        this.watermarks.push(this.getWatermarkGroup(watermark));
      }
    }

    this.form.markAsPristine();
  }

  private getRulings(): MsRuling[] | undefined {
    if (!this.rulings.length) {
      return undefined;
    }
    const rulings: MsRuling[] = [];
    for (let i = 0; i < this.rulings.length; i++) {
      const g = this.rulings.at(i) as FormGroup;
      rulings.push({
        manner: g.controls.manner.value?.trim(),
        system: g.controls.system.value?.trim(),
        type: g.controls.type.value?.trim(),
        description: g.controls.description.value?.trim(),
      });
    }
    return rulings.length ? rulings : undefined;
  }

  private getWatermarks(): MsWatermark[] | undefined {
    if (!this.watermarks.length) {
      return undefined;
    }
    const watermarks: MsWatermark[] = [];
    for (let i = 0; i < this.watermarks.length; i++) {
      const g = this.watermarks.at(i) as FormGroup;
      watermarks.push({
        value: g.controls.value.value?.trim(),
        description: g.controls.description.value?.trim(),
      });
    }
    return watermarks.length ? watermarks : undefined;
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
      binding: this.binding.value?.trim(),
      // leaf sizes
      leafSizes: this.leafSizes.length ? this.leafSizes : undefined,
      // written area size
      writtenAreaSize: this.areaSize,
      // rulings
      rulings: this.getRulings(),
      // watermarks
      watermarks: this.getWatermarks(),
    };
  }

  //#region Leaf Sizes
  public editLeafSize(index: number): void {
    this.editedLeafSizeIndex = index;
    if (index === -1) {
      this.editedLeafSize = undefined;
    } else {
      this.editedLeafSize = this.leafSizes[index];
    }
  }

  public onEditedLeafSizeChange(size: PhysicalSize): void {
    this.editedLeafSize = size;
    this.form.markAsDirty();
  }

  public addLeafSize(): void {
    this.leafSizes.push({});
    this.editLeafSize(this.leafSizes.length - 1);
    this.form.markAsDirty();
  }

  public removeLeafSize(index: number): void {
    this.leafSizes.splice(index, 1);
    this.form.markAsDirty();
  }

  public moveLeafSizeUp(index: number): void {
    if (index < 1) {
      return;
    }
    const size = this.leafSizes[index];
    this.leafSizes.splice(index, 1);
    this.leafSizes.splice(index - 1, 0, size);
    this.form.markAsDirty();
  }

  public moveLeafSizeDown(index: number): void {
    if (index + 1 >= this.leafSizes.length) {
      return;
    }
    const size = this.leafSizes[index];
    this.leafSizes.splice(index, 1);
    this.leafSizes.splice(index + 1, 0, size);
    this.form.markAsDirty();
  }

  public dimToString(dim: PhysicalDimension | undefined): string {
    return dim? `${dim.value} ${dim.unit}` : '';
  }
  //#endregion

  //#region Rulings
  private getRulingGroup(ruling?: MsRuling): FormGroup {
    return this._formBuilder.group({
      manner: this._formBuilder.control(ruling?.manner, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      system: this._formBuilder.control(ruling?.system, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      type: this._formBuilder.control(ruling?.type, Validators.maxLength(50)),
      description: this._formBuilder.control(
        ruling?.description,
        Validators.maxLength(500)
      ),
    });
  }

  public addRuling(item?: MsRuling): void {
    this.rulings.push(this.getRulingGroup(item));
  }

  public removeRuling(index: number): void {
    this.rulings.removeAt(index);
  }

  public moveRulingUp(index: number): void {
    if (index < 1) {
      return;
    }
    const item = this.rulings.controls[index];
    this.rulings.removeAt(index);
    this.rulings.insert(index - 1, item);
  }

  public moveRulingDown(index: number): void {
    if (index + 1 >= this.rulings.length) {
      return;
    }
    const item = this.rulings.controls[index];
    this.rulings.removeAt(index);
    this.rulings.insert(index + 1, item);
  }
  //#endregion

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

  public onAreaSizeChange(size: PhysicalSize): void {
    this.areaSize = size;
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
