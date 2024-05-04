import { Injectable } from "@nx-ddd/core";
import { OperatorRepository } from './operator';
import { SpecRepository } from './spec';
import { SystemRepository } from './system';
import { ProjectRepository } from "./project";

@Injectable({providedIn: 'root'})
export class RepositoriesService {

  constructor(
    public operator: OperatorRepository,
    public project: ProjectRepository,
    public spec: SpecRepository,
    public system: SystemRepository
  ) { }

}
