import { Injectable } from "@nx-ddd/core";
import { AssistantService } from "./assistant";
import { SpecService } from "./spec";
import { ProjectService } from "./project";

@Injectable({providedIn: 'root'})
export class UsecaseService {
  constructor(
    public assistant: AssistantService,
    public project: ProjectService,
    public spec: SpecService,
  ) { }
}
