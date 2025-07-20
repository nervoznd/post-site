import { inject, Injectable } from '@angular/core';
import { child, Database, get, ref, set, update } from '@angular/fire/database';
import { Profile } from '../interfaces/profile.interface';
import { from, map, Observable } from 'rxjs';
import { User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private db = inject(Database);
  private profilesRef = ref(this.db, 'users');

  addProfile(uid: string, profile: Profile): Observable<string> {
    const newProfileRef = ref(this.db, `users/${uid}`);
    const ProfileWithId = { ...profile, id: uid };
    return from(set(newProfileRef, ProfileWithId)).pipe(map(() => uid));
  }

  updateProfile(uid: string, data: Partial<Profile>): Observable<void> {
    return from(update(child(this.profilesRef, uid), data));
  }

  getProfile(uid: string): Observable<Profile> {
    return from(get(child(this.profilesRef, uid)))
      .pipe(
        map(snapshot => {
          if (!snapshot.exists()) {
            throw new Error('Profile not found');
          }
          return snapshot.val() as Profile;
        })
      );
  }

  getOrGenerateProfile(user: User): Observable<Profile> {
    return from(get(child(this.profilesRef, user.uid)))
      .pipe(
        map(snapshot => {
          if (!snapshot.exists()) {
            const newProfile: Profile = {
              email: user.email!,
              username: user.email!.split('@')[0]
            };
            this.addProfile(user.uid, newProfile);
            return newProfile;
          }
          return snapshot.val() as Profile;
        })
      );
  }
}
