import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { CadmusTgrCoreModule } from '@myrmidon/cadmus-tgr-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MonacoEditorModule,
    // Cadmus
    CadmusMaterialModule,
    CadmusUiModule,
    CadmusTgrCoreModule
  ],
  exports: [],
})
export class CadmusTgrPartGrUiModule {}
