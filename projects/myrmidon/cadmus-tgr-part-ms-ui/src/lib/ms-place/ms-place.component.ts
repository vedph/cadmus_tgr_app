import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DocReference, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { MsPlace } from '../ms-places-part';

@Component({
  selector: 'tgr-ms-place',
  templateUrl: './ms-place.component.html',
  styleUrls: ['./ms-place.component.css'],
})
export class MsPlaceComponent implements OnInit {
  private _model: MsPlace | undefined;

  @Input()
  public get model(): MsPlace | undefined {
    return this._model;
  }
  public set model(value: MsPlace | undefined) {
    this._model = value;
    this.updateForm(value);
  }

  @Output()
  public modelChange: EventEmitter<MsPlace>;
  @Output()
  public editorClose: EventEmitter<any>;

  public form: FormGroup;
  public area: FormControl;
  public address: FormControl;
  public city: FormControl;
  public site: FormControl;
  public rank: FormControl;
  public sources: FormControl;

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
    this.rank = formBuilder.control(0);
    this.sources = formBuilder.control([]);
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
    this.updateForm(this.model);
  }

  private updateForm(model: MsPlace | undefined): void {
    if (!model) {
      this.form.reset();
      return;
    }

    this.area.setValue(model.area);
    this.address.setValue(model.address);
    this.city.setValue(model.city);
    this.site.setValue(model.site);
    this.rank.setValue(model.rank || 0);
    this.initialSources = model.sources || [];

    this.form.markAsPristine();
  }

  private getModel(): MsPlace | null {
    return {
      area: this.area.value?.trim(),
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
    const model = this.getModel();
    if (!model) {
      return;
    }
    this.modelChange.emit(model);
  }
}
