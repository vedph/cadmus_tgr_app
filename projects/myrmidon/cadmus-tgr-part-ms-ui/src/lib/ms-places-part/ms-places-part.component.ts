import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
  UntypedFormGroup,
} from '@angular/forms';

import { EditedObject, ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { ThesauriSet, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { MsPlace, MsPlacesPart, MSPLACES_PART_TYPEID } from '../ms-places-part';
import { take } from 'rxjs/operators';
import { DialogService } from '@myrmidon/ng-mat-tools';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';

/**
 * Manuscript's place(s) of origin part editor.
 * Thesauri: ms-place-areas, doc-reference-tags (all optional).
 */
@Component({
  selector: 'tgr-ms-places-part',
  templateUrl: './ms-places-part.component.html',
  styleUrls: ['./ms-places-part.component.css'],
})
export class MsPlacesPartComponent
  extends ModelEditorComponentBase<MsPlacesPart>
  implements OnInit
{
  private _editedIndex: number;

  public tabIndex: number;
  public editedPlace: MsPlace | undefined;

  public areaEntries: ThesaurusEntry[] | undefined;
  public tagEntries: ThesaurusEntry[] | undefined;

  public places: FormControl;

  constructor(
    authService: AuthJwtService,
    formBuilder: FormBuilder,
    private _dialogService: DialogService
  ) {
    super(authService, formBuilder);
    this._editedIndex = -1;
    this.tabIndex = 0;
    // form
    this.places = formBuilder.control([], Validators.required);
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
    part.places = this.places.value || [];
    return part;
  }

  public addPlace(): void {
    const place: MsPlace = {
      area: '',
    };
    this.places.setValue([...this.places.value, place]);
    this.editPlace(this.places.value.length - 1);
  }

  public editPlace(index: number): void {
    if (index < 0) {
      this._editedIndex = -1;
      this.tabIndex = 0;
      this.editedPlace = undefined;
    } else {
      this._editedIndex = index;
      this.editedPlace = this.places.value[index];
      setTimeout(() => {
        this.tabIndex = 1;
      }, 300);
    }
  }

  public onPlaceSave(entry: MsPlace): void {
    this.places.setValue(
      this.places.value.map((e: MsPlace, i: number) =>
        i === this._editedIndex ? entry : e
      )
    );
    this.editPlace(-1);
    this.form?.markAsDirty();
  }

  public onPlaceClose(): void {
    this.editPlace(-1);
  }

  public deletePlace(index: number): void {
    this._dialogService
      .confirm('Confirmation', 'Delete entry?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          const places = [...this.places.value];
          places.splice(index, 1);
          this.places.setValue(places);
          this.form?.markAsDirty();
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
    this.form?.markAsDirty();
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
    this.form?.markAsDirty();
  }
}
