import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  UntypedFormGroup,
} from '@angular/forms';
import { take } from 'rxjs/operators';

import { EditedObject, ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { ThesauriSet, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { DialogService } from '@myrmidon/ng-mat-tools';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';
import { NgToolsValidators } from '@myrmidon/ng-tools';

import {
  MsScript,
  MsScriptsPart,
  MSSCRIPTS_PART_TYPEID,
} from '../ms-scripts-part';

/**
 * MsScripts editor component.
 * Thesauri: ms-languages (required); ms-script-types, ms-script-roles
 * (optional).
 */
@Component({
  selector: 'tgr-ms-scripts-part',
  templateUrl: './ms-scripts-part.component.html',
  styleUrls: ['./ms-scripts-part.component.css'],
  standalone: false,
})
export class MsScriptsPartComponent
  extends ModelEditorComponentBase<MsScriptsPart>
  implements OnInit
{
  public editedScriptIndex: number;
  public editedScript?: MsScript;

  public scripts: FormControl<MsScript[]>;

  public langEntries?: ThesaurusEntry[];
  public scrTypeEntries?: ThesaurusEntry[];
  public scrRoleEntries?: ThesaurusEntry[];

  constructor(
    authService: AuthJwtService,
    formBuilder: FormBuilder,
    private _dialogService: DialogService
  ) {
    super(authService, formBuilder);
    this.editedScriptIndex = -1;
    // form
    this.scripts = formBuilder.control([], {
      validators: NgToolsValidators.strictMinLengthValidator(1),
      nonNullable: true,
    });
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

  private updateForm(part?: MsScriptsPart | null): void {
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
    part.scripts = this.scripts.value;
    return part;
  }

  public addScript(): void {
    this.editScript({
      role: '',
      languages: ['lat'],
    });
  }

  public editScript(script: MsScript, index = -1): void {
    this.editedScriptIndex = index;
    this.editedScript = script;
  }

  public saveScript(script: MsScript): void {
    const scripts = [...this.scripts.value];
    if (this.editedScriptIndex === -1) {
      scripts.push(script);
    } else {
      scripts.splice(this.editedScriptIndex, 1, script);
    }
    this.scripts.setValue(scripts);
    this.scripts.updateValueAndValidity();
    this.scripts.markAsDirty();
    this.closeScript();
  }

  public closeScript(): void {
    this.editedScriptIndex = -1;
    this.editedScript = undefined;
  }

  public deleteScript(index: number): void {
    this._dialogService
      .confirm('Confirmation', 'Delete script?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          if (this.editedScriptIndex === index) {
            this.closeScript();
          }
          const scripts = [...this.scripts.value];
          scripts.splice(index, 1);
          this.scripts.setValue(scripts);
          this.scripts.updateValueAndValidity();
          this.scripts.markAsDirty();
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
    this.scripts.updateValueAndValidity();
    this.scripts.markAsDirty();
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
    this.scripts.updateValueAndValidity();
    this.scripts.markAsDirty();
  }
}
