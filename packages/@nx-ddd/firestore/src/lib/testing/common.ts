import admin from 'firebase-admin';
import dayjs from 'dayjs';
import { AdminFirestoreAdapter } from '../adapters/admin';
import axios from 'axios';

export const testAdapterFactory = () => new AdminFirestoreAdapter();

export const timestampFactory = (dt: dayjs.Dayjs) => {
  return admin.firestore.Timestamp.fromDate(dt.toDate());
};

export function initializeTest(projectId: string = 'nx-ddd') {
  process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';
  admin.initializeApp({projectId});
  return testAdapterFactory();
}

export async function clearFirestoreData(projectId: string = 'nx-ddd') {
  await axios.delete(`http://127.0.0.1:8080/emulator/v1/projects/${projectId}/databases/(default)/documents`);
}
