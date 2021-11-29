import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@myrmidon/cadmus-api';
import { CadmusValidators, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import {
  MsSignature,
  MsSignaturesPart,
  MSSIGNATURES_PART_TYPEID,
} from '../ms-signatures-part';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { deepCopy } from '@myrmidon/ng-tools';

/**
 * Manuscript's signatures part.
 * Thesauri (all optional): ms-signature-tags.
 */
@Component({
  selector: 'tgr-ms-signatures-part',
  templateUrl: './ms-signatures-part.component.html',
  styleUrls: ['./ms-signatures-part.component.css'],
})
export class MsSignaturesPartComponent
  extends ModelEditorComponentBase<MsSignaturesPart>
  implements OnInit, AfterViewInit, OnDestroy
{
  private _citySubscription?: Subscription;

  public tagEntries: ThesaurusEntry[] | undefined;

  public form: FormGroup;
  public signatures: FormArray;

  @ViewChildren('city') cityQueryList?: QueryList<any>;

  constructor(authService: AuthService, private _formBuilder: FormBuilder) {
    super(authService);
    // form
    this.signatures = _formBuilder.array(
      [],
      CadmusValidators.strictMinLengthValidator(1)
    );
    this.form = _formBuilder.group({
      signatures: this.signatures,
    });
  }

  public ngOnInit(): void {
    this.initEditor();
  }

  public ngAfterViewInit(): void {
    if (this.cityQueryList) {
      this._citySubscription = this.cityQueryList.changes
        .pipe(debounceTime(300))
        .subscribe((_) => {
          if (this.cityQueryList!.length > 0) {
            this.cityQueryList!.last.nativeElement.focus();
          }
        });
    }
  }

  public ngOnDestroy(): void {
    this._citySubscription?.unsubscribe();
  }

  private updateForm(model: MsSignaturesPart): void {
    if (!model) {
      this.form.reset();
      return;
    }
    this.signatures.clear();
    for (const signature of model.signatures || []) {
      this.addSignature(signature);
    }
    this.form.markAsPristine();
  }

  protected onModelSet(model: MsSignaturesPart): void {
    this.updateForm(deepCopy(model));
  }

  protected onThesauriSet(): void {
    // ms-signature-tags
    const key = 'ms-signature-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.tagEntries = this.thesauri[key].entries;
    } else {
      this.tagEntries = undefined;
    }
  }

  protected getModelFromForm(): MsSignaturesPart {
    let part = deepCopy(this.model);
    if (!part) {
      part = {
        itemId: this.itemId,
        id: null,
        typeId: MSSIGNATURES_PART_TYPEID,
        roleId: this.roleId,
        timeCreated: new Date(),
        creatorId: null,
        timeModified: new Date(),
        userId: null,
        signatures: [],
      };
    }
    part.signatures = [];
    for (let i = 0; i < this.signatures.length; i++) {
      const g = this.signatures.controls[i] as FormGroup;
      part.signatures.push({
        tag: g.controls.tag.value?.trim(),
        city: g.controls.city.value?.trim(),
        library: g.controls.library.value?.trim(),
        fund: g.controls.fund.value?.trim(),
        location: g.controls.location.value?.trim(),
      });
    }
    return part;
  }

  private getSignatureGroup(item?: MsSignature): FormGroup {
    return this._formBuilder.group({
      tag: this._formBuilder.control(item?.tag, Validators.maxLength(50)),
      city: this._formBuilder.control(item?.city, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      library: this._formBuilder.control(item?.library, [
        Validators.required,
        Validators.maxLength(100),
      ]),
      fund: this._formBuilder.control(item?.fund, [Validators.maxLength(100)]),
      location: this._formBuilder.control(item?.location, [
        Validators.required,
        Validators.maxLength(50),
      ]),
    });
  }

  public addSignature(item?: MsSignature): void {
    this.signatures.push(this.getSignatureGroup(item));
  }

  public removeSignature(index: number): void {
    this.signatures.removeAt(index);
    this.form.markAsDirty();
  }

  public moveSignatureUp(index: number): void {
    if (index < 1) {
      return;
    }
    const item = this.signatures.controls[index];
    this.signatures.removeAt(index);
    this.signatures.insert(index - 1, item);
    this.form.markAsDirty();
  }

  public moveSignatureDown(index: number): void {
    if (index + 1 >= this.signatures.length) {
      return;
    }
    const item = this.signatures.controls[index];
    this.signatures.removeAt(index);
    this.signatures.insert(index + 1, item);
    this.form.markAsDirty();
  }
}
