/* eslint-disable no-bitwise */
// Correct: Import React from 'react'
import * as React from 'react';

import {Dimensions, Platform, PixelRatio} from 'react-native';
import dayjs from 'dayjs';

import Color from '../theme/Color';
import ColorMappings from './colorMappings';
import RenderImage from './RenderImage';
import {TEMPLATE_TYPES} from '../constants/Constant';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
// based on iphone X's scale
let NEW_SCREEN_WIDTH =
  SCREEN_WIDTH > SCREEN_HEIGHT ? SCREEN_HEIGHT : SCREEN_WIDTH;
const scale = NEW_SCREEN_WIDTH / 375;

// const ICON_SHAPE = {
//   CIRCLE_IMG: 'circle-img',
// };

const imageTypes: any = [
  'bmp',
  'dds',
  'gif',
  'heic',
  'jpg',
  'png',
  'psd',
  'pspimage',
  'tga',
  'thm',
  'tif',
  'tiff',
  'yuv',
  'jpeg',
];
const videoTypes: any = [
  '3g2',
  '3gp',
  'asf',
  'avi',
  'flv',
  'm4v',
  'mov',
  'mp4',
  'mpg',
  'rm',
  'srt',
  'swf',
  'vob',
  'wmv',
];

export const renderImage: React.FC<any> = ({
  image,
  iconShape = undefined,
  iconSize = '',
  width = 10,
  height = 10,
}) => {
  return (
    <RenderImage
      image={image}
      iconShape={iconShape}
      iconSize={iconSize}
      width={width}
      height={height}
    />
  );
};

export function createDateRange(start: any, end: any) {
  const startDate = dayjs(start);
  const endDate = dayjs(end);
  let currentDate = startDate;
  const dateArray: any = [];

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
    dateArray.push(currentDate.toDate());
    currentDate = currentDate.add(1, 'day');
  }
  //console.log('dateArray   ---->:', dateArray);
  return dateArray;
}

function padZero(str: any, len?: any) {
  len = len || 2;
  var zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}

export function invertColor(hex: any, bw?: boolean) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }

  if (hex.length !== 6) {
    const hexValue = ColorMappings[hex?.toLowerCase()];

    if (!hexValue) {
      //throw new Error('Invalid HEX color to invertColor :' + hex);
      return Color.black;
    }

    hex = hexValue;
  }
  if (!hex) {
    return undefined;
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  var r: any = parseInt(hex.slice(0, 2), 16),
    g: any = parseInt(hex.slice(2, 4), 16),
    b: any = parseInt(hex.slice(4, 6), 16);

  //console.log('   ====>:', finalResultColor);
  if (hex?.toLowerCase() === '#000000') {
    return '#FFFFFF';
  }

  if (hex?.toLowerCase() === '#ffffff') {
    return '#000000';
  }

  if (bw) {
    // https://stackoverflow.com/a/3943023/112731
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
  }
  // invert color components
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  // pad each with zeros and return
  let finalResultColor = '#' + padZero(r) + padZero(g) + padZero(b);
  // console.log(' finalResultColor  ====>:', finalResultColor);
  return finalResultColor;
}

export function normalize(size: number) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.ceil(PixelRatio.roundToNearestPixel(newSize));
  }
}

export function generateColor() {
  const randomColor = Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0');
  return `#${randomColor}`;
}

// function getScale() {
//   if (Platform.OS === 'ios') {
//     let NEW_SCREEN_WIDTH =
//       SCREEN_WIDTH > SCREEN_HEIGHT ? SCREEN_HEIGHT : SCREEN_WIDTH;
//     return NEW_SCREEN_WIDTH / 375;
//   } else {
//     return 1080 / 1920;
//   }
// }

export function isSameDay(
  currentMessage: {createdOn: number} | any,
  diffMessage: {createdOn: number} | any,
) {
  const currentCreatedAt = dayjs(currentMessage.createdOn);
  const diffCreatedAt = dayjs(diffMessage.createdOn);
  if (!currentCreatedAt.isValid() || !diffCreatedAt.isValid()) {
    return false;
  }
  return currentCreatedAt.isSame(diffCreatedAt, 'day');
}

export function isSameUser(
  currentMessage: {user: {_id: string}} | any,
  diffMessage: {user: {_id: string}} | any,
) {
  return !!(
    diffMessage?.user &&
    currentMessage?.user &&
    diffMessage.user._id === currentMessage.user._id
  );
}

