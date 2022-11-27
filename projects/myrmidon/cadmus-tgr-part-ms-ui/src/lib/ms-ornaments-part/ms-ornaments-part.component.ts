import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
  UntypedFormGroup,
} from '@angular/forms';

import { EditedObject, ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { ThesauriSet, ThesaurusEntry } from '@myrmidon/cadmus-core';
import {
  MsOrnament,
  MsOrnamentsPart,
  MSORNAMENTS_PART_TYPEID,
} from '../ms-ornaments-part';
import { take } from 'rxjs/operators';
import { MsLocation, MsLocationService } from '@myrmidon/cadmus-tgr-core';
import { DialogService } from '@myrmidon/ng-mat-tools';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';

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
  implements OnInit
{
  private _editedIndex: number;

  public tabIndex: number;
  public editedOrnament: MsOrnament | undefined;

  public ornTypeEntries: ThesaurusEntry[] | undefined;
  public szUnitEntries: ThesaurusEntry[] | undefined;
  public szTagEntries: ThesaurusEntry[] | undefined;
  public szDimTagEntries: ThesaurusEntry[] | undefined;

  public ornaments: FormControl;

  constructor(
    authService: AuthJwtService,
    formBuilder: FormBuilder,
    private _dialogService: DialogService,
    private _locService: MsLocationService
  ) {
    super(authService, formBuilder);
    this._editedIndex = -1;
    this.tabIndex = 0;
    // form
    this.ornaments = formBuilder.control([], Validators.required);
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

  private updateForm(part?: MsOrnamentsPart): void {
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
