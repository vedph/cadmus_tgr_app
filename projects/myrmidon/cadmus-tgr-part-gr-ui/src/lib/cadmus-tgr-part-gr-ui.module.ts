import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { CadmusTgrCoreModule } from '@myrmidon/cadmus-tgr-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { LingTagsFragmentComponent } from './ling-tags-fragment/ling-tags-fragment.component';
import { LingTaggedFormComponent } from './ling-tagged-form/ling-tagged-form.component';

@NgModule({
  declarations: [LingTagsFragmentComponent, LingTaggedFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MonacoEditorModule,
    // Cadmus
    CadmusMaterialModule,
    CadmusUiModule,
    CadmusTgrCoreModule,
  ],
  exports: [LingTagsFragmentComponent, LingTaggedFormComponent],
})
export class CadmusTgrPartGrUiModule {}
