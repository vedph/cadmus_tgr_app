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

import {
  MsScript,
  MsScriptsPart,
  MSSCRIPTS_PART_TYPEID,
} from '../ms-scripts-part';
import { take } from 'rxjs/operators';
import { DialogService } from '@myrmidon/ng-mat-tools';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';

/**
 * MsScripts editor component.
 * Thesauri: ms-languages (required); ms-script-types, ms-script-roles
 * (optional).
 */
@Component({
  selector: 'tgr-ms-scripts-part',
  templateUrl: './ms-scripts-part.component.html',
  styleUrls: ['./ms-scripts-part.component.css'],
})
export class MsScriptsPartComponent
  extends ModelEditorComponentBase<MsScriptsPart>
  implements OnInit
{
  private _editedIndex: number;

  public tabIndex: number;
  public editedScript: MsScript | undefined;

  public scripts: FormControl;

  public langEntries: ThesaurusEntry[] | undefined;
  public scrTypeEntries: ThesaurusEntry[] | undefined;
  public scrRoleEntries: ThesaurusEntry[] | undefined;

  constructor(
    authService: AuthJwtService,
    formBuilder: FormBuilder,
    private _dialogService: DialogService
  ) {
    super(authService, formBuilder);
    this._editedIndex = -1;
    this.tabIndex = 0;
    // form
    this.scripts = formBuilder.control([], Validators.required);
  }

  public override ngOnInit(): void {
    super.ngOnInit();
  }

  protected buildForm(formBuilder: FormBuilder): FormGroup | UntypedFormGroup {
    return formBuilder.group({
      scripts: this.scripts,
    });
  }

  private updateThesauri(thesauri: ThesauriSet): void {
    let key = 'ms-languages';
    if (this.hasThesaurus(key)) {
      this.langEntries = thesauri[key].entries;
    } else {
      this.langEntries = undefined;
    }

    key = 'ms-script-types';
    if (this.hasThesaurus(key)) {
      this.scrTypeEntries = thesauri[key].entries;
    } else {
      this.scrTypeEntries = undefined;
    }

    key = 'ms-script-roles';
    if (this.hasThesaurus(key)) {
      this.scrRoleEntries = thesauri[key].entries;
    } else {
      this.scrRoleEntries = undefined;
    }
  }

  private updateForm(part?: MsScriptsPart): void {
    if (!part) {
      this.form.reset();
      return;
    }
    this.scripts.setValue(part.scripts || []);
    this.form.markAsPristine();
  }

  protected override onDataSet(data?: EditedObject<MsScriptsPart>): void {
    // thesauri
    if (data?.thesauri) {
      this.updateThesauri(data.thesauri);
    }

    // form
    this.updateForm(data?.value);
  }

  public entryToString(id: string | undefined, type: string): string {
    if (!id) {
      return '';
    }
    let entries: ThesaurusEntry[] | undefined;
    switch (type) {
      case 'L':
        entries = this.langEntries;
        break;
      case 'R':
        entries = this.scrRoleEntries;
        break;
      case 'T':
        entries = this.scrTypeEntries;
        break;
    }
    return entries
      ? entries.find((e) => {
          return e.id === id;
        })?.value || id
      : id;
  }

  protected getValue(): MsScriptsPart {
    let part = this.getEditedPart(MSSCRIPTS_PART_TYPEID) as MsScriptsPart;
    part.scripts = this.scripts.value || [];
    return part;
  }

  public addScript(): void {
    const unit: MsScript = {
      role: '',
      languages: ['lat'],
    };
    this.scripts.setValue([...this.scripts.value, unit]);
    this.editScript(this.scripts.value.length - 1);
  }

  public editScript(index: number): void {
    if (index < 0) {
      this._editedIndex = -1;
      this.tabIndex = 0;
      this.editedScript = undefined;
    } else {
      this._editedIndex = index;
      this.editedScript = this.scripts.value[index];
      setTimeout(() => {
        this.tabIndex = 1;
      }, 300);
    }
  }

  public onScriptSave(unit: MsScript): void {
    this.scripts.setValue(
      this.scripts.value.map((u: MsScript, i: number) =>
        i === this._editedIndex ? unit : u
      )
    );
    this.editScript(-1);
  }

  public onScriptClose(): void {
    this.editScript(-1);
  }

  public deleteScript(index: number): void {
    this._dialogService
      .confirm('Confirmation', 'Delete script?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          const scripts = [...this.scripts.value];
          scripts.splice(index, 1);
          this.scripts.setValue(scripts);
        }
      });
  }

  public moveScriptUp(index: number): void {
    if (index < 1) {
      return;
    }
    const script = this.scripts.value[index];
    const scripts = [...this.scripts.value];
    scripts.splice(index, 1);
    scripts.splice(index - 1, 0, script);
    this.scripts.setValue(scripts);
  }

  public moveScriptDown(index: number): void {
    if (index + 1 >= this.scripts.value.length) {
      return;
    }
    const script = this.scripts.value[index];
    const scripts = [...this.scripts.value];
    scripts.splice(index, 1);
    scripts.splice(index + 1, 0, script);
    this.scripts.setValue(scripts);
  }
}
