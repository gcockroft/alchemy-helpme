# slack_batcall
Dev repo for Alchemy customer service Slack bot.

## Latest Behavior

### On app mentions
1. Triggers two messages. 
    1. Sends a message to the hardcoded help channel with the following features.
        - Display name of the requesting user. 
        - Mentioning the help channel with @channel.
        - The channel where the request was made.
    ```js
    `:mega: Hey <!channel>, ${username} just asked for help in <#${event.channel}>. This is what they said: \n \n ${event.text}`
    ```
    2. Sends a direct message to the requesting user. Notifying them that their request was received by the help channel.
    ```js
    `Hi ${username}. I've let our help team know you tagged me, someone will be in touch shortly!`
    ```

CHANGE