import { Routes } from '@angular/router';
import { LayoutComponent } from './common-ui/layout/layout.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { FeedPageComponent } from './pages/feed-page/feed-page.component';
import { ProfileSettingsPageComponent } from './pages/profile-settings-page/profile-settings-page.component';
import { authGuard } from './auth/access.guard';
import { StatsPageComponent } from './pages/stats-page/stats-page.component';

export const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      {path: '', redirectTo: 'feed', pathMatch: 'full'},
      {path: 'feed', component: FeedPageComponent},
      {path: 'profile', component: ProfileSettingsPageComponent},
      {path: 'stats', component: StatsPageComponent}
    ],
    canActivate: [authGuard]
  },
  {path: 'login', component: LoginPageComponent}
];
