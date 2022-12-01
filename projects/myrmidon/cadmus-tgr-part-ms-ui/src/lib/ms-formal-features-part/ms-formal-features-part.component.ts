import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
  UntypedFormGroup,
} from '@angular/forms';
import { take } from 'rxjs/operators';

import { DialogService } from '@myrmidon/ng-mat-tools';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';

import { EditedObject, ModelEditorComponentBase } from '@myrmidon/cadmus-ui';

import {
  MsFormalFeature,
  MsFormalFeaturesPart,
  MSFORMAL_FEATURES_PART_TYPEID,
} from '../ms-formal-features-part';

/**
 * Manuscript's formal features part editor component.
 * Thesauri: none.
 */
@Component({
  selector: 'tgr-ms-formal-features-part',
  templateUrl: './ms-formal-features-part.component.html',
  styleUrls: ['./ms-formal-features-part.component.css'],
})
export class MsFormalFeaturesPartComponent
  extends ModelEditorComponentBase<MsFormalFeaturesPart>
  implements OnInit
{
  private _editedIndex: number;

  public tabIndex: number;
  public editedFeature: MsFormalFeature | undefined;

  public features: FormControl;

  constructor(
    authService: AuthJwtService,
    formBuilder: FormBuilder,
    private _dialogService: DialogService
  ) {
    super(authService, formBuilder);
    this._editedIndex = -1;
    this.tabIndex = 0;
    // form
    this.features = formBuilder.control([], Validators.required);
  }

  public override ngOnInit(): void {
    super.ngOnInit();
  }

  protected buildForm(formBuilder: FormBuilder): FormGroup | UntypedFormGroup {
    return formBuilder.group({
      entries: this.features,
    });
  }

  private updateForm(part?: MsFormalFeaturesPart | null): void {
    if (!part) {
      this.form.reset();
      return;
    }
    this.features.setValue(part.features || []);
    this.form.markAsPristine();
  }

  protected override onDataSet(
    data?: EditedObject<MsFormalFeaturesPart>
  ): void {
    this.updateForm(data?.value);
  }

  protected getValue(): MsFormalFeaturesPart {
    let part = this.getEditedPart(
      MSFORMAL_FEATURES_PART_TYPEID
    ) as MsFormalFeaturesPart;
    part.features = this.features.value || [];
    return part;
  }

  public addFeature(): void {
    const feature: MsFormalFeature = {
      handId: '',
      description: '',
    };
    this.features.setValue([...this.features.value, feature]);
    this.editFeature(this.features.value.length - 1);
  }

  public editFeature(index: number): void {
    if (index < 0) {
      this._editedIndex = -1;
      this.tabIndex = 0;
      this.editedFeature = undefined;
    } else {
      this._editedIndex = index;
      this.editedFeature = this.features.value[index];
      setTimeout(() => {
        this.tabIndex = 1;
      }, 300);
    }
  }

  public onFeatureSave(feature: MsFormalFeature): void {
    this.features.setValue(
      this.features.value.map((f: MsFormalFeature, i: number) =>
        i === this._editedIndex ? feature : f
      )
    );
    this.editFeature(-1);
  }

  public onFeatureClose(): void {
    this.editFeature(-1);
  }

  public deleteFeature(index: number): void {
    this._dialogService
      .confirm('Confirmation', 'Delete feature?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          const features = [...this.features.value];
          features.splice(index, 1);
          this.features.setValue(features);
        }
      });
  }

  public moveFeatureUp(index: number): void {
    if (index < 1) {
      return;
    }
    const feature = this.features.value[index];
    const features = [...this.features.value];
    features.splice(index, 1);
    features.splice(index - 1, 0, feature);
    this.features.setValue(features);
  }

  public moveFeatureDown(index: number): void {
    if (index + 1 >= this.features.value.length) {
      return;
    }
    const feature = this.features.value[index];
    const features = [...this.features.value];
    features.splice(index, 1);
    features.splice(index + 1, 0, feature);
    this.features.setValue(features);
  }
}
