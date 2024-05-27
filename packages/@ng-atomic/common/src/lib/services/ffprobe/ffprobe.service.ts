import { Injectable } from '@angular/core';
import { FFprobeWorker, FileInfo } from "ffprobe-wasm";

@Injectable({
  providedIn: 'root'
})
export class FfprobeService {
  private worker = new FFprobeWorker();

  constructor() { }

  async getFileInfo(blob: File | Blob): Promise<FileInfo> {
    // Blob適当な名前でFileに変換
    const file = new File([blob], 'test.webm');
    return this.worker.getFileInfo(file);
  }
}
