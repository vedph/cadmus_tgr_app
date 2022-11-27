import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  UntypedFormGroup,
} from '@angular/forms';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';
import { ThesauriSet, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { EditedObject, ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { DialogService } from '@myrmidon/ng-mat-tools';
import { deepCopy, NgToolsValidators } from '@myrmidon/ng-tools';
import { take } from 'rxjs/operators';
import {
  Interpolation,
  InterpolationsFragment,
} from '../interpolations-fragment';

/**
 * Interpolations layer fragment.
 * Thesauri: interpolation-roles, interpolation-tags, interpolation-languages,
 * apparatus-witnesses, quotation-tags, quotation-authorities, author-works,
 * apparatus-authors, apparatus-author-tags (all optional).
 */
@Component({
  selector: 'tgr-interpolations-fragment',
  templateUrl: './interpolations-fragment.component.html',
  styleUrls: ['./interpolations-fragment.component.css'],
})
export class InterpolationsFragmentComponent
  extends ModelEditorComponentBase<InterpolationsFragment>
  implements OnInit
{
  private _editedIndex: number;

  public tabIndex: number;
  public editedInterpolation: Interpolation | undefined;

  /**
   * Interpolation roles.
   */
  public intRoleEntries: ThesaurusEntry[] | undefined;
  /**
   * Interpolation tags.
   */
  public intTagEntries: ThesaurusEntry[] | undefined;
  /**
   * Interpolation languages.
   */
  public intLangEntries: ThesaurusEntry[] | undefined;
  /**
   * Apparatus witnesses.
   */
  public witEntries: ThesaurusEntry[] | undefined;
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
   * Authors.
   */
  public authEntries: ThesaurusEntry[] | undefined;
  /**
   * Author's tags.
   */
  public authTagEntries: ThesaurusEntry[] | undefined;

  public interpolations: FormControl<Interpolation[]>;

  constructor(
    authService: AuthJwtService,
    formBuilder: FormBuilder,
    private _dialogService: DialogService
  ) {
    super(authService, formBuilder);
    this._editedIndex = -1;
    this.tabIndex = 0;
    // form
    this.interpolations = formBuilder.control([], {
      validators: NgToolsValidators.strictMinLengthValidator(1),
      nonNullable: true,
    });
  }

  public override ngOnInit(): void {
    super.ngOnInit();
  }

  protected buildForm(formBuilder: FormBuilder): FormGroup | UntypedFormGroup {
    return formBuilder.group({
      entries: this.interpolations,
    });
  }

  private updateThesauri(thesauri: ThesauriSet): void {
    let key = 'interpolation-roles';
    if (this.hasThesaurus(key)) {
      this.intRoleEntries = thesauri[key].entries;
    } else {
      this.intRoleEntries = undefined;
    }

    key = 'interpolation-tags';
    if (this.hasThesaurus(key)) {
      this.intTagEntries = thesauri[key].entries;
    } else {
      this.intTagEntries = undefined;
    }

    key = 'interpolation-languages';
    if (this.hasThesaurus(key)) {
      this.intLangEntries = thesauri[key].entries;
    } else {
      this.intLangEntries = undefined;
    }

    key = 'apparatus-witnesses';
    if (this.hasThesaurus(key)) {
      this.witEntries = thesauri[key].entries;
    } else {
      this.witEntries = undefined;
    }

    key = 'quotation-tags';
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

  private updateForm(fr?: InterpolationsFragment): void {
    if (!fr) {
      this.form.reset();
      return;
    }
    this.interpolations.setValue(fr.interpolations || []);
    this.form.markAsPristine();
  }

  protected override onDataSet(
    data?: EditedObject<InterpolationsFragment>
  ): void {
    // thesauri
    if (data?.thesauri) {
      this.updateThesauri(data.thesauri);
    }

    // form
    this.updateForm(data?.value);
  }

  protected getValue(): InterpolationsFragment {
    const fr = this.getEditedFragment() as InterpolationsFragment;
    fr.interpolations = this.interpolations.value;
    return fr;
  }

  public addInterpolation(): void {
    const entry: Interpolation = {
      type: 0,
      role: '',
      languages: [],
      value: '',
    };
    this.interpolations.setValue([...this.interpolations.value, entry]);
    this.editInterpolation(this.interpolations.value.length - 1);
  }

  public editInterpolation(index: number): void {
    if (index < 0) {
      this._editedIndex = -1;
      this.tabIndex = 0;
      this.editedInterpolation = undefined;
    } else {
      this._editedIndex = index;
      this.editedInterpolation = this.interpolations.value[index];
      setTimeout(() => {
        this.tabIndex = 1;
      }, 300);
    }
  }

  public onInterpolationSave(entry: Interpolation): void {
    this.interpolations.setValue(
      this.interpolations.value.map((e: Interpolation, i: number) =>
        i === this._editedIndex ? entry : e
      )
    );
    this.editInterpolation(-1);
  }

  public onInterpolationClose(): void {
    this.editInterpolation(-1);
  }

  public deleteInterpolation(index: number): void {
    this._dialogService
      .confirm('Confirmation', 'Delete interpolation?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          const entries = [...this.interpolations.value];
          entries.splice(index, 1);
          this.interpolations.setValue(entries);
        }
      });
  }

  public moveInterpolationUp(index: number): void {
    if (index < 1) {
      return;
    }
    const entry = this.interpolations.value[index];
    const entries = [...this.interpolations.value];
    entries.splice(index, 1);
    entries.splice(index - 1, 0, entry);
    this.interpolations.setValue(entries);
  }

  public moveInterpolationDown(index: number): void {
    if (index + 1 >= this.interpolations.value.length) {
      return;
    }
    const entry = this.interpolations.value[index];
    const entries = [...this.interpolations.value];
    entries.splice(index, 1);
    entries.splice(index + 1, 0, entry);
    this.interpolations.setValue(entries);
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

  public resolveId(id: string, thesaurus: string): string {
    let entries: ThesaurusEntry[] | undefined;
    switch (thesaurus) {
      case 'r':
        entries = this.intRoleEntries;
        break;
      case 'l':
        entries = this.intLangEntries;
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

  public languagesToString(languages: string[] | undefined): string {
    if (!languages?.length) {
      return '';
    }
    return languages
      .map((id) => {
        return this.resolveId(id, 'l');
      })
      .join(', ');
  }
}
