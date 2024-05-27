import { Injector } from '@angular/core';
import { Command as Program } from 'commander';

export interface Command {
  name: string;
  load: () => Promise<(program: any, injector: any) => void>;
}

export async function registerCommands(commands: Command[], injector: Injector, program: Program = new Program()) {
  for (const command of commands) {
    await command.load().then(register => register(program.command(command.name), injector));
  }
  return program;
}