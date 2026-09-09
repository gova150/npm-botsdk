import * as React from 'react';
import React__default, { Component, RefObject } from 'react';
import { BotConfigModel } from 'rn-kore-bot-socket-lib-v79';
export { APP_STATE, BotConfigModel, default as KoreBotClient, RTM_EVENT } from 'rn-kore-bot-socket-lib-v79';
import * as react_native_sound from 'react-native-sound';

declare const MAX_SOURCE_LIMIT = 1;
declare const LIMIT_MESSAGE: string;
declare const MAX_FILE_NAME_LENGTH = 24;
declare const FILE_CONTEXT: string;
declare const attach_menu_buttons: {
    id: number;
    title: string;
}[];
declare const HeaderIconsId: {
    BACK: string;
    HELP: string;
    LIVE_AGENT: string;
    MINIMISE: string;
    CLOSE: string;
    THREE_DOTS: string;
    RECONNECT: string;
    EXPAND: string;
};
declare const ChatHeaderType: {
    COMPACT: string;
    LARGE: string;
    MEDIUM: string;
    REGULAR: string;
};
declare const SHOW_BUTTONS_LIMIT: number;
declare const MAX_INPUT_TEXT_LENGTH: number;
declare const MIN_COMPOSER_HEIGHT: number;
declare const MIN_TOOL_BAR_HEIGHT: number;
declare const MAX_TOOL_BAR_HEIGHT: number;
declare const MIN_HEADER_HEIGHT: number;
declare const BRANDING_RESPONSE_FILE = "branding";
declare const MAX_COMPOSER_HEIGHT = 200;
declare const DEFAULT_PLACEHOLDER = "Type a message";
declare const DATE_FORMAT = "ll";
declare const TIME_FORMAT = "LT, ddd";
declare const BOT_ICON_URL = "BOT_ICON_URL";
declare const URL_VERSION = "/1.1";
declare const TEMPLATE_TYPES: {
    TEXT: string;
    BUTTON: string;
    CUSTOM: string;
    OTHER: string;
    AUDIO_MESSAGE: string;
    VIDEO_MESSAGE: string;
    LINK_MESSAGE: string;
    IMAGE_MESSAGE: string;
    CARD_TEMPLATE: string;
    LIST_TEMPLATE: string;
    IMAGE_TEMPLATE: string;
    TABLE_TEMPLATE: string;
    QUICK_REPLIES: string;
    HIDDEN_DIALOG: string;
    ERROR_TEMPLATE: string;
    CAROUSEL_TEMPLATE: string;
    LIVE_AGENT_TEMPLATE: string;
    SYSTEM_TEMPLATE: string;
    START_TIMER: string;
    ADVANCED_LIST_TEMPLATE: string;
    MINI_TABLE_TEMPLATE: string;
    BAR_CHART_TEMPLATE: string;
    PIE_CHART_TEMPLATE: string;
    LINE_CHART_TEMPLATE: string;
    DATE_TEMPLATE: string;
    DATE_RANGE_TEMPLATE: string;
    TABLE_LIST_TEMPLATE: string;
    ADVANCED_MULTI_SELECT_TEMPLATE: string;
    MULTI_SELECT_TEMPLATE: string;
    RADIO_OPTION_TEMPLATE: string;
    LIST_VIEW_TEMPLATE: string;
    DROPDOWN_TEMPLATE: string;
    FEEDBACK_TEMPLATE: string;
    FORM_TEMPLATE: string;
    CLOCK_TEMPLATE: string;
    LISTWIDGET_TEMPLATE: string;
    USER_ATTACHEMENT_TEMPLATE: string;
    ARTICLE_TEMPLATE: string;
    ANSWER_TEMPLATE: string;
    OTP_TEMPLATE: string;
    RESET_PIN_TEMPLATE: string;
    DIGITALFORM_TEMPLATE: string;
};
declare const RENDER_KORA_BUBBLE = "RENDER_KORA_BUBBLE";
declare const KORA_ITEM_CLICK = "KORA_ITEM_CLICK";
interface ButtonTheme {
    ACTIVE_BG_COLOR: any;
    ACTIVE_TXT_COLOR: any;
    INACTIVE_BG_COLOR: any;
    INACTIVE_TXT_COLOR: any;
}
interface HEADER_ICON {
    ICON_1: 'icon-1';
    ICON_2: 'icon-2';
    ICON_3: 'icon-3';
    ICON_4: 'icon-4';
}
interface BubbleTheme {
    BUBBLE_LEFT_BG_COLOR: any;
    BUBBLE_LEFT_TEXT_COLOR: any;
    BUBBLE_RIGHT_BG_COLOR: any;
    BUBBLE_RIGHT_TEXT_COLOR: any;
}
declare const WelcomeHeaderConstants: {
    COMPACT: string;
    LARGE: string;
    MEDIUM: string;
    REGULAR: string;
};

