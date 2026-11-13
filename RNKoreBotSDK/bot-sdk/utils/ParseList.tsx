/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Alert, Linking, StyleSheet, Text, View} from 'react-native';
import { FallbackCommunicationsAPI } from '../components/LazyCommunications';
import {getButtonTheme} from '../theme/themeHelper';
const WWW_URL_PATTERN = /^www\./i;

const emojiMap = {
  ':)': '😀',
  ':(': '😞',
  ':D': '😁',
  ':P': '😛',
  ';)': '😉',
  ':O': '😮',
  ':|': '😐',
  ':’(': '😢',
  ':’D': '😂',
  ':3': '😺',
  ':*)': '😍',
  ':S': '😖',
  '>:( ': '😠',
  ':/': '😕',
  ':o': '😲',
  ':c': '😔',
  ':X': '😶',
  xD: '😆',
  'B-)': '😎',
  ':^)': '😄',
  '>.<': '😣',
  '-_-': '😑',
};

const htmlEntities = {
  '&quot;': '"',
  '&apos;': "'",
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&nbsp;': ' ',
  '&copy;': '©',
  '&reg;': '®',
  '&euro;': '€',
  '&yen;': '¥',
  '&cent;': '¢',
  '&pound;': '£',
  '&deg;': '°',
  '&para;': '¶',
  '&sect;': '§',
  '&trade;': '™',
  '&times;': '×',
  '&divide;': '÷',
  '&laquo;': '«',
  '&raquo;': '»',
};

