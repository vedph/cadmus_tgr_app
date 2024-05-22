import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

import { NgToolsModule } from '@myrmidon/ng-tools';
import { AuthJwtLoginModule } from '@myrmidon/auth-jwt-login';

import { CadmusCoreModule, PendingChangesGuard } from '@myrmidon/cadmus-core';
import { CadmusStateModule } from '@myrmidon/cadmus-state';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { CadmusUiPgModule } from '@myrmidon/cadmus-ui-pg';

import {
  AVAILABLE_WITNESSES_FRAGMENT_TYPEID,
  AVAILABLE_WITNESSES_PART_TYPEID,
  INTERPOLATIONS_FRAGMENT_TYPEID,
  LING_TAGS_FRAGMENT_TYPEID,
  VAR_QUOTATIONS_FRAGMENT_TYPEID,
  CadmusTgrPartGrUiModule,
} from '@myrmidon/cadmus-tgr-part-gr-ui';

import { AvailableWitnessesFragmentFeatureComponent } from './available-witnesses-fragment-feature/available-witnesses-fragment-feature.component';
import { AvailableWitnessesPartFeatureComponent } from './available-witnesses-part-feature/available-witnesses-part-feature.component';
import { InterpolationsFragmentFeatureComponent } from './interpolations-fragment-feature/interpolations-fragment-feature.component';
import { LingTagsFragmentFeatureComponent } from './ling-tags-fragment-feature/ling-tags-fragment-feature.component';
import { VarQuotationsFragmentFeatureComponent } from './var-quotations-fragment-feature/var-quotations-fragment-feature.component';

export const RouterModuleForChild = RouterModule.forChild([
  {
    path: `${AVAILABLE_WITNESSES_PART_TYPEID}/:pid`,
    pathMatch: 'full',
    component: AvailableWitnessesPartFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: `fragment/:pid/${AVAILABLE_WITNESSES_FRAGMENT_TYPEID}/:loc`,
    pathMatch: 'full',
    component: AvailableWitnessesFragmentFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
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
    AvailableWitnessesFragmentFeatureComponent,
    AvailableWitnessesPartFeatureComponent,
    InterpolationsFragmentFeatureComponent,
    LingTagsFragmentFeatureComponent,
    VarQuotationsFragmentFeatureComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
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
    // Cadmus
    NgToolsModule,
    AuthJwtLoginModule,
    RouterModuleForChild,
    CadmusCoreModule,
    CadmusStateModule,
    CadmusUiModule,
    CadmusUiPgModule,
    CadmusTgrPartGrUiModule,
  ],
  exports: [
    AvailableWitnessesFragmentFeatureComponent,
    AvailableWitnessesPartFeatureComponent,
    InterpolationsFragmentFeatureComponent,
    LingTagsFragmentFeatureComponent,
    VarQuotationsFragmentFeatureComponent,
  ],
})
export class CadmusTgrPartGrPgModule {}
