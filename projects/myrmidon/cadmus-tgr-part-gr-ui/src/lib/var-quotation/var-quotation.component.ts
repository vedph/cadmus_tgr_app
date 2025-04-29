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
import { Clipboard } from '@angular/cdk/clipboard';
import { take } from 'rxjs/operators';

import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

import { DialogService } from '@myrmidon/ngx-mat-tools';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import {
  renderLabelFromLastColon,
  ThesaurusTreeComponent,
} from '@myrmidon/cadmus-ui';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
} from '@angular/material/expansion';

import {
  QuotationParallel,
  QuotationVariant,
  VarQuotation,
} from '../var-quotations-fragment';
import { QuotationVariantComponent } from '../quotation-variant/quotation-variant.component';

@Component({
  selector: 'tgr-var-quotation',
  templateUrl: './var-quotation.component.html',
  styleUrls: ['./var-quotation.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTabGroup,
    MatTab,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInput,
    MatError,
    ThesaurusTreeComponent,
    MatButton,
    MatIcon,
    MatIconButton,
    MatTooltip,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    QuotationVariantComponent,
  ],
})
export class VarQuotationComponent {
  private _editedIndex;

  public editedVariant: QuotationVariant | undefined;
  public variantOpen: boolean;

  public readonly quotation = model<VarQuotation>();

  /**
   * Quotation tags.
   */
  public readonly quotTagEntries = input<ThesaurusEntry[]>();
  /**
   * Quotation authorities.
   */
  public readonly quotAuthEntries = input<ThesaurusEntry[]>();
  /**
   * Authors and works.
   */
  public readonly workEntries = input<ThesaurusEntry[]>();
  /**
   * Witnesses.
   */
  public readonly witEntries = input<ThesaurusEntry[]>();
  /**
   * Authors.
   */
  public readonly authEntries = input<ThesaurusEntry[]>();
  /**
   * Author's tags.
   */
  public readonly authTagEntries = input<ThesaurusEntry[]>();

  public readonly editorClose = output();

  public form: FormGroup;
  public tag: FormControl<string | null>;
  public authority: FormControl<string | null>;
  public work: FormControl<string | null>;
  public location: FormControl<string | null>;
  public subrange: FormControl<string | null>;
  public note: FormControl<string | null>;
  public parallels: FormArray;
  public variants: FormControl<QuotationVariant[]>;

  constructor(
    private _formBuilder: FormBuilder,
    private _clipboard: Clipboard,
    private _dialogService: DialogService
  ) {
    this._editedIndex = -1;
    this.variantOpen = false;
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
    this.subrange = _formBuilder.control(null, Validators.maxLength(50));
    this.note = _formBuilder.control(null, Validators.maxLength(1000));
    this.parallels = _formBuilder.array([]);
    this.variants = _formBuilder.control([], { nonNullable: true });
    this.form = _formBuilder.group({
      tag: this.tag,
      authority: this.authority,
      work: this.work,
      location: this.location,
      subrange: this.subrange,
      note: this.note,
      parallels: this.parallels,
      variants: this.variants,
    });

    effect(() => {
      this.updateForm(this.quotation());
    });
  }

  private updateForm(model: VarQuotation | undefined): void {
    if (!model) {
      this.form.reset();
      return;
    }

    this.tag.setValue(model.tag || null);
    this.authority.setValue(model.authority);
    this.work.setValue(model.work);
    this.location.setValue(model.location);
    this.subrange.setValue(model.subrange || null);
    this.note.setValue(model.note || null);
    this.parallels.clear();
    if (model.parallels) {
      for (let parallel of model.parallels) {
        this.parallels.controls.push(this.getParallelGroup(parallel));
      }
    }
    this.variants.setValue(model.variants || []);

    this.form.markAsPristine();
  }

  private getQuotation(): VarQuotation {
    return {
      tag: this.tag.value?.trim(),
      authority: this.authority.value?.trim() || '',
      work: this.work.value?.trim() || '',
      location: this.location.value?.trim() || '',
      subrange: this.subrange.value?.trim() || undefined,
      note: this.note.value?.trim(),
      parallels: this.getParallels(),
      variants: this.variants.value.length ? this.variants.value : undefined,
    };
  }