export const getItemId = (pattern?: any) => {
  var _pattern = pattern || 'xyxxyxxy';
  _pattern = _pattern.replace(/[xy]/g, function (c: any) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  return _pattern;
};

export function getDrawableByExt(ext: string): string {
  if (imageTypes.includes(ext)) {
    return '&#128247;';
  } else if (videoTypes.includes(ext)) {
    return '&#127909;';
  } else {
    return '&#128195;';
  }
}
const hexToRGB = (hex: string) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return {r, g, b};
};

const isWhite = (hex: string) => {
  const {r, g, b} = hexToRGB(hex);
  return r === 255 && g === 255 && b === 255;
};

function isHexColor(color: string) {
  const hexPattern = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  return hexPattern.test(color);
}

function isNearWhiteRGB(r: number, g: number, b: number, threshold = 15) {
  return (
    Math.abs(255 - r) <= threshold &&
    Math.abs(255 - g) <= threshold &&
    Math.abs(255 - b) <= threshold
  );
}

export function isWhiteStatusBar(color: any): boolean {
  // console.log(color);

  // If color is null, undefined, or explicitly 'white', return true
  if (!color || color.toLowerCase() === 'white') {
    return true;
  }

  color = color.trim();

  // Check if the color is a valid hex
  if (isHexColor(color)) {
    const {r, g, b} = hexToRGB(color);

    // Return true if the color is exactly white or near white
    return isWhite(color) || isNearWhiteRGB(r, g, b, 15);
  }

  // If not a valid color or hex, return false
  return false;
}

// Use Luma formula to check if a color is near black
function isDarkColor(
  r: number,
  g: number,
  b: number,
  brightnessThreshold = 80,
) {
  const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  // console.log(`Brightness: ${brightness}`);
  return brightness < brightnessThreshold;
}

export function isBlackStatusBar(color: any): boolean {
  // console.log('isBlackStatusBar color --------->:', color);

  if (!color || color.toLowerCase() === 'black') {
    return true;
  }

  if (isHexColor(color)) {
    const {r, g, b} = hexToRGB(color);
    // console.log(`RGB Values -> R: ${r}, G: ${g}, B: ${b}`);
    return isDarkColor(r, g, b);
  }

  return false;
}

export interface ParsedInternalAppNavigation {
  template_type: string;
  title: string;
  text: string;
  heading: string;
  buttons: Array<{
    type: string;
    title: string;
    navigationUrl: string;
    linkurl?: string;
    linkUrl?: string;
    [key: string]: any;
  }>;
}

export function parseInternalAppNavigationText(text: any): ParsedInternalAppNavigation | null {
  if (typeof text !== 'string') {
    return null;
  }
  if (!text.includes('$navigationStart$') || !text.includes('$navigationEnd$')) {
    return null;
  }

  const navRegex = /\$navigationStart\$(.*?)\$navigationEnd\$/gis;
  const buttons: Array<{
    type: string;
    title: string;
    navigationUrl: string;
    linkurl?: string;
    linkUrl?: string;
    [key: string]: any;
  }> = [];

  let match: RegExpExecArray | null;
  while ((match = navRegex.exec(text)) !== null) {
    const content = (match[1] || '').trim();
    if (!content) continue;

    // Check if multiple button definitions are in one block (e.g. separated by semicolons)
    const buttonChunks = content.split(/;+/).map(c => c.trim()).filter(Boolean);
    for (const chunk of buttonChunks) {
      const btn: Record<string, any> = {
        type: 'postback',
        title: '',
        navigationUrl: '',
      };

      // Key-value pairs separated by commas
      const pairs = chunk.split(',');
      for (const pair of pairs) {
        const colonIdx = pair.indexOf(':');
        if (colonIdx > -1) {
          const rawKey = pair.slice(0, colonIdx).trim();
          const key = rawKey.toLowerCase();
          const value = pair.slice(colonIdx + 1).trim();

          if (key === 'title') {
            btn.title = value;
          } else if (
            key === 'linkurl' ||
            key === 'link_url' ||
            key === 'link' ||
            key === 'navigationurl' ||
            key === 'url'
          ) {
            btn.navigationUrl = value;
          } else if (key === 'type') {
            btn.type = value;
          } else {
            btn[rawKey] = value;
          }
        }
      }

      // Also support linkurl/linkUrl as fallback accessors without duplicating keys in JSON
      Object.defineProperty(btn, 'linkurl', {
        get() {
          return this.navigationUrl;
        },
        set(v: string) {
          this.navigationUrl = v;
        },
        enumerable: false,
        configurable: true,
      });
      Object.defineProperty(btn, 'linkUrl', {
        get() {
          return this.navigationUrl;
        },
        set(v: string) {
          this.navigationUrl = v;
        },
        enumerable: false,
        configurable: true,
      });

      if (btn.title || btn.navigationUrl) {
        buttons.push(btn as any);
      }
    }
  }

  // Remove the $navigationStart$...$navigationEnd$ markers from title text
  const cleanTitle = text.replace(/\$navigationStart\$(.*?)\$navigationEnd\$/gis, '').trim();

  return {
    template_type: TEMPLATE_TYPES.INTERNAL_APP_NAVIGATION_TEMPLATE,
    title: cleanTitle,
    text: cleanTitle,
    heading: cleanTitle,
    buttons,
  };
}

