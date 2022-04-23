import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MonacoEditorModule } from 'ngx-monaco-editor';

import { CadmusTgrCoreModule } from '@myrmidon/cadmus-tgr-core';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { AuthJwtLoginModule } from '@myrmidon/auth-jwt-login';
import { NgToolsModule } from '@myrmidon/ng-tools';

import { LingTagsFragmentComponent } from './ling-tags-fragment/ling-tags-fragment.component';
import { LingTaggedFormComponent } from './ling-tagged-form/ling-tagged-form.component';
import { VarQuotationComponent } from './var-quotation/var-quotation.component';
import { QuotationVariantComponent } from './quotation-variant/quotation-variant.component';
import { VarQuotationsFragmentComponent } from './var-quotations-fragment/var-quotations-fragment.component';
import { InterpolationComponent } from './interpolation/interpolation.component';
import { InterpolationsFragmentComponent } from './interpolations-fragment/interpolations-fragment.component';
import { AvailableWitnessesPartComponent } from './available-witnesses-part/available-witnesses-part.component';

@NgModule({
  declarations: [
    AvailableWitnessesPartComponent,
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
    // material
    ClipboardModule,
    MatAutocompleteModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatTooltipModule,
    FlexLayoutModule,
    // Cadmus
    NgToolsModule,
    AuthJwtLoginModule,
    CadmusUiModule,
    CadmusTgrCoreModule,
  ],
  exports: [
    AvailableWitnessesPartComponent,
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
