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

  handleAppNavigation = (navigationUrl: string, item: any) => {
    if (!navigationUrl) {
      return;
    }
    // Take the dynamic URL directly from the template JSON
    if (navigationUrl.includes('://')) {
      Linking.openURL(navigationUrl).catch(err => {
        console.warn('Could not open navigation URL:', navigationUrl, err);
      });
    } else {
      this.props.navigation?.navigate(navigationUrl, { data: item });
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
