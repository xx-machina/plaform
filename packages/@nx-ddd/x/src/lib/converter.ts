import { Injectable } from "@angular/core";
import { Tweet } from "./domain/models";

@Injectable({providedIn: 'root'})
export class TweetConverter {
  fromTwitterResponseData(data): Tweet[] {
    return (data.data ?? []).map(tweet => {
      const user = data.includes.users.find(user => user.id === tweet.author_id);
      return Tweet.from({
        id: tweet.id,
        authorId: tweet.author_id,
        author: {
          id: tweet.author_id,
          name: user.name,
          username: user.username,
          description: user.description,
        },
        text: tweet.text,
        liked: tweet.public_metrics.like_count > 0,
      });
    });
  }
}