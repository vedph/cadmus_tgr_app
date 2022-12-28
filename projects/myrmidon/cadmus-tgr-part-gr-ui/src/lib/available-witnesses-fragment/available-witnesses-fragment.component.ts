import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import { AuthJwtService } from '@myrmidon/auth-jwt-login';
import { ThesauriSet, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { BucketStoreService } from '@myrmidon/cadmus-tgr-core';
import { EditedObject, ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { deepCopy, NgToolsValidators } from '@myrmidon/ng-tools';

import { AvailableWitnessesFragment } from '../available-witnesses-fragment';
import { AvailableWitness } from '../available-witnesses-part';

const BUCKET_AVAIL_WITNESSES_KEY = 'available-witnesses';

/**
 * AvailableWitnesses fragment editor component.
 * Thesauri: apparatus-witnesses (scoped, optional).
 */
@Component({
  selector: 'cadmus-available-witnesses-fragment',
  templateUrl: './available-witnesses-fragment.component.html',
  styleUrls: ['./available-witnesses-fragment.component.css'],
})
export class AvailableWitnessesFragmentComponent
  extends ModelEditorComponentBase<AvailableWitnessesFragment>
  implements OnInit
{
  /**
   * The witnesses entries.
   */
  public witEntries: ThesaurusEntry[] | undefined;

  public witnesses: FormArray;
  public bucketAvailable: boolean;

  constructor(
    authService: AuthJwtService,
    private _formBuilder: FormBuilder,
    private _store: BucketStoreService
  ) {
    super(authService, _formBuilder);
    this.bucketAvailable = false;
    // form
    this.witnesses = _formBuilder.array(
      [],
      NgToolsValidators.strictMinLengthValidator(1)
    );
  }

  public override ngOnInit(): void {
    super.ngOnInit();
    this._store.changes$.subscribe((_) => {
      this.bucketAvailable = this._store.has(BUCKET_AVAIL_WITNESSES_KEY);
    });
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

  private updateForm(fr?: AvailableWitnessesFragment | null): void {
    if (!fr) {
      this.form.reset();
      return;
    }
    this.witnesses.clear();
    if (fr.witnesses?.length) {
      for (let w of fr.witnesses) {
        this.witnesses.controls.push(this.getWitnessGroup(w));
      }
    }
    this.bucketAvailable = this._store.has(BUCKET_AVAIL_WITNESSES_KEY);
    this.form.markAsPristine();
  }

  protected override onDataSet(
    data?: EditedObject<AvailableWitnessesFragment>
  ): void {
    // thesauri
    if (data?.thesauri) {
      this.updateThesauri(data.thesauri);
    }

    // form
    this.updateForm(data?.value);
  }

  protected getValue(): AvailableWitnessesFragment {
    const fr = this.getEditedFragment() as AvailableWitnessesFragment;
    fr.witnesses = this.getWitnesses();
    return fr;
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
      this.form.updateValueAndValidity();
    });
    return g;
  }

  public addWitness(item?: AvailableWitness): void {
    this.witnesses.push(this.getWitnessGroup(item));
    this.witnesses.updateValueAndValidity();
    this.witnesses.markAsDirty();
  }

  public removeWitness(index: number): void {
    this.witnesses.removeAt(index);
    this.witnesses.updateValueAndValidity();
    this.witnesses.markAsDirty();
  }

  public moveWitnessUp(index: number): void {
    if (index < 1) {
      return;
    }
    const item = this.witnesses.controls[index];
    this.witnesses.removeAt(index);
    this.witnesses.insert(index - 1, item);
    this.witnesses.updateValueAndValidity();
    this.witnesses.markAsDirty();
  }

  public moveWitnessDown(index: number): void {
    if (index + 1 >= this.witnesses.length) {
      return;
    }
    const item = this.witnesses.controls[index];
    this.witnesses.removeAt(index);
    this.witnesses.insert(index + 1, item);
    this.witnesses.updateValueAndValidity();
    this.witnesses.markAsDirty();
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
    this.witnesses.updateValueAndValidity();
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

  public copyWitnesses(): void {
    if (this.witnesses.length) {
      this._store.set(
        BUCKET_AVAIL_WITNESSES_KEY,
        deepCopy(this.getWitnesses())
      );
    }
  }

  public pasteWitnesses(): void {
    if (!this.bucketAvailable) {
      return;
    }
    const pastedWits = this._store.get(
      BUCKET_AVAIL_WITNESSES_KEY
    ) as AvailableWitness[];
    if (!pastedWits) {
      return;
    }
    const wits = [...this.getWitnesses()];
    for (let i = 0; i < pastedWits.length; i++) {
      if (wits.some((t) => t.id === pastedWits[i].id)) {
        continue;
      }
      wits.push(pastedWits[i]);
    }
    this.witnesses.clear();
    for (let i = 0; i < wits.length; i++) {
      this.addWitness(wits[i]);
    }
    this.witnesses.updateValueAndValidity();
    this.witnesses.markAsDirty();
  }
}
