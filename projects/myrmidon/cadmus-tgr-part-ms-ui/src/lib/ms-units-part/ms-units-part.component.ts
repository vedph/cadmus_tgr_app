import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';

import { ModelEditorComponentBase, DialogService } from '@myrmidon/cadmus-ui';
import { AuthService } from '@myrmidon/cadmus-api';
import { ThesaurusEntry, deepCopy } from '@myrmidon/cadmus-core';
import { MsUnitsPart, MSUNITS_PART_TYPEID } from '../ms-units-part';

/**
 * MsUnitsPart editor component.
 * Thesauri: ms-materials, ms-exec-manners, ms-rulings, physical-size-units
 * (all optional).
 */
@Component({
  selector: 'tgr-ms-units-part',
  templateUrl: './ms-units-part.component.html',
  styleUrls: ['./ms-units-part.component.css'],
})
export class MsUnitsPartComponent
  extends ModelEditorComponentBase<MsUnitsPart>
  implements OnInit {
  public matEntries: ThesaurusEntry[] | undefined;
  public msxEntries: ThesaurusEntry[] | undefined;
  public msrEntries: ThesaurusEntry[] | undefined;
  public unitEntries: ThesaurusEntry[] | undefined;

  constructor(authService: AuthService, formBuilder: FormBuilder) {
    super(authService);
    // form
    this.form = formBuilder.group({
      // TODO
    });
  }

  public ngOnInit(): void {
    this.initEditor();
  }

  private updateForm(model: MsUnitsPart): void {
    if (!model) {
      this.form.reset();
      return;
    }
    // TODO set controls values from model
    this.form.markAsPristine();
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

    key = 'ms-exec-manners';
    if (this.thesauri && this.thesauri[key]) {
      this.msxEntries = this.thesauri[key].entries;
    } else {
      this.msxEntries = undefined;
    }

    key = 'ms-rulings';
    if (this.thesauri && this.thesauri[key]) {
      this.msrEntries = this.thesauri[key].entries;
    } else {
      this.msrEntries = undefined;
    }

    key = 'physical-size-units';
    if (this.thesauri && this.thesauri[key]) {
      this.unitEntries = this.thesauri[key].entries;
    } else {
      this.unitEntries = undefined;
    }
  }

  protected getModelFromForm(): MsUnitsPart {
    let part = this.model;
    if (!part) {
      part = {
        itemId: this.itemId,
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
    // TODO set part.properties from form controls
    return part;
  }
}
