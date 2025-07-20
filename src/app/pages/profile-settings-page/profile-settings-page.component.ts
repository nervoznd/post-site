import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile-settings-page',
  imports: [],
  templateUrl: './profile-settings-page.component.html',
  styleUrl: './profile-settings-page.component.scss'
})
export class ProfileSettingsPageComponent {
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;
}
