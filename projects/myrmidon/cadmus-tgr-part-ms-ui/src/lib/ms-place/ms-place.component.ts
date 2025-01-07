import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class MsPlaceComponent implements OnInit {
  private _model: MsPlace | undefined;

  @Input()
  public get model(): MsPlace | undefined {
    return this._model;
  }
  public set model(value: MsPlace | undefined) {
    if (this._model === value) {
      return;
    }
    this._model = value;
    this.updateForm(this._model);
  }

  @Output()
  public modelChange: EventEmitter<MsPlace>;
  @Output()
  public editorClose: EventEmitter<any>;

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
  @Input()
  public areaEntries: ThesaurusEntry[] | undefined;
  /**
   * doc-reference-tags thesaurus entries.
   */
  @Input()
  public tagEntries: ThesaurusEntry[] | undefined;

  constructor(formBuilder: FormBuilder) {
    this.modelChange = new EventEmitter<MsPlace>();
    this.editorClose = new EventEmitter<any>();
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
  }

  ngOnInit(): void {
    // this.updateForm(this.model);
  }

  private updateForm(model: MsPlace | undefined): void {
    if (!model) {
      this.form.reset();
      return;
    }

    this.area.setValue(model.area);
    this.address.setValue(model.address || null);
    this.city.setValue(model.city || null);
    this.site.setValue(model.site || null);
    this.rank.setValue(model.rank || 0);
    this.initialSources = model.sources || [];

    this.form.markAsPristine();
  }

  private getModel(): MsPlace {
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
    this._model = this.getModel();
    this.modelChange.emit(this._model);
  }
}
