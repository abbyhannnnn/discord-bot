import { Client, Events, GatewayIntentBits, Message } from "discord.js";

const token = process.env.DISCORD_TOKEN;

if (!token) {
  console.error("DISCORD_TOKEN environment variable is required.");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

const channelMessageCounts = new Map<string, number>();

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Discord bot is ready! Logged in as ${readyClient.user.tag}`);
  console.log(`Bot client ID: ${readyClient.user.id}`);
  console.log("Watching for every 15th message in each channel...");
});

client.on(Events.MessageCreate, async (message: Message) => {
  if (message.author.bot) return;

  const channelId = message.channelId;

  const current = channelMessageCounts.get(channelId) ?? 0;
  const next = current + 1;

  channelMessageCounts.set(channelId, next);

  console.log(`[${channelId}] Message count: ${next}`);

  if (next % 15 === 0) {
    try {
      await message.channel.send("Have you been talking to Joseph?");
      console.log(`[${channelId}] Sent Joseph reminder at message #${next}`);
    } catch (err) {
      console.error(`[${channelId}] Failed to send message:`, err);
    }
  }
});

client.login(token);
