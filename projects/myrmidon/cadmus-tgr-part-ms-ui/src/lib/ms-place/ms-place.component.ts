import { Component, effect, input, model, output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';

import {
  DocReference,
  DocReferencesComponent,
} from '@myrmidon/cadmus-refs-doc-references';

import { ThesaurusEntry } from '@myrmidon/cadmus-core';

import { MsPlace } from '../ms-places-part';

@Component({
  selector: 'tgr-ms-place',
  templateUrl: './ms-place.component.html',
  styleUrls: ['./ms-place.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatError,
    MatInput,
    DocReferencesComponent,
    MatIconButton,
    MatTooltip,
    MatIcon,
  ],
})
export class MsPlaceComponent {
  public readonly place = model<MsPlace>();

  public readonly editorClose = output();

  public form: FormGroup;
  public area: FormControl<string | null>;
  public address: FormControl<string | null>;
  public city: FormControl<string | null>;
  public site: FormControl<string | null>;
  public rank: FormControl<number>;
  public sources: FormControl<DocReference[]>;

  public initialSources: DocReference[];

  /**
   * ms-place-areas thesaurus entries.
   */
  public readonly areaEntries = input<ThesaurusEntry[]>();
  /**
   * doc-reference-tags thesaurus entries.
   */
  public readonly tagEntries = input<ThesaurusEntry[]>();

  constructor(formBuilder: FormBuilder) {
    this.initialSources = [];
    // form
    this.area = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.address = formBuilder.control(null, Validators.maxLength(300));
    this.city = formBuilder.control(null, Validators.maxLength(50));
    this.site = formBuilder.control(null, Validators.maxLength(100));
    this.rank = formBuilder.control(0, { nonNullable: true });
    this.sources = formBuilder.control([], { nonNullable: true });
    this.form = formBuilder.group({
      area: this.area,
      address: this.address,
      city: this.city,
      site: this.site,
      rank: this.rank,
      sources: this.sources,
    });

    effect(() => {
      this.updateForm(this.place());
    });
  }

  private updateForm(place: MsPlace | undefined): void {
    if (!place) {
      this.form.reset();
      return;
    }

    this.area.setValue(place.area);
    this.address.setValue(place.address || null);
    this.city.setValue(place.city || null);
    this.site.setValue(place.site || null);
    this.rank.setValue(place.rank || 0);
    this.initialSources = place.sources || [];

    this.form.markAsPristine();
  }

  private getPlace(): MsPlace {
    return {
      area: this.area.value?.trim() || '',
      address: this.address.value?.trim(),
      city: this.city.value?.trim(),
      site: this.site.value?.trim(),
      rank: this.rank.value,
      sources: this.sources.value?.length ? this.sources.value : undefined,
    };
  }

  public onSourcesChange(sources: DocReference[]): void {
    this.sources.setValue(sources);
    this.form.markAsDirty();
  }

  public cancel(): void {
    this.editorClose.emit();
  }

  public save(): void {
    if (this.form.invalid) {
      return;
    }
    this.place.set(this.getPlace());
  }
}