interface ThemeType {
    _id?: string;
    streamId?: string;
    __v?: number;
    activeTheme?: boolean;
    createdBy?: string;
    createdOn?: string;
    defaultTheme?: boolean;
    lastModifiedBy?: string;
    lastModifiedOn?: string;
    refId?: string;
    state?: string;
    themeName?: string;
    v3?: {
        general?: {
            bot_icon?: string;
            size?: string;
            themeType?: string;
            colors?: {
                primary?: string;
                secondary?: string;
                primary_text?: string;
                secondary_text?: string;
                useColorPaletteOnly?: boolean;
            };
        };
        chat_bubble?: {
            style?: string;
            icon?: {
                icon_url?: string;
                size?: string;
                type?: string;
            };
            minimise?: {
                icon?: string;
                theme?: string;
                type?: string;
            };
            sound?: string;
            alignment?: string;
            animation?: string;
            expand_animation?: string;
            primary_color?: string;
            secondary_color?: string;
        };
        welcome_screen?: {
            show?: boolean;
            layout?: string;
            logo?: {
                logo_url?: string;
            };
            title?: {
                name?: string;
            };
            sub_title?: {
                name?: string;
            };
            note?: {
                name?: string;
            };
            background?: {
                type?: string;
                color?: string;
                img?: string;
            };
            top_fonts?: {
                color?: string;
            };
            bottom_background?: {
                color?: string;
            };
            templates?: any;
            starter_box?: {
                show?: boolean;
                icon?: {
                    show?: boolean;
                };
                title?: string;
                sub_text?: string;
                start_conv_button?: {
                    color?: string;
                };
                start_conv_text?: {
                    color?: string;
                };
                quick_start_buttons?: {
                    show?: boolean;
                    style?: string;
                    buttons?: any;
                    input?: string;
                    action?: {
                        type?: string;
                        value?: string;
                    };
                };
            };
            static_links?: {
                show?: boolean;
                layout?: string;
                links?: any;
            };
            promotional_content?: {
                show?: boolean;
                promotions?: any;
            };
        };
        header?: {
            bg_color?: string;
            size?: string;
            icon?: {
                show?: boolean;
                icon_url?: string;
                type?: string;
            };
            icons_color?: string;
            title?: {
                name?: string;
                color?: string;
            };
            sub_title?: {
                name?: string;
                color?: string;
            };
            buttons?: {
                close?: {
                    show?: boolean;
                    icon?: string;
                };
                minimise?: {
                    show?: boolean;
                    icon?: string;
                };
                expand?: {
                    show?: boolean;
                    icon?: string;
                };
                reconnect?: {
                    show?: boolean;
                    icon?: string;
                };
                threeDots?: {
                    show?: boolean;
                    icon?: string;
                };
                help?: {
                    show?: boolean;
                    action?: {
                        type?: string;
                        value?: string;
                        icon?: string;
                    };
                };
                live_agent?: {
                    show?: boolean;
                    action?: {
                        type?: string;
                        value?: string;
                        icon?: string;
                    };
                };
            };
        };
        footer?: {
            bg_color?: string;
            layout?: string;
            compose_bar?: {
                bg_color?: string;
                'outline-color'?: string;
                placeholder?: string;
            };
            icons_color?: string;
            buttons?: {
                menu?: {
                    show?: boolean;
                    icon_color?: string;
                    actions?: any;
                };
                emoji?: {
                    show?: boolean;
                    icon?: string;
                };
                microphone?: {
                    show?: boolean;
                    icon?: string;
                };
                speaker: {
                    show: boolean;
                    icon: string;
                };
                attachment?: {
                    show?: boolean;
                    icon?: string;
                };
            };
        };
        body?: {
            background?: {
                type?: string;
                color?: string;
                img?: string;
            };
            font?: {
                family?: string;
                size?: string;
                style?: string;
            };
            user_message?: {
                bg_color?: string;
                color?: string;
            };
            bot_message?: {
                bg_color?: string;
                color?: string;
            };
            agent_message?: {
                bg_color?: string;
                color?: string;
                separator?: string;
                icon?: {
                    show?: string;
                    icon_url?: string;
                };
                title?: {
                    name?: string;
                    color?: string;
                };
                sub_title?: {
                    name?: string;
                    color?: string;
                };
            };
            time_stamp?: {
                show?: boolean;
                show_type?: string;
                position?: string;
                separator?: string;
                color?: string;
            };
            icon?: {
                show?: boolean;
                user_icon?: boolean;
                bot_icon?: boolean;
                agent_icon?: boolean;
                avatar_position?: 'top' | 'bottom';
            };
            buttons?: {
                bg_color?: string;
                color?: string;
            };
            bubble_style?: string;
            primaryColor?: string;
            primaryHoverColor?: string;
            secondaryColor?: string;
            secondaryHoverColor?: string;
            img?: string;
        };
    };
    version?: string;
}

