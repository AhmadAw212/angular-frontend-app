import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'users-list', pathMatch: 'full' },

  {
    path: 'users-list',
    loadComponent: () =>
      import('./components/users-list/users-list.component').then(
        (m) => m.UsersListComponent
      ),
  },

  {
    path: 'user/:id',
    loadComponent: () =>
      import('./components/user-detail/user-detail.component').then(
        (m) => m.UserDetailComponent
      ),
  },

  {
    path: '**',
    redirectTo: '/users-list',
  },
];
