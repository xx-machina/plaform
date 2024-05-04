import { Injectable } from "@nx-ddd/core";
import { InfrastructureService } from "@x-x-machina/common/infrastructure";
import { Spec } from "@x-x-machina/common/domain/models";
import { hash } from "@x-x-machina/common/utils";

@Injectable({providedIn: 'root'})
export class SpecService {
  constructor(
    private infra: InfrastructureService,
  ) { }

  async list(): Promise<Spec[]> {
    return this.infra.repositories.spec.list();
  }

  async get(id: string): Promise<Spec> {
    return this.infra.repositories.spec.get(id);
  }

  async create(spec: Spec): Promise<Spec> {
    const project = await this.infra.repositories.project.get('default');
    const embeddings = await this.infra.external.getAiAdapter(project.settings.ai).embedding(spec.input);
    return this.infra.repositories.spec.create({...spec, embeddings, id: hash(spec.input)});
  }

  async update(spec: Partial<Spec>): Promise<void> {
    const project = await this.infra.repositories.project.get('default');
    const embeddings = await this.infra.external.getAiAdapter(project.settings.ai).embedding(spec.input);
    if (spec.id !== hash(spec.input)) throw new Error('id is not match with input hash');
    return this.infra.repositories.spec.update({...spec, embeddings});
  }

  async delete(id: string): Promise<void> {
    return this.infra.repositories.spec.delete(id);
  }

}