interface IThemeType extends ThemeType {
    _id?: string;
    streamId?: string;
    __v?: number;
    activeTheme?: boolean;
    createdBy?: string;
    createdOn?: string;
    defaultTheme?: boolean;
    lastModifiedBy?: string;
    lastModifiedOn?: string;
    refId?: string;
    state?: string;
    themeName?: string;
    v3?: {
        general?: {
            bot_icon?: string;
            size?: string;
            themeType?: string;
            colors?: {
                primary?: string;
                secondary?: string;
                primary_text?: string;
                secondary_text?: string;
                useColorPaletteOnly?: boolean;
            };
        };
        chat_bubble?: {
            style?: string;
            icon?: {
                icon_url?: string;
                size?: string;
                type?: string;
            };
            minimise?: {
                icon?: string;
                theme?: string;
                type?: string;
            };
            sound?: string;
            alignment?: string;
            animation?: string;
            expand_animation?: string;
            primary_color?: string;
            secondary_color?: string;
        };
        welcome_screen?: {
            show?: boolean;
            layout?: string;
            logo?: {
                logo_url?: string;
            };
            title?: {
                name?: string;
            };
            sub_title?: {
                name?: string;
            };
            note?: {
                name?: string;
            };
            background?: {
                type?: string;
                color?: string;
                img?: string;
            };
            top_fonts?: {
                color?: string;
            };
            bottom_background?: {
                color?: string;
            };
            templates?: any;
            starter_box?: {
                show?: boolean;
                icon?: {
                    show?: boolean;
                };
                title?: string;
                sub_text?: string;
                start_conv_button?: {
                    color?: string;
                };
                start_conv_text?: {
                    color?: string;
                };
                quick_start_buttons?: {
                    show?: boolean;
                    style?: string;
                    buttons?: any;
                    input?: string;
                    action?: {
                        type?: string;
                        value?: string;
                    };
                };
            };
            static_links?: {
                show?: boolean;
                layout?: string;
                links?: any;
            };
            promotional_content?: {
                show?: boolean;
                promotions?: any;
            };
        };
        header?: {
            bg_color?: string;
            size?: string;
            icon?: {
                show?: boolean;
                icon_url?: string;
                type?: string;
            };
            icons_color?: string;
            title?: {
                name?: string;
                color?: string;
            };
            sub_title?: {
                name?: string;
                color?: string;
            };
            buttons?: {
                close?: {
                    show?: boolean;
                    icon?: string;
                };
                minimise?: {
                    show?: boolean;
                    icon?: string;
                };
                expand?: {
                    show?: boolean;
                    icon?: string;
                };
                reconnect?: {
                    show?: boolean;
                    icon?: string;
                };
                help?: {
                    show?: boolean;
                    action?: {
                        type?: string;
                        value?: string;
                        icon?: string;
                    };
                };
                live_agent?: {
                    show?: boolean;
                    action?: {
                        type?: string;
                        value?: string;
                        icon?: string;
                    };
                };
            };
        };
        footer?: {
            bg_color?: string;
            layout?: string;
            compose_bar?: {
                bg_color?: string;
                'outline-color'?: string;
                placeholder?: string;
            };
            icons_color?: string;
            buttons?: {
                menu?: {
                    show?: boolean;
                    icon_color?: string;
                    actions?: any;
                };
                emoji?: {
                    show?: boolean;
                    icon?: string;
                };
                microphone?: {
                    show?: boolean;
                    icon?: string;
                };
                speaker: {
                    show: boolean;
                    icon: string;
                };
                attachment?: {
                    show?: boolean;
                    icon?: string;
                    icon_color?: string;
                };
            };
        };
        body?: {
            background?: {
                type?: string;
                color?: string;
                img?: string;
            };
            font?: {
                family?: string;
                size?: 'small' | 'medium' | 'large';
                style?: string;
            };
            user_message?: {
                bg_color?: string;
                color?: string;
            };
            bot_message?: {
                bg_color?: string;
                color?: string;
            };
            agent_message?: {
                bg_color?: string;
                color?: string;
                separator?: string;
                icon?: {
                    show?: string;
                    icon_url?: string;
                };
                title?: {
                    name?: string;
                    color?: string;
                };
                sub_title?: {
                    name?: string;
                    color?: string;
                };
            };
            time_stamp?: {
                show?: boolean;
                show_type?: string;
                position?: string;
                separator?: string;
                color?: string;
            };
            icon?: {
                show?: boolean;
                user_icon?: boolean;
                bot_icon?: boolean;
                agent_icon?: boolean;
                avatar_position?: 'top' | 'bottom';
            };
            buttons?: {
                bg_color?: string;
                color?: string;
            };
            bubble_style?: 'balloon' | 'rounded' | 'rectangle';
            primaryColor?: string;
            primaryHoverColor?: string;
            secondaryColor?: string;
            secondaryHoverColor?: string;
            img?: string;
        };
    };
    version?: string;
}

