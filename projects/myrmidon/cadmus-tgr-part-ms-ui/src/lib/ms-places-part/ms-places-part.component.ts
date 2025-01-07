import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { take } from 'rxjs/operators';

import { MsPlace, MsPlacesPart, MSPLACES_PART_TYPEID } from '../ms-places-part';
import {
  MatCard,
  MatCardHeader,
  MatCardAvatar,
  MatCardTitle,
  MatCardContent,
  MatCardActions,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
} from '@angular/material/expansion';

import { DialogService } from '@myrmidon/ngx-mat-tools';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';
import { NgxToolsValidators } from '@myrmidon/ngx-tools';

import {
  EditedObject,
  ModelEditorComponentBase,
  CloseSaveButtonsComponent,
} from '@myrmidon/cadmus-ui';
import { ThesauriSet, ThesaurusEntry } from '@myrmidon/cadmus-core';

import { MsPlaceComponent } from '../ms-place/ms-place.component';

/**
 * Manuscript's place(s) of origin part editor.
 * Thesauri: ms-place-areas, doc-reference-tags (all optional).
 */
@Component({
  selector: 'tgr-ms-places-part',
  templateUrl: './ms-places-part.component.html',
  styleUrls: ['./ms-places-part.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCard,
    MatCardHeader,
    MatCardAvatar,
    MatIcon,
    MatCardTitle,
    MatCardContent,
    MatButton,
    MatIconButton,
    MatTooltip,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MsPlaceComponent,
    MatCardActions,
    CloseSaveButtonsComponent,
  ],
})
export class MsPlacesPartComponent
  extends ModelEditorComponentBase<MsPlacesPart>
  implements OnInit
{
  public editedPlaceIndex: number;
  public editedPlace: MsPlace | undefined;

  public areaEntries: ThesaurusEntry[] | undefined;
  public tagEntries: ThesaurusEntry[] | undefined;

  public places: FormControl<MsPlace[]>;

  constructor(
    authService: AuthJwtService,
    formBuilder: FormBuilder,
    private _dialogService: DialogService
  ) {
    super(authService, formBuilder);
    this.editedPlaceIndex = -1;
    // form
    this.places = formBuilder.control([], {
      validators: NgxToolsValidators.strictMinLengthValidator(1),
      nonNullable: true,
    });
  }

  public override ngOnInit(): void {
    super.ngOnInit();
  }

  protected buildForm(formBuilder: FormBuilder): FormGroup | UntypedFormGroup {
    return formBuilder.group({
      entries: this.places,
    });
  }

  private updateThesauri(thesauri: ThesauriSet): void {
    let key = 'ms-place-areas';
    if (this.hasThesaurus(key)) {
      this.areaEntries = thesauri[key].entries;
    } else {
      this.areaEntries = undefined;
    }
    key = 'doc-reference-tags';
    if (this.hasThesaurus(key)) {
      this.tagEntries = thesauri[key].entries;
    } else {
      this.tagEntries = undefined;
    }
  }

  private updateForm(part?: MsPlacesPart | null): void {
    if (!part) {
      this.form.reset();
      return;
    }
    this.places.setValue(part.places || []);
    this.form.markAsPristine();
  }

  protected override onDataSet(data?: EditedObject<MsPlacesPart>): void {
    // thesauri
    if (data?.thesauri) {
      this.updateThesauri(data.thesauri);
    }

    // form
    this.updateForm(data?.value);
  }

  protected getValue(): MsPlacesPart {
    let part = this.getEditedPart(MSPLACES_PART_TYPEID) as MsPlacesPart;
    part.places = this.places.value;
    return part;
  }

  public addPlace(): void {
    this.editPlace({
      area: '',
    });
  }

  public editPlace(place: MsPlace, index = -1): void {
    this.editedPlaceIndex = index;
    this.editedPlace = place;
  }

  public savePlace(place: MsPlace): void {
    const places = [...this.places.value];
    if (this.editedPlaceIndex === -1) {
      places.push(place);
    } else {
      places.splice(this.editedPlaceIndex, 1, place);
    }
    this.places.setValue(places);
    this.places.updateValueAndValidity();
    this.places.markAsDirty();
    this.closePlace();
  }

  public closePlace(): void {
    this.editedPlaceIndex = -1;
    this.editedPlace = undefined;
  }

  public deletePlace(index: number): void {
    this._dialogService
      .confirm('Confirmation', 'Delete entry?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          if (this.editedPlaceIndex === -1) {
            this.closePlace();
          }
          const places = [...this.places.value];
          places.splice(index, 1);
          this.places.setValue(places);
          this.places.updateValueAndValidity();
          this.places.markAsDirty();
        }
      });
  }

  public movePlaceUp(index: number): void {
    if (index < 1) {
      return;
    }
    const place = this.places.value[index];
    const places = [...this.places.value];
    places.splice(index, 1);
    places.splice(index - 1, 0, place);
    this.places.setValue(places);
    this.places.updateValueAndValidity();
    this.places.markAsDirty();
  }

  public movePlaceDown(index: number): void {
    if (index + 1 >= this.places.value.length) {
      return;
    }
    const place = this.places.value[index];
    const places = [...this.places.value];
    places.splice(index, 1);
    places.splice(index + 1, 0, place);
    this.places.setValue(places);
    this.places.updateValueAndValidity();
    this.places.markAsDirty();
  }
}
