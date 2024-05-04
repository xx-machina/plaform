import { Injectable } from "@nx-ddd/core";
import { Project } from "@x-x-machina/common/domain/models";
import { InfrastructureService } from "@x-x-machina/common/infrastructure";


@Injectable({providedIn: 'root'})
export class ProjectService {
  constructor(
    private infra: InfrastructureService,
  ) { }

  async list(): Promise<Project[]> {
    return await this.infra.repositories.project.list() as Project[];
  }

  async get(projectId: string): Promise<Project> {
    return this.infra.repositories.project.get(projectId);
  }

  async create(project: Project): Promise<Project> {
    return this.infra.repositories.project.create(project);
  }

  async update(project: Project): Promise<void> {
    return this.infra.repositories.project.update(project);
  }
}