interface BotTemplateProps {
    templateType: string;
    textContainerStyle?: any;
    payload?: any;
    theme?: IThemeType;
    renderMessageText?: (props: any) => React.ReactNode;
    currentMessage?: {
        message?: any;
        pending: any;
        received: any;
        sent: any;
        text?: any;
        createdOn?: any | null;
        image?: any | null;
        user: {
            _id: string;
            name: string;
        };
    };
    messageTextProps?: any;
    onListItemClick?: any;
    onSeeMoreClick?: any;
}
interface BotTemplateState {
}
interface onListItemClickProps {
    templateType: string;
    item?: any;
}
declare class BotTemplate extends React.Component<BotTemplateProps, BotTemplateState> {
    static defaultProps: {
        currentMessage: null;
    };
    private renderBubbleViews;
    private renderMessageText;
    private renderBotText;
    render(): string | number | bigint | boolean | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode>> | React.JSX.Element;
}

interface BaseViewProps {
    position?: 'left' | 'right' | 'center';
    payload?: any;
    theme?: IThemeType;
    onListItemClick?: any;
    onBottomSheetClose?: any;
}
interface BaseViewState {
}
declare class BaseView<T extends BaseViewProps, S extends BaseViewState> extends React.Component<T, S> {
    static contextType: React.Context<ThemeType>;
    static propTypes: {
        payload: {};
        onListItemClick: undefined;
        onBottomSheetClose: undefined;
    };
    constructor(props: T);
    static defaultProps: {
        position: 'left';
    };
    protected isViewDisable: () => boolean;
}

interface CustomViewProps extends BaseViewProps {
    payload: any;
    isLastMessage: boolean;
    onListItemClick: any;
}
interface CustomViewState extends BaseViewState {
}
declare class CustomTemplate<T extends CustomViewProps, S extends CustomViewState> extends BaseView<T, S> {
    static contextType: React.Context<ThemeType>;
    static propTypes: {
        payload: {};
        onListItemClick: undefined;
        onBottomSheetClose: undefined;
    };
    constructor(props: T);
}

type Props = {
    thisRef?: any;
};
type State = {
    isModalVisible: boolean;
    title: string;
    message: string;
    onPress: any;
};
declare class CustomAlertComponent extends Component<Props, State> {
    state: State;
    componentDidMount(): void;
    showAlert: (title: string, message: string, onPress?: any) => void;
    hideAlert: () => void;
    render(): React__default.JSX.Element;
}

