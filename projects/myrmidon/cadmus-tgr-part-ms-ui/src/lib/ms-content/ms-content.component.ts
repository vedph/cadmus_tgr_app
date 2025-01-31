import {
  Component,
  effect,
  input,
  model,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

import { MatTabGroup, MatTab } from '@angular/material/tabs';
import {
  MatFormField,
  MatLabel,
  MatError,
  MatHint,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';

import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { MsLocation, MsLocationService } from '@myrmidon/cadmus-tgr-core';
import {
  DocReference,
  DocReferencesComponent,
} from '@myrmidon/cadmus-refs-doc-references';
import {
  renderLabelFromLastColon,
  ThesaurusTreeComponent,
} from '@myrmidon/cadmus-ui';

import { MsContent } from '../ms-contents-part';

@Component({
  selector: 'tgr-ms-content',
  templateUrl: './ms-content.component.html',
  styleUrls: ['./ms-content.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTabGroup,
    MatTab,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatHint,
    ThesaurusTreeComponent,
    DocReferencesComponent,
    MatIconButton,
    MatTooltip,
    MatIcon,
  ],
})
export class MsContentComponent implements OnInit, OnDestroy {
  private _sub?: Subscription;

  public readonly content = model<MsContent>();

  /**
   * Author and works.
   */
  public readonly workEntries = input<ThesaurusEntry[]>();
  public readonly docTypeEntries = input<ThesaurusEntry[]>();
  public readonly docTagEntries = input<ThesaurusEntry[]>();
  public readonly editorClose = output();

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

  public workEntry?: ThesaurusEntry;

  public initialEditions: DocReference[];

  constructor(
    formBuilder: FormBuilder,
    private _locService: MsLocationService
  ) {
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
    this.work = formBuilder.control<string | null>(
      null,
      Validators.maxLength(300)
    );
    this.location = formBuilder.control<string | null>(
      null,
      Validators.maxLength(50)
    );
    this.title = formBuilder.control<string | null>(
      null,
      Validators.maxLength(100)
    );
    this.incipit = formBuilder.control<string | null>(
      null,
      Validators.maxLength(500)
    );
    this.explicit = formBuilder.control<string | null>(
      null,
      Validators.maxLength(500)
    );
    this.note = formBuilder.control<string | null>(
      null,
      Validators.maxLength(1500)
    );
    this.editions = formBuilder.control<DocReference[]>([], {
      nonNullable: true,
    });
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

    effect(() => {
      this.updateForm(this.content());
    });
  }

  public ngOnInit(): void {
    this._sub = this.work.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(300))
      .subscribe((value) => {
        this.workEntry = this.workEntries()?.find((e) => e.id === value);
      });
  }

  public ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  private updateForm(model: MsContent | undefined): void {
    if (!model) {
      this.form.reset();
      return;
    }

    this.start.setValue(this._locService.locationToString(model.start));
    this.end.setValue(this._locService.locationToString(model.end));

    this.work.setValue(model.work || null);
    if (model.work && this.workEntries()?.length) {
      this.workEntry = this.workEntries()?.find((e) => e.id === model.work);
    } else {
      this.workEntry = undefined;
    }

    this.location.setValue(model.location || null);
    this.title.setValue(model.title || null);
    this.incipit.setValue(model.incipit);
    this.explicit.setValue(model.explicit);
    this.note.setValue(model.note || null);
    this.initialEditions = model.editions || [];

    this.form.markAsPristine();
  }

  private getContent(): MsContent {
    return {
      start: this._locService.parseLocation(this.start.value) as MsLocation,
      end: this._locService.parseLocation(this.end.value) as MsLocation,
      work: this.work.value?.trim() || undefined,
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
    this.workEntry = entry;
    this.work.setValue(entry.id);
    this.work.markAsDirty();
    this.work.updateValueAndValidity();
  }

  public removeWork(): void {
    this.work.reset();
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
    this.content.set(this.getContent());
  }
}
