import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  UntypedFormGroup,
} from '@angular/forms';
import { take } from 'rxjs/operators';

import { AuthJwtService } from '@myrmidon/auth-jwt-login';
import { DialogService } from '@myrmidon/ng-mat-tools';
import { NgToolsValidators } from '@myrmidon/ng-tools';

import { ThesauriSet, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { MsLocation, MsLocationService } from '@myrmidon/cadmus-tgr-core';
import { EditedObject, ModelEditorComponentBase } from '@myrmidon/cadmus-ui';

import {
  MsContent,
  MsContentsPart,
  MSCONTENTS_PART_TYPEID,
} from '../ms-contents-part';

/**
 * MsContentsPart editor component.
 * Thesauri: author-works, doc-reference-tags, doc-reference-types (all optional).
 */
@Component({
  selector: 'tgr-ms-contents-part',
  templateUrl: './ms-contents-part.component.html',
  styleUrls: ['./ms-contents-part.component.css'],
})
export class MsContentsPartComponent
  extends ModelEditorComponentBase<MsContentsPart>
  implements OnInit
{
  private _editedIndex: number;

  public tabIndex: number;
  public editedContent: MsContent | undefined;
  public contents: FormControl<MsContent[]>;

  /**
   * Manuscript's materials.
   */
  public workEntries: ThesaurusEntry[] | undefined;
  public docTagEntries: ThesaurusEntry[] | undefined;
  public docTypeEntries: ThesaurusEntry[] | undefined;

  constructor(
    authService: AuthJwtService,
    formBuilder: FormBuilder,
    private _dialogService: DialogService,
    private _locService: MsLocationService
  ) {
    super(authService, formBuilder);
    this._editedIndex = -1;
    this.tabIndex = 0;
    // form
    this.contents = formBuilder.control([], {
      validators: NgToolsValidators.strictMinLengthValidator(1),
      nonNullable: true,
    });
  }

  public override ngOnInit(): void {
    super.ngOnInit();
  }

  protected buildForm(formBuilder: FormBuilder): FormGroup | UntypedFormGroup {
    return formBuilder.group({
      contents: this.contents,
    });
  }

  private updateThesauri(thesauri: ThesauriSet): void {
    let key = 'author-works';
    if (this.hasThesaurus(key)) {
      this.workEntries = thesauri[key].entries;
    } else {
      this.workEntries = undefined;
    }

    key = 'doc-reference-tags';
    if (this.hasThesaurus(key)) {
      this.docTagEntries = thesauri[key].entries;
    } else {
      this.docTagEntries = undefined;
    }

    key = 'doc-reference-types';
    if (this.hasThesaurus(key)) {
      this.docTypeEntries = thesauri[key].entries;
    } else {
      this.docTypeEntries = undefined;
    }
  }

  private updateForm(part?: MsContentsPart): void {
    if (!part) {
      this.form.reset();
      return;
    }
    this.contents.setValue(part.contents || []);
    this.form.markAsPristine();
  }

  protected override onDataSet(data?: EditedObject<MsContentsPart>): void {
    // thesauri
    if (data?.thesauri) {
      this.updateThesauri(data.thesauri);
    }

    // form
    this.updateForm(data?.value);
  }

  protected getValue(): MsContentsPart {
    let part = this.getEditedPart(MSCONTENTS_PART_TYPEID) as MsContentsPart;
    part.contents = this.contents.value || [];
    return part;
  }

  public addContent(): void {
    const content: MsContent = {
      start: { n: 0 },
      end: { n: 0 },
      incipit: '',
      explicit: '',
    };
    this.contents.setValue([...this.contents.value, content]);
    this.editContent(this.contents.value.length - 1);
  }

  public editContent(index: number): void {
    if (index < 0) {
      this._editedIndex = -1;
      this.tabIndex = 0;
      this.editedContent = undefined;
    } else {
      this._editedIndex = index;
      this.editedContent = this.contents.value[index];
      setTimeout(() => {
        this.tabIndex = 1;
      }, 300);
    }
  }

  public onContentSave(Content: MsContent): void {
    this.contents.setValue(
      this.contents.value.map((u: MsContent, i: number) =>
        i === this._editedIndex ? Content : u
      )
    );
    this.editContent(-1);
  }

  public onContentClose(): void {
    this.editContent(-1);
  }

  public deleteContent(index: number): void {
    this._dialogService
      .confirm('Confirmation', 'Delete content?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          const contents = [...this.contents.value];
          contents.splice(index, 1);
          this.contents.setValue(contents);
        }
      });
  }

  public moveContentUp(index: number): void {
    if (index < 1) {
      return;
    }
    const content = this.contents.value[index];
    const contents = [...this.contents.value];
    contents.splice(index, 1);
    contents.splice(index - 1, 0, content);
    this.contents.setValue(contents);
  }

  public moveContentDown(index: number): void {
    if (index + 1 >= this.contents.value.length) {
      return;
    }
    const content = this.contents.value[index];
    const contents = [...this.contents.value];
    contents.splice(index, 1);
    contents.splice(index + 1, 0, content);
    this.contents.setValue(contents);
  }

  public locationToString(location: MsLocation): string {
    return this._locService.locationToString(location) || '';
  }
}
