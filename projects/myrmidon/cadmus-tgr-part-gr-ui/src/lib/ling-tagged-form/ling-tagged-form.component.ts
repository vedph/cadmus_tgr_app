import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { AnnotatedTag } from '@myrmidon/cadmus-tgr-core';
import { renderLabelFromLastColon } from '@myrmidon/cadmus-ui';
import { LingTaggedForm } from '@myrmidon/cadmus-tgr-core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

/**
 * LingTaggedForm editor.
 */
@Component({
  selector: 'cadmus-ling-tagged-form',
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

  public dubious: FormControl;
  public lemmata: FormControl;
  public note: FormControl;
  public tagCount: FormControl;
  public form: FormGroup;
  public notes: FormArray;
  public noteForm: FormGroup;

  public tags: AnnotatedTag[] | undefined;

  constructor(private _formBuilder: FormBuilder) {
    this.modelChange = new EventEmitter<LingTaggedForm>();
    this._updates$ = new BehaviorSubject<string>('');
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
      this.tags[i].value.localeCompare(entry.id) > 0
    ) {
      i++;
    }
    this.tags = [
      ...this.tags.splice(i, 0, {
        value: entry.id,
      })
    ];
  }

  public deleteTag(index: number): void {
    if (!this.tags) {
      return;
    }
    this.tags = [...this.tags.splice(index, 1)];
  }

  public getTagLabel(tag: string): string {
    // get the tag label from the thesaurus if any, else use ID
    const entry = this._tagEntries?.find((e) => e.id === tag);
    return entry ? entry.value : tag;
  }

  public tagHasNotes(tag: string): boolean {
    // a tag may have notes when the aux thesaurus has any
    // entry starting with its ID plus "--"
    if (!this.auxEntries?.length) {
      return false;
    }
    const prefix = tag + '--';
    return this.auxEntries.some((e) => e.id.startsWith(prefix));
  }

  public editTagNotes(index: number): void {
    // TODO
  }
}
