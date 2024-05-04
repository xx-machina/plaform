import { Injectable } from "@nx-ddd/core";
import { CommunityRepository } from "./community";
import { MessageEventRepository } from "./message-event";

@Injectable({providedIn: 'root'})
export class FirestoreService {
  constructor(
    public community: CommunityRepository,
    public messageEvent: MessageEventRepository,
  ) { }
}
