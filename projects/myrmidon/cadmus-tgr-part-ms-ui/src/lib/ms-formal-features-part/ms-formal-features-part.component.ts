import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  UntypedFormGroup,
} from '@angular/forms';
import { take } from 'rxjs/operators';

import { DialogService } from '@myrmidon/ng-mat-tools';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';
import { NgToolsValidators } from '@myrmidon/ng-tools';
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
  standalone: false,
})
export class MsFormalFeaturesPartComponent
  extends ModelEditorComponentBase<MsFormalFeaturesPart>
  implements OnInit
{
  public editedFeatureIndex: number;
  public editedFeature: MsFormalFeature | undefined;

  public features: FormControl<MsFormalFeature[]>;

  constructor(
    authService: AuthJwtService,
    formBuilder: FormBuilder,
    private _dialogService: DialogService
  ) {
    super(authService, formBuilder);
    this.editedFeatureIndex = -1;
    // form
    this.features = formBuilder.control([], {
      validators: NgToolsValidators.strictMinLengthValidator(1),
      nonNullable: true,
    });
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
    this.editFeature({
      handId: '',
      description: '',
    });
  }

  public editFeature(feature: MsFormalFeature, index = -1): void {
    this.editedFeatureIndex = index;
    this.editedFeature = feature;
  }

  public saveFeature(feature: MsFormalFeature): void {
    const features = [...this.features.value];
    if (this.editedFeatureIndex === -1) {
      features.push(feature);
    } else {
      features.splice(this.editedFeatureIndex, 1, feature);
    }
    this.features.setValue(features);
    this.features.updateValueAndValidity();
    this.features.markAsDirty();
    this.closeFeature();
  }

  public closeFeature(): void {
    this.editedFeatureIndex = -1;
    this.editedFeature = undefined;
  }

  public deleteFeature(index: number): void {
    this._dialogService
      .confirm('Confirmation', 'Delete feature?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          if (this.editedFeatureIndex === index) {
            this.closeFeature();
          }
          const features = [...this.features.value];
          features.splice(index, 1);
          this.features.setValue(features);
          this.features.updateValueAndValidity();
          this.features.markAsDirty();
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
    this.features.updateValueAndValidity();
    this.features.markAsDirty();
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
    this.features.updateValueAndValidity();
    this.features.markAsDirty();
  }
}
