import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CadmusCoreModule, PendingChangesGuard } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusStateModule } from '@myrmidon/cadmus-state';
import {
  CadmusTgrPartGrUiModule,
  INTERPOLATIONS_FRAGMENT_TYPEID,
  LING_TAGS_FRAGMENT_TYPEID,
  VAR_QUOTATIONS_FRAGMENT_TYPEID,
} from '@myrmidon/cadmus-tgr-part-gr-ui';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { CadmusUiPgModule } from '@myrmidon/cadmus-ui-pg';

import { LingTagsFragmentFeatureComponent } from './ling-tags-fragment-feature/ling-tags-fragment-feature.component';
import { VarQuotationsFragmentFeatureComponent } from './var-quotations-fragment-feature/var-quotations-fragment-feature.component';
import { InterpolationsFragmentFeatureComponent } from './interpolations-fragment-feature/interpolations-fragment-feature.component';

export const RouterModuleForChild = RouterModule.forChild([
  {
    path: `fragment/:pid/${INTERPOLATIONS_FRAGMENT_TYPEID}/:loc`,
    pathMatch: 'full',
    component: InterpolationsFragmentFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: `fragment/:pid/${LING_TAGS_FRAGMENT_TYPEID}/:loc`,
    pathMatch: 'full',
    component: LingTagsFragmentFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: `fragment/:pid/${VAR_QUOTATIONS_FRAGMENT_TYPEID}/:loc`,
    pathMatch: 'full',
    component: VarQuotationsFragmentFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
]);

@NgModule({
  declarations: [
    InterpolationsFragmentFeatureComponent,
    LingTagsFragmentFeatureComponent,
    VarQuotationsFragmentFeatureComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Cadmus
    RouterModuleForChild,
    CadmusCoreModule,
    CadmusMaterialModule,
    CadmusStateModule,
    CadmusUiModule,
    CadmusUiPgModule,
    CadmusTgrPartGrUiModule,
  ],
  exports: [
    InterpolationsFragmentFeatureComponent,
    LingTagsFragmentFeatureComponent,
    VarQuotationsFragmentFeatureComponent,
  ],
})
export class CadmusTgrPartGrPgModule {}
