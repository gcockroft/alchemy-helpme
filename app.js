const { App } = require('@slack/bolt');

// Initialize app with the bot token and signing secret.
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
    port: process.env.PORT || 3000
});

app.message('!help', async ({ message, client, say }) => {
    client.chat.postMessage({
        token: SLACK_BOT_TOKEN,
        channel: ""
    })
    await say({
        // Takes value that is an object containing blocks and text.
        // blocks makes text the fallback for notifications and accessibility. 
        text: `Hey there <@${message.user}!`
    });
});

// app.action('button_click', async ({ body, ack, say }) => {
//     // Acknowledge the action.
//     await ack();
//     await say(`<@${body.user.id}> clicked the button`);
// });

(async () => {
    // Start app
    await app.start(process.env.PORT || 3000);
    console.log('Bolt app is running!');
})();

