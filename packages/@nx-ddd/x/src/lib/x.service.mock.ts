import { Injectable } from "@nx-ddd/core";
import { TwitterApi } from "twitter-api-v2";
import { XServiceImpl } from "./x.service.impl";

@Injectable()
export class MockXService extends XServiceImpl {
  async reply(client: TwitterApi, tweetId: string, text: string): Promise<void> {
    console.log('MockXService.reply() is called!');
  }

  async sendDirectMessage(client: TwitterApi, recipientId: string, text: string): Promise<any> {
    console.log('MockXService.sendDirectMessage() is called!');
  }
}
