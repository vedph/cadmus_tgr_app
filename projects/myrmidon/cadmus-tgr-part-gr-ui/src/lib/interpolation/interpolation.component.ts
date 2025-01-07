import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { take } from 'rxjs/operators';

import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { DialogService } from '@myrmidon/ngx-mat-tools';

import { Interpolation, ReadingSource } from '../interpolations-fragment';
import { VarQuotation } from '../var-quotations-fragment';
import { VarQuotationComponent } from '../var-quotation/var-quotation.component';

@Component({
  selector: 'tgr-interpolation',
  templateUrl: './interpolation.component.html',
  styleUrls: ['./interpolation.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTabGroup,
    MatTab,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatError,
    MatInput,
    MatButton,
    MatIcon,
    MatIconButton,
    MatTooltip,
    VarQuotationComponent,
  ],
})
export class InterpolationComponent implements OnInit {
  private _model: Interpolation | undefined;
  private _editedIndex: number;

  public tabIndex: number;
  public editedQuotation: VarQuotation | undefined;

  @Input()
  public get model(): Interpolation | undefined {
    return this._model;
  }
  public set model(value: Interpolation | undefined) {
    if (this._model === value) {
      return;
    }
    this._model = value;
    this.updateForm(value);
  }

  /**
   * Interpolation roles.
   */
  @Input()
  public intRoleEntries: ThesaurusEntry[] | undefined;
  /**
   * Interpolation tags.
   */
  @Input()
  public intTagEntries: ThesaurusEntry[] | undefined;
  /**
   * Interpolation languages.
   */
  @Input()
  public intLangEntries: ThesaurusEntry[] | undefined;
  /**
   * Apparatus witnesses.
   */
  @Input()
  public witEntries: ThesaurusEntry[] | undefined;
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
  public modelChange: EventEmitter<Interpolation>;
  @Output()
  public editorClose: EventEmitter<any>;

