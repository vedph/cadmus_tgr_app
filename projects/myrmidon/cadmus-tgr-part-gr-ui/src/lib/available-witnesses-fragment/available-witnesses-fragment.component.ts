import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';
import { CadmusValidators, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { BucketStoreService } from '@myrmidon/cadmus-tgr-core';
import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { deepCopy } from '@myrmidon/ng-tools';
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
    super(authService);
    this.bucketAvailable = false;
    // form
    this.witnesses = _formBuilder.array(
      [],
      CadmusValidators.strictMinLengthValidator(1)
    );
    this.form = _formBuilder.group({
      witnesses: this.witnesses,
    });
  }

  public ngOnInit(): void {
    this.initEditor();
    this._store.changes$.subscribe((_) => {
      this.bucketAvailable = this._store.has(BUCKET_AVAIL_WITNESSES_KEY);
    });
  }

  private updateForm(model: AvailableWitnessesFragment): void {
    if (!model) {
      this.form?.reset();
      return;
    }
    this.witnesses.clear();
    if (model.witnesses?.length) {
      for (let w of model.witnesses) {
        this.witnesses.controls.push(this.getWitnessGroup(w));
      }
    }
    this._store.set(BUCKET_AVAIL_WITNESSES_KEY, [...model.witnesses]);
    this.form?.markAsPristine();
  }

  protected onModelSet(model: AvailableWitnessesFragment): void {
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

  protected getModelFromForm(): AvailableWitnessesFragment {
    return {
      location: this.model?.location ?? '',
      witnesses: this.getWitnesses(),
    };
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

  public copyWitnesses(): void {
    if (this.witnesses.value.length) {
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
