import WebhookError from "./error";
import { Attachment, DiscordComponent, DiscordEmbed, WebhookUser } from "./types";

class Webhook {
    private sendTo: "discord" | "slack" = "discord";
    private webhookUrl: string = "";
    private user: WebhookUser = {};
    private content: string = "";
    private embeds: DiscordEmbed[] = [];
    private attachments: Attachment[] = [];
    private components: DiscordComponent[] = [];

    constructor(sendTo: "discord" | "slack", webhookUrl: string) {
        if (!sendTo || !webhookUrl) throw new WebhookError("sendTo and webhookUrl are required but missing.");
        this.sendTo = sendTo;
        this.webhookUrl = webhookUrl;
    }

    setUser({ name, avatar_url }: { name?: string, avatar_url?: string }) {
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

    setContent(message: string) {
        if (message) {
            this.content = message;
            return this;
        }
    }

    addEmbed(embedOptions: DiscordEmbed) {
        if (this.sendTo === "discord" && embedOptions) {
            this.embeds = [...this.embeds, embedOptions];
            return this;
        }
    }

    addAttachment(attachmentOptions: Attachment) {
        if (this.sendTo === "discord") {
            this.attachments = [...this.attachments, attachmentOptions];
            return this;
        }
        else if (this.sendTo === "slack") {
            this.attachments = [...this.attachments, attachmentOptions];
            return this;
        }
    }

    addComponent(componentOptions: DiscordComponent) {
        if (this.sendTo === "discord" && componentOptions) {
            this.components = [...this.components, componentOptions];
            return this;
        }
    }

    async send() {
        const { sendTo, webhookUrl, user, content, embeds, attachments, components } = this;
        if (!sendTo) throw new WebhookError("`sendTo` is required but missing.");
        if (!webhookUrl) throw new WebhookError("Discord/Slack Webhook URL is required but missing.");

        if (sendTo === "discord") {
            if (!content && !embeds[0]) throw new WebhookError("Discord Webhook: Either setContent or addEmbed is required but missing.");

            const payload = {
                username: user.name,
                avatar_url: user.avatar_url,
                content,
                embeds,
                attachments,
                components
            };

            try {
                const res = await fetch(webhookUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                if (!res.ok) {
                    // console.error("discord-webhook-response:", res);
                    throw new WebhookError("Discord Webhook: Message not sent.");
                }
            }
            catch (err) {
                // console.error("discord-webhook-error:", err);
                throw new WebhookError("Discord Webhook: Message not sent due to fetch error.");
            }
        }
        else if (sendTo === "slack") {
            if (!content && !attachments[0]) throw new WebhookError("Slack Webhook: Either setContent or addAttachment is required but missing.");

            const payload = {
                text: content,
                attachments: attachments.length > 0 ? attachments : undefined
            };

            try {
                const res = await fetch(webhookUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                if (!res.ok) {
                    // console.error("discord-webhook-response:", res);
                    throw new WebhookError("Slack Webhook: Message not sent.");
                }
            }
            catch (err) {
                // console.error("discord-webhook-error:", err);
                throw new WebhookError("Slack Webhook: Message not sent due to fetch error.");
            }
        }
    }

    async sendError(error: unknown) {
        let errorMessage = "An Unknown Error Occured.";
        let errorStack = "";
        let errorLocation = "";

        if (error instanceof Error) {
            // If it's an instance of Error, use its message and stack
            if (error.message) {
                errorMessage = error.message;
            }
            if (error.stack) {
                errorStack = error.stack;

                const stackLines = error.stack.split("\n");

                if (stackLines.length > 1) {
                    // Get the second line of the stack trace which usually contains the file name and line number
                    const location = stackLines[1].slice(3, stackLines[1].length).trim();

                    if (location) {
                        errorLocation = location;
                    }
                }
            } else {
                errorStack = "No stack trace available."
            }
        } else {
            // If it's not an instance of Error, just send a generic message
            errorLocation = "Unknown. Check Error Stack."
            errorMessage = "Non-Error Object Thrown. Check Error Stack.";
            errorStack = String(error);
        }

        if (this.sendTo === "discord") {
            this.addEmbed({
                title: "Error",
                description: `
                **Location**
                \`\`\`${errorLocation}\`\`\`
                **Error Message**
                \`\`\`${errorMessage.length > 250 ? errorMessage.substring(0, 245) + "..." : errorMessage}\`\`\`
                **Error Stack**
                \`\`\`${errorStack.length > 2500 ? errorStack.substring(0, 2445) + "..." : errorStack}\`\`\`
                `,
                color: 0xB82132,
                timestamp: new Date().toISOString()
            })?.send();
        }
        else if (this.sendTo === "slack") {
            this.addAttachment({
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
                ts: Math.floor(Date.now() / 1000)
            })?.send();
        }
    }
}

export default Webhook;