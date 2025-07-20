import { Component, inject, signal } from '@angular/core';
import { TextInputComponent } from "../../common-ui/text-input/text-input.component";
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [TextInputComponent, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  authService = inject(AuthService);
  router = inject(Router);

  isPasswordVisible = signal<boolean>(false);

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);

  form = new FormGroup({
    email: this.email,
    password: this.password
  });

  login() {
    const { email, password } = this.form.value;

    if (!email || !password || this.form.invalid) {
      console.log('Invalid data.');
      return;
    }

    this.authService.login(email, password).subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: (error) => {
        console.error('Sign-in error:', error);
      }
    });
  }

  register() {
    const { email, password } = this.form.value;

    if (!email || !password || this.form.invalid) {
      console.log('Invalid data.');
      return;
    }

    this.authService.register(email, password).subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: (error) => {
        console.error('Sign-up error:', error);
      }
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Log-out error:', error);
      }
    });
  }
}
