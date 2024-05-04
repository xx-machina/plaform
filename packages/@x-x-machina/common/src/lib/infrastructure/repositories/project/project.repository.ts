import { Injectable } from "@nx-ddd/core";
import { Converter, RedisRepository } from '../../redis';
import { Project } from "@x-x-machina/common/domain/models";

export class ProjectConverter extends Converter<Project, {id: string, settings: string}> {
  fromRedis(record: { id: string; settings: string; }): Project {
    return {
      id: record.id,
      settings: JSON.parse(record.settings),
    };
  }

  toRedis(entity: Project): { id: string; settings: string; } {
    return {
      id: entity.id,
      settings: JSON.stringify(entity.settings),
    };
  }
}

@Injectable({providedIn: 'root'})
export class ProjectRepository extends RedisRepository<Project> {
  protected entityName: string = 'project';
  protected converter = new ProjectConverter();
}
