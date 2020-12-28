import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { renderLabelFromLastColon } from '@myrmidon/cadmus-ui';
import {
  QuotationParallel,
  VarQuotationEntry,
} from '../var-quotations-fragment';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'tgr-var-quotation-entry',
  templateUrl: './var-quotation-entry.component.html',
  styleUrls: ['./var-quotation-entry.component.css'],
})
export class VarQuotationEntryComponent implements OnInit {
  private _model: VarQuotationEntry | undefined;

  @Input()
  public get model(): VarQuotationEntry | undefined {
    return this._model;
  }
  public set model(value: VarQuotationEntry | undefined) {
    this._model = value;
    this.updateForm(value);
  }

  /**
   * Quotation tags.
   */
  @Input()
  public quotTagEntries: ThesaurusEntry[] | undefined;
  /**
   * Quotation authorities.
   */
  @Input()
  public quotAuthEntries: ThesaurusEntry[] | undefined;
  /**
   * Authors and works.
   */
  @Input()
  public workEntries: ThesaurusEntry[] | undefined;
  /**
   * Witnesses.
   */
  @Input()
  public witEntries: ThesaurusEntry[] | undefined;
  /**
   * Authors.
   */
  @Input()
  public authEntries: ThesaurusEntry[] | undefined;
  /**
   * Author's tags.
   */
  @Input()
  public authTagEntries: ThesaurusEntry[] | undefined;

  @Output()
  public modelChange: EventEmitter<VarQuotationEntry>;
  @Output()
  public editorClose: EventEmitter<any>;

  public form: FormGroup;
  public tag: FormControl;
  public authority: FormControl;
  public work: FormControl;
  public location: FormControl;
  public parallels: FormArray;

  constructor(private _formBuilder: FormBuilder, private clipboard: Clipboard) {
    this.modelChange = new EventEmitter<VarQuotationEntry>();
    this.editorClose = new EventEmitter<any>();
    // form
    this.tag = _formBuilder.control(null, Validators.maxLength(50));
    this.authority = _formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.work = _formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.location = _formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.parallels = _formBuilder.array([]);
    this.form = _formBuilder.group({
      tag: this.tag,
      authority: this.authority,
      work: this.work,
      location: this.location,
      parallels: this.parallels,
    });
  }

  ngOnInit(): void {
    this.updateForm(this.model);
  }

  private updateForm(model: VarQuotationEntry | undefined): void {
    if (!model) {
      this.form.reset();
      return;
    }

    this.tag.setValue(model.tag);
    this.authority.setValue(model.authority);
    this.work.setValue(model.work);
    this.location.setValue(model.location);
    this.parallels.clear();
    if (model.parallels) {
      for (let parallel of model.parallels) {
        this.parallels.controls.push(this.getParallelGroup(parallel));
      }
    }

    this.form.markAsPristine();
  }

  private getModel(): VarQuotationEntry | null {
    return {
      tag: this.tag.value?.trim(),
      authority: this.authority.value?.trim(),
      work: this.work.value?.trim(),
      location: this.location.value?.trim(),
      parallels: this.getParallels(),
    };
  }

  //#region Parallels
  private getParallelGroup(parallel?: QuotationParallel): FormGroup {
    return this._formBuilder.group({
      work: this._formBuilder.control(parallel?.work, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      location: this._formBuilder.control(parallel?.location, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      tag: this._formBuilder.control(parallel?.work, Validators.maxLength(50)),
    });
  }

  public addParallel(parallel?: QuotationParallel): void {
    this.parallels.push(this.getParallelGroup(parallel));
    this.parallels.markAsDirty();
  }

  public removeParallel(index: number): void {
    this.parallels.removeAt(index);
    this.parallels.markAsDirty();
  }

  public moveParallelUp(index: number): void {
    if (index < 1) {
      return;
    }
    const parallel = this.parallels.controls[index];
    this.parallels.removeAt(index);
    this.parallels.insert(index - 1, parallel);
    this.parallels.markAsDirty();
  }

  public moveParallelDown(index: number): void {
    if (index + 1 >= this.parallels.length) {
      return;
    }
    const parallel = this.parallels.controls[index];
    this.parallels.removeAt(index);
    this.parallels.insert(index + 1, parallel);
    this.parallels.markAsDirty();
  }

  private getParallels(): QuotationParallel[] | undefined {
    const entries: QuotationParallel[] = [];
    for (let i = 0; i < this.parallels.length; i++) {
      const g = this.parallels.at(i) as FormGroup;
      entries.push({
        work: g.controls.work.value?.trim(),
        location: g.controls.location.value?.trim(),
        tag: g.controls.tag.value?.trim(),
      });
    }
    return entries.length ? entries : undefined;
  }
  //#endregion

  public renderLabel(label: string): string {
    return renderLabelFromLastColon(label);
  }

  public onEntryChange(entry: ThesaurusEntry): void {
    if (entry) {
      this.clipboard.copy(entry.id);
    }
  }

  public quoteTagToString(tag: string): string {
    const entry = this.quotTagEntries?.find((e) => e.id === tag);
    return entry ? entry.value : tag;
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
