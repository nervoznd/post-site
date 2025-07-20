import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp({
      projectId: "blogproj-29e7b",
      appId: "1:860655491355:web:1d4ed8583c9d9d8bf81bbe",
      databaseURL: "https://blogproj-29e7b-default-rtdb.asia-southeast1.firebasedatabase.app",
      storageBucket: "blogproj-29e7b.firebasestorage.app",
      apiKey: "AIzaSyDWkC_goYmFgvuBTPbEHT9haHCYyRdl-Sc",
      authDomain: "blogproj-29e7b.firebaseapp.com",
      messagingSenderId: "860655491355",
      measurementId: "G-40FYPG55PZ"
    })),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase())
  ]
};
