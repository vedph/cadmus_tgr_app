import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PendingChangesGuard } from '@myrmidon/cadmus-core';
import { LING_TAGS_FRAGMENT_TYPEID } from '@myrmidon/cadmus-tgr-part-gr-ui';
import { LingTagsFragmentFeatureComponent } from './ling-tags-fragment-feature/ling-tags-fragment-feature.component';

export const RouterModuleForChild = RouterModule.forChild([
  {
    path: `fragment/:pid/${LING_TAGS_FRAGMENT_TYPEID}/:loc`,
    pathMatch: 'full',
    component: LingTagsFragmentFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
]);

@NgModule({
  declarations: [LingTagsFragmentFeatureComponent],
  imports: [
    RouterModuleForChild
  ],
  exports: [LingTagsFragmentFeatureComponent],
})
export class CadmusTgrPartGrPgModule {}
