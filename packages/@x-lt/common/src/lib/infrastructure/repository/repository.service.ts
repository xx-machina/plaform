import { Injectable } from '@nx-ddd/core';
import { NotionRepository } from './notion';
import { FirestoreService } from './firestore';

@Injectable({providedIn: 'root'})
export class RepositoryService {
  constructor(
    public firestore: FirestoreService,
    public notion: NotionRepository,
  ) { }
}
