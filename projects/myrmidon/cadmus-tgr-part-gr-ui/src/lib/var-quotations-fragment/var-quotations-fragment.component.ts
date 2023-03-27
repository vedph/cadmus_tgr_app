import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormGroup,
} from '@angular/forms';
import { take } from 'rxjs/operators';

import { AuthJwtService } from '@myrmidon/auth-jwt-login';
import { ThesauriSet, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { EditedObject, ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { DialogService } from '@myrmidon/ng-mat-tools';
import { NgToolsValidators } from '@myrmidon/ng-tools';

import {
  VarQuotation,
  VarQuotationsFragment,
} from '../var-quotations-fragment';

/**
 * Quotations with variants fragment.
 * Thesauri: quotation-tags, quotation-authorities, author-works,
 * apparatus-witnesses, apparatus-authors, apparatus-author-tags (all optional).
 */
@Component({
  selector: 'tgr-var-quotations-fragment',
  templateUrl: './var-quotations-fragment.component.html',
  styleUrls: ['./var-quotations-fragment.component.css'],
})
export class VarQuotationsFragmentComponent
  extends ModelEditorComponentBase<VarQuotationsFragment>
  implements OnInit
{
  public editedQuotationIndex: number;
  public editedQuotation: VarQuotation | undefined;

  /**
   * Quotation tags.
   */
  public quotTagEntries: ThesaurusEntry[] | undefined;
  /**
   * Quotation authorities.
   */
  public quotAuthEntries: ThesaurusEntry[] | undefined;
  /**
   * Authors and works.
   */
  public workEntries: ThesaurusEntry[] | undefined;
  /**
   * Witnesses.
   */
  public witEntries: ThesaurusEntry[] | undefined;
  /**
   * Authors.
   */
  public authEntries: ThesaurusEntry[] | undefined;
  /**
   * Author's tags.
   */
  public authTagEntries: ThesaurusEntry[] | undefined;

  public quotations: FormControl<VarQuotation[]>;

  constructor(
    authService: AuthJwtService,
    formBuilder: FormBuilder,
    private _dialogService: DialogService
  ) {
    super(authService, formBuilder);
    this.editedQuotationIndex = -1;
    // form
    this.quotations = formBuilder.control([], {
      validators: NgToolsValidators.strictMinLengthValidator(1),
      nonNullable: true,
    });
  }

  public override ngOnInit(): void {
    super.ngOnInit();
  }

  protected buildForm(formBuilder: FormBuilder): FormGroup | UntypedFormGroup {
    return formBuilder.group({
      quotations: this.quotations,
    });
  }

  private updateThesauri(thesauri: ThesauriSet): void {
    let key = 'quotation-tags';
    if (this.hasThesaurus(key)) {
      this.quotTagEntries = thesauri[key].entries;
    } else {
      this.quotTagEntries = undefined;
    }

    key = 'quotation-authorities';
    if (this.hasThesaurus(key)) {
      this.quotAuthEntries = thesauri[key].entries;
    } else {
      this.quotAuthEntries = undefined;
    }

    key = 'author-works';
    if (this.hasThesaurus(key)) {
      this.workEntries = thesauri[key].entries;
    } else {
      this.workEntries = undefined;
    }

    key = 'apparatus-witnesses';
    if (this.hasThesaurus(key)) {
      this.witEntries = thesauri[key].entries;
    } else {
      this.witEntries = undefined;
    }

    key = 'apparatus-authors';
    if (this.hasThesaurus(key)) {
      this.authEntries = thesauri[key].entries;
    } else {
      this.authEntries = undefined;
    }

    key = 'apparatus-author-tags';
    if (this.hasThesaurus(key)) {
      this.authTagEntries = thesauri[key].entries;
    } else {
      this.authTagEntries = undefined;
    }
  }

  private updateForm(fr?: VarQuotationsFragment | null): void {
    if (!fr) {
      this.form.reset();
      return;
    }
    this.quotations.setValue(fr.quotations || []);
    this.form.markAsPristine();
  }

  protected override onDataSet(
    data?: EditedObject<VarQuotationsFragment>
  ): void {
    // thesauri
    if (data?.thesauri) {
      this.updateThesauri(data.thesauri);
    }

    // form
    this.updateForm(data?.value);
  }

  protected getValue(): VarQuotationsFragment {
    const fr = this.getEditedFragment() as VarQuotationsFragment;
    fr.quotations = this.quotations.value;
    return fr;
  }

  public addQuotation(): void {
    this.editQuotation({
      authority: 'gram',
      work: '',
      location: '',
    });
  }

  public editQuotation(quotation: VarQuotation, index = -1): void {
    this.editedQuotationIndex = index;
    this.editedQuotation = quotation;
  }

  public saveQuotation(quotation: VarQuotation): void {
    const quotations = [...this.quotations.value];
    if (this.editedQuotationIndex === -1) {
      quotations.push(quotation);
    } else {
      quotations.splice(this.editedQuotationIndex, 1, quotation);
    }
    this.quotations.setValue(quotations);
    this.closeQuotation();
  }

  public closeQuotation(): void {
    this.editedQuotationIndex = -1;
    this.editedQuotation = undefined;
  }

  public deleteQuotation(index: number): void {
    this._dialogService
      .confirm('Confirmation', 'Delete entry?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          if (this.editedQuotationIndex === -1) {
            this.closeQuotation();
          }
          const quotations = [...this.quotations.value];
          quotations.splice(index, 1);
          this.quotations.setValue(quotations);
        }
      });
  }

  public moveEntryUp(index: number): void {
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

  public moveEntryDown(index: number): void {
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
}
