export interface Context {
  id: string;
  instructions: string;
  context: string;
  embedding?: number[];
  score?: number;
}
