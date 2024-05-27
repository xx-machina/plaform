// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
const { nodeExternalsPlugin } = require('esbuild-node-externals');

// task config name which is the environment name: [staging, production]
const envName = process.env.NX_TASK_TARGET_CONFIGURATION;
console.debug(`[esbuild.config.ts] envName: ${envName}`);

function resolveEnvfile(envName) {
  switch (envName) {
    case "staging": return "environment.stg.ts";
    case "production": return "environment.prod.ts";
    default: return "environment.ts";
  }
}

// a simple plugin to replace environment source file based on the build environment
const fileReplacementsPlugin = {
  name: "fileReplacements",
  setup(build) {
    build.onLoad(
      { filter: /environments\/environment.ts/, namespace: "file" },
      async (args) => {
        const fileReplacementPath = args.path.replace("environment.ts", resolveEnvfile(envName));
        const fileReplacementContent = fs.readFileSync(fileReplacementPath, "utf8");
        return { contents: fileReplacementContent, loader: "default" };
      }
    );
  },
};

module.exports = {
  // plugins: envName ? [fileReplacementsPlugin] : [],
  bundle: false,
  sourcemap: true,
  outExtension: {
    ".js": ".js",
  },
  external: [],
  plugins: [
    nodeExternalsPlugin()
  ],
};