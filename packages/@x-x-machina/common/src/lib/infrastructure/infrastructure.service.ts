import { Injectable } from "@nx-ddd/core";
import { RepositoriesService } from "./repositories";
import { ExternalService } from "./external";

@Injectable({providedIn: 'root'})
export class InfrastructureService {
  constructor(
    public repositories: RepositoriesService,
    public external: ExternalService,
  ) { }
}
