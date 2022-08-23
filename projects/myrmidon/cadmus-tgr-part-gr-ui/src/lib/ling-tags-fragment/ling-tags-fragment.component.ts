import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { CadmusValidators, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { AnnotatedTag, LingTaggedForm } from '@myrmidon/cadmus-tgr-core';
import { deepCopy } from '@myrmidon/ng-tools';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';

import { LingTagsFragment } from '../ling-tags-fragment';

/**
 * Linguistic tags fragment editor component.
 * Thesauri: ling-tags, ling-tags-aux.
 */
@Component({
  selector: 'tgr-ling-tags-fragment',
  templateUrl: './ling-tags-fragment.component.html',
  styleUrls: ['./ling-tags-fragment.component.css'],
})
export class LingTagsFragmentComponent
  extends ModelEditorComponentBase<LingTagsFragment>
  implements OnInit
{
  private _editedFormIndex: number;

  public tagEntries$: BehaviorSubject<ThesaurusEntry[]>;
  public auxEntries$: BehaviorSubject<ThesaurusEntry[]>;

  public forms: FormControl<LingTaggedForm[]>;
  public form: FormGroup;

  public editedForm: LingTaggedForm | undefined;
  public tabIndex: number;

  constructor(authService: AuthJwtService, formBuilder: FormBuilder) {
    super(authService);
    this.tagEntries$ = new BehaviorSubject<ThesaurusEntry[]>([]);
    this.auxEntries$ = new BehaviorSubject<ThesaurusEntry[]>([]);
    this.tabIndex = 0;
    this._editedFormIndex = -1;
    // form
    this.forms = formBuilder.control([], {
      validators: CadmusValidators.strictMinLengthValidator(1),
      nonNullable: true,
    });
    this.form = formBuilder.group({
      forms: this.forms,
    });
  }

  public ngOnInit(): void {
    this.initEditor();
  }

  private updateForm(model: LingTagsFragment): void {
    if (!model) {
      this.form.reset();
      return;
    }
    this.forms.setValue(model.forms || []);
    this.form.markAsPristine();
  }

  protected onModelSet(model: LingTagsFragment): void {
    this.updateForm(deepCopy(model));
  }

  protected onThesauriSet(): void {
    let key = 'ling-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.tagEntries$.next(this.thesauri[key].entries || []);
    } else {
      this.tagEntries$.next([]);
    }

    key = 'ling-tags-aux';
    if (this.thesauri && this.thesauri[key]) {
      this.auxEntries$.next(this.thesauri[key].entries || []);
    } else {
      this.auxEntries$.next([]);
    }
  }

  protected getModelFromForm(): LingTagsFragment {
    return {
      location: this.model?.location ?? '',
      forms: this.forms.value,
    };
  }

  public getTagLabel(id: string): string {
    return this.tagEntries$.value.find((e) => e.id === id)?.value || id;
  }

  public getTagsLabel(tags: AnnotatedTag[] | undefined): string {
    if (!tags?.length) {
      return '';
    }
    return tags
      .map((t) => {
        return this.getTagLabel(t.value);
      })
      .join('\n');
  }

  public addForm(item?: LingTaggedForm): void {
    this.forms.setValue([...this.forms.value, item || { tags: [] }]);
    this.forms.updateValueAndValidity();
    this.forms.markAsDirty();
    this.editForm(this.forms.value.length - 1);
  }

  public addFormBelow(index: number): void {
    const forms = [...this.forms.value];
    forms.splice(index + 1, 0, { tags: [] });
    this.forms.setValue(forms);
    this.forms.updateValueAndValidity();
    this.forms.markAsDirty();
    this.editForm(index + 1);
  }

  public removeForm(index: number): void {
    const forms = [...this.forms.value];
    forms.splice(index, 1);
    this.forms.setValue(forms);
    this.forms.updateValueAndValidity();
    this.forms.markAsDirty();
  }

  public moveFormUp(index: number): void {
    if (index < 1) {
      return;
    }
    const item = this.forms.value[index];
    const forms = [...this.forms.value];
    forms.splice(index, 1);
    forms.splice(index - 1, 0, item);
    this.forms.setValue(forms);
    this.forms.updateValueAndValidity();
    this.forms.markAsDirty();
  }

  public moveFormDown(index: number): void {
    if (index + 1 >= this.forms.value.length) {
      return;
    }
    const item = this.forms.value[index];
    const forms = [...this.forms.value];
    forms.splice(index, 1);
    forms.splice(index + 1, 0, item);
    this.forms.setValue(forms);
    this.forms.updateValueAndValidity();
    this.forms.markAsDirty();
  }

  public editForm(index: number): void {
    this.editedForm = this.forms.value[index];
    this._editedFormIndex = index;

    setTimeout(() => {
      this.tabIndex = 1;
    }, 200);
  }

  public closeEditedForm(): void {
    this.editedForm = undefined;
    this._editedFormIndex = -1;
    this.tabIndex = 0;
  }

  public onFormChange(form: LingTaggedForm): void {
    const forms = [...this.forms.value];
    forms.splice(this._editedFormIndex, 1, form);
    this.forms.setValue(forms);
    this.closeEditedForm();
    this.forms.updateValueAndValidity();
    this.forms.markAsDirty();
  }
}
