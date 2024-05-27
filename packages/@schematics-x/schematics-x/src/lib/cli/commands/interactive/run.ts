import { bootstrap } from "@nx-ddd/core";
import { InteractiveCommand } from "./interactive.command";
import { DEBUG } from "../../workflow-runner/handlers";

async function main() {
  const injector = await bootstrap([
      // ...GlobalProvidersManager.providers,
      { provide: DEBUG, useValue: true },
      // { provide: SuggestService, useValue: {} },
  ]);
  await injector.get(InteractiveCommand).action();
}

if (require.main === module) {
  main().then(() => process.exit());
}
