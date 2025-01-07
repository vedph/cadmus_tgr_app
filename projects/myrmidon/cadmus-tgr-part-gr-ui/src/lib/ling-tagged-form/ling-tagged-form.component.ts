import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import {
  MatFormField,
  MatLabel,
  MatError,
  MatHint,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';

import { deepCopy, NgxToolsValidators } from '@myrmidon/ngx-tools';

import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import {
  AnnotatedTag,
  BucketStoreService,
  TaggedNote,
} from '@myrmidon/cadmus-tgr-core';
import {
  renderLabelFromLastColon,
  ThesaurusTreeComponent,
} from '@myrmidon/cadmus-ui';
import { LingTaggedForm } from '@myrmidon/cadmus-tgr-core';

interface EditedTaggedNote extends TaggedNote {
  label: string;
}

const BUCKET_TAGS_KEY = 'ling-tags';

/**
 * LingTaggedForm editor.
 */
@Component({
  selector: 'tgr-ling-tagged-form',
  templateUrl: './ling-tagged-form.component.html',
  styleUrls: ['./ling-tagged-form.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTabGroup,
    MatTab,
    MatIconButton,
    MatTooltip,
    MatIcon,
    ThesaurusTreeComponent,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatCheckbox,
    MatHint,
  ],
})
export class LingTaggedFormComponent implements OnInit {
  private _tagEntries: ThesaurusEntry[] | undefined;
  private _auxEntries: ThesaurusEntry[] | undefined;
  private _model: LingTaggedForm | undefined;
  private _updates$: BehaviorSubject<string>;

  @Input()
  public get tagEntries(): ThesaurusEntry[] | undefined {
    return this._tagEntries;
  }
  public set tagEntries(value: ThesaurusEntry[] | undefined) {
    this._tagEntries = value;
    this._updates$.next('tag');
  }

  @Input()
  public get auxEntries(): ThesaurusEntry[] | undefined {
    return this._auxEntries;
  }
  public set auxEntries(value: ThesaurusEntry[] | undefined) {
    this._auxEntries = value;
    this._updates$.next('aux');
  }

  @Input()
  public get model(): LingTaggedForm | undefined {
    return this._model;
  }
  public set model(value: LingTaggedForm | undefined) {
    this._model = value;
    this._updates$.next('mod');
  }

  @Output()
  public modelChange: EventEmitter<LingTaggedForm>;
  @Output()
  public editorClose: EventEmitter<any>;

  @ViewChild('notebar', { static: false })
  noteDivRef?: ElementRef<HTMLElement>;

  public dubious: FormControl<boolean>;
  public lemmata: FormControl<string | null>;
  public note: FormControl<string | null>;
  public tags: FormControl<AnnotatedTag[]>;
  public form: FormGroup;
  public notes: FormArray;
  public noteForm: FormGroup;

  public editedTagIndex: number;
  public editingNotes: boolean;
  public bucketAvailable: boolean;

  constructor(
    private _formBuilder: FormBuilder,
    private _store: BucketStoreService
  ) {
    this.modelChange = new EventEmitter<LingTaggedForm>();
    this.editorClose = new EventEmitter<any>();
    this._updates$ = new BehaviorSubject<string>('');
    this.editedTagIndex = -1;
    this.editingNotes = false;
    this.bucketAvailable = _store.has(BUCKET_TAGS_KEY);
    // form
    this.dubious = _formBuilder.control(false, { nonNullable: true });
    this.lemmata = _formBuilder.control(null, Validators.maxLength(500));
    this.note = _formBuilder.control(null, Validators.maxLength(500));
    this.tags = _formBuilder.control([], {
      validators: NgxToolsValidators.strictMinLengthValidator(1),
      nonNullable: true,
    });
    this.form = _formBuilder.group({
      dubious: this.dubious,
      lemmata: this.lemmata,
      note: this.note,
      tags: this.tags,
    });
    // note form
    this.notes = _formBuilder.array([]);
    this.noteForm = _formBuilder.group({
      notes: this.notes,
    });
  }

  ngOnInit(): void {
    this._updates$
      .pipe(
        filter((s) => (s ? true : false)),
        debounceTime(200)
      )
      .subscribe((_) => {
        this.updateForm(this._model);
      });

    this._store.changes$.subscribe((_) => {
      this.bucketAvailable = this._store.has(BUCKET_TAGS_KEY);
    });
  }

  private updateForm(model: LingTaggedForm | undefined): void {
    this.editedTagIndex = -1;
    this.noteForm.reset();

    if (!model) {
      this.form.reset();
      return;
    }
    this.dubious.setValue(model.isDubious || false);
    this.lemmata.setValue(model.lemmata?.join('\n') ?? '');
    this.note.setValue(model.note || null);
    this.tags.setValue(model.tags || []);
    this.form.markAsPristine();
  }

  private getModel(): LingTaggedForm {
    // split text into lemmata, trimming and removing
    // empty or duplicate lemmata
    const lemmata = [
      ...new Set<string>(
        this.lemmata.value
          ?.split('\n')
          .map((l: string) => {
            return l.trim();
          })
          .filter((l: string) => {
            return l.length > 0;
          })
      ).values(),
    ];
    const note = this.note.value?.trim();

    return {
      lemmata: lemmata.length > 0 ? lemmata : undefined,
      isDubious: this.dubious.value ? true : undefined,
      note: note ? note : undefined,
      tags: this.tags.value,
    };
  }

  public renderLabel(label: string): string {
    return renderLabelFromLastColon(label);
  }

  public onEntryChange(entry: ThesaurusEntry): void {
    // user picked a tag from the tree, add it unless exists
    if (this.tags.value.some((t) => t.value === entry.id)) {
      return;
    }
    // insert at sort place (sort by ID)
    const tags = [...this.tags.value];
    let i = 0;
    while (i < tags.length && entry.id.localeCompare(tags[i].value) > 0) {
      i++;
    }
    tags.splice(i, 0, {
      value: entry.id,
    });
    this.tags.setValue(tags);
    this.tags.updateValueAndValidity();
    this.tags.markAsDirty();
  }

  public deleteTag(index: number): void {
    if (!this.tags) {
      return;
    }
    const tags = [...this.tags.value];
    tags.splice(index, 1);
    this.tags.setValue(tags);
    this.tags.updateValueAndValidity();
    this.tags.markAsDirty();
  }

  public getTagLabel(tag: string): string {
    // get the tag label from the thesaurus if any, else use ID
    const entry = this._tagEntries?.find((e) => e.id === tag);
    return entry ? entry.value : tag;
  }

  public getAuxLabel(tag: string): string {
    const entry = this._auxEntries?.find((e) => e.id === tag);
    return entry ? entry.value : tag;
  }

  public copyTags(): void {
    if (this.tags.value.length) {
      this._store.set(BUCKET_TAGS_KEY, deepCopy(this.tags.value));
    }
  }

  public pasteTags(): void {
    if (!this.bucketAvailable) {
      return;
    }
    const pastedTags = this._store.get(BUCKET_TAGS_KEY) as AnnotatedTag[];
    if (!pastedTags) {
      return;
    }
    const tags = [...this.tags.value];
    for (let i = 0; i < pastedTags.length; i++) {
      if (tags.some((t) => t.value === pastedTags[i].value)) {
        continue;
      }
      tags.push(pastedTags[i]);
    }
    this.tags.setValue(tags);
    this.tags.updateValueAndValidity();
    this.tags.markAsDirty();
  }

  //#region Tag's notes
  public tagHasNotes(tag: string): boolean {
    // a tag may have notes when the aux thesaurus has any
    // entry starting with its ID plus "--"
    if (!this.auxEntries?.length) {
      return false;
    }
    const prefix = tag + '--';
    return this.auxEntries.some((e) => e.id.startsWith(prefix));
  }

  private getEditTagNotes(tag: AnnotatedTag): EditedTaggedNote[] {
    // scenario:
    // tagEntries: [{ id: 'alpha', label: 'ALPHA' }]
    // auxEntries: [{ id: 'alpha--one', label: 'A1' },
    //              { id: 'alpha--two', label: 'A2' }]
    // the TaggedNote's defined for that entries are:
    // [ { tag: 'one', label: 'A1' },
    //   { tag: 'two', label: 'A2' }]

    if (!this.auxEntries) {
      return [];
    }
    const prefix = tag.value + '--';

    // get the existing notes if any
    const notes: EditedTaggedNote[] = (tag.notes ?? []).map((n) => {
      return {
        tag: n.tag,
        note: n.note,
        label: this.getAuxLabel(prefix + n.tag) ?? n.tag,
      };
    });

    // add to them all the notes defined for the tag
    this.auxEntries
      .filter((e) => e.id.startsWith(prefix))
      .forEach((entry) => {
        const nid = entry.id.substring(prefix.length);
        if (!notes.some((n) => n.tag === nid)) {
          notes.push({
            tag: nid,
            note: '',
            label: entry.value,
          });
        }
      });

    // sort the notes
    notes.sort((a, b) => {
      return a.label.localeCompare(b.label);
    });

    return notes;
  }

  private getAnnotatedTagGroup(item: EditedTaggedNote): FormGroup {
    return this._formBuilder.group({
      tag: this._formBuilder.control(item.tag),
      label: this._formBuilder.control(item.label),
      note: this._formBuilder.control(item.note),
    });
  }

  public editTagNotes(index: number): void {
    if (!this.auxEntries || index === this.editedTagIndex || !this.tags) {
      return;
    }
    this.editedTagIndex = index;
    this.editingNotes = true;
    const tag = this.tags.value[this.editedTagIndex];
    const tagNotes = this.getEditTagNotes(tag);
    this.notes.clear();
    for (const note of tagNotes) {
      this.notes.push(this.getAnnotatedTagGroup(note));
    }
    this.noteForm.markAsPristine();

    // scroll to bottom of notes editor
    setTimeout(() => {
      this.noteDivRef?.nativeElement?.scrollIntoView({
        behavior: 'smooth',
      });
    }, 200);
  }

  public closeTagNotes(): void {
    if (this.editedTagIndex === -1) {
      return;
    }
    this.noteForm.reset();
    this.editedTagIndex = -1;
    this.editingNotes = false;
  }

  public saveTagNotes(): void {
    if (!this.tags || !this.editingNotes) {
      return;
    }
    const tag = this.tags.value[this.editedTagIndex];
    tag.notes = this.notes.value
      .filter((n: EditedTaggedNote) => {
        return n.note?.trim()?.length > 0;
      })
      .map((n: EditedTaggedNote) => {
        return {
          tag: n.tag,
          note: n.note,
        };
      });
    if (!tag.notes?.length) {
      tag.notes = undefined;
    }
    this.closeTagNotes();
    this.form.markAsDirty();
  }
  //#endregion

  public cancel(): void {
    this.editorClose.emit();
  }

  public save(): void {
    if (this.form.invalid) {
      return;
    }
    if (this.editedTagIndex > -1) {
      this.closeTagNotes();
    }
    const model = this.getModel();
    this.modelChange.emit(model);
    this.form.markAsPristine();
  }
}
