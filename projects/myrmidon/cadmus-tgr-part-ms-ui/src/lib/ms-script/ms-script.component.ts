import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { MsLocation, MsLocationService } from '@myrmidon/cadmus-tgr-core';
import { renderLabelFromLastColon } from '@myrmidon/cadmus-ui';
import { DialogService } from '@myrmidon/ng-mat-tools';

import { MsHand, MsScript } from '../ms-scripts-part';

@Component({
  selector: 'tgr-ms-script',
  templateUrl: './ms-script.component.html',
  styleUrls: ['./ms-script.component.css'],
})
export class MsScriptComponent implements OnInit, OnDestroy {
  private _sub?: Subscription;
  private _editedIndex: number;
  private _langEntries: ThesaurusEntry[] | undefined;
  private _model: MsScript | undefined;

  @Input()
  public get model(): MsScript | undefined {
    return this._model;
  }
  public set model(value: MsScript | undefined) {
    if (this._model === value) {
      return;
    }
    this._model = value;
    this.updateForm(this._model);
  }

  @Input()
  public get langEntries(): ThesaurusEntry[] | undefined {
    return this._langEntries;
  }
  public set langEntries(value: ThesaurusEntry[] | undefined) {
    if (this._langEntries === value) {
      return;
    }
    this._langEntries = value;
    this.buildLangArray(this.getCheckedLanguages());
  }

  @Input()
  public scrRoleEntries: ThesaurusEntry[] | undefined;

  @Input()
  public scrTypeEntries: ThesaurusEntry[] | undefined;

  @Output()
  public modelChange: EventEmitter<MsScript>;
  @Output()
  public editorClose: EventEmitter<any>;