interface KoraChatProps {
    messages?: any[];
    messagesContainerStyle?: any;
    text?: string | null;
    actionSheet: any;
    _actionSheetRef?: any;
    inverted: any;
    locale: string | null;
    isTyping?: boolean;
    onDragList: any;
    onSend: any;
    onInputTextChanged: any;
    renderSuggestionsView: any;
    renderMediaView: any;
    initialText?: any;
    minComposerHeight: number;
    textInputProps: any;
    maxInputLength: number;
    renderInputToolbar: any;
    renderComposer: any;
    renderSend: any;
    renderChatFooter: any;
    renderLoading: any;
    renderTypingIndicator: any;
    wrapInSafeArea: any;
    parsePatterns?: any;
    alignTop: boolean;
    alwaysShowSend?: boolean;
    scrollToBottom?: boolean;
    style?: any;
    onListItemClick?: any;
    onLongPress?: any;
    botConfig: BotConfigModel;
    renderQuickRepliesView?: any;
    renderChatHeader?: any;
    onHeaderActionsClick?: any;
    /** Called after the default Close action sends its bot-side close event. */
    onClose?: () => void;
    navigation?: any;
    route?: any;
    statusBarColor?: (colorCode: any) => void;
    templateInjection?: Map<string, CustomTemplate<CustomViewProps, CustomViewState>>;
}
interface KoraChatState {
    isInitialized: boolean;
    composerHeight: number;
    messagesContainerHeight: number | null;
    typingDisabled: boolean;
    text: string | null | undefined;
    messages: any[];
    isNetConnected?: boolean;
    showLoader?: boolean;
    quickReplies?: any;
    modalVisible?: boolean;
    viewMoreObj?: any;
    isBotResponseLoading?: boolean;
    menuItems?: any[];
    showAttachmentModal?: boolean;
    showSeeMoreModal?: boolean;
    progressObj?: any;
    isShowProgress?: boolean;
    mediaPayload?: any;
    onSTTValue?: any;
    currentTemplate?: any;
    currentTemplateData?: any;
    activetheme?: any;
    wlcomeModalVisible?: boolean;
    currentTemplateHeading?: any;
    themeData?: IThemeType;
    /** Keeps the default UI from rendering before branding is resolved. */
    isThemeLoaded?: boolean;
    isTTSenable?: boolean;
    isReconnecting?: boolean;
    showBackButtonDialog?: boolean;
    showTemplateBottomSheet: boolean;
    messageBottomSheet?: any;
}
declare class KoreChat extends React.Component<KoraChatProps, KoraChatState> {
    _messageContainerRef: RefObject<any>;
    private ttsModule;
    private isTTSAvailable;
    textInput: any;
    alertRef: React.RefObject<CustomAlertComponent>;
    _isFirstLayout: boolean;
    _locale: string;
    invertibleScrollViewProps: {};
    _unsubscribeConn: any;
    backHandler: any;
    unsubscribeNavigation: any;
    allowNavigation: boolean;
    static defaultProps: {
        messagesContainerStyle: null;
        text: null;
        placeholder: string;
        disableComposer: boolean;
        messageIdGenerator: () => string | number[];
        user: {};
        onSend: undefined;
        timeFormat: string;
        dateFormat: string;
        loadEarlier: boolean;
        onLoadEarlier: () => void;
        isLoadingEarlier: boolean;
        renderLoading: null;
        renderLoadEarlier: null;
        renderAvatar: null;
        showUserAvatar: boolean;
        actionSheet: null;
        onPressAvatar: null;
        onLongPressAvatar: null;
        renderUsernameOnMessage: boolean;
        renderAvatarOnTop: boolean;
        onLongPress: null;
        renderMessage: null;
        renderMessageText: null;
        imageProps: {};
        videoProps: {};
        audioProps: {};
        lightboxProps: {};
        textInputProps: {};
        listViewProps: {};
        renderCustomView: null;
        isCustomViewBottom: boolean;
        renderDay: null;
        renderTime: null;
        renderFooter: null;
        renderChatEmpty: null;
        renderChatFooter: null;
        renderInputToolbar: null;
        renderComposer: null;
        renderActions: any;
        renderSend: null;
        renderAccessory: null;
        isKeyboardInternallyHandled: boolean;
        onPressActionButton: null;
        bottomOffset: number;
        minInputToolbarHeight: number;
        keyboardShouldPersistTaps: string;
        onInputTextChanged: null;
        maxInputLength: null;
        forceGetKeyboardHeight: boolean;
        inverted: boolean;
        extraData: null;
        minComposerHeight: number | undefined;
        maxComposerHeight: number;
        wrapInSafeArea: boolean;
        renderSuggestionsView: null;
        renderMediaView: null;
        Suggestions: never[];
        renderQuickRepliesView: null;
        onFormAction: null;
        renderTypingIndicator: null;
        renderSpeechToText: null;
        clickSpeechToText: null;
        onDragList: null;
        _actionSheetRef: null;
        locale: string | null;
        alignTop: boolean;
        initialText: undefined;
        onListItemClick: undefined;
        menuItems: [];
    };
    private _isChatMounted;
    private fileUploadQueue?;
    private themApi;
    constructor(props: KoraChatProps);
    private lazyLaunchCamera;
    private lazyDocumentPicker;
    private getDocumentPickerTypes;
    private handleDocumentTypeSelection;
    private init;
    private showAlert;
    private saveThemeData;
    private getThemeData;
    static append(currentMessages: any, messages: any): any;
    private handleBackPress;
    private handleDialogCancel;
    private handleDialogClose;
    private handleDialogMinimize;
    componentDidMount(): void;
    private clickedQuickReply;
    componentWillUnmount(): void;
    componentDidUpdate(prevProps: KoraChatProps, prevState: KoraChatState): void;
    private setBotClientListeners;
    private onReconnect;
    private isQuickReplies;
    private processMessage;
    private stopTTS;
    private initializeTTS;
    private cleanupTTS;
    private speakMessage;
    isSliderView: (message: any) => boolean;
    private textToSpeech;
    private initLocale;
    private setLocale;
    private getLocalizedString;
    private setTextFromProp;
    private getTextFromProp;
    private setMessages;
    private getMessages;
    private setIsFirstLayout;
    private getIsFirstLayout;
    private setIsTypingDisabled;
    private getIsTypingDisabled;
    private setIsBotResponseLoading;
    private getIsBotResponseLoading;
    private setisChatMounted;
    private getisChatMounted;
    private scrollToBottom;
    private renderMessages;
    renderTemplateBottomSheet: () => React.JSX.Element;
    onSendPlainText: (message?: any) => void;
    private getAttachmentPayload;
    onSendText: (message: any, shouldResetInputToolbar?: boolean, data_type?: string) => void;
    private renderQuickRepliesView;
    private renderMediaView;
    private getFileType;
    private renderInternalMediaView;
    private clearQuickReplies;
    private onSend;
    private computePostBack;
    private onListItemClick;
    private getDateRangeText;
    private resetInputToolbar;
    private onInputSizeChanged;
    private onInputTextChanged;
    private notifyInputTextReset;
    private onInitialLayoutViewLayout;
    private onMainViewLayout;
    private isMediaAddedToSend;
    private onSpeakerClicked;
    private renderInputToolbar;
    private renderChatFooter;
    private renderLoading;
    private renderTypingIndicator;
    renderSTTview(value: any): React.ReactNode;
    private refreshView;
    private getViewMoreView;
    private openFullScreenDialog;
    private renderAttachedBottomSheet;
    private renderMenuBottomSheet;
    private renderSeeMorePopupComponent;
    private renderSeeMoreBottomSheet;
    private renderMenuPopupComponent;
    private requestCameraPermission;
    private renderAssetPopupComponent;
    private onAttachItemClick;
    private pickDocument;
    private getBeforeLoadingList;
    private computeMediaResult;
    private showCustomToast;
    private onHeaderActionsClick;
    private renderHeader;
    private renderLoader;
    private renderWelcomeComponent;
    private renderWelcomeScreenModel;
    private renderBackButtonDialog;
    render(): React.JSX.Element;
    private onHistoryLoaded;
    private loadHistory;
}

