import { Injectable } from "@nx-ddd/core";
import { Role } from "@schematics-x/core/adapters/base";
import { InfrastructureService } from "@x-x-machina/common/infrastructure";
import { AssistantOperator } from "@x-x-machina/common/domain/models";
import { hash } from "@x-x-machina/common/utils";


@Injectable({providedIn: 'root'})
export class AssistantService {
  constructor(
    private infra: InfrastructureService,
  ) { }

  async list(): Promise<AssistantOperator[]> {
    return await this.infra.repositories.operator.list() as AssistantOperator[];
  }

  async create(assistant: AssistantOperator): Promise<AssistantOperator> {
    return this.infra.repositories.operator.create(assistant) as any;
  }

  async update(assistant: AssistantOperator): Promise<void> {
    return this.infra.repositories.operator.update(assistant);
  }

  async delete(assistantid: string): Promise<void> {
    return this.infra.repositories.operator.delete(assistantid);
  }

  async operate(assistantId: string, input: string): Promise<string> {
    const project = await this.infra.repositories.project.get('default');
    const assistant = await this.infra.repositories.operator.get(assistantId);
    const adapter = this.infra.external.getAiAdapter(project.settings.ai)
    const embeddings = await adapter.embedding(input);
    const specs = await this.infra.repositories.spec.search(assistant.id, embeddings);

    const messages = [
      {role: Role.SYSTEM, content: assistant.description},
      ...specs.map(spec => [
        {role: Role.USER, content: spec.input},
        {role: Role.ASSISTANT, content: spec.output},
      ]).flat(),
      {role: Role.USER, content: input},
    ];

    console.debug('messages', messages);
    const output_ = await adapter.chatComplete(messages);
    const output = this.scrape(assistant.outputInterfaceId, output_);
    await this.infra.repositories.spec.create({
      input, output, embeddings, id: hash(input), operatorId: assistant.id,
    }).catch(() => {});

    return output;
  }

  private scrape(interface_: string, output: string): string {
    if (interface_ === 'interface:codeblock') {
      const [_, ...lines] = (output.split('```')?.[1] ?? '').split('\n');
      return `\`\`\`\n${lines.join('\n')}\n\`\`\``;
    } else {
      return output;
    }
  }

}
