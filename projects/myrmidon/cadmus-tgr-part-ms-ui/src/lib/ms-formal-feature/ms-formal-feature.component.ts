import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MarkdownComponent } from 'ngx-markdown';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';

import { MsFormalFeature } from '../ms-formal-features-part';

@Component({
  selector: 'tgr-ms-formal-feature',
  templateUrl: './ms-formal-feature.component.html',
  styleUrls: ['./ms-formal-feature.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MarkdownComponent,
    MatIconButton,
    MatTooltip,
    MatIcon,
  ],
})
export class MsFormalFeatureComponent implements OnInit, AfterViewInit {
  private _model: MsFormalFeature | undefined;

  @Input()
  public get model(): MsFormalFeature | undefined {
    return this._model;
  }
  public set model(value: MsFormalFeature | undefined) {
    if (this._model === value) {
      return;
    }
    this._model = value;
    this.updateForm(value);
  }

  @Output()
  public modelChange: EventEmitter<MsFormalFeature>;
  @Output()
  public editorClose: EventEmitter<any>;

  public form: FormGroup;
  public handId: FormControl<string | null>;
  public description: FormControl<string | null>;

  constructor(formBuilder: FormBuilder) {
    this.modelChange = new EventEmitter<MsFormalFeature>();
    this.editorClose = new EventEmitter<any>();
    // form
    this.handId = formBuilder.control(null, Validators.maxLength(50));
    this.description = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50000),
    ]);
    this.form = formBuilder.group({
      handId: this.handId,
      description: this.description,
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.updateForm(this.model);
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

  private getModel(): MsFormalFeature {
    return {
      handId: this.handId.value?.trim() || '',
      description: this.description.value?.trim() || '',
    };
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
