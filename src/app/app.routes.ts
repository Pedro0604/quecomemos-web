import {Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';

export const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  }, {path: '**', component: PageNotFoundComponent}
];
