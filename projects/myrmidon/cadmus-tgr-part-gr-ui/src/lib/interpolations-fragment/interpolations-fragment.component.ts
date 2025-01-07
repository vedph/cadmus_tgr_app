import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { take } from 'rxjs/operators';

import {
  MatCard,
  MatCardHeader,
  MatCardAvatar,
  MatCardTitle,
  MatCardSubtitle,
  MatCardContent,
  MatCardActions,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
} from '@angular/material/expansion';

import { AuthJwtService } from '@myrmidon/auth-jwt-login';
import { ThesauriSet, ThesaurusEntry } from '@myrmidon/cadmus-core';
import {
  EditedObject,
  ModelEditorComponentBase,
  CloseSaveButtonsComponent,
} from '@myrmidon/cadmus-ui';
import { DialogService } from '@myrmidon/ngx-mat-tools';
import { NgxToolsValidators } from '@myrmidon/ngx-tools';

import {
  Interpolation,
  InterpolationsFragment,
} from '../interpolations-fragment';
import { InterpolationComponent } from '../interpolation/interpolation.component';

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
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCard,
    MatCardHeader,
    MatCardAvatar,
    MatIcon,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatButton,
    MatIconButton,
    MatTooltip,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    InterpolationComponent,
    MatCardActions,
    CloseSaveButtonsComponent,
  ],
})
export class InterpolationsFragmentComponent
  extends ModelEditorComponentBase<InterpolationsFragment>
  implements OnInit
{
  public editedInterpolationIndex: number;
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
    this.editedInterpolationIndex = -1;
    // form
    this.interpolations = formBuilder.control([], {
      validators: NgxToolsValidators.strictMinLengthValidator(1),
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

  private updateForm(fr?: InterpolationsFragment | null): void {
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
    this.editInterpolation(
      {
        type: 0,
        role: '',
        languages: [],
        value: '',
      },
      -1
    );
  }

  public editInterpolation(interpolation: Interpolation, index: number): void {
    this.editedInterpolationIndex = index;
    this.editedInterpolation = interpolation;
  }

  public saveInterpolation(interpolation: Interpolation): void {
    const interpolations = [...this.interpolations.value];
    if (this.editedInterpolationIndex === -1) {
      interpolations.push(interpolation);
    } else {
      interpolations.splice(this.editedInterpolationIndex, 1, interpolation);
    }
    this.interpolations.setValue(interpolations);
    this.interpolations.updateValueAndValidity();
    this.interpolations.markAsDirty();
    this.closeInterpolation();
  }

  public closeInterpolation(): void {
    this.editedInterpolationIndex = -1;
    this.editedInterpolation = undefined;
  }

  public deleteInterpolation(index: number): void {
    this._dialogService
      .confirm('Confirmation', 'Delete interpolation?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          if (this.editedInterpolationIndex === index) {
            this.closeInterpolation();
          }
          const entries = [...this.interpolations.value];
          entries.splice(index, 1);
          this.interpolations.setValue(entries);
          this.interpolations.updateValueAndValidity();
          this.interpolations.markAsDirty();
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
    this.interpolations.updateValueAndValidity();
    this.interpolations.markAsDirty();
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
    this.interpolations.updateValueAndValidity();
    this.interpolations.markAsDirty();
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
