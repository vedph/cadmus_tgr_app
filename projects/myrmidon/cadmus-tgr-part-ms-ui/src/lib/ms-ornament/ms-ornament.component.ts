import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  ViewChild,
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
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { NgeMonacoModule } from '@cisstech/nge/monaco';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';

import {
  PhysicalSize,
  PhysicalSizeComponent,
} from '@myrmidon/cadmus-mat-physical-size';
import {
  CADMUS_TEXT_ED_BINDINGS_TOKEN,
  CadmusTextEdBindings,
  CadmusTextEdService,
} from '@myrmidon/cadmus-text-ed';

import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { MsLocation, MsLocationService } from '@myrmidon/cadmus-tgr-core';

import { MsOrnament } from '../ms-ornaments-part';

@Component({
  selector: 'tgr-ms-ornament',
  templateUrl: './ms-ornament.component.html',
  styleUrls: ['./ms-ornament.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatError,
    MatInput,
    MatCheckbox,
    PhysicalSizeComponent,
    NgeMonacoModule,
    MatIconButton,
    MatTooltip,
    MatIcon,
  ],
})
export class MsOrnamentComponent implements OnInit, OnDestroy, AfterViewInit {
  private _model: MsOrnament | undefined;

  private readonly _disposables: monaco.IDisposable[] = [];
  private _editorModel?: monaco.editor.ITextModel;
  private _editor?: monaco.editor.IStandaloneCodeEditor;

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

  constructor(
    formBuilder: FormBuilder,
    private _locService: MsLocationService,
    private _editService: CadmusTextEdService,
    @Inject(CADMUS_TEXT_ED_BINDINGS_TOKEN)
    @Optional()
    private _editorBindings?: CadmusTextEdBindings
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

  public ngOnDestroy() {
    this._disposables.forEach((d) => d.dispose());
  }

  private async applyEdit(selector: string) {
    if (!this._editor) {
      return;
    }
    const selection = this._editor.getSelection();
    const text = selection
      ? this._editor.getModel()!.getValueInRange(selection)
      : '';

    const result = await this._editService.edit({
      selector,
      text: text,
    });

    this._editor.executeEdits('my-source', [
      {
        range: selection!,
        text: result.text,
        forceMoveMarkers: true,
      },
    ]);
  }

  public onEditorInit(editor: monaco.editor.IEditor) {
    editor.updateOptions({
      minimap: {
        side: 'left',
      },
      wordWrap: 'on',
      automaticLayout: true,
    });

    this._editorModel =
      this._editorModel || monaco.editor.createModel('', 'markdown');
    editor.setModel(this._editorModel);
    this._editor = editor as monaco.editor.IStandaloneCodeEditor;

    this._disposables.push(
      this._editorModel.onDidChangeContent((e) => {
        this.description.setValue(this._editorModel!.getValue());
        this.description.markAsDirty();
        this.description.updateValueAndValidity();
      })
    );

    if (this._editorBindings) {
      Object.keys(this._editorBindings).forEach((key) => {
        const n = parseInt(key, 10);
        console.log(
          'Binding ' + n + ' to ' + this._editorBindings![key as any]
        );
        this._editor!.addCommand(n, () => {
          this.applyEdit(this._editorBindings![key as any]);
        });
      });
    }

    // focus to editor
    editor.focus();
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
    this._editorModel?.setValue(model.description || '');
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
