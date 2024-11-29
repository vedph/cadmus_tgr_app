import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ThesauriSet, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { EditedObject, ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { NgToolsValidators } from '@myrmidon/ng-tools';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';

import {
  MsSignature,
  MsSignaturesPart,
  MSSIGNATURES_PART_TYPEID,
} from '../ms-signatures-part';

/**
 * Manuscript's signatures part.
 * Thesauri (all optional): ms-signature-tags.
 */
@Component({
  selector: 'tgr-ms-signatures-part',
  templateUrl: './ms-signatures-part.component.html',
  styleUrls: ['./ms-signatures-part.component.css'],
  standalone: false,
})
export class MsSignaturesPartComponent
  extends ModelEditorComponentBase<MsSignaturesPart>
  implements OnInit, AfterViewInit, OnDestroy
{
  private _citySubscription?: Subscription;

  public tagEntries: ThesaurusEntry[] | undefined;
  public signatures: FormArray;

  @ViewChildren('city') cityQueryList?: QueryList<any>;

  constructor(authService: AuthJwtService, private _formBuilder: FormBuilder) {
    super(authService, _formBuilder);
    // form
    this.signatures = _formBuilder.array(
      [],
      NgToolsValidators.strictMinLengthValidator(1)
    );
  }

  public override ngOnInit(): void {
    super.ngOnInit();
  }

  protected buildForm(formBuilder: FormBuilder): FormGroup | UntypedFormGroup {
    return formBuilder.group({
      signatures: this.signatures,
    });
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

  private updateThesauri(thesauri: ThesauriSet): void {
    // ms-signature-tags
    const key = 'ms-signature-tags';
    if (this.hasThesaurus(key)) {
      this.tagEntries = thesauri[key].entries;
    } else {
      this.tagEntries = undefined;
    }
  }

  private updateForm(part?: MsSignaturesPart | null): void {
    if (!part) {
      this.form.reset();
      return;
    }
    this.signatures.clear();
    for (const signature of part.signatures || []) {
      this.addSignature(signature);
    }
    this.form.markAsPristine();
  }

  protected override onDataSet(data?: EditedObject<MsSignaturesPart>): void {
    // thesauri
    if (data?.thesauri) {
      this.updateThesauri(data.thesauri);
    }

    // form
    this.updateForm(data?.value);
  }

  protected getValue(): MsSignaturesPart {
    let part = this.getEditedPart(MSSIGNATURES_PART_TYPEID) as MsSignaturesPart;
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
    this.signatures.updateValueAndValidity();
    this.signatures.markAsDirty();
  }

  public moveSignatureUp(index: number): void {
    if (index < 1) {
      return;
    }
    const item = this.signatures.controls[index];
    this.signatures.removeAt(index);
    this.signatures.insert(index - 1, item);
    this.signatures.updateValueAndValidity();
    this.signatures.markAsDirty();
  }

  public moveSignatureDown(index: number): void {
    if (index + 1 >= this.signatures.length) {
      return;
    }
    const item = this.signatures.controls[index];
    this.signatures.removeAt(index);
    this.signatures.insert(index + 1, item);
    this.signatures.updateValueAndValidity();
    this.signatures.markAsDirty();
  }
}
