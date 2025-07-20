import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  User,
  user
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { Profile } from '../data/interfaces/profile.interface';
import { ProfileService } from '../data/services/profile.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private profileService = inject(ProfileService);

  user$ = user(this.auth);

  currentUser: User | null = null;
  currentUserProfile: Profile | null = null;

  constructor() {
    setPersistence(this.auth, browserSessionPersistence);
    this.user$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        this.profileService.getOrGenerateProfile(this.currentUser)
          .subscribe((profile) => {
            if (profile) {
              this.currentUserProfile = profile;
            }
          })
      }
      else {
        this.currentUser = null;
        this.currentUserProfile = null;
      }
    });
  }

  register(email: string, password: string) {
    const promise = createUserWithEmailAndPassword(this.auth, email, password).then(() => {
      
    });
    return from(promise);
  }

  login(email: string, password: string) {
    const promise = signInWithEmailAndPassword(this.auth, email, password).then(() => {
      
    });
    return from(promise);
  }

  logout() {
    const promise = signOut(this.auth).then(() => {
      sessionStorage.clear();
    });
    return from(promise);
  }
}
