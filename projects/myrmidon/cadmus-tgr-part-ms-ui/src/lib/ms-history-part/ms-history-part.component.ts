import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl,
  ValidationErrors,
  FormGroup,
  UntypedFormGroup,
} from '@angular/forms';

import { EditedObject, ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { ThesauriSet, ThesaurusEntry } from '@myrmidon/cadmus-core';
import {
  MsAnnotation,
  MsHistoryPart,
  MSHISTORY_PART_TYPEID,
} from '../ms-history-part';
import {
  GeoAddress,
  MsLocation,
  MsLocationService,
} from '@myrmidon/cadmus-tgr-core';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';

/**
 * Manuscript's history part editor component.
 * Thesauri: ms-languages (optional).
 */
@Component({
  selector: 'tgr-ms-history-part',
  templateUrl: './ms-history-part.component.html',
  styleUrls: ['./ms-history-part.component.css'],
})
export class MsHistoryPartComponent
  extends ModelEditorComponentBase<MsHistoryPart>
  implements OnInit
{
  public provenances: FormArray;
  public history: FormControl<string | null>;
  public owners: FormArray;
  public subLocations: FormControl<string | null>;
  public subLanguage: FormControl<string | null>;
  public subHandId: FormControl<string | null>;
  public subText: FormControl<string | null>;
  public subNote: FormControl<string | null>;
  public annotations: FormArray;

  public langEntries: ThesaurusEntry[] | undefined;

  public editorOptions = {
    theme: 'vs-light',
    language: 'markdown',
    wordWrap: 'on',
    // https://github.com/atularen/ngx-monaco-editor/issues/19
    automaticLayout: true,
  };

  constructor(
    authService: AuthJwtService,
    private _formBuilder: FormBuilder,
    private _locService: MsLocationService
  ) {
    super(authService, _formBuilder);
    // form
    this.provenances = _formBuilder.array([]);
    this.history = _formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(5000),
    ]);
    this.owners = _formBuilder.array([]);
    this.subLocations = _formBuilder.control(null, [
      Validators.maxLength(100),
      this.locationsVal,
    ]);
    this.subLanguage = _formBuilder.control(null, [Validators.maxLength(50)]);
    this.subHandId = _formBuilder.control(null, Validators.maxLength(50));
    this.subText = _formBuilder.control(null, Validators.maxLength(1000));
    this.subNote = _formBuilder.control(null, Validators.maxLength(1500));
    this.annotations = _formBuilder.array([]);
  }

  private locationsVal(control: AbstractControl): ValidationErrors | null {
    const locService = new MsLocationService();
    if (control.value) {
      const err = control.value
        .split(',')
        .map((t: string) => {
          return locService.parseLocation(t.trim());
        })
        .some((l: MsLocation) => !l);
      if (err) {
        return { invalid: true };
      }
    }
    return null;
  }

  public override ngOnInit(): void {
    super.ngOnInit();
  }

  protected buildForm(formBuilder: FormBuilder): FormGroup | UntypedFormGroup {
    return formBuilder.group({
      provenances: this.provenances,
      history: this.history,
      owners: this.owners,
      subLocations: this.subLocations,
      subLanguage: this.subLanguage,
      subHandId: this.subHandId,
      subText: this.subText,
      subNote: this.subNote,
      annotations: this.annotations,
    });
  }

  private updateThesauri(thesauri: ThesauriSet): void {
    const key = 'ms-languages';
    if (this.hasThesaurus(key)) {
      this.langEntries = thesauri[key].entries;
    } else {
      this.langEntries = undefined;
    }
  }

  private updateForm(part?: MsHistoryPart | null): void {
    if (!part) {
      this.form.reset();
      return;
    }
    // provenances
    this.provenances.clear();
    if (part.provenances?.length) {
      for (let provenance of part.provenances) {
        this.provenances.controls.push(this.getProvenanceGroup(provenance));
      }
    }
    this.provenances.updateValueAndValidity();
    this.history.setValue(part.history);
    // owners
    this.owners.clear();
    if (part.owners?.length) {
      for (let owner of part.owners) {
        this.owners.controls.push(this.getOwnerGroup(owner));
      }
    }
    this.subLocations.setValue(
      part.subscription?.locations
        ? part.subscription.locations
            .map((l) => {
              return this._locService.locationToString(l);
            })
            .join(',')
        : ''
    );
    this.subLanguage.setValue(part.subscription?.language || null);
    this.subHandId.setValue(part.subscription?.handId || null);
    this.subText.setValue(part.subscription?.text || null);
    this.subNote.setValue(part.subscription?.note || null);
    // annotations
    this.annotations.clear();
    if (part.annotations?.length) {
      for (let annotation of part.annotations) {
        this.annotations.controls.push(this.getAnnotationGroup(annotation));
      }
    }
    this.form.markAsPristine();
  }

  protected override onDataSet(data?: EditedObject<MsHistoryPart>): void {
    // thesauri
    if (data?.thesauri) {
      this.updateThesauri(data.thesauri);
    }

    // form
    this.updateForm(data?.value);
  }

  protected getValue(): MsHistoryPart {
    let part = this.getEditedPart(MSHISTORY_PART_TYPEID) as MsHistoryPart;
    part.provenances = this.getProvenances();
    part.history = this.history.value?.trim() || '';
    part.owners = this.getOwners();
    part.annotations = this.getAnnotations();

    if (this.subLocations.value) {
      part.subscription = {
        locations: this.subLocations.value.split(',').map((t: string) => {
          return this._locService.parseLocation(t.trim())!;
        }),
        language: this.subLanguage.value?.trim() || '',
        handId: this.subHandId.value?.trim(),
        text: this.subText.value?.trim() || '',
        note: this.subNote.value?.trim(),
      };
    }

    return part;
  }

  //#region Provenances
  private getProvenanceGroup(address?: GeoAddress): FormGroup {
    return this._formBuilder.group({
      area: this._formBuilder.control(address?.area, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      address: this._formBuilder.control(
        address?.address,
        Validators.maxLength(500)
      ),
    });
  }

  public addProvenance(item?: GeoAddress): void {
    this.provenances.push(this.getProvenanceGroup(item));
    this.provenances.updateValueAndValidity();
    this.form?.markAsDirty();
  }

  public removeProvenance(index: number): void {
    this.provenances.removeAt(index);
    this.provenances.updateValueAndValidity();
    this.form?.markAsDirty();
  }

  public moveProvenanceUp(index: number): void {
    if (index < 1) {
      return;
    }
    const provenance = this.provenances.controls[index];
    this.provenances.removeAt(index);
    this.provenances.insert(index - 1, provenance);
    this.form?.markAsDirty();
  }

  public moveProvenanceDown(index: number): void {
    if (index + 1 >= this.provenances.length) {
      return;
    }
    const provenance = this.provenances.controls[index];
    this.provenances.removeAt(index);
    this.provenances.insert(index + 1, provenance);
    this.form?.markAsDirty();
  }

  private getProvenances(): GeoAddress[] | undefined {
    const provenances: GeoAddress[] = [];
    for (let i = 0; i < this.provenances.length; i++) {
      const g = this.provenances.at(i) as FormGroup;
      provenances.push({
        area: g.controls.area.value?.trim(),
        address: g.controls.address.value?.trim(),
      });
    }
    return provenances.length ? provenances : undefined;
  }
  //#endregion

  //#region Owners
  private getOwnerGroup(owner?: string): FormGroup {
    return this._formBuilder.group({
      name: this._formBuilder.control(owner, [
        Validators.required,
        Validators.maxLength(50),
      ]),
    });
  }

  public addOwner(item?: string): void {
    this.owners.push(this.getOwnerGroup(item));
  }

  public removeOwner(index: number): void {
    this.owners.removeAt(index);
  }

  public moveOwnerUp(index: number): void {
    if (index < 1) {
      return;
    }
    const owner = this.owners.controls[index];
    this.owners.removeAt(index);
    this.owners.insert(index - 1, owner);
  }

  public moveOwnerDown(index: number): void {
    if (index + 1 >= this.owners.length) {
      return;
    }
    const owner = this.owners.controls[index];
    this.owners.removeAt(index);
    this.owners.insert(index + 1, owner);
  }

  private getOwners(): string[] | undefined {
    const owners: string[] = [];
    for (let i = 0; i < this.owners.length; i++) {
      const g = this.owners.at(i) as FormGroup;
      owners.push(g.controls.name.value?.trim());
    }
    return owners.length ? owners : undefined;
  }
  //#endregion

  //#region Annotations
  private getAnnotationGroup(annotation?: MsAnnotation): FormGroup {
    return this._formBuilder.group({
      language: this._formBuilder.control(annotation?.language, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      handId: this._formBuilder.control(
        annotation?.handId,
        Validators.maxLength(50)
      ),
      note: this._formBuilder.control(
        annotation?.note,
        Validators.maxLength(500)
      ),
    });
  }

  public addAnnotation(item?: MsAnnotation): void {
    this.annotations.push(this.getAnnotationGroup(item));
  }

  public removeAnnotation(index: number): void {
    this.annotations.removeAt(index);
  }

  public moveAnnotationUp(index: number): void {
    if (index < 1) {
      return;
    }
    const annotation = this.annotations.controls[index];
    this.annotations.removeAt(index);
    this.annotations.insert(index - 1, annotation);
  }

  public moveAnnotationDown(index: number): void {
    if (index + 1 >= this.annotations.length) {
      return;
    }
    const annotation = this.annotations.controls[index];
    this.annotations.removeAt(index);
    this.annotations.insert(index + 1, annotation);
  }

  private getAnnotations(): MsAnnotation[] | undefined {
    const annotations: MsAnnotation[] = [];
    for (let i = 0; i < this.annotations.length; i++) {
      const g = this.annotations.at(i) as FormGroup;
      annotations.push({
        language: g.controls.language.value?.trim(),
        handId: g.controls.handId.value?.trim(),
        note: g.controls.note.value?.trim(),
      });
    }
    return annotations.length ? annotations : undefined;
  }
  //#endregion
}