interface QuickProps extends BaseViewProps {
    quick_replies: any;
    itemClick?: any;
    isVertical?: boolean;
    quick_container_style?: any;
    quck_text_style?: any;
    quick_image_style?: any;
}
interface QuickState extends BaseViewState {
    isClickedItem?: boolean;
}
declare class QuickReplies extends BaseView<QuickProps, QuickState> {
    constructor(props: QuickProps);
    componentDidUpdate(prevProps: Readonly<QuickProps>, _prevState: Readonly<QuickState>, _snapshot?: any): void;
    private renderQuickRepliesView;
    render(): React.JSX.Element;
}

type SpeechErrorEvent = any;
interface InputToolbarProps {
    renderAccessory?: ((props: any) => any) | null;
    renderActions?: ((props: any) => any) | null;
    renderSend?: ((props: any) => any) | null;
    renderComposer?: ((props: any) => any) | null;
    onPressActionButton?: ((props: any) => any) | null;
    containerStyle?: any;
    primaryStyle?: any;
    accessoryStyle?: any;
    renderSuggestionsView?: ((props: any) => any) | null;
    renderQuickRepliesView?: ((props: any) => any) | null;
    renderSpeechToText?: ((props: any) => any) | null;
    onMenuItemClick?: any;
    onAttachedItemClick?: any;
    renderMediaView?: ((props: any) => any) | null;
    isMediaAddedToSend?: boolean;
    isMediaLoading?: boolean;
    onSTTValue?: any;
    onSendSTTClick?: any;
}
interface InputToolbarStates {
    isSTTViewShow?: boolean;
    showMenuPopover?: boolean;
    showAttachedPopover?: boolean;
    isRecordingstart?: boolean;
    recordState?: string;
    STT_value?: any;
}
declare class InputToolbar extends React.Component<InputToolbarProps, InputToolbarStates> {
    static contextType: React.Context<ThemeType>;
    private voiceHelper;
    constructor(props: InputToolbarProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: InputToolbarProps): void;
    private isVoiceEnabled;
    private initVoiceHelper;
    private getVoiceHelper;
    state: {
        position: string;
        isSTTViewShow: boolean;
        showMenuPopover: boolean;
        showAttachedPopover: boolean;
        isRecordingstart: boolean;
        recordState: string;
        STT_value: string;
    };
    fadeInToBottomRef?: any;
    renderSuggestionsView(): any;
    renderMediaView(): any;
    private renderActions;
    private _renderActions;
    renderSend(): any;
    private _renderSend;
    renderComposer(): any;
    onSpeechStart: () => void;
    onSpeechRecognized: () => void;
    onSpeechEnd: () => void;
    onSpeechError: (e: SpeechErrorEvent) => Promise<void>;
    onSpeechResults: (e: any) => void;
    onSpeechResultsIos: (e: any) => void;
    onSpeechPartialResults: (e: any) => void;
    onSpeechVolumeChanged: (_e: any) => void;
    handleVoiceTextSwitch: () => void;
    startRecognizing: () => Promise<void>;
    stopRecognizing: () => void;
    cancelRecognizing: () => void;
    destroyRecognizer: () => void;
    handleVoiceToTextSwitch: () => void;
    renderSTTView(): React.JSX.Element;
    getRecordTitle(): string | null;
    renderQuickRepliesView(theme: any): any;
    renderAccessory(): React.JSX.Element;
    renderSpeechToText(): any;
    private isShowActions;
    render(): React.JSX.Element;
}

