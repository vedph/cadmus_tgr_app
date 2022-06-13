import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';

import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import {
  AnnotatedValue,
  LocAnnotatedValue,
} from '@myrmidon/cadmus-part-philology-ui';
import { renderLabelFromLastColon } from '@myrmidon/cadmus-ui';

import { QuotationVariant } from '../var-quotations-fragment';

@Component({
  selector: 'tgr-quotation-variant',
  templateUrl: './quotation-variant.component.html',
  styleUrls: ['./quotation-variant.component.css'],
})
export class QuotationVariantComponent implements OnInit {
  private _model: QuotationVariant | undefined;

  @Input()
  public get model(): QuotationVariant | undefined {
    return this._model;
  }
  public set model(value: QuotationVariant | undefined) {
    this._model = value;
    this.updateForm(value);
  }

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
  /**
   * Author/work tags. This can be alternative or additional
   * to authEntries, and allows picking the work from a tree
   * of authors and works.
   */
  @Input()
  public workEntries: ThesaurusEntry[] | undefined;

  @Output()
  public modelChange: EventEmitter<QuotationVariant>;
  @Output()
  public editorClose: EventEmitter<any>;

  public form: FormGroup;
  public type: FormControl<number>;
  public lemma: FormControl<string | null>;
  public value: FormControl<string | null>;
  public witnesses: FormArray;
  public authors: FormArray;

  constructor(
    private _formBuilder: FormBuilder,
    private _clipboard: Clipboard
  ) {
    this.modelChange = new EventEmitter<QuotationVariant>();
    this.editorClose = new EventEmitter<any>();
    // form
    this.type = _formBuilder.control(0, {
      validators: Validators.required,
      nonNullable: true,
    });
    this.lemma = _formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(300),
    ]);
    this.value = _formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(300),
    ]);
    this.witnesses = _formBuilder.array([]);
    this.authors = _formBuilder.array([]);
    this.form = _formBuilder.group({
      type: this.type,
      lemma: this.lemma,
      value: this.value,
      witnesses: this.witnesses,
      authors: this.authors,
    });
  }

  ngOnInit(): void {
    this.updateForm(this.model);
  }

  private updateForm(model: QuotationVariant | undefined): void {
    if (!model) {
      this.form.reset();
      return;
    }

    this.type.setValue(model.type);
    this.lemma.setValue(model.lemma);
    this.value.setValue(model.value);
    // witnesses
    this.witnesses.clear();
    if (model.witnesses) {
      for (let witness of model.witnesses) {
        this.witnesses.controls.push(this.getWitnessGroup(witness));
      }
    }

    // authors
    this.authors.clear();
    if (model.authors) {
      for (let author of model.authors) {
        this.authors.controls.push(this.getAuthorGroup(author));
      }
    }

    this.form.markAsPristine();
  }

  private getModel(): QuotationVariant | null {
    return {
      type: this.type.value,
      lemma: this.lemma.value?.trim() || '',
      value: this.value.value?.trim() || '',
      witnesses: this.getWitnesses(),
      authors: this.getAuthors(),
    };
  }

  //#region Witnesses
  private getWitnessGroup(witness?: AnnotatedValue): FormGroup {
    return this._formBuilder.group({
      value: this._formBuilder.control(witness?.value, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      note: this._formBuilder.control(witness?.note, Validators.maxLength(500)),
    });
  }

  public addWitness(witness?: AnnotatedValue): void {
    this.witnesses.push(this.getWitnessGroup(witness));
    this.witnesses.markAsDirty();
  }

  public removeWitness(index: number): void {
    this.witnesses.removeAt(index);
    this.witnesses.markAsDirty();
  }

  public moveWitnessUp(index: number): void {
    if (index < 1) {
      return;
    }
    const witness = this.witnesses.controls[index];
    this.witnesses.removeAt(index);
    this.witnesses.insert(index - 1, witness);
    this.witnesses.markAsDirty();
  }

  public moveWitnessDown(index: number): void {
    if (index + 1 >= this.witnesses.length) {
      return;
    }
    const witness = this.witnesses.controls[index];
    this.witnesses.removeAt(index);
    this.witnesses.insert(index + 1, witness);
    this.witnesses.markAsDirty();
  }

  private getWitnesses(): AnnotatedValue[] | undefined {
    const entries: AnnotatedValue[] = [];
    for (let i = 0; i < this.witnesses.length; i++) {
      const g = this.witnesses.at(i) as FormGroup;
      entries.push({
        value: g.controls.value.value?.trim(),
        note: g.controls.note.value?.trim(),
      });
    }
    return entries.length ? entries : undefined;
  }
  //#endregion

  //#region Authors
  private getAuthorGroup(author?: LocAnnotatedValue): FormGroup {
    return this._formBuilder.group({
      tag: this._formBuilder.control(author?.tag, Validators.maxLength(50)),
      value: this._formBuilder.control(author?.value, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      location: this._formBuilder.control(
        author?.location,
        Validators.maxLength(50)
      ),
      note: this._formBuilder.control(author?.note, Validators.maxLength(500)),
    });
  }

  public addAuthor(item?: LocAnnotatedValue): void {
    this.authors.push(this.getAuthorGroup(item));
    this.authors.markAsDirty();
  }

  public removeAuthor(index: number): void {
    this.authors.removeAt(index);
    this.authors.markAsDirty();
  }

  public moveAuthorUp(index: number): void {
    if (index < 1) {
      return;
    }
    const author = this.authors.controls[index];
    this.authors.removeAt(index);
    this.authors.insert(index - 1, author);
    this.authors.markAsDirty();
  }

  public moveAuthorDown(index: number): void {
    if (index + 1 >= this.authors.length) {
      return;
    }
    const author = this.authors.controls[index];
    this.authors.removeAt(index);
    this.authors.insert(index + 1, author);
    this.authors.markAsDirty();
  }

  private getAuthors(): LocAnnotatedValue[] | undefined {
    const entries: LocAnnotatedValue[] = [];
    for (let i = 0; i < this.authors.length; i++) {
      const g = this.authors.at(i) as FormGroup;
      entries.push({
        tag: g.controls.tag.value?.trim(),
        value: g.controls.value.value?.trim(),
        location: g.controls.location.value?.trim(),
        note: g.controls.note.value?.trim(),
      });
    }
    return entries.length ? entries : undefined;
  }

  public onEntryChange(entry: ThesaurusEntry): void {
    if (entry) {
      this._clipboard.copy(entry.id);
    }
  }

  public renderLabel(label: string): string {
    return renderLabelFromLastColon(label);
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
