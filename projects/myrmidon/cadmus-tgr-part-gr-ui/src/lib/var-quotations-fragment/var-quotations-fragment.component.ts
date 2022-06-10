import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { DialogService } from '@myrmidon/ng-mat-tools';
import { deepCopy } from '@myrmidon/ng-tools';
import { take } from 'rxjs/operators';
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
  implements OnInit {
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

  public entries: UntypedFormControl;

  constructor(
    authService: AuthJwtService,
    formBuilder: UntypedFormBuilder,
    private _dialogService: DialogService
  ) {
    super(authService);
    this._editedIndex = -1;
    this.tabIndex = 0;
    // form
    this.entries = formBuilder.control([], Validators.required);
    this.form = formBuilder.group({
      entries: this.entries,
    });
  }

  public ngOnInit(): void {
    this.initEditor();
  }

  private updateForm(model: VarQuotationsFragment): void {
    if (!model) {
      this.form?.reset();
      return;
    }
    this.entries.setValue(model.quotations || []);
    this.form?.markAsPristine();
  }

  protected onModelSet(model: VarQuotationsFragment): void {
    this.updateForm(deepCopy(model));
  }

  protected onThesauriSet(): void {
    let key = 'quotation-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.quotTagEntries = this.thesauri[key].entries;
    } else {
      this.quotTagEntries = undefined;
    }

    key = 'quotation-authorities';
    if (this.thesauri && this.thesauri[key]) {
      this.quotAuthEntries = this.thesauri[key].entries;
    } else {
      this.quotAuthEntries = undefined;
    }

    key = 'author-works';
    if (this.thesauri && this.thesauri[key]) {
      this.workEntries = this.thesauri[key].entries;
    } else {
      this.workEntries = undefined;
    }

    key = 'apparatus-witnesses';
    if (this.thesauri && this.thesauri[key]) {
      this.witEntries = this.thesauri[key].entries;
    } else {
      this.witEntries = undefined;
    }

    key = 'apparatus-authors';
    if (this.thesauri && this.thesauri[key]) {
      this.authEntries = this.thesauri[key].entries;
    } else {
      this.authEntries = undefined;
    }

    key = 'apparatus-author-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.authTagEntries = this.thesauri[key].entries;
    } else {
      this.authTagEntries = undefined;
    }
  }

  protected getModelFromForm(): VarQuotationsFragment {
    return {
      location: this.model?.location ?? '',
      quotations: this.entries.value?.length ? this.entries.value : undefined,
    };
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

  public resolveId(id: string, thesaurus: string): string {
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
      return id;
    }
    const entry = entries.find((e) => {
      return e.id === id;
    });
    return entry ? entry.value : id;
  }
}