declare const _default: {
    defaultColor: string;
    backgroundTransparent: string;
    transparent: string;
    defaultBlue: string;
    leftBubbleBackground: string;
    carrot: string;
    emerald: string;
    peterRiver: string;
    wisteria: string;
    alizarin: string;
    midnightBlue: string;
    optionTintColor: string;
    timeTextColor: string;
    bot_blue: string;
    red: string;
    green: string;
    blue: string;
    cyan: string;
    magenta: string;
    yellow: string;
    black: string;
    white: string;
    gray: string;
    silver: string;
    maroon: string;
    olive: string;
    navy: string;
    purple: string;
    teal: string;
    indigo: string;
    orange: string;
    pink: string;
    violet: string;
    peach: string;
    lavender: string;
    coral: string;
    turquoise: string;
    chocolate: string;
    lime: string;
    gold: string;
    crimson: string;
    plum: string;
    slate: string;
    khaki: string;
    aquamarine: string;
    bisque: string;
    cornsilk: string;
    firebrick: string;
    midnightblue: string;
    text_color: string;
    sub_text_color: string;
    button_blue: string;
    header_blue: string;
};

/**
 * Custom UUID utility to replace react-native-uuid dependency
 * Generates RFC4122 version 4 UUIDs
 */
declare class UUID {
    /**
     * Generate a version 4 UUID string
     * Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
     * where x is any hexadecimal digit and y is one of 8, 9, A, or B
     * @returns {string} UUID v4 string
     */
    static v4(): string;
}

interface CommunicationsModule {
    phonecall: (phoneNumber: string, isPrompt: boolean) => void;
    email: (to?: string[], cc?: string[], bcc?: string[], subject?: string, body?: string) => void;
    text: (phoneNumber?: string, body?: string) => void;
    web: (url: string) => void;
}
interface LazyCommunicationsState {
    CommunicationsModule: CommunicationsModule | null;
    isLoading: boolean;
    loadError: string | null;
}
interface LazyCommunicationsProps {
    autoLoad?: boolean;
    fallbackComponent?: React__default.ComponentType<any>;
    loadingComponent?: React__default.ComponentType<any>;
    errorComponent?: React__default.ComponentType<{
        error: string;
    }>;
    onModuleLoaded?: (communicationsModule: CommunicationsModule | null) => void;
}
/**
 * Lazy-loaded Communications component that dynamically imports
 * react-native-communications only when needed
 */
