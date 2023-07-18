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

// Configure app mention to notify user and help.
app.event('app_mention', async ({ event, context, client, say }) => {
    try {
        // Send message to help channel.
        sendMessage(`:mega: Hey <!channel>,  just asked for help in <#${event.channel}>. This is what they said: \n \n ${event.text}`,
            'batcall-dev1',
            'h',
        )
    } catch (error) {
        console.error(error);
        return;
    }

    try {
        // Notify user that they've been heard via DM.
        sendMessage(`Now I'm sending a message to in a different channel`,
            'batcall-dev1',
            'h',
        )
    } catch (error) {
        console.error(error);
    }
});

// Function to get a user's username from their UID.
async function getUsername(uid) {
    try {
        const userInfo = await app.client.users.info({
            user: userId
        });
        return userInfo.user.profile.display_name ? userInfo.user.profile.display_name : userInfo.name;
    } catch (error) {
        console.error(error);
    }
}

// Function for sending any message to any user group in any specificied channel. 
// Pass the channel name for readability.
async function sendMessage(text, channelName, userGroup) {
    const mention = userGroup ? userGroup : null;
    const channelId = channelStore[channelName];
    try {
        const res = await app.client.chat.postMessage({
            token: process.env.SLACK_BOT_TOKEN,
            channel: channelId,
            text: `${text}`
        })
    } catch (error) {
        console.error(error);
    }
}

async function getChannels() {
    let count = 0;
    try {
        console.log('Getting channels');
        // Uses API to get all non-archived channels.
        let result;
        let next_cursor = null;

        // Paginate through all conversations list and store in mapping.
        do {
            result = await app.client.conversations.list({
                token: process.env.SLACK_BOT_TOKEN,
                types: 'public_channel,private_channel,mpim,im',
                exclude_archived: true,
                limit: 1000,
                cursor: next_cursor != null ? next_cursor : null
            });

            result.channels.forEach((channel) => {
                const channelName = channel['name'];
                const channelId = channel['id'];
    
                channelStore[channelName] = channelId;
                count++;
            })
            next_cursor = result.response_metadata.next_cursor;
        } while (result.response_metadata.next_cursor);
    } catch (error) {
        console.error(error);
    }
    console.log(channelStore);
    console.log("There are " + count + " channels");
    console.log(channelStore['batcall-dev']);
}
