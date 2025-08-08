import { Routes } from '@angular/router';

import { jwtGuard, jwtAdminGuard } from '@myrmidon/auth-jwt-login';

import { PendingChangesGuard } from '@myrmidon/cadmus-core';

import { HomeComponent } from './home/home.component';
import { editorGuard } from '@myrmidon/cadmus-api';
import { LoginPageComponent } from './login-page/login-page.component';
import { ManageUsersPageComponent } from './manage-users-page/manage-users-page.component';
import { RegisterUserPageComponent } from './register-user-page/register-user-page.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { EditFrameStatsPageComponent } from './edit-frame-stats-page/edit-frame-stats-page.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  // auth
  { path: 'login', component: LoginPageComponent },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [jwtGuard],
  },
  {
    path: 'register-user',
    component: RegisterUserPageComponent,
    canActivate: [jwtAdminGuard],
  },
  {
    path: 'manage-users',
    component: ManageUsersPageComponent,
    canActivate: [jwtAdminGuard],
  },
  {
    path: 'stats',
    component: EditFrameStatsPageComponent,
    canActivate: [jwtGuard],
  },
  // cadmus - items
  {
    path: 'items/:id',
    loadComponent: () =>
      import('@myrmidon/cadmus-item-editor').then(
        (module) => module.ItemEditorComponent
      ),
    canActivate: [jwtGuard],
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: 'items',
    loadComponent: () =>
      import('@myrmidon/cadmus-item-list').then(
        (module) => module.ItemListComponent
      ),
    canActivate: [jwtGuard],
  },
  {
    path: 'search',
    loadComponent: () =>
      import('@myrmidon/cadmus-item-search').then(
        (module) => module.ItemSearchComponent
      ),
    canActivate: [jwtGuard],
  },
  // cadmus - thesauri
  {
    path: 'thesauri/:id',
    loadComponent: () =>
      import('@myrmidon/cadmus-thesaurus-editor').then(
        (module) => module.ThesaurusEditorFeatureComponent
      ),
    canActivate: [editorGuard],
  },
  {
    path: 'thesauri',
    loadComponent: () =>
      import('@myrmidon/cadmus-thesaurus-list').then(
        (module) => module.ThesaurusListComponent
      ),
    canActivate: [editorGuard],
  },
  // cadmus - parts
  {
    path: 'items/:iid/general',
    loadChildren: () =>
      import('@myrmidon/cadmus-part-general-pg').then(
        (module) => module.CadmusPartGeneralPgModule
      ),
    canActivate: [jwtGuard],
  },
  {
    path: 'items/:iid/philology',
    loadChildren: () =>
      import('@myrmidon/cadmus-part-philology-pg').then(
        (module) => module.CadmusPartPhilologyPgModule
      ),
    canActivate: [jwtGuard],
  },
  {
    path: 'items/:iid/tgr-gr',
    loadChildren: () =>
      import('@myrmidon/cadmus-tgr-part-gr-pg').then(
        (module) => module.CadmusTgrPartGrPgModule
      ),
    canActivate: [jwtGuard],
  },
  {
    path: 'items/:iid/tgr-ms',
    loadChildren: () =>
      import('@myrmidon/cadmus-tgr-part-ms-pg').then(
        (module) => module.CadmusTgrPartMsPgModule
      ),
    canActivate: [jwtGuard],
  },
  // cadmus - preview
  {
    path: 'preview',
    loadChildren: () =>
      import('@myrmidon/cadmus-preview-pg').then(
        (module) => module.CadmusPreviewPgModule
      ),
    canActivate: [jwtGuard],
  },
  // cadmus - flags
  {
    path: 'flags',
    loadComponent: () =>
      import('@myrmidon/cadmus-flags-pg').then(
        (module) => module.FlagsEditorFeatureComponent
      ),
    canActivate: [jwtAdminGuard],
  },
  // fallback
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: HomeComponent },
];
