import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { PhysicalSize } from '@myrmidon/cadmus-mat-physical-size';
import { MsLocation, MsLocationService } from '@myrmidon/cadmus-tgr-core';
import { MsOrnament } from '../ms-ornaments-part';

@Component({
  selector: 'tgr-ms-ornament',
  templateUrl: './ms-ornament.component.html',
  styleUrls: ['./ms-ornament.component.css'],
})
export class MsOrnamentComponent implements OnInit, AfterViewInit {
  private _model: MsOrnament | undefined;

  @ViewChild('dsceditor') dscEditor: any;

  @Input()
  public get model(): MsOrnament | undefined {
    return this._model;
  }
  public set model(value: MsOrnament | undefined) {
    if (this._model === value) {
      return;
    }
    this._model = value;
    this.updateForm(value);
  }

  @Input()
  public ornTypeEntries: ThesaurusEntry[] | undefined;

  @Input()
  public szUnitEntries: ThesaurusEntry[] | undefined;

  @Input()
  public szTagEntries: ThesaurusEntry[] | undefined;

  @Input()
  public szDimTagEntries: ThesaurusEntry[] | undefined;

  @Output()
  public modelChange: EventEmitter<MsOrnament>;
  @Output()
  public editorClose: EventEmitter<any>;

  public form: FormGroup;
  public type: FormControl<string | null>;
  public start: FormControl<string | null>;
  public end: FormControl<string | null>;
  public description: FormControl<string | null>;
  public note: FormControl<string | null>;
  public hasSize: FormControl<boolean>;
  public size: PhysicalSize | undefined;

  public editorOptions = {
    theme: 'vs-light',
    language: 'markdown',
    wordWrap: 'on',
    // https://github.com/atularen/ngx-monaco-editor/issues/19
    automaticLayout: true,
  };

  constructor(
    formBuilder: FormBuilder,
    private _locService: MsLocationService
  ) {
    this.modelChange = new EventEmitter<MsOrnament>();
    this.editorClose = new EventEmitter<any>();
    // form
    this.type = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.start = formBuilder.control(null, [
      Validators.required,
      Validators.pattern(MsLocationService.locRegexp),
    ]);
    this.end = formBuilder.control(null, [
      Validators.required,
      Validators.pattern(MsLocationService.locRegexp),
    ]);
    this.description = formBuilder.control(null, Validators.maxLength(1000));
    this.note = formBuilder.control(null, Validators.maxLength(1500));
    this.hasSize = formBuilder.control(false, { nonNullable: true });
    this.form = formBuilder.group({
      type: this.type,
      start: this.start,
      end: this.end,
      description: this.description,
      note: this.note,
      hasSize: this.hasSize,
    });
  }

  ngOnInit(): void {
    this.updateForm(this.model);
  }

  ngAfterViewInit(): void {
    this.updateForm(this.model);
    // HACK: required to show the monaco editor when this component
    // is used in some initially-hidden container, e.g. a tab
    setTimeout(() => {
      this.dscEditor._editor?.layout();
    }, 150);
  }

  private updateForm(model: MsOrnament | undefined): void {
    if (!model) {
      this.size = undefined;
      this.form.reset();
      return;
    }

    this.type.setValue(model.type);
    this.start.setValue(this._locService.locationToString(model.start));
    this.end.setValue(this._locService.locationToString(model.end));
    this.description.setValue(model.description || null);
    this.note.setValue(model.note || null);

    if (model.size) {
      this.size = model.size;
      this.hasSize.setValue(true);
    } else {
      this.size = undefined;
      this.hasSize.setValue(false);
    }

    this.form.markAsPristine();
  }

  private getModel(): MsOrnament {
    return {
      type: this.type.value?.trim() || '',
      start: this._locService.parseLocation(this.start.value) as MsLocation,
      end: this._locService.parseLocation(this.end.value) as MsLocation,
      size: this.hasSize.value ? this.size : undefined,
      description: this.description.value?.trim(),
      note: this.note.value?.trim(),
    };
  }

  public onSizeChange(size: PhysicalSize): void {
    this.size = size;
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
