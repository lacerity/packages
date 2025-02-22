"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);

// src/error.ts
var WebhookError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "WebhookError";
  }
};
var error_default = WebhookError;

// src/index.ts
var Webhook = class {
  constructor(sendTo, webhookUrl) {
    this.sendTo = "discord";
    this.webhookUrl = "";
    this.user = {};
    this.content = "";
    this.embeds = [];
    this.attachments = [];
    this.components = [];
    if (!sendTo || !webhookUrl) throw new error_default("sendTo and webhookUrl are required but missing.");
    this.sendTo = sendTo;
    this.webhookUrl = webhookUrl;
  }
  setUser({ name, avatar_url }) {
    if (this.sendTo === "discord") {
      if (name) {
        this.user.name = name;
      }
      if (avatar_url) {
        this.user.avatar_url = avatar_url;
      }
      return this;
    }
  }
  setContent(message) {
    if (message) {
      this.content = message;
      return this;
    }
  }
  addEmbed(embedOptions) {
    if (this.sendTo === "discord" && embedOptions) {
      this.embeds = [...this.embeds, embedOptions];
      return this;
    }
  }
  addAttachment(attachmentOptions) {
    if (this.sendTo === "discord") {
      this.attachments = [...this.attachments, attachmentOptions];
      return this;
    } else if (this.sendTo === "slack") {
      this.attachments = [...this.attachments, attachmentOptions];
      return this;
    }
  }
  addComponent(componentOptions) {
    if (this.sendTo === "discord" && componentOptions) {
      this.components = [...this.components, componentOptions];
      return this;
    }
  }
  send() {
    return __async(this, null, function* () {
      const { sendTo, webhookUrl, user, content, embeds, attachments, components } = this;
      if (!sendTo) throw new error_default("`sendTo` is required but missing.");
      if (!webhookUrl) throw new error_default("Discord/Slack Webhook URL is required but missing.");
      if (sendTo === "discord") {
        if (!content && !embeds[0]) throw new error_default("Discord Webhook: Either setContent or addEmbed is required but missing.");
        const payload = {
          username: user.name,
          avatar_url: user.avatar_url,
          content,
          embeds,
          attachments,
          components
        };
        try {
          const res = yield fetch(webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });
          if (!res.ok) {
            throw new error_default("Discord Webhook: Message not sent.");
          }
        } catch (err) {
          throw new error_default("Discord Webhook: Message not sent due to fetch error.");
        }
      } else if (sendTo === "slack") {
        if (!content && !attachments[0]) throw new error_default("Slack Webhook: Either setContent or addAttachment is required but missing.");
        const payload = {
          text: content,
          attachments: attachments.length > 0 ? attachments : void 0
        };
        try {
          const res = yield fetch(webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });
          if (!res.ok) {
            throw new error_default("Slack Webhook: Message not sent.");
          }
        } catch (err) {
          throw new error_default("Slack Webhook: Message not sent due to fetch error.");
        }
      }
    });
  }
  sendError(error) {
    return __async(this, null, function* () {
      var _a, _b;
      let errorMessage = "An Unknown Error Occured.";
      let errorStack = "";
      let errorLocation = "";
      if (error instanceof Error) {
        if (error.message) {
          errorMessage = error.message;
        }
        if (error.stack) {
          errorStack = error.stack;
          const stackLines = error.stack.split("\n");
          if (stackLines.length > 1) {
            const location = stackLines[1].slice(3, stackLines[1].length).trim();
            if (location) {
              errorLocation = location;
            }
          }
        } else {
          errorStack = "No stack trace available.";
        }
      } else {
        errorLocation = "Unknown. Check Error Stack.";
        errorMessage = "Non-Error Object Thrown. Check Error Stack.";
        errorStack = String(error);
      }
      if (this.sendTo === "discord") {
        (_a = this.addEmbed({
          title: "Error",
          description: `
                **Location**
                \`\`\`${errorLocation}\`\`\`
                **Error Message**
                \`\`\`${errorMessage.length > 250 ? errorMessage.substring(0, 245) + "..." : errorMessage}\`\`\`
                **Error Stack**
                \`\`\`${errorStack.length > 2500 ? errorStack.substring(0, 2445) + "..." : errorStack}\`\`\`
                `,
          color: 12067122,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        })) == null ? void 0 : _a.send();
      } else if (this.sendTo === "slack") {
        (_b = this.addAttachment({
          title: "Error",
          text: `
                **Location**
                \`\`\`${errorLocation}\`\`\`
                **Error Message**
                \`\`\`${errorMessage.length > 250 ? errorMessage.substring(0, 245) + "..." : errorMessage}\`\`\`
                **Error Stack**
                \`\`\`${errorStack.length > 2500 ? errorStack.substring(0, 2445) + "..." : errorStack}\`\`\`
                `,
          color: "#B82132",
          ts: Math.floor(Date.now() / 1e3)
        })) == null ? void 0 : _b.send();
      }
    });
  }
};
var index_default = Webhook;
