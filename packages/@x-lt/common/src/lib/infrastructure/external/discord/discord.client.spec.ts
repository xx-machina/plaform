import { TestBed } from '@nx-ddd/core';
import { DiscordClient, DISCORD_ACCESS_TOKEN, DISCORD_CONFIG } from './discord.client';
import { DiscordModule } from './discord.module';
jest.setTimeout(50_000);

describe('DiscordClient', () => {
  let client: DiscordClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        DiscordModule,
      ],
      providers: [
        { provide: DISCORD_CONFIG, useValue: {webhookUrl: '', mention: '' } },
        { provide: DISCORD_ACCESS_TOKEN, useValue: '' },
      ],
    });
    client = TestBed.inject(DiscordClient);

    // jest.useFakeTimers();
  });

  it('should be created', async () => {
    // await discord.getMessage();
    // await new Promise((resolve) => setTimeout(() => resolve(null), 100));

    expect(client).toBeTruthy();
  });

  describe('sendMessage', () => {

    xit ('', async () => {
      await client.login();
      await client.sendMessage('700764551427391528', 'test');
    })
  })
});