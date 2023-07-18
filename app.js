const { App } = require('@slack/bolt');

let channelStore = {};

const app = new App({
    token: process.env.SLACK_BOT_TOKEN, 
    appToken: process.env.SLACK_APP_TOKEN,
    signingSecret: process.env.signingSecret,
    socketMode: true,
});

(async () => {
    await app.start();
    console.log('⚡️ Bolt app started');
    getChannels();
})();

// subscribe to 'app_mention' event in your App config
// need app_mentions:read and chat:write scopes
app.event('app_mention', async ({ event, context, client, say }) => {
    console.log('mentioned');
    try {
        sendMessage(`Now I'm sending a message to <@${event.user}> in a different channel`,
            'dev-batcall1',
            'h',
        )
    } catch (error) {
        console.error(error);
    }
});

async function getChannels() {
    try {
        console.log('Getting channels');
        // Uses API to get all non-archived channels. 
        const result = await app.client.conversations.list({
            token: process.env.SLACK_BOT_TOKEN,
            type: 'public,private,mpim,im',
            exclude_archived: true
        });

        // Store in mapping of channel name -> ID.
        result.channels.forEach((channel) => {
            const channelName = channel['name'];
            const channelId = channel['id'];

            channelStore[channelName] = channelId;
        })
    } catch (error) {
        console.error(error);
    }
}

// Function for sending any message to any user group in any specificied channel. 
// Pass the channel name for readability.
async function sendMessage(text, channelName, userGroup) {
    const channelId = channelStore[channelName];
    try {
        const res = await app.client.chat.postMessage({
            channel: channelId,
            text: `${text}`
        })
    } catch (error) {
        console.error(error);
    }
}
