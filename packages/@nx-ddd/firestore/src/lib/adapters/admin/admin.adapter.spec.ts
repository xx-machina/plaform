import admin from 'firebase-admin';
import dayjs from 'dayjs';
import { provideFirestoreAdapter } from './admin.adapter';
import { TestBed } from '@angular/core/testing';
import { FirestoreAdapter } from '../base';
import { clearFirestoreData } from '@nx-ddd/firestore/testing';

process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';
admin.initializeApp({projectId: 'x-x-machina'});

describe('AdminFirestoreAdapter', () => {
  let adapter: FirestoreAdapter;

  beforeEach(async () => {
    await clearFirestoreData('x-x-machina');
    TestBed.configureTestingModule({
      providers: [
        provideFirestoreAdapter(),
      ]
    });
    adapter = TestBed.inject(FirestoreAdapter);
  });

  describe('CRUD', () => {
    it('should be succeeded', async () => {
      const path = `examples/0001`;
      await adapter.doc(path).set({hoge: 'fuga'});
      expect((await adapter.doc(path).get()).data()).toEqual({hoge: 'fuga'});

      await adapter.doc(path).update({hoge: 'poga'});
      expect((await adapter.doc(path).get()).data()).toEqual({hoge: 'poga'});

      await adapter.doc(path).delete();
      expect((await adapter.doc(path).get()).data()).toEqual(undefined);
    });
  });

  describe('toFirestoreData()', () => {
    it('should be succeeded', () => {
      const data = adapter.toFirestoreData({createdAt: dayjs()});
      expect(data.createdAt).toBeInstanceOf(admin.firestore.Timestamp);
    });
  });
});
