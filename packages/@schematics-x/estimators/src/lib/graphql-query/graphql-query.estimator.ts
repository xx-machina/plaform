import { Injectable } from "@nx-ddd/core";
import { BaseAdapter } from "@schematics-x/core/adapters";
import { ContextServer } from "@schematics-x/server";
import { Context } from "@machina/common/domain/models";

@Injectable({providedIn: 'root'})
export class GraphqlQueryEstimatorService {
  constructor(
    private server: ContextServer,
    private adapter: BaseAdapter,
  ) { }

  async onInit(): Promise<void> {
    await this.server.onInit();
  }

  async onDestroy(): Promise<void> {
    await this.server.onDestroy();
  }

  async estimate(prompt: string, model: string = 'text-davinci-003'): Promise<{query: string, variables: {}}> {
    const contexts = await this.server.searchContexts(prompt).catch(() => ([] as Context[]));
    const context = contexts.map(context => context.context).slice(0,2).join('\n\n');
    const _prompt = `${context}\nINPUT: ${prompt}\n`
    + `INSTRUCTIONS: Output a Graphql query that satisfies the input instructions.\n`
    + `OUTPUT:\n\`\`\`graphql\n`;
    const complete = await this.adapter.complete(_prompt, {
      model,
      max_tokens: 2048,
      stop: '\n```',
    });
    const query = (_prompt + complete + '\n```').split('```').reverse()
      .find(content => content.startsWith('graphql')).replace('graphql', '');
    
    return {query, variables: {}};
  }
}