  public form: FormGroup;
  public type: FormControl<number>;
  public role: FormControl<string | null>;
  public tag: FormControl<string | null>;
  public value: FormControl<string | null>;
  public groupId: FormControl<string | null>;
  public languages: FormArray;
  public note: FormControl<string | null>;
  public sources: FormArray;
  public quotations: FormControl<VarQuotation[]>;

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogService: DialogService
  ) {
    this.modelChange = new EventEmitter<Interpolation>();
    this.editorClose = new EventEmitter<any>();
    this._editedIndex = -1;
    this.tabIndex = 0;
    // form
    this.type = _formBuilder.control(0, {
      validators: Validators.required,
      nonNullable: true,
    });
    this.role = _formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.tag = _formBuilder.control(null, [Validators.maxLength(50)]);
    this.value = _formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(500),
    ]);
    this.groupId = _formBuilder.control(null, Validators.maxLength(50));
    this.languages = _formBuilder.array([]);
    this.note = _formBuilder.control(null, Validators.maxLength(500));
    this.sources = _formBuilder.array([]);
    this.quotations = _formBuilder.control([], { nonNullable: true });
    this.form = _formBuilder.group({
      type: this.type,
      role: this.role,
      tag: this.tag,
      value: this.value,
      groupId: this.groupId,
      languages: this.languages,
      note: this.note,
      sources: this.sources,
      quotations: this.quotations,
    });
  }

  ngOnInit(): void {
    // this.updateForm(this.model);
  }

  private updateForm(model: Interpolation | undefined): void {
    if (!model) {
      this.form.reset();
      return;
    }

    this.type.setValue(model.type);
    this.role.setValue(model.role);
    this.tag.setValue(model.tag || null);
    this.value.setValue(model.value);
    this.groupId.setValue(model.groupId || null);
    // languages
    this.languages.clear();
    if (model.languages?.length) {
      for (let language of model.languages) {
        this.languages.controls.push(this.getLanguageGroup(language));
      }
    }
    this.note.setValue(model.note || null);
    // sources
    this.sources.clear();
    if (model.sources?.length) {
      for (let source of model.sources) {
        this.sources.controls.push(this.getSourceGroup(source));
      }
    }
    this.quotations.setValue(model.quotations ?? []);

    this.form.markAsPristine();
  }

  private getModel(): Interpolation {
    return {
      type: this.type.value,
      role: this.role.value?.trim() || '',
      tag: this.tag.value?.trim(),
      value: this.value.value?.trim() || '',
      groupId: this.groupId.value?.trim(),
      languages: this.getLanguages() || [],
      note: this.note.value?.trim(),
      sources: this.getSources(),
      quotations: this.quotations.value?.length
        ? this.quotations.value
        : undefined,
    };
  }

  //#region Languages
  private getLanguageGroup(language?: string): FormGroup {
    return this._formBuilder.group({
      id: this._formBuilder.control(language, [
        Validators.required,
        Validators.maxLength(50),
      ]),
    });
  }

  public addLanguage(language?: string): void {
    this.languages.push(this.getLanguageGroup(language));
    this.languages.updateValueAndValidity();
    this.languages.markAsDirty();
  }

  public removeLanguage(index: number): void {
    this.languages.removeAt(index);
    this.languages.updateValueAndValidity();
    this.languages.markAsDirty();
  }

  public moveLanguageUp(index: number): void {
    if (index < 1) {
      return;
    }
    const language = this.languages.controls[index];
    this.languages.removeAt(index);
    this.languages.insert(index - 1, language);
    this.languages.updateValueAndValidity();
    this.languages.markAsDirty();
  }

  public moveLanguageDown(index: number): void {
    if (index + 1 >= this.languages.length) {
      return;
    }
    const language = this.languages.controls[index];
    this.languages.removeAt(index);
    this.languages.insert(index + 1, language);
    this.languages.updateValueAndValidity();
    this.languages.markAsDirty();
  }

  private getLanguages(): string[] | undefined {
    const entries: string[] = [];
    for (let i = 0; i < this.languages.length; i++) {
      const g = this.languages.at(i) as FormGroup;
      entries.push(g.controls['id'].value?.trim());
    }
    return entries.length ? entries : undefined;
  }
  //#endregion

  //#region Sources
  private getSourceGroup(item?: ReadingSource): FormGroup {
    return this._formBuilder.group({
      witness: this._formBuilder.control(item?.witness, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      handId: this._formBuilder.control(item?.handId, Validators.maxLength(50)),
    });
  }

  public addSource(item?: ReadingSource): void {
    this.sources.push(this.getSourceGroup(item));
    this.sources.updateValueAndValidity();
    this.sources.markAsDirty();
  }

  public removeSource(index: number): void {
    this.sources.removeAt(index);
    this.sources.updateValueAndValidity();
    this.sources.markAsDirty();
  }

  public moveSourceUp(index: number): void {
    if (index < 1) {
      return;
    }
    const source = this.sources.controls[index];
    this.sources.removeAt(index);
    this.sources.insert(index - 1, source);
    this.sources.updateValueAndValidity();
    this.sources.markAsDirty();
  }

  public moveSourceDown(index: number): void {
    if (index + 1 >= this.sources.length) {
      return;
    }
    const source = this.sources.controls[index];
    this.sources.removeAt(index);
    this.sources.insert(index + 1, source);
    this.sources.updateValueAndValidity();
    this.sources.markAsDirty();
  }

  private getSources(): ReadingSource[] | undefined {
    const sources: ReadingSource[] = [];
    for (let i = 0; i < this.sources.length; i++) {
      const g = this.sources.at(i) as FormGroup;
      sources.push({
        witness: g.controls['witness'].value?.trim(),
        handId: g.controls['handId'].value?.trim(),
      });
    }
    return sources.length ? sources : undefined;
  }
  //#endregion

  //#region Quotations
  public addQuotation(): void {
    this.editQuotation(
      {
        authority: 'gram',
        work: '',
        location: '',
      },
      -1
    );
  }

  public editQuotation(quotation: VarQuotation, index: number): void {
    this.editedQuotation = quotation;
    this._editedIndex = index;
    setTimeout(() => {
      this.tabIndex = 1;
    }, 0);
  }

  public saveQuotation(quotation: VarQuotation): void {
    const quotations = [...this.quotations.value];
    if (this._editedIndex === -1) {
      quotations.push(quotation);
    } else {
      quotations.splice(this._editedIndex, 1, quotation);
    }
    this.quotations.setValue(quotations);
    this.quotations.updateValueAndValidity();
    this.quotations.markAsDirty();
  }

  public closeQuotation(): void {
    this._editedIndex = -1;
    this.editedQuotation = undefined;
    this.tabIndex = 0;
  }

  public deleteQuotation(index: number): void {
    this._dialogService
      .confirm('Confirmation', 'Delete quotation?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          if (this._editedIndex === index) {
            this.closeQuotation();
          }
          const quotations = [...this.quotations.value];
          quotations.splice(index, 1);
          this.quotations.setValue(quotations);
          this.quotations.updateValueAndValidity();
          this.quotations.markAsDirty();
        }
      });
  }

  public moveQuotationUp(index: number): void {
    if (index < 1) {
      return;
    }
    const quotation = this.quotations.value[index];
    const quotations = [...this.quotations.value];
    quotations.splice(index, 1);
    quotations.splice(index - 1, 0, quotation);
    this.quotations.setValue(quotations);
    this.quotations.updateValueAndValidity();
    this.quotations.markAsDirty();
  }

  public moveQuotationDown(index: number): void {
    if (index + 1 >= this.quotations.value.length) {
      return;
    }
    const quotation = this.quotations.value[index];
    const quotations = [...this.quotations.value];
    quotations.splice(index, 1);
    quotations.splice(index + 1, 0, quotation);
    this.quotations.setValue(quotations);
    this.quotations.updateValueAndValidity();
    this.quotations.markAsDirty();
  }

  public resolveId(id: string | null | undefined, thesaurus: string): string {
    let entries: ThesaurusEntry[] | undefined;
    switch (thesaurus) {
      case 't':
        entries = this.quotTagEntries;
        break;
      case 'a':
        entries = this.authEntries;
        break;
      case 'w':
        entries = this.workEntries;
        break;
    }
    if (!entries) {
      return id || '';
    }
    const entry = entries.find((e) => {
      return e.id === id;
    });
    return entry ? entry.value : id || '';
  }
  //#endregion

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
