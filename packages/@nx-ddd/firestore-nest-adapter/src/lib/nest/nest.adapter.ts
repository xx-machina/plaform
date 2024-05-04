import { Injectable } from "@nestjs/common";
import { AdminFirestoreAdapter } from "@nx-ddd/firestore/adapters/admin";
import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';


@Injectable()
export class NestFirestoreAdapter extends AdminFirestoreAdapter {
  constructor(private _firestore: FirebaseFirestoreService) {
    super();
  }
  
  protected firestore = this._firestore.firestore;
}
