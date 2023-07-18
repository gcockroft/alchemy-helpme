const { App } = require('@slack/bolt');

let channelStore = {};

const app = new App({
    token: process.env.SLACK_BOT_TOKEN, 
    appToken: process.env.SLACK_APP_TOKEN,
    signingSecret: process.env.signingSecret,
    socketMode: true,
});


// Starts app.
(async () => {
    await app.start();
    console.log('⚡️ Bolt app started');
    getChannels();
})();

// Notify user and help channel on app mention.
app.event('app_mention', async ({ event, context, client, say }) => {
    const channelId = channelStore['batcall-dev1'];
    const uid = event.user;
    const username = await getUsername(uid);
    try {
        // Send message to help channel.
        sendMessage(`:mega: Hey <!channel>, ${username} just asked for help in <#${event.channel}>. This is what they said: \n \n ${event.text}`,
            channelId);
    } catch (error) {
        console.error(error);
        return;
    }

    try {
        // Notify user that they've been heard via DM.
        sendDirect(`Hi ${username}. I've let our help team know you tagged me, someone will be in touch shortly!`, uid);
    } catch (error) {
        console.error(error);
    }
});

// Open a DM conversation and send a direct message to user.
async function sendDirect(text, uid) {
    try {
        const conversation = await app.client.conversations.open({
            token: process.env.SLACK_BOT_TOKEN,
            users: uid,
        });
        sendMessage(text, conversation.channel.id);
    } catch (error) {
        console.error(error);
    }

}

// Get a user's username from their UID.
async function getUsername(uid) {
    try {
        const userInfo = await app.client.users.info({
            user: uid
        });
        return userInfo.user.profile.display_name ? userInfo.user.profile.display_name : userInfo.name;
    } catch (error) {
        console.error(error);
    }
}

// Send any message to any specified channel. 
async function sendMessage(text, channelId) {
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

// Get all channels in the workspace into a mapping for future operations.
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
    console.log("There are " + count + " channels");
}
