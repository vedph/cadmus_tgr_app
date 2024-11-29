import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormGroup,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { ThesauriSet, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { EditedObject, ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { AnnotatedTag, LingTaggedForm } from '@myrmidon/cadmus-tgr-core';
import { NgToolsValidators } from '@myrmidon/ng-tools';
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
  standalone: false,
})
export class LingTagsFragmentComponent
  extends ModelEditorComponentBase<LingTagsFragment>
  implements OnInit
{
  public tagEntries$: BehaviorSubject<ThesaurusEntry[]>;
  public auxEntries$: BehaviorSubject<ThesaurusEntry[]>;

  public forms: FormControl<LingTaggedForm[]>;

  public editedFormIndex: number;
  public editedForm: LingTaggedForm | undefined;

  constructor(authService: AuthJwtService, formBuilder: FormBuilder) {
    super(authService, formBuilder);
    this.tagEntries$ = new BehaviorSubject<ThesaurusEntry[]>([]);
    this.auxEntries$ = new BehaviorSubject<ThesaurusEntry[]>([]);
    this.editedFormIndex = -1;
    // form
    this.forms = formBuilder.control([], {
      validators: NgToolsValidators.strictMinLengthValidator(1),
      nonNullable: true,
    });
  }

  public override ngOnInit(): void {
    super.ngOnInit();
  }

  protected buildForm(formBuilder: FormBuilder): FormGroup | UntypedFormGroup {
    return formBuilder.group({
      forms: this.forms,
    });
  }

  private updateThesauri(thesauri: ThesauriSet): void {
    let key = 'ling-tags';
    if (this.hasThesaurus(key)) {
      this.tagEntries$.next(thesauri[key].entries || []);
    } else {
      this.tagEntries$.next([]);
    }

    key = 'ling-tags-aux';
    if (this.hasThesaurus(key)) {
      this.auxEntries$.next(thesauri[key].entries || []);
    } else {
      this.auxEntries$.next([]);
    }
  }

  private updateForm(fr?: LingTagsFragment | null): void {
    if (!fr) {
      this.form.reset();
      return;
    }
    this.forms.setValue(fr.forms || []);
    this.form.markAsPristine();
  }

  protected override onDataSet(data?: EditedObject<LingTagsFragment>): void {
    // thesauri
    if (data?.thesauri) {
      this.updateThesauri(data.thesauri);
    }

    // form
    this.updateForm(data?.value);
  }

  protected getValue(): LingTagsFragment {
    const fr = this.getEditedFragment() as LingTagsFragment;
    fr.forms = this.forms.value;
    return fr;
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

  public addForm(): void {
    this.editForm({ tags: [] });
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

  public editForm(form: LingTaggedForm, index = -1): void {
    this.editedForm = form;
    this.editedFormIndex = index;
  }

  public closeForm(): void {
    this.editedForm = undefined;
    this.editedFormIndex = -1;
  }

  public saveForm(form: LingTaggedForm): void {
    const forms = [...this.forms.value];
    forms.splice(this.editedFormIndex, 1, form);
    this.forms.setValue(forms);
    this.forms.updateValueAndValidity();
    this.forms.markAsDirty();
    this.closeForm();
  }
}
