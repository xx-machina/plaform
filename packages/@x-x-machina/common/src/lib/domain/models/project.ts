export enum AiType {
  OPEN_AI = 'openai',
  AZURE_OPEN_AI = 'azureopenai',
}

export interface OpenAiConfig {
  apiKey: string;
}

export interface AzureOpenAiConfig {
  baseUrl: string;
  token: string;
}

export interface AiConfig {
  type: AiType;
  config: OpenAiConfig | AzureOpenAiConfig;
}

export interface Settings {
  ai: AiConfig;
}

export interface Project {
  id: string;
  settings: Settings;
};