  //#region Parallels
  private getParallelGroup(parallel?: QuotationParallel): FormGroup {
    const g = this._formBuilder.group({
      work: this._formBuilder.control(parallel?.work, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      location: this._formBuilder.control(parallel?.location, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      note: this._formBuilder.control(
        parallel?.note,
        Validators.maxLength(1000)
      ),
      qtag: this._formBuilder.control(parallel?.tag, Validators.maxLength(50)),
    });
    g.valueChanges.subscribe((_) => {
      this.form.updateValueAndValidity();
    });
    return g;
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
        work: g.controls['work'].value?.trim(),
        location: g.controls['location'].value?.trim(),
        tag: g.controls['qtag'].value?.trim(),
        note: g.controls['note'].value?.trim(),
      });
    }
    return entries.length ? entries : undefined;
  }
  //#endregion

  //#region Variants
  public addVariant(): void {
    const variant: QuotationVariant = {
      type: 0,
      lemma: '',
      value: '',
    };
    this.variants.setValue([...this.variants.value, variant]);
    this.editVariant(this.variants.value.length - 1);
  }

  public editVariant(index: number): void {
    if (index < 0) {
      this._editedIndex = -1;
      this.variantOpen = false;
      this.editedVariant = undefined;
    } else {
      this._editedIndex = index;
      this.editedVariant = this.variants.value[index];
      setTimeout(() => {
        this.variantOpen = true;
      }, 300);
    }
  }

  public onVariantSave(item: QuotationVariant): void {
    this.variants.setValue(
      this.variants.value.map((x: QuotationVariant, i: number) =>
        i === this._editedIndex ? item : x
      )
    );
    this.form.markAsDirty();
    this.editVariant(-1);
  }

  public onVariantClose(): void {
    this.editVariant(-1);
  }

  public deleteVariant(index: number): void {
    this._dialogService
      .confirm('Confirmation', 'Delete item?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          const variants = [...this.variants.value];
          variants.splice(index, 1);
          this.variants.setValue(variants);
          this.form.markAsDirty();
        }
      });
  }

  public moveVariantUp(index: number): void {
    if (index < 1) {
      return;
    }
    const variant = this.variants.value[index];
    const variants = [...this.variants.value];
    variants.splice(index, 1);
    variants.splice(index - 1, 0, variant);
    this.variants.setValue(variants);
    this.form.markAsDirty();
  }

  public moveVariantDown(index: number): void {
    if (index + 1 >= this.variants.value.length) {
      return;
    }
    const variant = this.variants.value[index];
    const variants = [...this.variants.value];
    variants.splice(index, 1);
    variants.splice(index + 1, 0, variant);
    this.variants.setValue(variants);
    this.form.markAsDirty();
  }
  //#endregion

  public renderLabel(label: string): string {
    return renderLabelFromLastColon(label);
  }

  public onEntryChange(entry: ThesaurusEntry): void {
    if (entry) {
      this._clipboard.copy(entry.id);
    }
  }

  public quoteTagToString(tag: string): string {
    const entry = this.quotTagEntries()?.find((e) => e.id === tag);
    return entry ? entry.value : tag;
  }

  public getEntryTypeDsc(type: number): string {
    switch (type) {
      case 1:
        return 'Addition before';
      case 2:
        return 'Addition after';
      case 3:
        return 'Note';
      default:
        return 'Replacement';
    }
  }

  public getEntryTypeIcon(type: number): string {
    switch (type) {
      case 1:
        return 'skip_next';
      case 2:
        return 'skip_previous';
      case 3:
        return 'chat';
      default:
        return 'content_copy';
    }
  }

  public cancel(): void {
    this.editorClose.emit();
  }

  public save(): void {
    if (this.form.invalid) {
      return;
    }
    this.quotation.set(this.getQuotation());
  }
}
