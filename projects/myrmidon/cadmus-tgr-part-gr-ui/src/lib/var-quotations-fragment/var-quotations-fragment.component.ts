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
  private _editedIndex: number;

  public tabIndex: number;
  public editedEntry: VarQuotation | undefined;

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

  public entries: FormControl<VarQuotation[]>;

  constructor(
    authService: AuthJwtService,
    formBuilder: FormBuilder,
    private _dialogService: DialogService
  ) {
    super(authService, formBuilder);
    this._editedIndex = -1;
    this.tabIndex = 0;
    // form
    this.entries = formBuilder.control([], {
      validators: NgToolsValidators.strictMinLengthValidator(1),
      nonNullable: true,
    });
  }

  public override ngOnInit(): void {
    super.ngOnInit();
  }

  protected buildForm(formBuilder: FormBuilder): FormGroup | UntypedFormGroup {
    return formBuilder.group({
      entries: this.entries,
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

  private updateForm(fr?: VarQuotationsFragment): void {
    if (!fr) {
      this.form.reset();
      return;
    }
    this.entries.setValue(fr.quotations || []);
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
    fr.quotations = this.entries.value;
    return fr;
  }

  public addEntry(): void {
    const entry: VarQuotation = {
      authority: 'gram',
      work: '',
      location: '',
    };
    this.entries.setValue([...this.entries.value, entry]);
    this.editEntry(this.entries.value.length - 1);
  }

  public editEntry(index: number): void {
    if (index < 0) {
      this._editedIndex = -1;
      this.tabIndex = 0;
      this.editedEntry = undefined;
    } else {
      this._editedIndex = index;
      this.editedEntry = this.entries.value[index];
      setTimeout(() => {
        this.tabIndex = 1;
      }, 300);
    }
  }

  public onEntrySave(entry: VarQuotation): void {
    this.entries.setValue(
      this.entries.value.map((e: VarQuotation, i: number) =>
        i === this._editedIndex ? entry : e
      )
    );
    this.editEntry(-1);
  }

  public onEntryClose(): void {
    this.editEntry(-1);
  }

  public deleteEntry(index: number): void {
    this._dialogService
      .confirm('Confirmation', 'Delete entry?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          const entries = [...this.entries.value];
          entries.splice(index, 1);
          this.entries.setValue(entries);
        }
      });
  }

  public moveEntryUp(index: number): void {
    if (index < 1) {
      return;
    }
    const entry = this.entries.value[index];
    const entries = [...this.entries.value];
    entries.splice(index, 1);
    entries.splice(index - 1, 0, entry);
    this.entries.setValue(entries);
  }

  public moveEntryDown(index: number): void {
    if (index + 1 >= this.entries.value.length) {
      return;
    }
    const entry = this.entries.value[index];
    const entries = [...this.entries.value];
    entries.splice(index, 1);
    entries.splice(index + 1, 0, entry);
    this.entries.setValue(entries);
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