declare class LazyCommunications extends Component<LazyCommunicationsProps, LazyCommunicationsState> {
    private mounted;
    constructor(props: LazyCommunicationsProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    loadCommunications(): Promise<{
        phonecall: (phoneNumber: string, prompt?: boolean) => void;
        email: (to?: string[], cc?: string[], bcc?: string[], subject?: string, body?: string) => void;
        text: (phoneNumber?: string, body?: string) => void;
        web: (url: string) => void;
    }>;
    phonecall(phoneNumber: string, prompt?: boolean): Promise<void>;
    email(to?: string[], cc?: string[], bcc?: string[], subject?: string, body?: string): Promise<void>;
    text(phoneNumber?: string, body?: string): Promise<void>;
    web(url: string): Promise<void>;
    render(): React__default.JSX.Element;
}
/**
 * Hook-based version for functional components
 */
declare const useLazyCommunications: () => {
    CommunicationsModule: CommunicationsModule;
    isLoading: boolean;
    loadError: string;
    loadCommunications: () => Promise<{
        phonecall: (phoneNumber: string, prompt?: boolean) => void;
        email: (to?: string[], cc?: string[], bcc?: string[], subject?: string, body?: string) => void;
        text: (phoneNumber?: string, body?: string) => void;
        web: (url: string) => void;
    }>;
    phonecall: (phoneNumber: string, prompt?: boolean) => Promise<void>;
    email: (to?: string[], cc?: string[], bcc?: string[], subject?: string, body?: string) => Promise<void>;
    text: (phoneNumber?: string, body?: string) => Promise<void>;
    web: (url: string) => Promise<void>;
};
/**
 * Simple fallback Communications using React Native Linking
 */
declare const FallbackCommunications: React__default.FC<{
    onError?: (message: string) => void;
}>;
declare const FallbackCommunicationsAPI: CommunicationsModule;

interface SoundModule {
    new (filename: string, basePath: string, onError?: (error: any) => void, options?: any): SoundInstance;
    MAIN_BUNDLE: string;
    DOCUMENT: string;
    LIBRARY: string;
    CACHES: string;
    setCategory: (category: any, mixWithOthers?: boolean) => void;
    setMode: (mode: any) => void;
    setActive: (active: boolean) => void;
}
interface SoundInstance {
    play: (callback?: (success: boolean) => void) => void;
    pause: (callback?: () => void) => void;
    stop: (callback?: () => void) => void;
    reset: () => void;
    release: () => void;
    getDuration: () => number;
    getCurrentTime: (callback: (seconds: number, isPlaying: boolean) => void) => void;
    setCurrentTime: (seconds: number) => void;
    setVolume: (volume: number) => void;
    getVolume: (callback: (volume: number) => void) => void;
    setNumberOfLoops: (loops: number) => void;
    getNumberOfLoops: (callback: (loops: number) => void) => void;
    setPan: (pan: number) => void;
    getPan: (callback: (pan: number) => void) => void;
    setSpeed: (speed: number) => void;
    getSpeed: (callback: (speed: number) => void) => void;
    isLoaded: () => boolean;
    isPlaying: () => boolean;
}
interface LazySoundState {
    SoundModule: SoundModule | null;
    isLoading: boolean;
    loadError: string | null;
}
interface LazySoundProps {
    autoLoad?: boolean;
    fallbackComponent?: React__default.ComponentType<any>;
    loadingComponent?: React__default.ComponentType<any>;
    errorComponent?: React__default.ComponentType<{
        error: string;
    }>;
    onModuleLoaded?: (soundModule: SoundModule | null) => void;
}
/**
 * Lazy-loaded Sound component that dynamically imports
 * react-native-sound only when needed
 */
declare class LazySound extends Component<LazySoundProps, LazySoundState> {
    private mounted;
    constructor(props: LazySoundProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    loadSound(): Promise<SoundModule | typeof react_native_sound>;
    createSound(filename: string, basePath?: string, onError?: (error: any) => void, options?: any): Promise<SoundInstance | null>;
    setCategory(category: string, mixWithOthers?: boolean): Promise<void>;
    setMode(mode: string): Promise<void>;
    setActive(active: boolean): Promise<void>;
    render(): React__default.JSX.Element;
}
/**
 * Hook-based version for functional components
 */
declare const useLazySound: () => {
    SoundModule: SoundModule;
    isLoading: boolean;
    loadError: string;
    loadSound: () => Promise<SoundModule | typeof react_native_sound>;
    createSound: (filename: string, basePath?: string, onError?: (error: any) => void, options?: any) => Promise<SoundInstance | null>;
    setCategory: (category: string, mixWithOthers?: boolean) => Promise<void>;
    setMode: (mode: string) => Promise<void>;
    setActive: (active: boolean) => Promise<void>;
};
/**
 * Simple fallback Sound using basic alert notifications
 */
declare const FallbackSound: React__default.FC<{
    onError?: (message: string) => void;
}>;
declare const FallbackSoundAPI: {
    createSound: (filename: string, basePath?: string, onError?: (error: any) => void) => Promise<null>;
    setCategory: (category: string, mixWithOthers?: boolean) => Promise<void>;
    setMode: (mode: string) => Promise<void>;
    setActive: (active: boolean) => Promise<void>;
};

interface VoiceRecognitionEvents {
    onSpeechStart?: () => void;
    onSpeechRecognized?: () => void;
    onSpeechEnd?: () => void;
    onSpeechError?: (error: {
        error: string;
        code: number;
    }) => void;
    onSpeechResults?: (results: {
        value: string[];
    }) => void;
    onSpeechPartialResults?: (results: {
        value: string[];
    }) => void;
    onSpeechVolumeChanged?: (volume: {
        value: number;
    }) => void;
}
declare class CustomVoiceRecognition {
    private eventEmitter;
    private listeners;
    private isInitialized;
    constructor();
    private initializeEventEmitter;
    isAvailable(): Promise<boolean>;
    start(language?: string, options?: any): Promise<string>;
    stop(): Promise<string>;
    cancel(): Promise<string>;
    destroy(): Promise<string>;
    setEventListeners(events: VoiceRecognitionEvents): void;
    removeAllListeners(): void;
    getModuleInfo(): {
        available: boolean;
        initialized: boolean;
        platform: string;
    };
}
declare const customVoiceRecognition: CustomVoiceRecognition;

export { BOT_ICON_URL, BRANDING_RESPONSE_FILE, BotTemplate, BotTemplateProps, BotTemplateState, BubbleTheme, ButtonTheme, ChatHeaderType, _default as Color, CustomTemplate, CustomViewProps, CustomViewState, customVoiceRecognition as CustomVoiceRecognition, DATE_FORMAT, DEFAULT_PLACEHOLDER, FILE_CONTEXT, FallbackCommunications, FallbackCommunicationsAPI, FallbackSound, FallbackSoundAPI, HEADER_ICON, HeaderIconsId, IThemeType, InputToolbar, KORA_ITEM_CLICK, LIMIT_MESSAGE, LazyCommunications, LazySound, MAX_COMPOSER_HEIGHT, MAX_FILE_NAME_LENGTH, MAX_INPUT_TEXT_LENGTH, MAX_SOURCE_LIMIT, MAX_TOOL_BAR_HEIGHT, MIN_COMPOSER_HEIGHT, MIN_HEADER_HEIGHT, MIN_TOOL_BAR_HEIGHT, QuickReplies, RENDER_KORA_BUBBLE, SHOW_BUTTONS_LIMIT, TEMPLATE_TYPES, TIME_FORMAT, URL_VERSION, UUID, WelcomeHeaderConstants, attach_menu_buttons, KoreChat as default, onListItemClickProps, useLazyCommunications, useLazySound };
