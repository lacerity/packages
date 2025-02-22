type DiscordEmbed = {
    title?: string;
    description?: string;
    url?: string;
    timestamp?: string;
    color?: number;
    footer?: {
        text: string;
        icon_url?: string;
    };
    image?: {
        url: string;
    };
    thumbnail?: {
        url: string;
    };
    video?: {
        url: string;
    };
    author?: {
        name: string;
        url?: string;
        icon_url?: string;
    };
    fields?: {
        name: string;
        value: string;
        inline?: boolean;
    }[];
};
type DiscordAttachment = {
    id: string;
    filename: string;
    size: number;
    url: string;
    proxy_url: string;
    height?: number;
    width?: number;
    content_type?: string;
};
type DiscordComponent = {
    type: number;
    custom_id?: string;
    style?: number;
    label?: string;
    emoji?: {
        id?: string;
        name?: string;
        animated?: boolean;
    };
    url?: string;
    options?: DiscordSelectOption[];
    placeholder?: string;
    min_values?: number;
    max_values?: number;
};
type DiscordSelectOption = {
    label: string;
    value: string;
    description?: string;
    emoji?: {
        id?: string;
        name?: string;
        animated?: boolean;
    };
    default?: boolean;
};
interface SlackField {
    title: string;
    value: string;
    short?: boolean;
}
interface SlackAttachment {
    color?: string;
    title?: string;
    text?: string;
    footer?: string;
    ts?: number;
    fields?: SlackField[];
    actions?: SlackAction[];
}
interface SlackAction {
    type: "button";
    text: string;
    url: string;
    style?: "primary" | "danger";
}
type Attachment = DiscordAttachment | SlackAttachment;

declare class Webhook {
    private sendTo;
    private webhookUrl;
    private user;
    private content;
    private embeds;
    private attachments;
    private components;
    constructor(sendTo: "discord" | "slack", webhookUrl: string);
    setUser({ name, avatar_url }: {
        name?: string;
        avatar_url?: string;
    }): this | undefined;
    setContent(message: string): this | undefined;
    addEmbed(embedOptions: DiscordEmbed): this | undefined;
    addAttachment(attachmentOptions: Attachment): this | undefined;
    addComponent(componentOptions: DiscordComponent): this | undefined;
    send(): Promise<void>;
    sendError(error: unknown): Promise<void>;
}

export { Webhook as default };
