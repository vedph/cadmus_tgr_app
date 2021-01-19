import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { MsLocation, MsLocationService } from '@myrmidon/cadmus-itinera-core';
import { DialogService } from '@myrmidon/cadmus-ui';
import { take } from 'rxjs/operators';
import { MsHand, MsScript } from '../ms-scripts-part';
import { renderLabelFromLastColon } from '@myrmidon/cadmus-ui';

@Component({
  selector: 'tgr-ms-script',
  templateUrl: './ms-script.component.html',
  styleUrls: ['./ms-script.component.css'],
})
export class MsScriptComponent implements OnInit {
  private _editedIndex: number;
  private _langEntries: ThesaurusEntry[] | undefined;

  @Input()
  public model: MsScript | undefined;
  @Input()
  public get langEntries(): ThesaurusEntry[] | undefined {
    return this._langEntries;
  }
  public set langEntries(value: ThesaurusEntry[] | undefined) {
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
  public langCount: FormControl;
  public role: FormControl;
  public type: FormControl;
  public hands: FormControl;
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
    this.langCount = _formBuilder.control(0, Validators.min(1));
    this.role = _formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.type = _formBuilder.control(null, Validators.maxLength(50));
    this.hands = _formBuilder.control([]);

    this.form = _formBuilder.group({
      langChecks: this.langChecks,
      langCount: this.langCount,
      role: this.role,
      type: this.type,
      hands: this.hands,
    });
  }

  ngOnInit(): void {
    this.updateForm(this.model);
    this.langChecks.valueChanges.subscribe((_) => {
      this.updateCheckedCount();
    });
  }

  private updateForm(model: MsScript | undefined): void {
    if (!model) {
      this.form.reset();
      return;
    }

    this.updateLangArray(model.languages || []);
    this.updateCheckedCount();
    this.role.setValue(model.role);
    this.type.setValue(model.type);
    this.hands.setValue(model.hands || []);

    this.form.markAsPristine();
  }

  private getModel(): MsScript | null {
    return {
      languages: this.getCheckedLanguages(),
      role: this.role.value?.trim(),
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
    this.langChecks.clear();
    if (!this._langEntries?.length) {
      return;
    }

    this._langEntries.forEach((e) => {
      const checked = ids.some((s: string) => s === e.id);
      const g = this._formBuilder.group({
        check: this._formBuilder.control(checked)
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
    const model = this.getModel();
    if (!model) {
      return;
    }
    this.modelChange.emit(model);
  }
}
