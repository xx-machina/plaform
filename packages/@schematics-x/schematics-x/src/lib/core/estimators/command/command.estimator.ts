import { inject, Injectable } from "@angular/core";
import { parseJsonFuzzy } from "../../helpers";
import { buildInputJson, buildOutputEntry, Instructor } from "../../instructor";

@Injectable({providedIn: 'root'})
export class CommandEstimator {
  private instructor = inject(Instructor);

  async estimate(history: string[], prompt: string): Promise<string[]> {
    const inputs = [buildInputJson(history)];
    const expected = [
      buildOutputEntry(`[\n\t"${prompt}`, 'output.json'),
    ];
    const outputs = await this.instructor.instruct(inputs, BUILD_INSTRUCTIONS(prompt), expected, undefined, {
      model: 'text-babbage-001',
    });
    const output = outputs.find((output) => output.path === 'output.json');
    return parseJsonFuzzy(output.content.toString());
  }
}

const BUILD_INSTRUCTIONS = (prompt) => {
  return `Estimate 5 commands starting with "${prompt}" and output them as a json array.`;
}