export function getParseList(theme?: any, customLinkColor?: string): any[] {
  let linkColor = customLinkColor;
  if (!linkColor && theme) {
    const bodyBtn =
      (theme?.v3?.body as any)?.buttons ||
      (theme?.v3?.body as any)?.button;
    const buttonTheme = getButtonTheme(theme);
    const brandingBtnBg = buttonTheme?.ACTIVE_BG_COLOR || '#002259';
    linkColor =
      bodyBtn?.border_color || bodyBtn?.borderColor || brandingBtnBg;
  }
  if (!linkColor) {
    linkColor = '#002259';
  }

  // const renderText = (matchingString: any, matches: any) => {
  //   // matches => ["[@michel:5455345]", "@michel", "5455345"]
  //   let pattern = /\[(@[^:]+):([^\]]+)\]/i;
  //   let match = matchingString.match(pattern);
  //   return `^^${match[1]}^^`;
  // };

  const renderHeaderNew = (
    level: number,
    matchingString: string,
    matches: string[],
  ) => {
    const Header = `h${level}`;
    return <Text style={styles1[Header]}>{matches[1]}</Text>;
  };

  //start

  const renderBold = (matchingString: string, matches: string[]) => (
    <Text style={styles1.bold}>{matches[1]}</Text>
  );

  const renderItalic = (matchingString: string, matches: string[]) => (
    <Text style={[styles1.italic]}>{matches[1]}</Text>
  );

  const renderBoldItalic = (matchingString: string, matches: string[]) => (
    <Text style={styles1.boldItalic}>{matches[1]}</Text>
  );

  const renderLink = (matchingString: string, matches: string[]) => (
    <Text
      style={[styles1.link, {color: linkColor, textDecorationLine: 'underline'}]}
      onPress={() => onUrlPress(matches[2] || matchingString)}>
      {matches[1]}
    </Text>
  );

  const renderHeader =
    (level: number) => (matchingString: string, matches: string[]) => {
      const Header = `h${level}`;
      return (
        <Text style={styles1[Header]}>
          {matches[3]}
          {'\n'}
        </Text>
      );
    };
  // renderHeaderNew = (
  //   level: number,
  //   matchingString: string,
  //   matches: string[],
  // ) => {
  //   const Header = `h${level}`;
  //   return <Text style={styles1[Header]}>{matches[1]}</Text>;
  // };

  const renderStrikethrough = (matchingString: string, matches: string[]) => (
    <Text style={styles1.strikethrough}>{matches[1]}</Text>
  );

  const renderBlockquote = (matchingString: string, matches: string[]) => (
    <Text style={styles1.blockquote}>{matches[1]}</Text>
  );

  const renderCode = (matchingString: string, matches: string[]) => (
    <Text style={styles1.code}>{matches[1]}</Text>
  );

  // const renderUnorderedList2 = (matchingString: string, matches: string[]) => (
  //   <Text style={styles1.unorderedList}>{matches[1]}</Text>
  // );
  const renderUnorderedList = (matchingString: string, matches: string[]) => {
    return `\n\u2022 ${matches[1]}`;
  };

  const renderCheckboxList = (matchingString: string, matches: string[]) => {
    const isChecked = matches[1] === 'x';
    return (
      <View key={matchingString} style={styles1.taskItem}>
        <Text style={styles1.taskCheckbox}>{isChecked ? '✔️' : '⬜'}</Text>
        <Text style={styles1.taskText}>{matches[2]}</Text>
      </View>
    );
  };

  const renderOrderedList = (matchingString: string, matches: string[]) => (
    <Text style={styles1.orderedList}>{matches[1]}</Text>
  );

  const renderHorizontalRule = () => (
    <Text style={styles1.horizontalRule}>
      {'\n'}────────────{'\n'}
    </Text>
  );

  const renderBlockCode = (matchingString: string, matches: string[]) => (
    <Text style={styles1.codeBlock}>{matches[1]}</Text>
  );

  const renderTable_2 = (matchingString: string, _matches: string[]) => {
    // Split the table into rows
    const rows = matchingString
      .trim()
      .split('\n')
      .map(row =>
        row
          .split('|')
          .map(cell => cell.trim())
          .filter(cell => cell),
      );

    // Extract headers and body
    const headers = rows[0];
    const body = rows.slice(2); // Adjust slice to skip the separator row

    return (
      <View key={matchingString} style={styles1.table}>
        <View style={styles1.tableRow}>
          {headers.map((cell, i) => (
            <Text key={i} style={styles1.tableHeader}>
              {cell}
            </Text>
          ))}
        </View>
        {body.map((row, i) => (
          <View key={i} style={styles1.tableRow}>
            {row.map((cell, j) => (
              <Text key={j} style={styles1.tableCell}>
                {cell}
              </Text>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const renderTable = (matchingString: string, matches: string[]) => {
    const rows = matches[0].trim().split('\n');
    const header = rows[0]
      .split('|')
      .map(cell => cell.trim())
      .filter(cell => cell);
    // const align = rows[1]
    //   .split('|')
    //   .map(cell => cell.trim())
    //   .filter(cell => cell);
    const body = rows.slice(2).map(row =>
      row
        .split('|')
        .map(cell => cell.trim())
        .filter(cell => cell),
    );

    return (
      <View style={styles1.table}>
        <View style={styles1.tableRow}>
          {header.map((cell, i) => (
            <Text key={i} style={styles1.tableHeader}>
              {cell}
            </Text>
          ))}
        </View>
        {body.map((row, i) => (
          <View key={i} style={styles1.tableRow}>
            {row.map((cell, j) => (
              <Text key={j} style={styles1.tableCell}>
                {cell}
              </Text>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const renderTaskList = (matchingString: string, matches: string[]) => (
    <Text style={styles1.taskListItem}>
      {matches[1] === 'x' ? '☑️' : '⬜️'} {matches[2]}
    </Text>
  );

  const renderFootnote = (matchingString: string, matches: string[]) => (
    <Text style={styles1.footnote}>
      {matches[1]}: {matches[2]}
    </Text>
  );

  const renderFootnoteReference = (
    matchingString: string,
    matches: string[],
  ) => (
    <Text
      key={matchingString}
      style={[styles1.footnoteReference, {color: linkColor, textDecorationLine: 'underline'}]}>
      {`[${matches[1]}]`}
    </Text>
  );

  const renderHTML = (matchingString: string, matches: string[]) => (
    <Text style={styles1.html}>{matches[1]}</Text>
  );
  const renderParagraph = (matchingString: string, matches: string[]) => (
    <View style={styles1.paragraph}>
      <Text style={styles1.paragraph}>{matches[1]}</Text>
    </View>
  );

  const renderPhone = (matchingString: string, matches: string[]) => (
    <Text
      style={[styles1.phone, {color: linkColor, textDecorationLine: 'underline'}]}
      onPress={() => onPhonePress(matches[0])}>
      {matches[0]}
    </Text>
  );

  const renderUrl = (matchingString: string, matches: string[]) => (
    <Text
      style={[styles1.url, {color: linkColor, textDecorationLine: 'underline'}]}
      onPress={() => onUrlPress(matches[0])}>
      {matches[0]}
    </Text>
  );
  const renderUrl_2 = (matchingString: string, matches: string[]) => (
    <Text
      key={matchingString}
      style={[styles1.link, {color: linkColor, textDecorationLine: 'underline'}]}
      onPress={() => onUrlPress(matches[2] || matchingString)}>
      {matches[1]}
    </Text>
  );

  const renderEmail = (matchingString: string, matches: string[]) => (
    <Text
      style={[styles1.email, {color: linkColor, textDecorationLine: 'underline'}]}
      onPress={() => onEmailPress(matches[0])}>
      {matches[0]}
    </Text>
  );

  // Custom render function to replace emoticons with emojis
  const renderEmoticon = (match: string) => {
    return emojiMap[match] || match; // Use the emoji from the map or return the original match
  };

  const onUrlPress = (url: string) => {
    if (!url || typeof url !== 'string') {
      return;
    }
    let targetUrl = url.trim();

    // If it's a markdown link [label](url), extract the target URL
    const markdownMatch = targetUrl.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (markdownMatch && markdownMatch[2]) {
      targetUrl = markdownMatch[2].trim();
    }

    // Handle www. or missing scheme
    if (WWW_URL_PATTERN.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    } else if (
      !targetUrl.startsWith('http://') &&
      !targetUrl.startsWith('https://') &&
      !targetUrl.includes('://') &&
      !targetUrl.startsWith('mailto:') &&
      !targetUrl.startsWith('tel:')
    ) {
      targetUrl = `https://${targetUrl}`;
    }

    console.log('🔗 [Link Clicked]:', targetUrl, url !== targetUrl ? `(original: "${url}")` : '');

    Linking.canOpenURL(targetUrl)
      .then(supported => {
        if (supported) {
          Linking.openURL(targetUrl).catch(err => {
            console.warn('Cannot open URL:', targetUrl, err);
          });
        } else {
          // On Android 11+ (API 30+), canOpenURL may return false if <queries>
          // is not declared in AndroidManifest.xml, but openURL still opens the default browser.
          Linking.openURL(targetUrl).catch(err => {
            console.warn('Cannot open URL via fallback:', targetUrl, err);
          });
        }
      })
      .catch(err => {
        // Fallback: directly attempt openURL
        Linking.openURL(targetUrl).catch(openErr => {
          console.warn('Cannot open URL:', targetUrl, openErr);
        });
      });
  };

  const onPhonePress = async (phone: string) => {
    try {
      // Try to dynamically load react-native-communications
      const communications = await loadCommunications();
      if (communications) {
        communications.phonecall(phone, true);
      } else {
        // Fallback to basic Linking API
        FallbackCommunicationsAPI.phonecall(phone, true);
      }
    } catch (error) {
      console.warn('Failed to load communications, using fallback:', error);
      // Fallback to basic Linking API
      FallbackCommunicationsAPI.phonecall(phone, true);
    }
  };

  const sendEmail = (email: string, subject?: string, body?: string) => {
    // Construct the mailto URL
    let url = `mailto:${email}`;
    let params: string[] = [];

    if (subject) {
      params.push(`subject=${encodeURIComponent(subject)}`);
    }
    if (body) {
      params.push(`body=${encodeURIComponent(body)}`);
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    Linking.openURL(url)
      .then(() => console.log('Email client opened successfully'))
      .catch(err => {
        console.error('Error opening email client:', err);
        Alert.alert('Error', `An error occurred: ${err.message}`);
      });
  };

  const loadCommunications = async () => {
    try {
      const CommunicationsModule = await import('react-native-communications');
      return CommunicationsModule.default || CommunicationsModule;
    } catch (error) {
      console.warn('react-native-communications not available:', error);
      return null;
    }
  };

  const onEmailPress = (email: string) => {
    console.log('email ------------>:', email);
    //Communications.email([email], null, null, null, null);
    sendEmail(email);
  };

  let parseList: any = [
    // Smileys & Emotion
    {
      pattern: /(^|[^\w]):\)(?=[^\w]|$)/g,
      renderText: (match: string) => renderEmoticon(match.trim()),
    },
    {
      pattern: /(^|[^\w]):\((?=[^\w]|$)/g,
      renderText: (match: string) => renderEmoticon(match.trim()),
    },
    {
      pattern: /(^|[^\w]):D(?=[^\w]|$)/g,
      renderText: (match: string) => renderEmoticon(match.trim()),
    },
    {
      pattern: /(^|[^\w]):P(?=[^\w]|$)/g,
      renderText: (match: string) => renderEmoticon(match.trim()),
    },
    {
      pattern: /(^|[^\w]);\)(?=[^\w]|$)/g,
      renderText: (match: string) => renderEmoticon(match.trim()),
    },
    {
      pattern: /(^|[^\w]):O(?=[^\w]|$)/g,
      renderText: (match: string) => renderEmoticon(match.trim()),
    },
    {
      pattern: /(^|[^\w]):\|(?=[^\w]|$)/g,
      renderText: (match: string) => renderEmoticon(match.trim()),
    },
    {
      pattern: /(^|[^\w]):’\((?=[^\w]|$)/g,
      renderText: (match: string) => renderEmoticon(match.trim()),
    },
    {
      pattern: /(^|[^\w]):’D(?=[^\w]|$)/g,
      renderText: (match: string) => renderEmoticon(match.trim()),
    },
    {
      pattern: /(^|[^\w]):3(?=[^\w]|$)/g,
      renderText: (match: string) => renderEmoticon(match.trim()),
    },
    {
      pattern: /(^|[^\w]):\*\)(?=[^\w]|$)/g,
      renderText: (match: string) => renderEmoticon(match.trim()),
    },
    {
      pattern: /(^|[^\w]):S(?=[^\w]|$)/g,
      renderText: (match: string) => renderEmoticon(match.trim()),
    },
    {
      pattern: /(^|[^\w])>:\((?=[^\w]|$)/g,
      renderText: (match: string) => renderEmoticon(match.trim()),
    },
    {
      pattern: /(^|[^\w]):\/(?=[^\w]|$)/g,
      renderText: (match: string) => renderEmoticon(match.trim()),
    },
    {
      pattern: /(^|[^\w]):o(?=[^\w]|$)/g,
      renderText: (match: string) => renderEmoticon(match.trim()),
    },
    {
      pattern: /(^|[^\w]):c(?=[^\w]|$)/g,
      renderText: (match: string) => renderEmoticon(match.trim()),
    },
    {
      pattern: /(^|[^\w]):X(?=[^\w]|$)/g,
      renderText: (match: string) => renderEmoticon(match.trim()),
    },
    {
      pattern: /(^|[^\w])xD(?=[^\w]|$)/g,
      renderText: (match: string) => renderEmoticon(match.trim()),
    },
    {
      pattern: /(^|[^\w])B-\)(?=[^\w]|$)/g,
      renderText: (match: string) => renderEmoticon(match.trim()),
    },
    {
      pattern: /(^|[^\w]):\^\)(?=[^\w]|$)/g,
      renderText: (match: string) => renderEmoticon(match.trim()),
    },
    {
      pattern: /(^|[^\w])>.<(?=[^\w]|$)/g,
      renderText: (match: string) => renderEmoticon(match.trim()),
    },
    {
      pattern: /(^|[^\w])-_-(?=[^\w]|$)/g,
      renderText: (match: string) => renderEmoticon(match.trim()),
    },
    {
      pattern: /#h1(\w+)/,
      renderText: (matchingString: string, matches: string[]) =>
        renderHeaderNew(1, matchingString, matches),
    },
    {
      pattern: /#h2(\w+)/,
      renderText: (matchingString: string, matches: string[]) =>
        renderHeaderNew(2, matchingString, matches),
    },
    {
      pattern: /#h3(\w+)/,
      renderText: (matchingString: string, matches: string[]) =>
        renderHeaderNew(3, matchingString, matches),
    },
    {
      pattern: /#h4(\w+)/,
      renderText: (matchingString: string, matches: string[]) =>
        renderHeaderNew(4, matchingString, matches),
    },
    {
      pattern: /#h5(\w+)/,
      renderText: (matchingString: string, matches: string[]) =>
        renderHeaderNew(5, matchingString, matches),
    },
    {
      pattern: /#h6(\w+)/,
      renderText: (matchingString: string, matches: string[]) =>
        renderHeaderNew(6, matchingString, matches),
    },

    {
      pattern: /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
      style: [styles1.phone, {color: linkColor, textDecorationLine: 'underline'}],
      renderText: renderPhone,
      onPress: onPhonePress,
    },
    {
      pattern: /\[([^\]]+)\]\(([^)]+)\)/,
      style: [styles1.link, {color: linkColor, textDecorationLine: 'underline'}],
      renderText: (_matchingString: string, matches: string[]) => matches[1],
      onPress: onUrlPress,
    },
    {
      type: 'url',
      style: [styles1.url, {color: linkColor, textDecorationLine: 'underline'}],
      onPress: onUrlPress,
    },
    {
      pattern: /(\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b)/,
      style: [styles1.email, {color: linkColor, textDecorationLine: 'underline'}],
      renderText: renderEmail,
      onPress: onEmailPress,
    },
    {pattern: /~(.*?)~/, renderText: renderItalic},
    {pattern: /<p>(.*?)<\/p>/, renderText: renderParagraph},
    {pattern: /<div>(.*?)<\/div>/g, renderText: renderHTML},
    {pattern: /(^|\s)(#)\s(.*)/, renderText: renderHeader(1)},
    {pattern: /(^|\s)(##)\s(.*)/, renderText: renderHeader(2)},
    {pattern: /(^|\s)(###)\s(.*)/, renderText: renderHeader(3)},
    {pattern: /(^|\s)(####)\s(.*)/, renderText: renderHeader(4)},
    {pattern: /(^|\s)(#####)\s(.*)/, renderText: renderHeader(5)},
    {pattern: /(^|\s)(######)\s(.*)/, renderText: renderHeader(6)},

    {pattern: /\~\~(.*?)\~\~/, renderText: renderStrikethrough},
    // {pattern: /~(.*?)~/, renderText: renderItalic},

    {pattern: />(.*?)$/, renderText: renderBlockquote},
    {pattern: />\s*(.*)$/gm, renderText: renderBlockquote},
    {pattern: /`([^`]*)`/, renderText: renderCode},
    {pattern: /^\d+\.\s(.*?)$/, renderText: renderOrderedList},
    {pattern: /^---$/, renderText: renderHorizontalRule},
    {pattern: /```([\s\S]*?)```/, renderText: renderBlockCode},
    {pattern: /\[(.*?)\]\((.*?)\)/, renderText: renderLink},
    {pattern: /\|([^|]+)\|([^|]+)\|$/, renderText: renderTable},
    {
      pattern:
        /(?:\|([\s\S]*?)\|\r?\n)(?:\|[-:| ]+\|\r?\n)(?:\|([\s\S]*?)\|\r?\n)+/g,
      renderText: renderTable_2,
    },
    {
      pattern: /^\s*\|.*\|\r?\n(?:^\s*\|.*\|\r?\n)*/gm,
      renderText: renderTable_2,
    },
    {
      pattern: /^\s*\|.*\|\s*\r?\n(?:^\s*\|.*\|\s*\r?\n)*/gm,
      renderText: renderTable_2,
    },
    //{pattern: /~(.*?)~/, renderText: renderItalic},
    {pattern: /-\s\[(\s|x)\]\s(.*?)$/, renderText: renderTaskList},
    {pattern: /\[\^(\d+)\]:\s(.*?)$/, renderText: renderFootnote},
    {pattern: /^\[\^(\d+)\]:\s*(.*)$/gm, renderText: renderFootnote},
    {pattern: /\[\^(\d+)\]/g, renderText: renderFootnoteReference},

    {pattern: /\*\*\*(.*?)\*\*\*/, renderText: renderBoldItalic},
    {pattern: /\*(.*?)\*/, renderText: renderBold},
    //{pattern: /\*(.*?)\*/g, renderText: renderItalic}, // Correct renderText to renderItalic

    {pattern: /(?:^\s*\*\s)(.*)/gm, renderText: renderUnorderedList},
    {pattern: /^\s*-\s+(.*)$/, renderText: renderUnorderedList},
    {pattern: /^\s*\*\s+(.*)$/, renderText: renderUnorderedList},
    {pattern: /^\s*[-*]\s+(.*)$/, renderText: renderUnorderedList},
    {pattern: /- \[([ x])\] (.+)/g, renderText: renderCheckboxList},
    {pattern: /^-{3,}$/gm, renderText: renderHorizontalRule},
    {
      pattern:
        /&quot;|&apos;|&amp;|&lt;|&gt;|&nbsp;|&copy;|&reg;|&euro;|&yen;|&cent;|&pound;|&deg;|&para;|&sect;|&trade;|&times;|&divide;|&laquo;|&raquo;/g,
      renderText: (match: string) => {
        return htmlEntities[match]; // Return the corresponding character for each entity
      },
    },
  ];

  // let parseList1: any = [
  //   {pattern: /^\s*-\s+(.*)$/, renderText: renderUnorderedList},
  //   {pattern: /^\s*\*\s+(.*)$/, renderText: renderUnorderedList},
  //   {pattern: /^\s*[-*]\s+(.*)$/, renderText: renderUnorderedList},
  // ];

  return parseList;
}

const styles1 = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  taskCheckbox: {
    // fontSize: 16,
    marginRight: 8,
    color: '#000', // Change the color as needed
  },
  taskText: {
    //fontSize: 14,
    //color: '#333', // Change the color as needed
  },
  footnoteReference: {
    color: '#002259',
    textDecorationLine: 'underline',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  text: {
    fontSize: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  boldItalic: {
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  link: {
    color: '#002259',
    textDecorationLine: 'underline',
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  h4: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  h5: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  h6: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  blockquote: {
    // borderLeftWidth: 4,
    // borderLeftColor: '#cccccc',
    // paddingLeft: 10,
    // color: '#666666',
    // fontStyle: 'italic',

    borderLeftWidth: 4,
    //borderLeftColor: 'gray',
    paddingLeft: 10,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    fontStyle: 'italic', // Add italic if needed
    color: '#666666', // Add color if needed
  },
  code: {
    fontFamily: 'monospace',
    // backgroundColor: '#f5f5f5',
    padding: 2,
    borderRadius: 4,
  },
  unorderedList: {
    //fontSize: 16,
    marginBottom: 5,
    marginLeft: 20, // Indent list items
  },
  orderedList: {
    marginLeft: 20,
  },
  horizontalRule: {
    textAlign: 'center',
  },
  codeBlock: {
    fontFamily: 'monospace',
    // backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 4,
  },
  table: {
    borderWidth: 1,
    borderColor: '#cccccc',
    marginTop: 10,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    flex: 1,
    fontWeight: 'bold',
    padding: 5,
    borderWidth: 1,
    borderColor: '#cccccc',
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    flex: 1,
    padding: 5,
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  taskListItem: {
    marginLeft: 20,
  },
  footnote: {
    fontSize: 12,
    color: '#666666',
  },
  html: {
    paddingTop: 5,
    fontFamily: 'serif',
    //color: '#333333',
    paddingBottom: 5,
  },
  paragraph: {
    paddingBottom: 5,
    paddingTop: 5,
  },
  phone: {
    color: '#002259',
    textDecorationLine: 'underline',
  },
  url: {
    color: '#002259',
    textDecorationLine: 'underline',
  },
  email: {
    color: '#002259',
    textDecorationLine: 'underline',
  },
});