export function getTemplateType(message: any) {
  const msg = Array.isArray(message) ? message[0] : message;

  let compPayload = msg?.component?.payload;
  if (typeof compPayload === 'string') {
    try {
      compPayload = JSON.parse(compPayload);
    } catch (e) {}
  }

  // Check if message text contains internal app navigation format ($navigationStart$...$navigationEnd$)
  const navTextCandidate =
    msg?.component?.payload?.text ||
    compPayload?.text ||
    compPayload?.payload?.text ||
    (typeof compPayload === 'string' ? compPayload : null) ||
    msg?.cInfo?.body ||
    msg?.text;

  if (
    typeof navTextCandidate === 'string' &&
    navTextCandidate.includes('$navigationStart$') &&
    navTextCandidate.includes('$navigationEnd$')
  ) {
    return TEMPLATE_TYPES.INTERNAL_APP_NAVIGATION_TEMPLATE;
  }

  // Direct check for customTemplate_displayClaims regardless of nesting
  const detectedCustomType =
    compPayload?.payload?.template_type ||
    compPayload?.template_type ||
    compPayload?.type ||
    msg?.component?.template_type ||
    msg?.template_type;

  if (
    detectedCustomType === TEMPLATE_TYPES.CUSTOM_TEMPLATE_DISPLAY_CLAIMS ||
    detectedCustomType === 'customTemplate_displayClaims'
  ) {
    return TEMPLATE_TYPES.CUSTOM_TEMPLATE_DISPLAY_CLAIMS;
  }

  if (
    detectedCustomType === TEMPLATE_TYPES.CLAIM_MORE_DETAILS_TEMPLATE ||
    detectedCustomType === 'claimMoreDetails_template'
  ) {
    return TEMPLATE_TYPES.CLAIM_MORE_DETAILS_TEMPLATE;
  }

  if (
    detectedCustomType === TEMPLATE_TYPES.LIVE_AGENT_TEMPLATE ||
    (typeof detectedCustomType === 'string' &&
      detectedCustomType.toLowerCase() === 'live_agent')
  ) {
    return TEMPLATE_TYPES.LIVE_AGENT_TEMPLATE;
  }

  if (
    detectedCustomType === TEMPLATE_TYPES.SYSTEM_TEMPLATE ||
    (typeof detectedCustomType === 'string' &&
      detectedCustomType.toLowerCase() === 'system')
  ) {
    return TEMPLATE_TYPES.SYSTEM_TEMPLATE;
  }

  if (
    detectedCustomType === TEMPLATE_TYPES.AGENT_START_TYPING ||
    (typeof detectedCustomType === 'string' &&
      detectedCustomType.toLowerCase() === 'agent_start_typing')
  ) {
    return TEMPLATE_TYPES.AGENT_START_TYPING;
  }

  if (
    detectedCustomType === TEMPLATE_TYPES.AGENT_STOP_TYPING ||
    (typeof detectedCustomType === 'string' &&
      detectedCustomType.toLowerCase() === 'agent_stop_typing')
  ) {
    return TEMPLATE_TYPES.AGENT_STOP_TYPING;
  }

  if (
    (msg?.component?.type === 'template' || compPayload?.template_type || compPayload?.payload?.template_type) &&
    (compPayload?.type === 'template' ||
      compPayload?.payload?.template_type ||
      compPayload?.template_type)
  ) {
    const templateType =
      compPayload?.payload?.template_type ||
      compPayload?.template_type;

    if (
      templateType === TEMPLATE_TYPES.BUTTON &&
      compPayload?.formData != null
    ) {
      return TEMPLATE_TYPES.DIGITALFORM_TEMPLATE;
    }
    if (templateType) {
      return templateType;
    }
  }

  if (
    message?.[0]?.component?.type === 'text' &&
    message?.[0]?.component?.payload?.text
  ) {
    return TEMPLATE_TYPES.TEXT;
  }
  if (
    message?.[0]?.component?.type === TEMPLATE_TYPES.USER_ATTACHEMENT_TEMPLATE
  ) {
    return TEMPLATE_TYPES.USER_ATTACHEMENT_TEMPLATE;
  }

  if (
    message?.[0]?.type === 'text' &&
    (message[0]?.component?.type === 'template' ||
      message[0]?.component?.type === 'text') &&
    message[0].component?.payload
    //message[0].component?.payload?.type !== 'message'
  ) {
    if (message[0].component?.payload?.type === 'link') {
      return TEMPLATE_TYPES.LINK_MESSAGE;
    }
    if (message[0].component?.payload?.type === 'message') {
      if (message[0].component?.payload?.payload?.audioUrl) {
        return TEMPLATE_TYPES.AUDIO_MESSAGE;
      }

      if (message[0].component?.payload?.payload?.videoUrl) {
        return TEMPLATE_TYPES.VIDEO_MESSAGE;
      }
    }
    if (message[0].component?.payload?.type === 'image') {
      return TEMPLATE_TYPES.IMAGE_MESSAGE;
    }

    if (message[0].component?.payload?.type === 'error') {
      return TEMPLATE_TYPES.ERROR_TEMPLATE;
    }

    if (typeof message[0].component?.payload === 'string') {
      return TEMPLATE_TYPES.TEXT;
    }
    if (
      (message[0].component?.payload?.text &&
        typeof message[0].component?.payload?.text === 'string') ||
      message[0].component?.payload?.text?.length === 0
    ) {
      return TEMPLATE_TYPES.TEXT;
    }

    if (
      message[0].component?.payload?.payload?.text &&
      typeof message[0].component?.payload?.payload?.text === 'string'
    ) {
      return TEMPLATE_TYPES.TEXT;
    }

    if (
      message?.[0]?.component?.payload?.[0]?.isFromLocal &&
      message?.[0]?.component?.payload?.[0]?.fileId
    ) {
      return TEMPLATE_TYPES.TEXT;
    }
  }

  if (
    message?.[0]?.component?.payload?.lastMessage?.messagePayload?.message
      ?.attachments?.[0]?.isFromLocal &&
    message?.[0]?.component?.payload?.lastMessage?.messagePayload?.message
      ?.attachments?.[0]?.fileId
  ) {
    return TEMPLATE_TYPES.TEXT;
  }

  return TEMPLATE_TYPES.OTHER;
}

