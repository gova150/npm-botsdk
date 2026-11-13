import * as React from 'react';
import {SafeAreaView, Linking} from 'react-native';
import styles from './styles';
import KoreChat from 'rn-kore-bot-sdk-v79';
import {botConfig} from '../../config/BotConfig';
import {ROUTE_NAMES} from '../../navigation/RouteNames';

import WAKeyboardAvoidingView from '../../components/WAKeyboardAvoidingView';
import {
  TEMPLATE_TYPES,
} from 'rn-kore-bot-sdk-v79';
import CustomButton from '../../customTemplates/CustomButton';

interface homeState {
  modalVisible?: boolean;
  viewMoreObj?: any;
}
interface HomeProps {
  navigation?: any;
  route?: any;
  onStatusBarColor: (colorCode: string) => void;
}

class Home extends React.Component<HomeProps, homeState> {
  _unsubscribeConn: any;
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      modalVisible: false,
      viewMoreObj: undefined,
    };
  }

  resolveRoute = (navUrl: string): string => {
    if (!navUrl) {
      return '';
    }
    let target = navUrl;
    if (target.includes('://')) {
      const parts = target.split('://');
      target = (parts[1] || '').split('?')[0].replace(/^\/+|\/+$/g, '');
    } else if (target.startsWith('/')) {
      target = target.slice(1).split('?')[0];
    }
    const clean = target.toLowerCase();
    if (clean === 'page1' || clean === 'page_one' || clean === 'pageone') {
      return ROUTE_NAMES.PAGE_ONE;
    }
    if (clean === 'page2' || clean === 'page_two' || clean === 'pagetwo') {
      return ROUTE_NAMES.PAGE_TWO;
    }
    if (clean === 'home' || clean === 'main_home' || clean === 'mainhome') {
      return ROUTE_NAMES.MAIN_HOME;
    }
    if (clean === 'welcome' || clean === 'settings') {
      return ROUTE_NAMES.WELCOME_SCREEN;
    }
    return target;
  };

  handleAppNavigation = async (navigationUrl: string, item: any) => {
    if (!navigationUrl) {
      return;
    }

    const routeName = this.resolveRoute(navigationUrl);

    // If it's an external web URL (http/https), open in browser
    if (
      navigationUrl.startsWith('http://') ||
      navigationUrl.startsWith('https://')
    ) {
      Linking.openURL(navigationUrl).catch(err => {
        console.warn('Could not open web URL:', navigationUrl, err);
      });
      return;
    }

    // Attempt internal screen navigation first
    if (routeName && this.props.navigation?.navigate) {
      try {
        this.props.navigation.navigate(routeName, {
          data: item,
          navigationUrl,
        });
        return;
      } catch (e) {
        console.warn('Internal navigation failed for route:', routeName, e);
      }
    }

    // Fallback: Check if device OS has an app registered for this custom URL scheme
    if (navigationUrl.includes('://')) {
      try {
        const canOpen = await Linking.canOpenURL(navigationUrl);
        if (canOpen) {
          await Linking.openURL(navigationUrl);
        } else {
          console.warn('No Activity found to handle URL scheme:', navigationUrl);
        }
      } catch (err) {
        console.warn('Could not open navigation URL:', navigationUrl, err);
      }
    }
  };

  render() {
    let config: any = botConfig;
    if (this.props.route?.params?.botConfig) {
      config = this.props.route?.params?.botConfig;
    }
    return (
      <SafeAreaView style={styles.rootContainer}>
        <WAKeyboardAvoidingView style={styles.mainStyle2}>
          <KoreChat
            botConfig={config}
            fontFamily="DM Sans"
            alwaysShowSend={true}
            onAppNavigation={this.handleAppNavigation}
            onClose={() => {
              if (this.props.navigation?.canGoBack?.()) {
                this.props.navigation.goBack();
              } else {
                this.props.navigation.navigate(ROUTE_NAMES.MAIN_HOME);
              }
            }}
            statusBarColor={(color: any) => {
              this.props.onStatusBarColor(color);
            }}
            {...this.props}
          />
        </WAKeyboardAvoidingView>
      </SafeAreaView>
    );
  }
  getCustomTemplates() {
    const hashMap = new Map();
    hashMap.set(TEMPLATE_TYPES.BUTTON, CustomButton);

    return hashMap;
  }
}

export default Home;
