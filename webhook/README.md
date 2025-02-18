# Webhook
Send errors or custom embeds to Discord/Slack through webhooks easily.

## Install
```bash
npm i @lacerity/webook
```

## Import
- JavaScript
```js
const Webhook = require("@lacerity/webhook");
```

- TypeScript
```ts
import Webhook from "@lacerity/webhook";
```

## Discord or Slack Webhook

### Define the webhook
```ts
// discord webhook
const DiscordWebhook = new Webook("discord", "DISCORD_WEBHOOK_URL");
// slack webhook
const SlackWebhook = new Webook("slack", "SLACK_WEBHOOK_URL");
```

### Sending errors through webhook
```ts
try {
    // try something
} catch(error) {
    // send error
    DiscordWebhook.sendError(error); // typeof error can be Error or unknown
}
```

### Send Custom Embeds
- Documentation coming soon...