export function convertToRNStyle(elementStyles: Record<string, string>) {
  const rnStyle: Record<string, any> = {};

  for (const [key, value] of Object.entries(elementStyles)) {
    switch (key) {
      case 'border':
        const array = value.split(' ');
        if (array?.length === 2) {
          rnStyle.borderStyle = array[0];
          let color1 = array?.[1].replace(';', '');
          rnStyle.borderColor = color1;
        } else if (array?.length === 3) {
          // rnStyle.borderWidth = parseInt(array[0].replace('px', ''));
          rnStyle.borderStyle = array[1];
          let color2 = array?.[2].replace(';', '');
          rnStyle.borderColor = color2;
        }
        // const [_pixel, style, color] = value.split(' ');
        // rnStyle.borderStyle = style;
        // //style.replace('px', '');
        // rnStyle.borderColor = color;
        break;

      case 'border-width':
        const borderWidths = value.split(' ').map(v => parseFloat(v));
        if (borderWidths.length === 1) {
          rnStyle.borderWidth = borderWidths[0];
        } else {
          rnStyle.borderTopWidth = borderWidths[0];
          rnStyle.borderRightWidth = borderWidths[1];
          rnStyle.borderBottomWidth = borderWidths[2];
          rnStyle.borderLeftWidth = borderWidths[3];
        }
        break;

      case 'padding-left':
        rnStyle.paddingLeft = value.includes('%')
          ? `${value}`
          : parseFloat(value);
        break;

      case 'box-shadow':
        const [offsetX, offsetY, blurRadius] = value
          .split(' ')
          .map(v => parseFloat(v));
        rnStyle.shadowOffset = {width: offsetX, height: offsetY};
        rnStyle.shadowRadius = blurRadius;
        rnStyle.shadowOpacity = 0.5; // Default opacity (adjust as needed)
        rnStyle.shadowColor = '#000'; // Default shadow color
        break;

      case 'border-radius':
        rnStyle.borderRadius = parseFloat(value);
        break;

      case 'font-style':
        rnStyle.fontFamily = value; // React Native uses fontFamily instead of font-style
        break;

      case 'color':
        rnStyle.color = value; // Assign text color
        break;

      case 'font-size':
        let num = value?.replace?.(/px/g, '') || '14';
        rnStyle.fontSize = normalize(parseFloat(num));

        break;

      case 'background-color':
        rnStyle.backgroundColor = value;
        break;

      default:
        break;
    }
  }

  return rnStyle;
}

