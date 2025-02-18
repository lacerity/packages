export type WebhookUser = {
    name?: string
    avatar_url?: string
}

export type DiscordEmbed = {
    title?: string;
    description?: string;
    url?: string;
    timestamp?: string;
    color?: number;
    footer?: {
        text: string;
        icon_url?: string;
    };
    image?: { url: string };
    thumbnail?: { url: string };
    video?: { url: string };
    author?: {
        name: string;
        url?: string;
        icon_url?: string;
    };
    fields?: { name: string; value: string; inline?: boolean }[];
}

export type DiscordAttachment = {
    id: string;         // Attachment ID
    filename: string;   // Filename of the attachment
    size: number;       // Size in bytes
    url: string;        // URL of the attachment (accessible publicly)
    proxy_url: string;  // Proxy URL to access the attachment
    height?: number;    // Optional: Height of the attachment if it's an image
    width?: number;     // Optional: Width of the attachment if it's an image
    content_type?: string;  // Optional: MIME type of the attachment (e.g., "image/jpeg")
};

// Base type for any component
export type DiscordComponent = {
    type: number; // The type of the component (button, select menu, etc.)
    custom_id?: string; // Custom identifier for the component (only for buttons, select menus, etc.)
    style?: number; // Style of the component (e.g., color for buttons)
    label?: string; // Text label for buttons
    emoji?: {
        id?: string;
        name?: string;
        animated?: boolean;
    }; // Optional emoji for buttons
    url?: string; // URL for a link button (only valid for style 5 - LINK)
    options?: DiscordSelectOption[]; // Options for select menus
    placeholder?: string; // Placeholder text for select menus
    min_values?: number; // Minimum number of values for multi-select menus
    max_values?: number; // Maximum number of values for multi-select menus
};

// Button component
export type DiscordButton = DiscordComponent & {
    type: 1; // Type for buttons
    custom_id: string; // Required for buttons
    style: 1 | 2 | 3 | 4 | 5; // Button style (primary, secondary, success, danger, link)
    label: string; // Label text for the button
    emoji?: {
        id?: string;
        name?: string;
        animated?: boolean;
    }; // Optional emoji for the button
    url?: string; // URL (only if style is 5 - LINK)
};

// Select menu component
export type DiscordSelectMenu = DiscordComponent & {
    type: 3; // Type for select menus
    custom_id: string; // Required for select menus
    placeholder?: string; // Optional placeholder text
    min_values?: number; // Minimum number of selections
    max_values?: number; // Maximum number of selections
    options: DiscordSelectOption[]; // Options for the select menu
};

// Select menu option
export type DiscordSelectOption = {
    label: string; // The label of the option
    value: string; // The value of the option
    description?: string; // Optional description
    emoji?: {
        id?: string;
        name?: string;
        animated?: boolean;
    }; // Optional emoji for the option
    default?: boolean; // Whether this option is the default selected one
};

// Action row container for components
export type DiscordActionRow = {
    type: 1; // Type for action rows
    components: DiscordComponent[]; // Components within the action row
};

export interface SlackField {
    title: string;
    value: string;
    short?: boolean;
}

export interface SlackAttachment {
    color?: string;
    title?: string;
    text?: string;
    footer?: string;
    ts?: number;
    fields?: SlackField[];
    actions?: SlackAction[];
}

export interface SlackAction {
    type: "button";
    text: string;
    url: string;
    style?: "primary" | "danger";
}

export type Attachment = DiscordAttachment | SlackAttachment;