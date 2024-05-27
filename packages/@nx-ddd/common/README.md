# NxDDD Common
`@nx-ddd/common` is a library used for domain model annotations and related functionalities.

## Install
```sh
$ npm i @nx-ddd/common
```

## Usage

```ts
import { Domain, getAnnotations, getLangMap, getModelName } from './models';

@Domain.Entity({name: 'Profile'})
class Profile {
  @Domain.Lang('名前') name: string;
  @Domain.Lang('メールアドレス') email: string;
}

@Domain.Entity({name: 'ユーザー'})
class User {
  @Domain.Lang('ID') id: string;
  @Domain.Type() profile: Profile;
  @Domain.Lang('作成日時') createdAt: Date;
  @Domain.Lang('更新日時') updatedAt: Date;
}

getLangMap(User);
/**
-> {
  id: 'ID',
  'profile.name': '名前',
  'profile.email': 'メールアドレス',
  createdAt: '作成日時',
  updatedAt: '更新日時',
}
 * */

getModelName(User) // -> 'ユーザー'
```
