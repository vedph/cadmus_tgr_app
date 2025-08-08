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

import { NgxToolsValidators } from '@myrmidon/ngx-tools';
import { DialogService } from '@myrmidon/ngx-mat-tools';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';

import {
  EditedObject,
  ThesauriSet,
  ThesaurusEntry,
} from '@myrmidon/cadmus-core';
import {
  ModelEditorComponentBase,
  CloseSaveButtonsComponent,
} from '@myrmidon/cadmus-ui';
import { MsLocation, MsLocationService } from '@myrmidon/cadmus-tgr-core';

import {
  MsOrnament,
  MsOrnamentsPart,
  MSORNAMENTS_PART_TYPEID,
} from '../ms-ornaments-part';

import { MsOrnamentComponent } from '../ms-ornament/ms-ornament.component';

/**
 * Manuscript's ornamentations part editor component.
 * Thesauri: ms-ornament-types, physical-size-units, physical-size-tags,
 * physical-dim-tags (all optional).
 */
@Component({
  selector: 'tgr-ms-ornaments-part',
  templateUrl: './ms-ornaments-part.component.html',
  styleUrls: ['./ms-ornaments-part.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCard,
    MatCardHeader,
    MatCardAvatar,
    MatIcon,
    MatCardTitle,
    MatCardContent,
    MatButton,
    MatIconButton,
    MatTooltip,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MsOrnamentComponent,
    MatCardActions,
    CloseSaveButtonsComponent,
  ],
})
export class MsOrnamentsPartComponent
  extends ModelEditorComponentBase<MsOrnamentsPart>
  implements OnInit
{
  public editedOrnamentIndex: number;
  public editedOrnament: MsOrnament | undefined;

  public ornTypeEntries: ThesaurusEntry[] | undefined;
  public szUnitEntries: ThesaurusEntry[] | undefined;
  public szTagEntries: ThesaurusEntry[] | undefined;
  public szDimTagEntries: ThesaurusEntry[] | undefined;

  public ornaments: FormControl<MsOrnament[]>;

  constructor(
    authService: AuthJwtService,
    formBuilder: FormBuilder,
    private _dialogService: DialogService,
    private _locService: MsLocationService
  ) {
    super(authService, formBuilder);
    this.editedOrnamentIndex = -1;
    // form
    this.ornaments = formBuilder.control([], {
      validators: NgxToolsValidators.strictMinLengthValidator(1),
      nonNullable: true,
    });
  }

  public override ngOnInit(): void {
    super.ngOnInit();
  }

  protected buildForm(formBuilder: FormBuilder): FormGroup | UntypedFormGroup {
    return formBuilder.group({
      entries: this.ornaments,
    });
  }

  private updateThesauri(thesauri: ThesauriSet): void {
    let key = 'ms-ornament-types';
    if (this.hasThesaurus(key)) {
      this.ornTypeEntries = thesauri[key].entries;
    } else {
      this.ornTypeEntries = undefined;
    }

    key = 'physical-size-units';
    if (this.hasThesaurus(key)) {
      this.szUnitEntries = thesauri[key].entries;
    } else {
      this.szUnitEntries = undefined;
    }

    key = 'physical-size-tags';
    if (this.hasThesaurus(key)) {
      this.szTagEntries = thesauri[key].entries;
    } else {
      this.szTagEntries = undefined;
    }

    key = 'physical-dim-tags';
    if (this.hasThesaurus(key)) {
      this.szDimTagEntries = thesauri[key].entries;
    } else {
      this.szDimTagEntries = undefined;
    }
  }

  private updateForm(part?: MsOrnamentsPart | null): void {
    if (!part) {
      this.form.reset();
      return;
    }
    this.ornaments.setValue(part.ornaments || []);
    this.form.markAsPristine();
  }

  protected override onDataSet(data?: EditedObject<MsOrnamentsPart>): void {
    // thesauri
    if (data?.thesauri) {
      this.updateThesauri(data.thesauri);
    }

    // form
    this.updateForm(data?.value);
  }

  protected getValue(): MsOrnamentsPart {
    let part = this.getEditedPart(MSORNAMENTS_PART_TYPEID) as MsOrnamentsPart;
    part.ornaments = this.ornaments.value;
    return part;
  }

  public editOrnament(ornament: MsOrnament, index = -1): void {
    this.editedOrnamentIndex = index;
    this.editedOrnament = ornament;
  }

  public addOrnament(): void {
    this.editOrnament({
      type: '',
      start: { n: 0 },
      end: { n: 0 },
    });
  }

  public saveOrnament(ornament: MsOrnament): void {
    const ornaments = [...this.ornaments.value];

    if (this.editedOrnamentIndex === -1) {
      ornaments.push(ornament);
    } else {
      ornaments.splice(this.editedOrnamentIndex, 1, ornament);
    }
    this.ornaments.setValue(ornaments);
    this.ornaments.updateValueAndValidity();
    this.ornaments.markAsDirty();
    this.closeOrnament();
  }

  public closeOrnament(): void {
    this.editedOrnamentIndex = -1;
    this.editedOrnament = undefined;
  }

  public deleteOrnament(index: number): void {
    this._dialogService
      .confirm('Confirmation', 'Delete ornament?')
      .pipe(take(1))
      .subscribe((yes: boolean) => {
        if (yes) {
          if (index === this.editedOrnamentIndex) {
            this.closeOrnament();
          }
          const ornaments = [...this.ornaments.value];
          ornaments.splice(index, 1);
          this.ornaments.setValue(ornaments);
          this.ornaments.updateValueAndValidity();
          this.ornaments.markAsDirty();
        }
      });
  }

  public moveOrnamentUp(index: number): void {
    if (index < 1) {
      return;
    }
    const ornament = this.ornaments.value[index];
    const ornaments = [...this.ornaments.value];
    ornaments.splice(index, 1);
    ornaments.splice(index - 1, 0, ornament);
    this.ornaments.setValue(ornaments);
    this.ornaments.updateValueAndValidity();
    this.ornaments.markAsDirty();
  }

  public moveOrnamentDown(index: number): void {
    if (index + 1 >= this.ornaments.value.length) {
      return;
    }
    const ornament = this.ornaments.value[index];
    const ornaments = [...this.ornaments.value];
    ornaments.splice(index, 1);
    ornaments.splice(index + 1, 0, ornament);
    this.ornaments.setValue(ornaments);
    this.ornaments.updateValueAndValidity();
    this.ornaments.markAsDirty();
  }

  public locationToString(location?: MsLocation): string {
    return this._locService.locationToString(location) ?? '';
  }
}
