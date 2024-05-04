import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireFirestoreAdapter } from './angularfire';

@NgModule({
  imports: [CommonModule],
  providers: [AngularFireFirestoreAdapter],
})
export class FirestoreAngularAdapterModule {}
