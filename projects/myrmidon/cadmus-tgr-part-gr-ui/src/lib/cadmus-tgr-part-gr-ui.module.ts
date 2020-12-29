import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { CadmusTgrCoreModule } from '@myrmidon/cadmus-tgr-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { LingTagsFragmentComponent } from './ling-tags-fragment/ling-tags-fragment.component';
import { LingTaggedFormComponent } from './ling-tagged-form/ling-tagged-form.component';
import { VarQuotationEntryComponent } from './var-quotation-entry/var-quotation-entry.component';
import { QuotationVariantComponent } from './quotation-variant/quotation-variant.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { VarQuotationsFragmentComponent } from './var-quotations-fragment/var-quotations-fragment.component';
import { InterpEntryComponent } from './interp-entry/interp-entry.component';

@NgModule({
  declarations: [
    InterpEntryComponent,
    LingTagsFragmentComponent,
    LingTaggedFormComponent,
    QuotationVariantComponent,
    VarQuotationEntryComponent,
    VarQuotationsFragmentComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MonacoEditorModule,
    ClipboardModule,
    // Cadmus
    CadmusMaterialModule,
    CadmusUiModule,
    CadmusTgrCoreModule,
  ],
  exports: [
    InterpEntryComponent,
    LingTagsFragmentComponent,
    LingTaggedFormComponent,
    QuotationVariantComponent,
    VarQuotationEntryComponent,
    VarQuotationsFragmentComponent,
  ],
})
export class CadmusTgrPartGrUiModule {}
