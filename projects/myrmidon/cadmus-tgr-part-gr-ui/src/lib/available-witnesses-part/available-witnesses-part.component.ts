import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
  FormGroup,
} from '@angular/forms';

import { ModelEditorComponentBase, DialogService } from '@myrmidon/cadmus-ui';
import { AuthService } from '@myrmidon/cadmus-api';
import { ThesaurusEntry, deepCopy } from '@myrmidon/cadmus-core';
import {
  AvailableWitness,
  AvailableWitnessesPart,
  AVAILABLE_WITNESSES_PART_TYPEID,
} from '../available-witnesses-part';
import { take } from 'rxjs/operators';

/**
 * AvailableWitnessesPart editor component.
 * Thesauri: apparatus-witnesses (scoped, optional).
 */
@Component({
  selector: 'tgr-available-witnesses-part',
  templateUrl: './available-witnesses-part.component.html',
  styleUrls: ['./available-witnesses-part.component.css'],
})
export class AvailableWitnessesPartComponent
  extends ModelEditorComponentBase<AvailableWitnessesPart>
  implements OnInit {
  /**
   * The witnesses entries.
   */
  public witEntries: ThesaurusEntry[] | undefined;

  public witnesses: FormArray;

  constructor(
    authService: AuthService,
    private _formBuilder: FormBuilder,
    private _dialogService: DialogService
  ) {
    super(authService);
    // form
    this.witnesses = _formBuilder.array([], Validators.required);
    this.form = _formBuilder.group({
      witnesses: this.witnesses,
    });
  }

  public ngOnInit(): void {
    this.initEditor();
  }

  private updateForm(model: AvailableWitnessesPart): void {
    if (!model) {
      this.form.reset();
      return;
    }
    this.witnesses.clear();
    if (model.witnesses?.length) {
      for (let w of model.witnesses) {
        this.witnesses.controls.push(this.getWitnessGroup(w));
      }
    }
    this.form.markAsPristine();
  }

  protected onModelSet(model: AvailableWitnessesPart): void {
    this.updateForm(deepCopy(model));
  }

  protected onThesauriSet(): void {
    const key = 'apparatus-witnesses';
    if (this.thesauri && this.thesauri[key]) {
      this.witEntries = this.thesauri[key].entries;
    } else {
      this.witEntries = undefined;
    }
  }

  protected getModelFromForm(): AvailableWitnessesPart {
    let part = this.model;
    if (!part) {
      part = {
        itemId: this.itemId,
        id: '',
        typeId: AVAILABLE_WITNESSES_PART_TYPEID,
        roleId: this.roleId,
        timeCreated: new Date(),
        creatorId: '',
        timeModified: new Date(),
        userId: '',
        witnesses: [],
      };
    }
    part.witnesses = this.getWitnesses();
    return part;
  }

  private getWitnessGroup(witness?: AvailableWitness): FormGroup {
    return this._formBuilder.group({
      id: this._formBuilder.control(witness?.id, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      partial: this._formBuilder.control(witness?.isPartial),
      note: this._formBuilder.control(witness?.note, Validators.maxLength(300)),
    });
  }

  public addWitness(item?: AvailableWitness): void {
    this.witnesses.push(this.getWitnessGroup(item));
    this.witnesses.markAsDirty();
  }

  public addWitnessBelow(index: number): void {
    this.witnesses.insert(index + 1, this.getWitnessGroup());
    this.witnesses.markAsDirty();
  }

  public removeWitness(index: number): void {
    this.witnesses.removeAt(index);
    this.witnesses.markAsDirty();
  }

  public moveWitnessUp(index: number): void {
    if (index < 1) {
      return;
    }
    const item = this.witnesses.controls[index];
    this.witnesses.removeAt(index);
    this.witnesses.insert(index - 1, item);
    this.witnesses.markAsDirty();
  }

  public moveWitnessDown(index: number): void {
    if (index + 1 >= this.witnesses.length) {
      return;
    }
    const item = this.witnesses.controls[index];
    this.witnesses.removeAt(index);
    this.witnesses.insert(index + 1, item);
    this.witnesses.markAsDirty();
  }

  private getWitnesses(): AvailableWitness[] {
    const witnesses: AvailableWitness[] = [];
    for (let i = 0; i < this.witnesses.length; i++) {
      const g = this.witnesses.at(i) as FormGroup;
      witnesses.push({
        id: g.controls.id.value?.trim(),
        isPartial: g.controls.partial.value ? true : undefined,
        note: g.controls.note.value?.trim(),
      });
    }
    return witnesses;
  }
}
