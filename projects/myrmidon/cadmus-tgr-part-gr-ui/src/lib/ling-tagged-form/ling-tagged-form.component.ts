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
} from '@angular/forms';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { AnnotatedTag, TaggedNote } from '@myrmidon/cadmus-tgr-core';
import { renderLabelFromLastColon } from '@myrmidon/cadmus-ui';
import { LingTaggedForm } from '@myrmidon/cadmus-tgr-core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

interface EditedTaggedNote extends TaggedNote {
  label: string;
}

/**
 * LingTaggedForm editor.
 */
@Component({
  selector: 'tgr-ling-tagged-form',
  templateUrl: './ling-tagged-form.component.html',
  styleUrls: ['./ling-tagged-form.component.css'],
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

  public dubious: FormControl;
  public lemmata: FormControl;
  public note: FormControl;
  public tagCount: FormControl;
  public form: FormGroup;
  public notes: FormArray;
  public noteForm: FormGroup;

  public tags: AnnotatedTag[] | undefined;
  public editedTagIndex: number;
  public editingNotes: boolean;

  constructor(private _formBuilder: FormBuilder) {
    this.modelChange = new EventEmitter<LingTaggedForm>();
    this.editorClose = new EventEmitter<any>();
    this._updates$ = new BehaviorSubject<string>('');
    this.editedTagIndex = -1;
    this.editingNotes = false;
    // form
    this.dubious = _formBuilder.control(false);
    this.lemmata = _formBuilder.control(null, Validators.maxLength(500));
    this.note = _formBuilder.control(null, Validators.maxLength(500));
    this.tagCount = _formBuilder.control(0, Validators.min(1));
    this.form = _formBuilder.group({
      dubious: this.dubious,
      lemmata: this.lemmata,
      note: this.note,
      tagCount: this.tagCount,
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
  }

  private updateForm(model: LingTaggedForm | undefined): void {
    this.editedTagIndex = -1;
    this.noteForm.reset();

    if (!model) {
      this.tags = undefined;
      this.form.reset();
      return;
    }
    this.dubious.setValue(model.isDubious);
    this.lemmata.setValue(model.lemmata?.join('\n') ?? '');
    this.note.setValue(model.note);
    this.tagCount.setValue(model.tags?.length || 0);
    this.tags = model.tags || [];
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
      tags: this.tags || [],
    };
  }

  public renderLabel(label: string): string {
    return renderLabelFromLastColon(label);
  }

  public onEntryChange(entry: ThesaurusEntry): void {
    // user picked a tag from the tree, add it unless exists
    if (this.tags?.some((t) => t.value === entry.id)) {
      return;
    }
    if (!this.tags) {
      this.tags = [];
    }
    // insert at sort place (sort by ID)
    let i = 0;
    while (
      i < this.tags.length &&
      entry.id.localeCompare(this.tags[i].value) > 0
    ) {
      i++;
    }
    this.tags.splice(i, 0, {
      value: entry.id,
    });
    this.tagCount.setValue(this.tags.length);
    this.form.markAsDirty();
  }

  public deleteTag(index: number): void {
    if (!this.tags) {
      return;
    }
    this.tags.splice(index, 1);
    this.form.markAsDirty();
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
    const tag = this.tags[this.editedTagIndex];
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
    const tag = this.tags[this.editedTagIndex];
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
