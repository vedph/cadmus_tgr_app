import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { CadmusTgrCoreModule } from '@myrmidon/cadmus-tgr-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { LingTagsFragmentComponent } from './ling-tags-fragment/ling-tags-fragment.component';
import { LingTaggedFormComponent } from './ling-tagged-form/ling-tagged-form.component';
import { VarQuotationComponent } from './var-quotation/var-quotation.component';
import { QuotationVariantComponent } from './quotation-variant/quotation-variant.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { VarQuotationsFragmentComponent } from './var-quotations-fragment/var-quotations-fragment.component';
import { InterpolationComponent } from './interpolation/interpolation.component';
import { InterpolationsFragmentComponent } from './interpolations-fragment/interpolations-fragment.component';

@NgModule({
  declarations: [
    InterpolationComponent,
    InterpolationsFragmentComponent,
    LingTagsFragmentComponent,
    LingTaggedFormComponent,
    QuotationVariantComponent,
    VarQuotationComponent,
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
    InterpolationComponent,
    InterpolationsFragmentComponent,
    LingTagsFragmentComponent,
    LingTaggedFormComponent,
    QuotationVariantComponent,
    VarQuotationComponent,
    VarQuotationsFragmentComponent,
  ],
})
export class CadmusTgrPartGrUiModule {}
