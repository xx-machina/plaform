import { CommonModule } from '@angular/common';
import { Firestore } from '@angular/fire/firestore';
import { FirestoreAdapter } from '@nx-ddd/firestore/adapters/base';
import { NxModule } from '@nx-ddd/core';
import { AngularFirestoreAdapter } from './angular-firestore.adapter';

@NxModule({
  imports: [CommonModule],
  providers: [
    {
      provide: FirestoreAdapter,
      useClass: AngularFirestoreAdapter,
    }
  ],
})
export class AngularFirestoreModule {
  static from(firestore: Firestore) {
    return {
      nxModule: AngularFirestoreModule,
      providers: [
        { provide: FirestoreAdapter, useValue: new AngularFirestoreAdapter(firestore) },
      ],
    }
  }
}
