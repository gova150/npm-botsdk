/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './SampleUI/src/botIndex';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('SampleUI', () => App);
