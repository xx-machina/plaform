import { OpenAiServiceImpl } from '../openai/open-ai.service.impl';
import { targetConstructorToSchema } from "class-validator-jsonschema";
import { ChatCompletionMessageParam, FunctionParameters,  } from "openai/resources";
import { FunctionTool } from "openai/resources/beta/assistants";
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions";

const AI_TOOLS = '[ai-tools]' as const;
const AI_SYSTEM = '[ai-system]' as const;

export function addTool(obj: object, tool: object) {
  obj[AI_TOOLS] = obj[AI_TOOLS] ?? [];
  obj[AI_TOOLS].push(tool);
  return obj;
}

export function getTools(obj: object): any[] {
  return obj[AI_TOOLS] ?? [];
}

function buildFunctionTool(params: {
  name: string,
  description: string,
  parameters: FunctionParameters,
}): FunctionTool {
  return {
    type: 'function',
    function: {
      name: params.name,
      description: params.description,
      parameters: params.parameters,
    },
  }
}

export function buildToolFromSchema(name: string, description: string, schema: Function): FunctionTool {
  const parameters = targetConstructorToSchema(schema) as FunctionParameters;
  return buildFunctionTool({ name, description, parameters });
}

export function AiFunction(params?: {description?: string}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // 引数の型を取得
    const args = Reflect.getMetadata('design:paramtypes', target, propertyKey);
    const tool = buildToolFromSchema(propertyKey, params?.description ?? '', args[0]);
    addTool(target, tool);
    return descriptor;
  };
}

export interface AiSystemConfig {
  model?: ChatCompletionCreateParamsBase['model'];
  instructions?: string;
  shots?: {input: string, output: string}[];
}

export function setAiSystemConfig(obj: object, config: AiSystemConfig) {
  obj[AI_SYSTEM] = config;
  return obj;
}

export function getAiSystemConfig(obj: object): AiSystemConfig {
  return obj[AI_SYSTEM] as AiSystemConfig;
}

export function AiSystem({
  model = 'gpt-4-1106-preview',
  instructions = ``,
  shots = [],
}: AiSystemConfig) {
  return function (target: any) {
    setAiSystemConfig(target, {model, instructions, shots});
    return target;
  };
}

export class AiToolsAgent {
  constructor (protected openai: OpenAiServiceImpl) { }
  
  messages: ChatCompletionMessageParam[] = [
    { role: 'system' as const, content: '' },
  ];

  results: any[] = [];

  get tools() {
    return getTools(this.constructor);
  }

  get config() {
    return getAiSystemConfig(this.constructor);
  }

  async completion(tools: any[] = this.tools) {
    const message = await this.openai.chat.completions.create({
      model: this.config.model,
      messages: this.messages,
      tools,
    });
    for (const call of message.choices?.[0]?.message?.tool_calls ?? []) {
      if (call.type === 'function') {
        console.debug('call.function.name:', call.function.name);
        const result = this[call.function.name]?.(JSON.parse(call.function.arguments));
        this.results.push(result);
      }
    }
  }

  async execute<T=any>(message: string, options: {tools?: any[]} = {}): Promise<T> {
    this.messages.push({role: 'user', content: message});
    await this.completion(options.tools);
    return this.results.at(-1) as any;
  }
}

export class AnyFunction {
  constructor(private openai: OpenAiServiceImpl) { }

  async call<I, T>(_input: I, args: {new (): T}, {
    instructions = '',
    model = 'gpt-4o',
    specs = [],
  }: {
    instructions?: string,
    model?: string,
    specs?: { input: I, output: T }[],
  } = {}): Promise<T> {
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: instructions ?? '' },
      ...(this.convertToChatMessages(specs)),
      { role: 'user', content: this.parseInput(_input) },
    ];
    const res = await this.openai.chat.completions.create({
      model,
      messages,
      tools: [
        buildToolFromSchema('function', '', args),
      ],
      tool_choice: {
        type: 'function',
        function: {
          name: 'function'
        }
      },
    });

    return JSON.parse(res.choices[0].message.tool_calls[0].function.arguments);
  }

  private convertToChatMessages(specs: {
    input: any;
    output: any;
  }[]): {role: 'assistant' | 'user', content: string}[] {
    return specs.map(({ input, output }) => {
      return [
        { role: 'user', content: this.parseInput(input) },
        { role: 'assistant', content: JSON.stringify(output) },
      ];
    }).flat() as {role: 'assistant' | 'user', content: string}[];
  }

  private parseInput(input: any) {
    return typeof input === 'string' ? input : JSON.stringify(input);
  }
}
