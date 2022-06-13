import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { MsLocation, MsLocationService } from '@myrmidon/cadmus-tgr-core';
import { DocReference } from '@myrmidon/cadmus-refs-doc-references';
import { renderLabelFromLastColon } from '@myrmidon/cadmus-ui';
import { MsContent } from '../ms-contents-part';

@Component({
  selector: 'tgr-ms-content',
  templateUrl: './ms-content.component.html',
  styleUrls: ['./ms-content.component.css'],
})
export class MsContentComponent implements OnInit {
  @Input()
  public model: MsContent | undefined;

  /**
   * Author and works.
   */
  @Input()
  public workEntries: ThesaurusEntry[] | undefined;
  @Input()
  public docTypeEntries: ThesaurusEntry[] | undefined;
  @Input()
  public docTagEntries: ThesaurusEntry[] | undefined;
  @Output()
  public modelChange: EventEmitter<MsContent>;
  @Output()
  public editorClose: EventEmitter<any>;

  public start: FormControl<string | null>;
  public end: FormControl<string | null>;
  public work: FormControl<string | null>;
  public location: FormControl<string | null>;
  public title: FormControl<string | null>;
  public incipit: FormControl<string | null>;
  public explicit: FormControl<string | null>;
  public note: FormControl<string | null>;
  public editions: FormControl<DocReference[]>;
  public form: FormGroup;

  public initialEditions: DocReference[];

  constructor(
    formBuilder: FormBuilder,
    private _locService: MsLocationService
  ) {
    this.modelChange = new EventEmitter<MsContent>();
    this.editorClose = new EventEmitter<any>();
    this.initialEditions = [];
    // form
    this.start = formBuilder.control(null, [
      Validators.required,
      Validators.pattern(MsLocationService.locRegexp),
    ]);
    this.end = formBuilder.control(null, [
      Validators.required,
      Validators.pattern(MsLocationService.locRegexp),
    ]);
    this.work = formBuilder.control(null, Validators.maxLength(100));
    this.location = formBuilder.control(null, Validators.maxLength(50));
    this.title = formBuilder.control(null, Validators.maxLength(100));
    this.incipit = formBuilder.control(null, Validators.maxLength(500));
    this.explicit = formBuilder.control(null, Validators.maxLength(500));
    this.note = formBuilder.control(null, Validators.maxLength(500));
    this.editions = formBuilder.control([], { nonNullable: true });
    this.form = formBuilder.group({
      start: this.start,
      end: this.end,
      work: this.work,
      location: this.location,
      title: this.title,
      incipit: this.incipit,
      explicit: this.explicit,
      note: this.note,
      editions: this.editions,
    });
  }

  ngOnInit(): void {
    this.updateForm(this.model);
  }

  private updateForm(model: MsContent | undefined): void {
    if (!model) {
      this.form.reset();
      return;
    }

    this.start.setValue(this._locService.locationToString(model.start));
    this.end.setValue(this._locService.locationToString(model.end));
    this.work.setValue(model.work || null);
    this.location.setValue(model.location || null);
    this.title.setValue(model.title || null);
    this.incipit.setValue(model.incipit);
    this.explicit.setValue(model.explicit);
    this.note.setValue(model.note || null);
    this.initialEditions = model.editions || [];

    this.form.markAsPristine();
  }

  private getModel(): MsContent | null {
    return {
      start: this._locService.parseLocation(this.start.value) as MsLocation,
      end: this._locService.parseLocation(this.end.value) as MsLocation,
      work: this.work.value?.trim(),
      location: this.location.value?.trim(),
      title: this.title.value?.trim(),
      incipit: this.incipit.value?.trim() || '',
      explicit: this.explicit.value?.trim() || '',
      note: this.note.value?.trim(),
      editions: this.editions.value?.length ? this.editions.value : undefined,
    };
  }

  public renderLabel(label: string): string {
    return renderLabelFromLastColon(label);
  }

  public onWorkEntryChange(entry: ThesaurusEntry): void {
    this.work.setValue(entry.value);
  }

  public onEditionsChange(editions: DocReference[]): void {
    this.editions.setValue(editions);
    this.form.markAsDirty();
  }

  public cancel(): void {
    this.editorClose.emit();
  }

  public save(): void {
    if (this.form.invalid) {
      return;
    }
    const model = this.getModel();
    if (!model) {
      return;
    }
    this.modelChange.emit(model);
  }
}
