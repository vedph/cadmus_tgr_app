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

import { DialogService } from '@myrmidon/ngx-mat-tools';
import { NgxToolsValidators } from '@myrmidon/ngx-tools';
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

import { MsUnit, MsUnitsPart, MSUNITS_PART_TYPEID } from '../ms-units-part';
import { MsUnitComponent } from '../ms-unit/ms-unit.component';

/**
 * MsUnitsPart editor component.
 * Thesauri: ms-materials, ms-ruling-manners, ms-ruling-systems,
 * physical-size-units, physical-size-tags, physical-dim-tags
 * (all optional).
 */
@Component({
  selector: 'tgr-ms-units-part',
  templateUrl: './ms-units-part.component.html',
  styleUrls: ['./ms-units-part.component.css'],
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
    MsUnitComponent,
    MatCardActions,
    CloseSaveButtonsComponent,
  ],
})
export class MsUnitsPartComponent
  extends ModelEditorComponentBase<MsUnitsPart>
  implements OnInit
{
  public editedUnitIndex: number;
  public editedUnit: MsUnit | undefined;

  /**
   * Manuscript's materials.
   */
  public matEntries: ThesaurusEntry[] | undefined;
  /**
   * Manuscript's ruling: manners of execution.
   */
  public rulManEntries: ThesaurusEntry[] | undefined;
  /**
   * Manuscript's ruling: systems.
   */
  public rulSysEntries: ThesaurusEntry[] | undefined;
  /**
   * Physical size: units.
   */
  public szUnitEntries: ThesaurusEntry[] | undefined;
  /**
   * Physical size: size tags.
   */
  public szTagEntries: ThesaurusEntry[] | undefined;
  /**
   * Physical size: dimensions tags.
   */
  public szDimTagEntries: ThesaurusEntry[] | undefined;

  public units: FormControl<MsUnit[]>;

  constructor(
    authService: AuthJwtService,
    formBuilder: FormBuilder,
    private _dialogService: DialogService,
    private _locService: MsLocationService
  ) {
    super(authService, formBuilder);
    this.editedUnitIndex = -1;
    // form
    this.units = formBuilder.control([], {
      validators: NgxToolsValidators.strictMinLengthValidator(1),
      nonNullable: true,
    });
  }

  public override ngOnInit(): void {
    super.ngOnInit();
  }

  protected buildForm(formBuilder: FormBuilder): FormGroup | UntypedFormGroup {
    return formBuilder.group({
      units: this.units,
    });
  }

  private updateThesauri(thesauri: ThesauriSet): void {
    let key = 'ms-materials';
    if (this.hasThesaurus(key)) {
      this.matEntries = thesauri[key].entries;
    } else {
      this.matEntries = undefined;
    }

    key = 'ms-ruling-manners';
    if (this.hasThesaurus(key)) {
      this.rulManEntries = thesauri[key].entries;
    } else {
      this.rulManEntries = undefined;
    }

    key = 'ms-ruling-systems';
    if (this.hasThesaurus(key)) {
      this.rulSysEntries = thesauri[key].entries;
    } else {
      this.rulSysEntries = undefined;
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

  private updateForm(part?: MsUnitsPart | null): void {
    if (!part) {
      this.form.reset();
      return;
    }
    this.units.setValue(part.units || []);
    this.form.markAsPristine();
  }

  protected override onDataSet(data?: EditedObject<MsUnitsPart>): void {
    // thesauri
    if (data?.thesauri) {
      this.updateThesauri(data.thesauri);
    }

    // form
    this.updateForm(data?.value);
  }

  protected getValue(): MsUnitsPart {
    let part = this.getEditedPart(MSUNITS_PART_TYPEID) as MsUnitsPart;
    part.units = this.units.value || [];
    return part;
  }

  public addUnit(): void {
    this.editUnit({
      start: { n: 0 },
      end: { n: 0 },
      material: undefined,
      sheetCount: 0,
      guardSheetCount: 0,
      backGuardSheetCount: 0,
    });
  }

  public editUnit(unit: MsUnit, index = -1): void {
    this.editedUnitIndex = index;
    this.editedUnit = unit;
  }

  public saveUnit(unit: MsUnit): void {
    const units = [...this.units.value];
    if (this.editedUnitIndex === -1) {
      units.push(unit);
    } else {
      units.splice(this.editedUnitIndex, 1, unit);
    }
    this.units.setValue(units);
    this.units.updateValueAndValidity();
    this.units.markAsDirty();
    this.closeUnit();
  }

  public closeUnit(): void {
    this.editedUnitIndex = -1;
    this.editedUnit = undefined;
  }

  public deleteUnit(index: number): void {
    this._dialogService
      .confirm('Confirmation', 'Delete unit?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          if (this.editedUnitIndex === index) {
            this.closeUnit();
          }
          const units = [...this.units.value];
          units.splice(index, 1);
          this.units.setValue(units);
          this.units.updateValueAndValidity();
          this.units.markAsDirty();
        }
      });
  }

  public moveUnitUp(index: number): void {
    if (index < 1) {
      return;
    }
    const unit = this.units.value[index];
    const units = [...this.units.value];
    units.splice(index, 1);
    units.splice(index - 1, 0, unit);
    this.units.setValue(units);
    this.units.updateValueAndValidity();
    this.units.markAsDirty();
  }

  public moveUnitDown(index: number): void {
    if (index + 1 >= this.units.value.length) {
      return;
    }
    const unit = this.units.value[index];
    const units = [...this.units.value];
    units.splice(index, 1);
    units.splice(index + 1, 0, unit);
    this.units.setValue(units);
    this.units.updateValueAndValidity();
    this.units.markAsDirty();
  }

  public locationToString(location?: MsLocation | null): string {
    if (!location) {
      return '';
    }
    return this._locService.locationToString(location) || '';
  }
}
