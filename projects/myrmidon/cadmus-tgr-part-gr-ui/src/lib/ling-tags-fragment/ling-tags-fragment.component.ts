import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Fragment, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { AuthService } from '@myrmidon/cadmus-api';
import {
  ModelEditorComponentBase,
  DialogService,
  renderLabelFromLastColon,
} from '@myrmidon/cadmus-ui';

import { LingTagsFragment } from '../ling-tags-fragment';
import { BehaviorSubject } from 'rxjs';

/**
 * Linguistic tags fragment editor component.
 * Thesauri: ling-tags, ling-tags-aux.
 */
@Component({
  selector: 'cadmus-ling-tags-fragment',
  templateUrl: './ling-tags-fragment.component.html',
  styleUrls: ['./ling-tags-fragment.component.css'],
})
export class LingTagsFragmentComponent
  extends ModelEditorComponentBase<LingTagsFragment>
  implements OnInit {
  public fragment: Fragment | undefined;

  public tagEntries$: BehaviorSubject<ThesaurusEntry[]>;
  public auxEntries$: BehaviorSubject<ThesaurusEntry[]>;

  public entries: FormControl;
  public form: FormGroup;

  public entryNotes: FormArray;
  public entryForm: FormGroup;

  constructor(authService: AuthService, formBuilder: FormBuilder) {
    super(authService);
    this.tagEntries$ = new BehaviorSubject<ThesaurusEntry[]>([]);
    this.auxEntries$ = new BehaviorSubject<ThesaurusEntry[]>([]);
    // form
    this.entries = formBuilder.control([], Validators.required);
    this.form = formBuilder.group({
      entries: this.entries,
    });
    // entry notes form
    this.entryNotes = formBuilder.array([]);
    this.entryForm = formBuilder.group({
      entryNotes: this.entryNotes,
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
    this.entryForm.reset();

    this.entries.setValue(model.forms);
    this.form.markAsPristine();
  }

  protected onModelSet(model: LingTagsFragment): void {
    this.updateForm(model);
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
    let fr = this.getModelFromJson();
    if (!fr) {
      fr = {
        location: this.fragment?.location ?? '',
        forms: [],
      };
    }
    fr.forms = this.entries.value;
    return fr;
  }

  public renderLabel(label: string): string {
    return renderLabelFromLastColon(label);
  }

  public getTagLabel(id: string): string {
    return this.tagEntries$.value.find((e) => e.id === id)?.value || id;
  }

  public getAuxLabel(id: string): string {
    return this.auxEntries$.value.find((e) => e.id === id)?.value || id;
  }

  public onEntryChange(entry: ThesaurusEntry): void {
    // TODO
  }
}