export interface LiveAgentSenderUser {
  name?: string;
  screenName?: string;
  [key: string]: any;
}

export interface LiveAgentSender {
  type?: 'system' | 'user' | string;
  user?: LiveAgentSenderUser;
  [key: string]: any;
}

export interface LiveAgentMessageInfo {
  templateType: string;
  text: string;
  sender?: LiveAgentSender;
  senderType: 'system' | 'user';
  screenName?: string;
}

const NAMED_HTML_ENTITIES: Record<string, string> = {
  nbsp: ' ',
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
};

/**
 * Strips HTML markup safely to plain text without executing or exposing
 * `<script>`, `<style>`, `<iframe>`, `<object>`, `<embed>`, `<noscript>`,
 * `<template>`, `<head>`, HTML comments, or container tags (e.g., `<div class="ck-content">`).
 */
export function sanitizeHtmlToPlainText(input: any): string {
  if (input === null || input === undefined) {
    return '';
  }
  const raw = typeof input === 'string' ? input : String(input);
  if (!raw) {
    return '';
  }

  // Fast path if there are no HTML tags or HTML entities
  if (!raw.includes('<') && !raw.includes('&')) {
    return raw.trim();
  }

  let cleaned = raw
    // Strip dangerous / non-visible tags along with their full inner contents
    .replace(
      /<(script|style|iframe|object|embed|noscript|template|head)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,
      ' ',
    )
    // Also strip unclosed trailing dangerous tags if malformed HTML is sent
    .replace(
      /<(script|style|iframe|object|embed|noscript|template|head)\b[^>]*>[\s\S]*$/gi,
      '',
    )
    // Strip HTML comments and DOCTYPE declarations
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<!DOCTYPE\b[^>]*>/gi, '')
    // Preserve readable line breaks for <br> and block-level HTML elements
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<hr\b[^>]*\/?>/gi, '\n')
    .replace(/<li\b[^>]*>/gi, '\n• ')
    .replace(
      /<\/(?:p|div|tr|h[1-6]|blockquote|section|article|header|footer|pre|ul|ol)\s*>/gi,
      '\n',
    )
    // Strip remaining HTML tags (e.g., <div class="ck-content">, <div class\="ck-content\">, <span>, <a>)
    .replace(/<\/?[a-zA-Z!][a-zA-Z0-9:-]*(?:\s+[^<>]*)?\/?>/g, '');

  // Decode HTML entities after tag stripping so encoded markup (e.g. &lt;script&gt;)
  // renders safely as literal text and is never re-interpreted as HTML.
  cleaned = cleaned
    .replace(/&#(\d+);/g, (_match, dec) => {
      const code = Number(dec);
      if (Number.isFinite(code) && code >= 0 && code <= 0x10ffff) {
        try {
          return String.fromCodePoint(code);
        } catch (e) {
          return '';
        }
      }
      return '';
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (_match, hex) => {
      const code = parseInt(hex, 16);
      if (Number.isFinite(code) && code >= 0 && code <= 0x10ffff) {
        try {
          return String.fromCodePoint(code);
        } catch (e) {
          return '';
        }
      }
      return '';
    })
    .replace(/&([a-zA-Z]+);/g, (match, name) => {
      const mapped = NAMED_HTML_ENTITIES[name.toLowerCase()];
      return mapped !== undefined ? mapped : match;
    });

  return cleaned
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map(line => line.replace(/[ \t]{2,}/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Extracts `live_agent` / `SYSTEM` message metadata, normalizing payload nesting
 * across real-time socket messages, bot history responses, and template payloads.
 */
export function extractLiveAgentInfo(input: any): LiveAgentMessageInfo | null {
  if (!input) {
    return null;
  }

  const msg = Array.isArray(input?.message)
    ? input.message[0]
    : input?.message || input;

  let compPayload = msg?.component?.payload ?? input?.payload ?? input;
  if (typeof compPayload === 'string') {
    try {
      compPayload = JSON.parse(compPayload);
    } catch (e) {}
  }

  let innerPayload = compPayload?.payload;
  if (typeof innerPayload === 'string') {
    try {
      innerPayload = JSON.parse(innerPayload);
    } catch (e) {}
  }

  const resolvedPayload =
    innerPayload && typeof innerPayload === 'object' ? innerPayload : compPayload;

  const templateType = (
    resolvedPayload?.template_type ||
    compPayload?.template_type ||
    msg?.component?.template_type ||
    msg?.template_type ||
    input?.template_type ||
    ''
  )
    .toString()
    .trim();

  if (
    templateType !== TEMPLATE_TYPES.LIVE_AGENT_TEMPLATE &&
    templateType !== TEMPLATE_TYPES.SYSTEM_TEMPLATE &&
    templateType.toLowerCase() !== 'live_agent' &&
    templateType.toLowerCase() !== 'system'
  ) {
    return null;
  }

  let sender =
    resolvedPayload?.sender ||
    compPayload?.sender ||
    msg?.component?.sender ||
    msg?.sender ||
    input?.sender;

  if (typeof sender === 'string') {
    try {
      sender = JSON.parse(sender);
    } catch (e) {}
  }

  const rawText =
    resolvedPayload?.text ??
    compPayload?.text ??
    msg?.cInfo?.body ??
    msg?.text ??
    input?.text ??
    '';

  const text = sanitizeHtmlToPlainText(rawText);

  const rawSenderType = (sender?.type || '').toString().toLowerCase().trim();
  const screenName = sender?.user?.screenName || sender?.user?.name || undefined;

  let senderType: 'system' | 'user' = 'system';
  if (templateType === TEMPLATE_TYPES.SYSTEM_TEMPLATE) {
    senderType = 'system';
  } else if (rawSenderType === 'user') {
    senderType = 'user';
  } else if (rawSenderType === 'system') {
    senderType = 'system';
  } else if (screenName) {
    senderType = 'user';
  }

  return {
    templateType,
    text,
    sender,
    senderType,
    screenName,
  };
}

const TEXT_ONLY_TEMPLATE_TYPES = new Set<string>([
  '',
  TEMPLATE_TYPES.TEXT,
  TEMPLATE_TYPES.OTHER,
  TEMPLATE_TYPES.LIVE_AGENT_TEMPLATE,
  TEMPLATE_TYPES.SYSTEM_TEMPLATE,
]);

/**
 * Returns true if a `bot_response` message has an empty text payload
 * (`component.payload.text === ''` or `cInfo.text` / `cInfo.body === ''`)
 * and no rich template / attachment content to display.
 */
export function isEmptyBotResponseMessage(msgObj: any): boolean {
  if (!msgObj || msgObj?.type !== 'bot_response') {
    return false;
  }

  const msg = Array.isArray(msgObj?.message)
    ? msgObj.message[0]
    : msgObj?.message;

  const templateType = (getTemplateType(msgObj?.message) || '').toString().trim();
  if (!TEXT_ONLY_TEMPLATE_TYPES.has(templateType)) {
    return false;
  }

  let compPayload = msg?.component?.payload;
  if (typeof compPayload === 'string') {
    const trimmed = compPayload.trim();
    if (!trimmed) {
      return true;
    }
    try {
      compPayload = JSON.parse(trimmed);
    } catch (e) {
      return sanitizeHtmlToPlainText(trimmed).length === 0;
    }
  }

  let innerPayload = compPayload?.payload;
  if (typeof innerPayload === 'string') {
    try {
      innerPayload = JSON.parse(innerPayload);
    } catch (e) {}
  }

  const resolvedPayload =
    innerPayload && typeof innerPayload === 'object' ? innerPayload : compPayload;

  // Preserve messages that carry attachments or interactive/template items
  const hasRichItems =
    (Array.isArray(resolvedPayload?.attachments) &&
      resolvedPayload.attachments.length > 0) ||
    (Array.isArray(compPayload?.attachments) &&
      compPayload.attachments.length > 0) ||
    (Array.isArray(resolvedPayload?.buttons) &&
      resolvedPayload.buttons.length > 0) ||
    (Array.isArray(resolvedPayload?.elements) &&
      resolvedPayload.elements.length > 0) ||
    (Array.isArray(resolvedPayload?.cards) &&
      resolvedPayload.cards.length > 0) ||
    (Array.isArray(resolvedPayload?.quick_replies) &&
      resolvedPayload.quick_replies.length > 0);

  if (hasRichItems) {
    return false;
  }

  const hasPayloadTextField =
    (compPayload && typeof compPayload === 'object' && 'text' in compPayload) ||
    (innerPayload && typeof innerPayload === 'object' && 'text' in innerPayload);

  if (hasPayloadTextField) {
    const payloadText = innerPayload?.text ?? compPayload?.text;
    return sanitizeHtmlToPlainText(payloadText).length === 0;
  }

  const cInfoText =
    msg?.cInfo?.text ??
    msg?.cInfo?.body ??
    msgObj?.cInfo?.text ??
    msgObj?.cInfo?.body;

  if (
    (msg?.cInfo && ('text' in msg.cInfo || 'body' in msg.cInfo)) ||
    (msgObj?.cInfo && ('text' in msgObj.cInfo || 'body' in msgObj.cInfo))
  ) {
    return sanitizeHtmlToPlainText(cInfoText).length === 0;
  }

  const fallbackText = msg?.text ?? msgObj?.text;
  return sanitizeHtmlToPlainText(fallbackText).length === 0;
}

export const BUBBLE_BREAK_MARKER = '@@QQ-BubbleBreak-@@QQ';

/**
 * Replaces `@@QQ-BubbleBreak-@@QQ` markers with a space and trims extra whitespace,
 * useful for non-bubble consumers such as Text-to-Speech.
 */
export function stripBubbleBreakMarker(input: any): string {
  if (typeof input !== 'string') {
    return '';
  }
  return input
    .split(BUBBLE_BREAK_MARKER)
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .join(' ');
}

function parseJsonSafe(value: any): any {
  if (typeof value !== 'string') {
    return value;
  }
  const trimmed = value.trim();
  if (!trimmed || (trimmed[0] !== '{' && trimmed[0] !== '[')) {
    return value;
  }
  try {
    return JSON.parse(trimmed);
  } catch (e) {
    return value;
  }
}

function clonePayloadWithSegmentText(
  messageObj: any,
  segmentText: string,
  isLastSegment: boolean,
): any {
  const msgArray = Array.isArray(messageObj?.message)
    ? messageObj.message
    : messageObj?.message
    ? [messageObj.message]
    : [];
  const firstMsg = msgArray[0];

  const cloned: any = {
    ...messageObj,
  };

  if (typeof cloned.text === 'string') {
    cloned.text = segmentText;
  }

  if (cloned.cInfo && typeof cloned.cInfo === 'object') {
    cloned.cInfo = {
      ...cloned.cInfo,
      ...('text' in cloned.cInfo ? {text: segmentText} : {}),
      ...('body' in cloned.cInfo ? {body: segmentText} : {}),
    };
  }

  if (firstMsg && typeof firstMsg === 'object') {
    const nextFirstMsg: any = {
      ...firstMsg,
      ...('text' in firstMsg ? {text: segmentText} : {}),
    };

    if (firstMsg.cInfo && typeof firstMsg.cInfo === 'object') {
      nextFirstMsg.cInfo = {
        ...firstMsg.cInfo,
        ...('text' in firstMsg.cInfo ? {text: segmentText} : {}),
        ...('body' in firstMsg.cInfo ? {body: segmentText} : {}),
      };
    }

    if (firstMsg.component && typeof firstMsg.component === 'object') {
      const nextComponent: any = {...firstMsg.component};
      const rawCompPayload = firstMsg.component.payload;
      const parsedCompPayload = parseJsonSafe(rawCompPayload);

      if (parsedCompPayload && typeof parsedCompPayload === 'object') {
        const nextCompPayload: any = {...parsedCompPayload};
        const rawInnerPayload = parsedCompPayload.payload;
        const parsedInnerPayload = parseJsonSafe(rawInnerPayload);

        if (parsedInnerPayload && typeof parsedInnerPayload === 'object') {
          const nextInnerPayload: any = {
            ...parsedInnerPayload,
            text: segmentText,
          };
          if (!isLastSegment) {
            delete nextInnerPayload.buttons;
            delete nextInnerPayload.quick_replies;
            delete nextInnerPayload.elements;
            delete nextInnerPayload.cards;
            delete nextInnerPayload.attachments;
          }
          nextCompPayload.payload = nextInnerPayload;
        }

        if (
          'text' in nextCompPayload ||
          !(parsedInnerPayload && typeof parsedInnerPayload === 'object')
        ) {
          nextCompPayload.text = segmentText;
        }

        if (!isLastSegment) {
          delete nextCompPayload.buttons;
          delete nextCompPayload.quick_replies;
          delete nextCompPayload.elements;
          delete nextCompPayload.cards;
          delete nextCompPayload.attachments;
        }

        nextComponent.payload = nextCompPayload;
      } else {
        nextComponent.payload = segmentText;
      }

      nextFirstMsg.component = nextComponent;
    }

    cloned.message = [nextFirstMsg, ...msgArray.slice(1)];
  }

  return cloned;
}

/**
 * Splits a `bot_response` message containing `@@QQ-BubbleBreak-@@QQ` into an
 * ordered (top-to-bottom / chronological) array of separate bubble messages,
 * omitting the delimiter itself and any empty segments.
 */
export function splitBotResponseOnBubbleBreak(
  messageObj: any,
  options?: {preserveStreamMessageId?: boolean},
): any[] {
  if (!messageObj) {
    return [];
  }
  if (messageObj?.type !== 'bot_response') {
    return [messageObj];
  }

  const firstMsg = Array.isArray(messageObj?.message)
    ? messageObj.message[0]
    : messageObj?.message;

  const compPayload = parseJsonSafe(firstMsg?.component?.payload);
  const innerPayload =
    compPayload && typeof compPayload === 'object'
      ? parseJsonSafe(compPayload?.payload)
      : undefined;

  const rawText =
    (innerPayload && typeof innerPayload === 'object'
      ? innerPayload?.text
      : undefined) ??
    (compPayload && typeof compPayload === 'object'
      ? compPayload?.text
      : typeof compPayload === 'string'
      ? compPayload
      : undefined) ??
    firstMsg?.cInfo?.text ??
    firstMsg?.cInfo?.body ??
    messageObj?.cInfo?.text ??
    messageObj?.cInfo?.body ??
    firstMsg?.text ??
    messageObj?.text;

  if (typeof rawText !== 'string' || !rawText.includes(BUBBLE_BREAK_MARKER)) {
    return [messageObj];
  }

  const segments = rawText
    .split(BUBBLE_BREAK_MARKER)
    .map((part) => part.trim())
    .filter(
      (part) => part.length > 0 && sanitizeHtmlToPlainText(part).length > 0,
    );

  if (segments.length === 0) {
    return [];
  }

  const parsedTimeMillis = Number(messageObj?.timeMillis);
  const baseTimeMillis =
    Number.isFinite(parsedTimeMillis) && parsedTimeMillis > 0
      ? parsedTimeMillis
      : Date.now();
  const baseMessageId = messageObj?.messageId;
  const preserveStreamMessageId = options?.preserveStreamMessageId === true;

  return segments.map((segmentText, index) => {
    const isLastSegment = index === segments.length - 1;
    const itemId =
      index === 0 && messageObj?.itemId ? messageObj.itemId : getItemId();
    const nextMsg = clonePayloadWithSegmentText(
      messageObj,
      segmentText,
      isLastSegment,
    );

    nextMsg.itemId = itemId;
    nextMsg.timeMillis =
      segments.length === 1
        ? messageObj?.timeMillis ?? baseTimeMillis
        : baseTimeMillis + index;

    if (messageObj?._id) {
      nextMsg._id =
        index === 0 ? messageObj._id : `${messageObj._id}_part_${index}`;
    } else {
      nextMsg._id = itemId;
    }

    if (baseMessageId != null && segments.length > 1) {
      if (preserveStreamMessageId) {
        nextMsg.messageId = isLastSegment
          ? baseMessageId
          : `${baseMessageId}_part_${index}_${baseTimeMillis}`;
      } else if (index > 0) {
        nextMsg.messageId = `${baseMessageId}_part_${index}`;
      }
    }

    return nextMsg;
  });
}

/**
 * Returns true if the template type is an agent typing indicator event
 * (`agent_start_typing` or `agent_stop_typing`), which should be ignored in UI.
 */
export function isAgentTypingTemplate(templateType?: string): boolean {
  const normalized = (templateType || '').toString().trim().toLowerCase();
  return (
    normalized === TEMPLATE_TYPES.AGENT_START_TYPING ||
    normalized === TEMPLATE_TYPES.AGENT_STOP_TYPING
  );
}

/**
 * Single predicate to determine if a message should be excluded from
 * chat state, history, and UI rendering (agent typing events or empty `bot_response` text messages).
 */
export function shouldIgnoreChatMessage(messageObj: any): boolean {
  if (!messageObj) {
    return false;
  }
  const tType = getTemplateType(messageObj?.message ?? messageObj);
  return isAgentTypingTemplate(tType) || isEmptyBotResponseMessage(messageObj);
}
