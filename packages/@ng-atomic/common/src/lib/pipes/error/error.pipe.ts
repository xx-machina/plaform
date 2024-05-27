import { InjectionToken, Pipe, inject, PipeTransform } from "@angular/core";
import { ValidationErrors } from "@angular/forms";

export type ErrorMessageResolver = (errors: ValidationErrors) => string;
export const ERROR_MESSAGE_RESOLVER = new InjectionToken<ErrorMessageResolver>('[@ng-atomic/common] Error message resolver');

export const defaultErrorMessageResolver: ErrorMessageResolver = (errors: ValidationErrors): string => {
  if (!errors) return '';
  const value = Object.entries(errors)[0][0];
  switch (value) {
    case 'required':
      return '必須項目です';
    case 'minlength':
      return `最低${errors[value].requiredLength}文字以上で入力してください`;
    case 'maxlength':
      return `最大${errors[value].requiredLength}文字以下で入力してください`;
    case 'email':
      return 'メールアドレスの形式で入力してください';
    case 'pattern':
      return '半角英数字で入力してください';
    default:
      return '値を確認してください';
  }
};

export function provideErrorMessageResolver(resolver: ErrorMessageResolver) {
  return {provide: ERROR_MESSAGE_RESOLVER, useValue: resolver};
}

@Pipe({
  standalone: true,
  name: 'error',
  pure: true,
})
export class ErrorPipe implements PipeTransform {
  protected resolver = inject(ERROR_MESSAGE_RESOLVER, {optional: true}) ?? defaultErrorMessageResolver;

  transform(errors: ValidationErrors): string {
    return this.resolver(errors);
  }
}
