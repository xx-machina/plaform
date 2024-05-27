import { TestBed } from '@angular/core/testing';
import { connectStorageEmulator, getStorage, provideStorage } from '@angular/fire/storage';
import { getApp, provideFirebaseApp } from '@angular/fire/app';
import { CloudStorageService } from './cloud-storage.service';
import { initializeApp } from 'firebase/app';


describe('CloudStorageService', () => {
  let service: CloudStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        provideFirebaseApp(() => initializeApp({
          //TODO(@nontangent): Fix This
          apiKey: 'AIzaSyBVSy3YpkVGiKXbbxeK0qBnu3-MNZ9UIjA',
          authDomain: 'angularfire2-test.firebaseapp.com',
          databaseURL: 'https://angularfire2-test.firebaseio.com',
          projectId: 'angularfire2-test',
          storageBucket: 'angularfire2-test.appspot.com',
          messagingSenderId: '920323787688',
          appId: '1:920323787688:web:2253a0e5eb5b9a8b',
          measurementId: 'G-W20QDV5CZP'
        })),
        provideStorage(() => {
          const storage = getStorage(getApp());
          connectStorageEmulator(storage, 'localhost', 9199);
          return storage;
        }),
      ],
    });
    service = TestBed.inject(CloudStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
