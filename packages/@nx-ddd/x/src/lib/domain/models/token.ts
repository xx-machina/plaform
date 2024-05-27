import { IsDayjs } from "@nx-ddd/core/util/class-validators";
import { Firestore } from "@nx-ddd/firestore/decorators";
import { IsString, validateSync } from "class-validator";
import dayjs from 'dayjs';

export class TwitterToken {
  @Firestore.String() @IsString() token_type: string;
  @Firestore.String() @IsString() access_token: string;
  @Firestore.String() @IsString() scope: string;
  @Firestore.String() @IsString() refresh_token: string;
  @Firestore.Timestamp() @IsDayjs() expires_at: dayjs.Dayjs;

  static validate(token?: Partial<TwitterToken>) {
    return validateSync(Object.assign(new TwitterToken(), token));
  }
}
