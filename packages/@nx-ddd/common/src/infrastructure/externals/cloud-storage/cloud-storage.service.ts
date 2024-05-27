import { inject, signal, Injectable } from '@angular/core';
import { Storage, UploadTask, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({providedIn: 'any'})
export class CloudStorageService {
  private storage = inject(Storage);
  private task = signal<UploadTask | null>(null);
  private task$ = toObservable(this.task);

  readonly progress = toSignal(this.task$.pipe(
    switchMap(task => task ? this.convertToObservable(task) : of(null)),
    // tap(progress => this.store.updateTaskProgress('default', progress)),
  ));
  readonly progress$ = toObservable(this.progress);

  getDownloadUrl(filePath: string) {
    return getDownloadURL(ref(this.storage, filePath));
  }

  private convertToObservable(task: UploadTask): Observable<number | null> {
    return new Observable<number | null>(sub => {
      task.on('state_changed', snapshot => sub.next(snapshot.bytesTransferred / snapshot.totalBytes * 100));
      task.then(() => (sub.next(null), sub.complete()));
    });
  }

  upload(path: string, file: File) {
    this.cancel();
    const storageRef = ref(this.storage, path);
    const task = uploadBytesResumable(storageRef, file);
    this.task.set(task);
    return task;
  }

  cancel() {
    this.task()?.cancel();
    this.task.set(null);
  }
}
