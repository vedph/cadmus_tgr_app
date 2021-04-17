import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';

import { ModelEditorComponentBase, DialogService } from '@myrmidon/cadmus-ui';
import { AuthService } from '@myrmidon/cadmus-api';
import { ThesaurusEntry, deepCopy } from '@myrmidon/cadmus-core';
import {
  MsOrnament,
  MsOrnamentsPart,
  MSORNAMENTS_PART_TYPEID,
} from '../ms-ornaments-part';
import { take } from 'rxjs/operators';
import { MsLocation, MsLocationService } from '@myrmidon/cadmus-itinera-core';

/**
 * Manuscript's ornamentations part editor component.
 * Thesauri: ms-ornament-types, physical-size-units, physical-size-tags,
 * physical-dim-tags (all optional).
 */
@Component({
  selector: 'tgr-ms-ornaments-part',
  templateUrl: './ms-ornaments-part.component.html',
  styleUrls: ['./ms-ornaments-part.component.css'],
})
export class MsOrnamentsPartComponent
  extends ModelEditorComponentBase<MsOrnamentsPart>
  implements OnInit {
  private _editedIndex: number;

  public tabIndex: number;
  public editedOrnament: MsOrnament | undefined;

  public ornTypeEntries: ThesaurusEntry[] | undefined;
  public szUnitEntries: ThesaurusEntry[] | undefined;
  public szTagEntries: ThesaurusEntry[] | undefined;
  public szDimTagEntries: ThesaurusEntry[] | undefined;

  public ornaments: FormControl;

  constructor(
    authService: AuthService,
    formBuilder: FormBuilder,
    private _dialogService: DialogService,
    private _locService: MsLocationService
  ) {
    super(authService);
    this._editedIndex = -1;
    this.tabIndex = 0;
    // form
    this.ornaments = formBuilder.control([], Validators.required);
    this.form = formBuilder.group({
      entries: this.ornaments,
    });
  }

  public ngOnInit(): void {
    this.initEditor();
  }

  private updateForm(model: MsOrnamentsPart): void {
    if (!model) {
      this.form.reset();
      return;
    }
    this.ornaments.setValue(model.ornaments || []);
    this.form.markAsPristine();
  }

  protected onModelSet(model: MsOrnamentsPart): void {
    this.updateForm(deepCopy(model));
  }

  protected onThesauriSet(): void {
    let key = 'ms-ornament-types';
    if (this.thesauri && this.thesauri[key]) {
      this.ornTypeEntries = this.thesauri[key].entries;
    } else {
      this.ornTypeEntries = undefined;
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

  protected getModelFromForm(): MsOrnamentsPart {
    let part = this.model;
    if (!part) {
      part = {
        itemId: this.itemId,
        id: '',
        typeId: MSORNAMENTS_PART_TYPEID,
        roleId: this.roleId,
        timeCreated: new Date(),
        creatorId: '',
        timeModified: new Date(),
        userId: '',
        ornaments: [],
      };
    }
    part.ornaments = this.ornaments.value || [];
    return part;
  }

  public addOrnament(): void {
    const ornament: MsOrnament = {
      type: '',
      start: { n: 0 },
      end: { n: 0 },
    };
    this.ornaments.setValue([...this.ornaments.value, ornament]);
    this.editOrnament(this.ornaments.value.length - 1);
  }

  public editOrnament(index: number): void {
    if (index < 0) {
      this._editedIndex = -1;
      this.tabIndex = 0;
      this.editedOrnament = undefined;
    } else {
      this._editedIndex = index;
      this.editedOrnament = this.ornaments.value[index];
      setTimeout(() => {
        this.tabIndex = 1;
      }, 300);
    }
  }

  public onOrnamentSave(unit: MsOrnament): void {
    this.ornaments.setValue(
      this.ornaments.value.map((u: MsOrnament, i: number) =>
        i === this._editedIndex ? unit : u
      )
    );
    this.editOrnament(-1);
  }

  public onOrnamentClose(): void {
    this.editOrnament(-1);
  }

  public deleteOrnament(index: number): void {
    this._dialogService
      .confirm('Confirmation', 'Delete ornament?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          const ornaments = [...this.ornaments.value];
          ornaments.splice(index, 1);
          this.ornaments.setValue(ornaments);
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
  }

  public locationToString(location?: MsLocation): string {
    return this._locService.locationToString(location) ?? '';
  }
}
