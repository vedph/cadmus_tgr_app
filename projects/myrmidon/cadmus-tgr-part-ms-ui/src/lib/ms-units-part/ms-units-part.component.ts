import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';

import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { CadmusValidators, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { MsUnit, MsUnitsPart, MSUNITS_PART_TYPEID } from '../ms-units-part';
import { take } from 'rxjs/operators';
import { MsLocation, MsLocationService } from '@myrmidon/cadmus-tgr-core';
import { DialogService } from '@myrmidon/ng-mat-tools';
import { deepCopy } from '@myrmidon/ng-tools';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';

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
})
export class MsUnitsPartComponent
  extends ModelEditorComponentBase<MsUnitsPart>
  implements OnInit
{
  private _editedIndex: number;

  public tabIndex: number;
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
    super(authService);
    this._editedIndex = -1;
    this.tabIndex = 0;
    // form
    this.units = formBuilder.control([], {
      validators: CadmusValidators.strictMinLengthValidator(1),
      nonNullable: true,
    });
    this.form = formBuilder.group({
      units: this.units,
    });
  }

  public ngOnInit(): void {
    this.initEditor();
  }

  private updateForm(model: MsUnitsPart): void {
    if (!model) {
      this.form?.reset();
      return;
    }
    this.units.setValue(model.units || []);
    this.form?.markAsPristine();
  }

  protected onModelSet(model: MsUnitsPart): void {
    this.updateForm(deepCopy(model));
  }

  protected onThesauriSet(): void {
    let key = 'ms-materials';
    if (this.thesauri && this.thesauri[key]) {
      this.matEntries = this.thesauri[key].entries;
    } else {
      this.matEntries = undefined;
    }

    key = 'ms-ruling-manners';
    if (this.thesauri && this.thesauri[key]) {
      this.rulManEntries = this.thesauri[key].entries;
    } else {
      this.rulManEntries = undefined;
    }

    key = 'ms-ruling-systems';
    if (this.thesauri && this.thesauri[key]) {
      this.rulSysEntries = this.thesauri[key].entries;
    } else {
      this.rulSysEntries = undefined;
    }

    key = 'physical-size-units';
    if (this.thesauri && this.thesauri[key]) {
      this.szUnitEntries = this.thesauri[key].entries;
    } else {
      this.szUnitEntries = undefined;
    }

    key = 'physical-size-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.szTagEntries = this.thesauri[key].entries;
    } else {
      this.szTagEntries = undefined;
    }

    key = 'physical-dim-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.szDimTagEntries = this.thesauri[key].entries;
    } else {
      this.szDimTagEntries = undefined;
    }
  }

  protected getModelFromForm(): MsUnitsPart {
    let part = this.model;
    if (!part) {
      part = {
        itemId: this.itemId || '',
        id: '',
        typeId: MSUNITS_PART_TYPEID,
        roleId: this.roleId,
        timeCreated: new Date(),
        creatorId: '',
        timeModified: new Date(),
        userId: '',
        units: [],
      };
    }
    part.units = this.units.value || [];
    return part;
  }

  public addUnit(): void {
    const unit: MsUnit = {
      start: { n: 0 },
      end: { n: 0 },
      material: undefined,
      sheetCount: 0,
      guardSheetCount: 0,
      backGuardSheetCount: 0,
    };
    this.units.setValue([...this.units.value, unit]);
    this.editUnit(this.units.value.length - 1);
  }

  public editUnit(index: number): void {
    if (index < 0) {
      this._editedIndex = -1;
      this.tabIndex = 0;
      this.editedUnit = undefined;
    } else {
      this._editedIndex = index;
      this.editedUnit = this.units.value[index];
      setTimeout(() => {
        this.tabIndex = 1;
      }, 300);
    }
  }

  public onUnitSave(unit: MsUnit): void {
    this.units.setValue(
      this.units.value.map((u: MsUnit, i: number) =>
        i === this._editedIndex ? unit : u
      )
    );
    this.editUnit(-1);
  }

  public onUnitClose(): void {
    this.editUnit(-1);
  }

  public deleteUnit(index: number): void {
    this._dialogService
      .confirm('Confirmation', 'Delete unit?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          const units = [...this.units.value];
          units.splice(index, 1);
          this.units.setValue(units);
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
  }

  public locationToString(location?: MsLocation | null): string {
    if (!location) {
      return '';
    }
    return this._locService.locationToString(location) || '';
  }
}
