import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { deepCopy, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { AuthService } from '@myrmidon/cadmus-api';
import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';

import { LingTagsFragment } from '../ling-tags-fragment';
import { BehaviorSubject } from 'rxjs';
import { AnnotatedTag, LingTaggedForm } from '@myrmidon/cadmus-tgr-core';

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
  implements OnInit {
  private _editedFormIndex: number;

  public tagEntries$: BehaviorSubject<ThesaurusEntry[]>;
  public auxEntries$: BehaviorSubject<ThesaurusEntry[]>;

  public forms: FormControl;
  public formCount: FormControl;
  public form: FormGroup;
  public editedForm: LingTaggedForm | undefined;
  public tabIndex: number;

  constructor(authService: AuthService, formBuilder: FormBuilder) {
    super(authService);
    this.tagEntries$ = new BehaviorSubject<ThesaurusEntry[]>([]);
    this.auxEntries$ = new BehaviorSubject<ThesaurusEntry[]>([]);
    this.tabIndex = 0;
    this._editedFormIndex = -1;
    // form
    this.forms = formBuilder.control([]);
    this.formCount = formBuilder.control(0, Validators.min(1));
    this.form = formBuilder.group({
      forms: this.forms,
      formCount: this.formCount
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
    this.formCount.setValue(model.forms?.length || 0);
    this.form.markAsPristine();
  }

  protected onModelSet(model: LingTagsFragment): void {
    this.updateForm(deepCopy(model));
  }

  protected onThesauriSet(): void {
    let key = 'ling-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.tagEntries$.next(this.thesauri[key].entries);
    } else {
      this.tagEntries$.next([]);
    }

    key = 'ling-tags-aux';
    if (this.thesauri && this.thesauri[key]) {
      this.auxEntries$.next(this.thesauri[key].entries);
    } else {
      this.auxEntries$.next([]);
    }
  }

  protected getModelFromForm(): LingTagsFragment {
    return {
      location: this.model?.location ?? '',
      forms: this.forms.value?.length ? this.forms.value : undefined,
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
    this.forms.value.push(item || { tags: [] });
    this.formCount.setValue(this.forms.value.length);
    this.form.markAsDirty();
  }

  public addFormBelow(index: number): void {
    this.forms.value.splice(index + 1, 0, { tags: [] });
    this.formCount.setValue(this.forms.value.length);
    this.form.markAsDirty();
  }

  public removeForm(index: number): void {
    this.forms.value.splice(index, 1);
    this.formCount.setValue(this.forms.value.length);
    this.form.markAsDirty();
  }

  public moveFormUp(index: number): void {
    if (index < 1) {
      return;
    }
    const item = this.forms.value[index];
    this.forms.value.splice(index, 1);
    this.forms.value.splice(index - 1, 0, item);
    this.form.markAsDirty();
  }

  public moveFormDown(index: number): void {
    if (index + 1 >= this.forms.value.length) {
      return;
    }
    const item = this.forms.value[index];
    this.forms.value.splice(index, 1);
    this.forms.value.splice(index + 1, 0, item);
    this.form.markAsDirty();
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
    this.forms.value.splice(this._editedFormIndex, 1, form);
    this.closeEditedForm();
    this.form.markAsDirty();
  }
}
