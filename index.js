const { Client } = require("discord.js");
const { DisTube } = require("distube");
const { YtDlpPlugin } = require("@distube/yt-dlp");

const client = new Client({ intents: ["GUILDS", "GUILD_VOICE_STATES"] });
client.config = require(`./config/bot`);
client.player = new DisTube(client, { leaveOnStop: false, leaveOnEmpty: false, youtubeDL: false, plugins: [ new YtDlpPlugin() ] });

client.on("ready", async client => {
  const channel = await client.channels.cache.get(client.config.voice);
  if (channel) {
    setInterval(async () => {
      const queue = await client.player.getQueue(channel.guild.id);
      if (queue) {
        if (queue.playing) return;
        if (queue.paused) return await queue.resume();
      } else if (!queue) {
        await client.player.play(channel, client.config.lofi, { textChannel: client.config.textchannel });
      }
    }, 10000);
  }
});

client.login(client.config.token);
require("http").createServer((_, res) => res.end("Uptime!")).listen(3000)
