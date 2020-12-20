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
import { MsFormalFeature } from '../ms-formal-features-part';

@Component({
  selector: 'tgr-ms-formal-feature',
  templateUrl: './ms-formal-feature.component.html',
  styleUrls: ['./ms-formal-feature.component.css'],
})
export class MsFormalFeatureComponent implements OnInit, AfterViewInit {
  private _model: MsFormalFeature | undefined;

  @ViewChild('dsceditor') dscEditor: any;

  @Input()
  public get model(): MsFormalFeature | undefined {
    return this._model;
  }
  public set model(value: MsFormalFeature | undefined) {
    this._model = value;
    this.updateForm(value);
  }

  @Output()
  public modelChange: EventEmitter<MsFormalFeature>;
  @Output()
  public editorClose: EventEmitter<any>;

  public form: FormGroup;
  public handId: FormControl;
  public description: FormControl;

  public editorOptions = {
    theme: 'vs-light',
    language: 'markdown',
    wordWrap: 'on',
    // https://github.com/atularen/ngx-monaco-editor/issues/19
    automaticLayout: true,
  };

  constructor(formBuilder: FormBuilder) {
    this.modelChange = new EventEmitter<MsFormalFeature>();
    this.editorClose = new EventEmitter<any>();
    // form
    this.handId = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.description = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(500),
    ]);
    this.form = formBuilder.group({
      handId: this.handId,
      description: this.description,
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.updateForm(this.model);
    // HACK: required to show the monaco editor when this component
    // is used in some initially-hidden container, e.g. a tab
    setTimeout(() => {
      this.dscEditor._editor?.layout();
    }, 150);
  }

  private updateForm(model: MsFormalFeature | undefined): void {
    if (!model) {
      this.form.reset();
      return;
    }

    this.handId.setValue(model.handId);
    this.description.setValue(model.description);

    this.form.markAsPristine();
  }

  private getModel(): MsFormalFeature | null {
    return {
      handId: this.handId.value?.trim(),
      description: this.description.value?.trim(),
    };
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
