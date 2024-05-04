import { Injectable } from "@nestjs/common";
import { AdminFirestoreAdapter } from "@nx-ddd/firestore/adapters/admin";
import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';


@Injectable()
export class NestFirestoreAdapter extends AdminFirestoreAdapter {
  constructor(nestFirestore: FirebaseFirestoreService) {
    super(nestFirestore.firestore);
  }
}
