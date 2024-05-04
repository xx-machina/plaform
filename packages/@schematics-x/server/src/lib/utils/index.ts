export function float32Buffer(arr: number[]) {
  return Buffer.from(new Float32Array(arr).buffer);
}

export function _bufferFloat32(buffer: Buffer): Float32Array {
  return new Float32Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / Float32Array.BYTES_PER_ELEMENT);
}

export function bufferFloat32(buffer: Buffer): number[] {
  return Array.from(_bufferFloat32(buffer));
}


export function float64Buffer(arr: number[]) {
  return Buffer.from(new Float64Array(arr).buffer);
}

export function _bufferFloat64(buffer: Buffer): Float64Array {
  return new Float64Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / Float64Array.BYTES_PER_ELEMENT);
}


export function bufferFloat64(buffer: Buffer): number[] {
  return Array.from(_bufferFloat64(buffer));
}
