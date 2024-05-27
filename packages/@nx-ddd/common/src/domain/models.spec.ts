import 'reflect-metadata';
import { Domain, getAnnotations, getLangMap, getModelName } from './models';

@Domain.Entity({name: 'プロフィール'})
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

describe('Models', () => {
  describe('getAnnotations()', () => {
    it('should be succeeded', () => {
      const annotations = getAnnotations(User);
      expect(annotations).toHaveLength(5);
    });
  });

  describe('getLangMap()', () => {
    expect(getLangMap(User)).toEqual({
      id: 'ID',
      'profile.name': '名前',
      'profile.email': 'メールアドレス',
      createdAt: '作成日時',
      updatedAt: '更新日時',
    });
  });

  describe('getModelName()', () => {
    expect(getModelName(User)).toEqual('ユーザー');
  })
});
