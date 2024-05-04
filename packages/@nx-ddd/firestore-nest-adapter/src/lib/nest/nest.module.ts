import { Module } from "@nestjs/common";
import { FirebaseAdminModule } from '@aginix/nestjs-firebase-admin';
import { NestFirestoreAdapter } from "./nest.adapter";

@Module({
  providers: [NestFirestoreAdapter],
  exports: [NestFirestoreAdapter],
})
export class FirestoreAdapterModule {
  static forRoot(options) {
    return {
      module: FirestoreAdapterModule,
      imports: [
        FirebaseAdminModule.forRoot(options)
      ],
    };
  }
}