  public form: FormGroup;
  public langChecks: FormArray;
  public langCount: FormControl<number>;
  public role: FormControl<string | null>;
  public type: FormControl<string | null>;
  public hands: FormControl<MsHand[]>;
  public tabIndex: number;
  public editedHand: MsHand | undefined;

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogService: DialogService,
    private _locService: MsLocationService
  ) {
    this.modelChange = new EventEmitter<MsScript>();
    this.editorClose = new EventEmitter<any>();
    this._editedIndex = -1;
    this.tabIndex = 0;
    // form
    this.langChecks = _formBuilder.array([]);
    this.langCount = _formBuilder.control(0, {
      validators: Validators.min(1),
      nonNullable: true,
    });
    this.role = _formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.type = _formBuilder.control(null, Validators.maxLength(50));
    this.hands = _formBuilder.control([], { nonNullable: true });

    this.form = _formBuilder.group({
      langChecks: this.langChecks,
      langCount: this.langCount,
      role: this.role,
      type: this.type,
      hands: this.hands,
    });
  }

  ngOnInit(): void {
    // build lang array with up to date values - this can be necessary
    // if the lang entries are set before the form has been built
    this.buildLangArray(this.getCheckedLanguages());

    this._sub = this.langChecks.valueChanges.subscribe((_) => {
      this.updateCheckedCount();
    });
  }

  ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  private updateForm(model: MsScript | undefined): void {
    if (!model) {
      this.form.reset();
      return;
    }

    this.updateLangArray(model.languages || []);
    this.updateCheckedCount();
    this.role.setValue(model.role);
    this.type.setValue(model.type || null);
    this.hands.setValue(model.hands || []);

    this.form.markAsPristine();
  }

  private getModel(): MsScript {
    return {
      languages: this.getCheckedLanguages(),
      role: this.role.value?.trim() || '',
      type: this.type.value?.trim(),
      hands: this.hands.value?.length ? this.hands.value : undefined,
    };
  }

  //#region Hands
  public addHand(): void {
    const hand: MsHand = {
      id: '',
      start: { n: 0 },
      end: { n: 0 },
    };
    this.hands.setValue([...this.hands.value, hand]);
    this.hands.updateValueAndValidity();
    this.hands.markAsDirty();
    this.editHand(this.hands.value.length - 1);
  }

  public editHand(index: number): void {
    if (index < 0) {
      this._editedIndex = -1;
      this.tabIndex = 0;
      this.editedHand = undefined;
    } else {
      this._editedIndex = index;
      this.editedHand = this.hands.value[index];
      setTimeout(() => {
        this.tabIndex = 1;
      }, 300);
    }
  }

  public onHandSave(item: MsHand): void {
    this.hands.setValue(
      this.hands.value.map((x: MsHand, i: number) =>
        i === this._editedIndex ? item : x
      )
    );
    this.hands.updateValueAndValidity();
    this.hands.markAsDirty();
    this.editHand(-1);
  }

  public onHandClose(): void {
    this.editHand(-1);
  }

  public deleteHand(index: number): void {
    this._dialogService
      .confirm('Confirmation', 'Delete item?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          const items = [...this.hands.value];
          items.splice(index, 1);
          this.hands.setValue(items);
          this.hands.updateValueAndValidity();
          this.hands.markAsDirty();
        }
      });
  }

  public moveHandUp(index: number): void {
    if (index < 1) {
      return;
    }
    const item = this.hands.value[index];
    const items = [...this.hands.value];
    items.splice(index, 1);
    items.splice(index - 1, 0, item);
    this.hands.setValue(items);
    this.hands.updateValueAndValidity();
    this.hands.markAsDirty();
  }

  public moveHandDown(index: number): void {
    if (index + 1 >= this.hands.value.length) {
      return;
    }
    const item = this.hands.value[index];
    const items = [...this.hands.value];
    items.splice(index, 1);
    items.splice(index + 1, 0, item);
    this.hands.setValue(items);
    this.hands.updateValueAndValidity();
    this.hands.markAsDirty();
  }

  public locationToString(location: MsLocation | null): string {
    return this._locService.locationToString(location) ?? '';
  }
  //#endregion

  //#region Languages
  /**
   * Add a FormControl to the languages array for each language
   * entry, checked when its ID is found among the selected
   * languages.
   * @param ids The IDs of the selected languages.
   */
  private buildLangArray(ids: string[]): void {
    if (!this.langChecks) {
      return;
    }
    this.langChecks.clear();
    if (!this._langEntries?.length) {
      return;
    }

    this._langEntries.forEach((e) => {
      const checked = ids.some((s: string) => s === e.id);
      const g = this._formBuilder.group({
        check: this._formBuilder.control(checked),
      });
      this.langChecks.push(g);
    });
  }

  /**
   * Update the languages array checks to reflect the selected
   * languages.
   */
  private updateLangArray(ids: string[] | undefined): void {
    if (!this._langEntries?.length || !ids) {
      this.langCount.setValue(0);
      return;
    }

    let n = 0;
    for (let i = 0; i < this._langEntries.length; i++) {
      const id = this._langEntries[i].id;
      const checked = ids.some((s) => s === id);
      const g = this.langChecks.at(i) as FormGroup;
      g.controls.check.setValue(checked);
      if (checked) {
        n++;
      }
    }
    this.langCount.setValue(n);
  }

  /**
   * Gets the list of all the IDs corresponding to the checked
   * languages.
   */
  private getCheckedLanguages(): string[] {
    if (!this._langEntries?.length || !this.langChecks) {
      return [];
    }
    const ids: string[] = [];
    for (let i = 0; i < this._langEntries.length; i++) {
      const g = this.langChecks.at(i) as FormGroup;
      if (g?.controls?.check.value) {
        ids.push(this._langEntries[i].id);
      }
    }
    return ids;
  }

  private updateCheckedCount(): void {
    if (!this._langEntries?.length) {
      return;
    }
    let n = 0;
    for (let i = 0; i < this._langEntries.length; i++) {
      const g = this.langChecks.at(i) as FormGroup;
      if (g.controls.check.value) {
        n++;
      }
    }
    this.langCount.setValue(n);
  }
  //#endregion

  public renderLabel(label: string): string {
    return renderLabelFromLastColon(label);
  }

  public onScrTypeEntryChange(entry: ThesaurusEntry): void {
    this.type.setValue(entry.id);
  }

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
