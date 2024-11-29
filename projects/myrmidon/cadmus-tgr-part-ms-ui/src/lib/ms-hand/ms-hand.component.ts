import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HistoricalDateModel } from '@myrmidon/cadmus-refs-historical-date';
import { MsLocation, MsLocationService } from '@myrmidon/cadmus-tgr-core';

import { MsHand, MsHandLetter } from '../ms-scripts-part';

@Component({
  selector: 'tgr-ms-hand',
  templateUrl: './ms-hand.component.html',
  styleUrls: ['./ms-hand.component.css'],
  standalone: false,
})
export class MsHandComponent implements OnInit {
  private _model: MsHand | undefined;

  @Input()
  public get model(): MsHand | undefined {
    return this._model;
  }
  public set model(value: MsHand | undefined) {
    if (this._model === value) {
      return;
    }
    this._model = value;
    this.updateForm(this._model);
  }

  @Output()
  public modelChange: EventEmitter<MsHand>;
  @Output()
  public editorClose: EventEmitter<any>;

  public form: FormGroup;
  public id: FormControl<string | null>;
  public start: FormControl<string | null>;
  public end: FormControl<string | null>;
  public description: FormControl<string | null>;
  public abbreviations: FormControl<string | null>;
  public letters: FormArray;

  public date: HistoricalDateModel | undefined;

  constructor(
    private _formBuilder: FormBuilder,
    private _locService: MsLocationService
  ) {
    this.modelChange = new EventEmitter<MsHand>();
    this.editorClose = new EventEmitter<any>();
    // form
    this.id = _formBuilder.control(null, Validators.maxLength(50));
    this.start = _formBuilder.control(null, [
      Validators.required,
      Validators.pattern(MsLocationService.locRegexp),
    ]);
    this.end = _formBuilder.control(null, [
      Validators.required,
      Validators.pattern(MsLocationService.locRegexp),
    ]);
    this.description = _formBuilder.control(null, Validators.maxLength(50000));
    this.abbreviations = _formBuilder.control(null, Validators.maxLength(500));
    this.letters = _formBuilder.array([]);

    this.form = _formBuilder.group({
      id: this.id,
      start: this.start,
      end: this.end,
      description: this.description,
      abbreviations: this.abbreviations,
      letters: this.letters,
    });
  }

  ngOnInit(): void {
    // this.updateForm(this.model);
  }

  private updateForm(model: MsHand | undefined): void {
    if (!model) {
      this.form.reset();
      return;
    }

    this.id.setValue(model.id);
    this.start.setValue(this._locService.locationToString(model.start));
    this.end.setValue(this._locService.locationToString(model.end));
    this.description.setValue(model.description || null);
    this.abbreviations.setValue(model.abbreviations || null);
    // date
    this.date = model.date;
    // letters
    this.letters.clear();
    if (model.letters) {
      for (let letter of model.letters) {
        this.letters.push(this.getLetterGroup(letter));
      }
    }
    this.form.markAsPristine();
  }

  private getLetters(): MsHandLetter[] | undefined {
    if (!this.letters.controls.length) {
      return undefined;
    }
    const letters: MsHandLetter[] = [];
    for (let i = 0; i < this.letters.controls.length; i++) {
      const g = this.letters.at(i) as FormGroup;
      letters.push({
        letter: g.controls.letter.value?.trim(),
        description: g.controls.description.value?.trim(),
        imageId: g.controls.imageId.value?.trim(),
      });
    }
    return letters;
  }

  private getModel(): MsHand {
    return {
      id: this.id.value?.trim() || '',
      start: this._locService.parseLocation(this.start.value) as MsLocation,
      end: this._locService.parseLocation(this.end.value) as MsLocation,
      date: this.date,
      description: this.description.value?.trim(),
      abbreviations: this.abbreviations.value?.trim(),
      letters: this.getLetters(),
    };
  }

  public onDateChange(date: HistoricalDateModel): void {
    this.date = date;
    this.form.markAsDirty();
  }

  //#region Letters
  private getLetterGroup(letter?: MsHandLetter): FormGroup {
    return this._formBuilder.group({
      letter: this._formBuilder.control(letter?.letter, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      description: this._formBuilder.control(letter?.description, [
        Validators.required,
        Validators.maxLength(5000),
      ]),
      imageId: this._formBuilder.control(letter?.imageId, [
        Validators.maxLength(100),
      ]),
    });
  }

  public addLetter(item?: MsHandLetter): void {
    this.letters.push(this.getLetterGroup(item));
  }

  public removeLetter(index: number): void {
    this.letters.removeAt(index);
  }

  public moveLetterUp(index: number): void {
    if (index < 1) {
      return;
    }
    const item = this.letters.controls[index];
    this.letters.removeAt(index);
    this.letters.insert(index - 1, item);
  }

  public moveLetterDown(index: number): void {
    if (index + 1 >= this.letters.length) {
      return;
    }
    const item = this.letters.controls[index];
    this.letters.removeAt(index);
    this.letters.insert(index + 1, item);
  }
  //#endregion

  public cancel(): void {
    this.editorClose.emit();
  }

  public save(): void {
    if (this.form.invalid) {
      return;
    }
    this._model = this.getModel();
    this.modelChange.emit(this._model);
  }
}
