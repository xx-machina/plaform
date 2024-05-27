# Schematics X

A generic code generator using [Schematics](https://www.npmjs.com/package/@angular-devkit/schematics) and GPT-4o.

![demo_gif](https://github.com/nontangent/ng-atomic/blob/main/ng-atomic/schematics-x/demo.gif?raw=true)


## Setup
Get Open AI API Access Token via https://platform.openai.com/api-keys

```sh
$ ng add schematics-x
$ export OPENAI_API_KEY=<OPENAI_API_KEY>
```

## Usage
```sh
$ ng g x pages/community
ESTIMATING /src/app/pages/community/community.page.css FROM [
  '/src/app/pages/profile/profile.page.css',
  '/src/app/pages/user/user.page.css'
] BY "Generate a directory `pages/community`."
ESTIMATING /src/app/pages/community/community.page.spec.ts FROM [
  '/src/app/pages/profile/profile.page.spec.ts',
  '/src/app/pages/user/user.page.spec.ts'
] BY "Generate a directory `pages/community`."
ESTIMATING /src/app/pages/community/community.page.ts FROM [
  '/src/app/pages/profile/profile.page.ts',
  '/src/app/pages/user/user.page.ts'
] BY "Generate a directory `pages/community`."
CREATE src/app/pages/community/community.page.css (0 bytes)
CREATE src/app/pages/community/community.page.spec.ts (581 bytes)
CREATE src/app/pages/community/community.page.ts (279 bytes)
```

## Demo

[StackBlitz](https://stackblitz.com/~/github.com/nontangent/schematics-x-demo)

## LICENSE

MIT
