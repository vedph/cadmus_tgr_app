import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormArray,
  FormGroup,
  UntypedFormGroup,
} from '@angular/forms';

import { EditedObject, ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { ThesauriSet, ThesaurusEntry } from '@myrmidon/cadmus-core';
import {
  AvailableWitness,
  AvailableWitnessesPart,
  AVAILABLE_WITNESSES_PART_TYPEID,
} from '../available-witnesses-part';
import { deepCopy, NgToolsValidators } from '@myrmidon/ng-tools';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';

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
  implements OnInit
{
  /**
   * The witnesses entries.
   */
  public witEntries: ThesaurusEntry[] | undefined;

  public witnesses: FormArray;

  constructor(authService: AuthJwtService, private _formBuilder: FormBuilder) {
    super(authService, _formBuilder);
    // form
    this.witnesses = _formBuilder.array(
      [],
      NgToolsValidators.strictMinLengthValidator(1)
    );
  }

  public override ngOnInit(): void {
    super.ngOnInit();
  }

  protected buildForm(formBuilder: FormBuilder): FormGroup | UntypedFormGroup {
    return formBuilder.group({
      witnesses: this.witnesses,
    });
  }

  private updateThesauri(thesauri: ThesauriSet): void {
    const key = 'apparatus-witnesses';
    if (this.hasThesaurus(key)) {
      this.witEntries = thesauri[key].entries;
    } else {
      this.witEntries = undefined;
    }
  }

  private updateForm(part?: AvailableWitnessesPart | null): void {
    if (!part) {
      this.form.reset();
      return;
    }
    this.witnesses.clear();
    if (part.witnesses?.length) {
      for (let w of part.witnesses) {
        this.witnesses.controls.push(this.getWitnessGroup(w));
      }
    }
    this.form.markAsPristine();
  }

  protected override onDataSet(
    data?: EditedObject<AvailableWitnessesPart>
  ): void {
    // thesauri
    if (data?.thesauri) {
      this.updateThesauri(data.thesauri);
    }

    // form
    this.updateForm(data?.value);
  }

  protected getValue(): AvailableWitnessesPart {
    let part = this.getEditedPart(
      AVAILABLE_WITNESSES_PART_TYPEID
    ) as AvailableWitnessesPart;
    part.witnesses = this.getWitnesses();
    return part;
  }

  private getWitnessGroup(witness?: AvailableWitness): FormGroup {
    const g = this._formBuilder.group({
      id: this._formBuilder.control(witness?.id, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      partial: this._formBuilder.control(witness?.isPartial),
      note: this._formBuilder.control(witness?.note, Validators.maxLength(300)),
    });
    g.valueChanges.subscribe((_) => {
      this.form?.updateValueAndValidity();
    });
    return g;
  }

  public addWitness(item?: AvailableWitness): void {
    this.witnesses.push(this.getWitnessGroup(item));
    this.form?.markAsDirty();
  }

  public removeWitness(index: number): void {
    this.witnesses.removeAt(index);
    this.form?.markAsDirty();
  }

  public moveWitnessUp(index: number): void {
    if (index < 1) {
      return;
    }
    const item = this.witnesses.controls[index];
    this.witnesses.removeAt(index);
    this.witnesses.insert(index - 1, item);
    this.form?.markAsDirty();
  }

  public moveWitnessDown(index: number): void {
    if (index + 1 >= this.witnesses.length) {
      return;
    }
    const item = this.witnesses.controls[index];
    this.witnesses.removeAt(index);
    this.witnesses.insert(index + 1, item);
    this.form?.markAsDirty();
  }

  public addAllWitnesses(): void {
    if (!this.witEntries?.length) {
      return;
    }
    const present = this.getWitnesses();
    this.witEntries.forEach((e) => {
      if (!present.find((p) => p.id === e.id)) {
        this.addWitness({
          id: e.id,
        });
      }
    });
    this.form?.markAsDirty();
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
