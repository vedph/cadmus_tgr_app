import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { DialogService } from '@myrmidon/ng-mat-tools';
import { NgToolsValidators } from '@myrmidon/ng-tools';

import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { MsLocation, MsLocationService } from '@myrmidon/cadmus-tgr-core';
import { renderLabelFromLastColon } from '@myrmidon/cadmus-ui';
import { Flag, FlagsPickerAdapter } from '@myrmidon/cadmus-ui-flags-picker';

import { MsHand, MsScript } from '../ms-scripts-part';

function entryToFlag(entry: ThesaurusEntry): Flag {
  return {
    id: entry.id,
    label: entry.value,
  };
}

@Component({
  selector: 'tgr-ms-script',
  templateUrl: './ms-script.component.html',
  styleUrls: ['./ms-script.component.css'],
})
export class MsScriptComponent {
  private _editedIndex: number;
  private _langEntries: ThesaurusEntry[] | undefined;
  private _model: MsScript | undefined;
  private readonly _flagAdapter: FlagsPickerAdapter;

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
  public scrRoleEntries: ThesaurusEntry[] | undefined;

  @Input()
  public scrTypeEntries: ThesaurusEntry[] | undefined;

  @Input()
  public get langEntries(): ThesaurusEntry[] | undefined {
    return this._langEntries;
  }
  public set langEntries(value: ThesaurusEntry[] | undefined) {
    if (this._langEntries === value) {
      return;
    }
    this._langEntries = value || [];
    this._flagAdapter.setSlotFlags(
      'languages',
      this._langEntries.map(entryToFlag)
    );
  }

  @Output()
  public modelChange: EventEmitter<MsScript>;
  @Output()
  public editorClose: EventEmitter<any>;

  public form: FormGroup;
  public languages: FormControl<Flag[]>;
  public role: FormControl<string | null>;
  public type: FormControl<string | null>;
  public hands: FormControl<MsHand[]>;
  public tabIndex: number;
  public editedHand: MsHand | undefined;

  // flags
  public langFlags$: Observable<Flag[]>;

  constructor(
    formBuilder: FormBuilder,
    private _dialogService: DialogService,
    private _locService: MsLocationService
  ) {
    this.modelChange = new EventEmitter<MsScript>();
    this.editorClose = new EventEmitter<any>();
    this._editedIndex = -1;
    this.tabIndex = 0;
    // form
    this.languages = formBuilder.control([], {
      validators: NgToolsValidators.strictMinLengthValidator(1),
      nonNullable: true,
    });
    this.role = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.type = formBuilder.control(null, Validators.maxLength(50));
    this.hands = formBuilder.control([], { nonNullable: true });

    this.form = formBuilder.group({
      languages: this.languages,
      role: this.role,
      type: this.type,
      hands: this.hands,
    });
    // flags
    this._flagAdapter = new FlagsPickerAdapter();
    this.langFlags$ = this._flagAdapter.selectFlags('languages');
  }

  private updateForm(model: MsScript | undefined): void {
    if (!model) {
      this.form.reset();
      return;
    }

    this.languages.setValue(
      this._flagAdapter.setSlotChecks('languages', model.languages)
    );
    this.languages.updateValueAndValidity();
    this.role.setValue(model.role);
    this.type.setValue(model.type || null);
    this.hands.setValue(model.hands || []);

    this.form.markAsPristine();
  }

  private getModel(): MsScript {
    return {
      languages: this._flagAdapter.getOptionalCheckedFlagIds('languages') || [],
      role: this.role.value?.trim() || '',
      type: this.type.value?.trim(),
      hands: this.hands.value?.length ? this.hands.value : undefined,
    };
  }

  public onLangFlagsChange(flags: Flag[]): void {
    this._flagAdapter.setSlotFlags('languages', flags, true);
    this.languages.setValue(flags);
    this.languages.markAsDirty();
    this.languages.updateValueAndValidity();
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
