import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';

import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { AuthService } from '@myrmidon/cadmus-api';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { MsPlace, MsPlacesPart, MSPLACES_PART_TYPEID } from '../ms-places-part';
import { take } from 'rxjs/operators';
import { DialogService } from '@myrmidon/ng-mat-tools';
import { deepCopy } from '@myrmidon/ng-tools';

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
    authService: AuthService,
    formBuilder: FormBuilder,
    private _dialogService: DialogService
  ) {
    super(authService);
    this._editedIndex = -1;
    this.tabIndex = 0;
    // form
    this.places = formBuilder.control([], Validators.required);
    this.form = formBuilder.group({
      entries: this.places,
    });
  }

  public ngOnInit(): void {
    this.initEditor();
  }

  private updateForm(model: MsPlacesPart): void {
    if (!model) {
      this.form?.reset();
      return;
    }
    this.places.setValue(model.places || []);
    this.form?.markAsPristine();
  }

  protected onModelSet(model: MsPlacesPart): void {
    this.updateForm(deepCopy(model));
  }

  protected onThesauriSet(): void {
    let key = 'ms-place-areas';
    if (this.thesauri && this.thesauri[key]) {
      this.areaEntries = this.thesauri[key].entries;
    } else {
      this.areaEntries = undefined;
    }
    key = 'doc-reference-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.tagEntries = this.thesauri[key].entries;
    } else {
      this.tagEntries = undefined;
    }
  }

  protected getModelFromForm(): MsPlacesPart {
    let part = this.model;
    if (!part) {
      part = {
        itemId: this.itemId || '',
        id: '',
        typeId: MSPLACES_PART_TYPEID,
        roleId: this.roleId,
        timeCreated: new Date(),
        creatorId: '',
        timeModified: new Date(),
        userId: '',
        places: [],
      };
    }
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
