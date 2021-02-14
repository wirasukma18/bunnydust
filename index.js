const { Autohook } = require('twitter-autohook');
const util = require('util');
const request = require('request');
const http = require('http');

const post = util.promisify(request.post);

// set api keys from environment variables
const oAuthConfig = {
    token: (process.env.TWITTER_ACCESS_TOKEN || ''),
    token_secret: (process.env.TWITTER_ACCESS_TOKEN_SECRET || ''),
    consumer_key: (process.env.TWITTER_CONSUMER_KEY || ''),
    consumer_secret: (process.env.TWITTER_CONSUMER_SECRET || ''),
    env: (process.env.TWITTER_WEBHOOK_ENV || ''),
    port: 5000
};


(async start => {
    try {
        const webhook = new Autohook(oAuthConfig);

        // Removes existing webhooks
        await webhook.removeWebhooks();

        // Starts a server and adds a new webhook
        await webhook.start();

        webhook.on('event', async event => {
            if (event.direct_message_events) {
                await sayHi(event);
            }
        });

        // Subscribes to your own user's activity
        await webhook.subscribe({ oauth_token: oAuthConfig.oauth_token, oauth_token_secret: oAuthConfig.oauth_token_secret });
    } catch (e) {
        // Display the error and quit
        console.error(e);
        if (e.name === 'RateLimitError') {
            await sleep(e.resetAt - new Date().getTime());
            process.exit(1);
        }
    }
})();

let sayHi = async(event) => {
    if (!event.direct_message_events) {
        return;
    }

    // Messages are wrapped in an array, so we'll extract the first element
    const message = event.direct_message_events.shift();

    // We check that the message is valid
    if (typeof message === 'undefined' || typeof message.message_create === 'undefined') {
        return;
    }

    // We filter out message you send, to avoid an infinite loop
    if (message.message_create.sender_id === message.message_create.target.recipient_id) {
        return;
    }
    // mark received message as seen
    await markAsRead(message.message_create.id, message.message_create.sender_id, oAuthConfig);
    // show typing effect
    await indicateTyping(message.message_create.sender_id, oAuthConfig);
    // username of the sender
    const senderScreenName = event.users[message.message_create.sender_id].screen_name;
    // send message
    await sendMessage(message.message_create.sender_id, `Hi @${senderScreenName}! 👋`)
}

// send message function
let sendMessage = async(recipient, message) => {
    const requestConfig = {
        url: 'https://api.twitter.com/1.1/direct_messages/events/new.json',
        oauth: oAuthConfig,
        json: {
            event: {
                type: 'message_create',
                message_create: {
                    target: {
                        recipient_id: recipient,
                    },
                    message_data: {
                        text: message,
                    },
                },
            },
        },
    };
    await post(requestConfig)
}

let indicateTyping = async(senderId, auth) => {
    const requestConfig = {
        url: 'https://api.twitter.com/1.1/direct_messages/indicate_typing.json',
        form: {
            recipient_id: senderId,
        },
        oauth: auth,
    };

    await post(requestConfig);
}

let markAsRead = async(messageId, senderId, auth) => {
    const requestConfig = {
        url: 'https://api.twitter.com/1.1/direct_messages/mark_read.json',
        form: {
            last_read_event_id: messageId,
            recipient_id: senderId,
        },
        oauth: auth,
    };

    await post(requestConfig);
}
