import * as React from 'react';
import {normalize} from '../utils/helpers';
import Color from '../theme/Color';
import Svg, {Path} from 'react-native-svg';

export interface HeaderProps {
  width: number;
  height: number;
  color: string;
}

const WIDTH = 17;
const HEIGHT = 17;

export const HeaderHelp = (props: HeaderProps) => {
  let width = props.width || normalize(WIDTH);
  let height = props.height || normalize(HEIGHT);
  let strokeColor = props.color || Color.black;

  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill={strokeColor}>
      <Path
        d="M7.11956 8.09317C7.11956 5.60254 9.59056 4.46819 11.41 5.36853C12.5593 5.93725 13.26 7.30009 13.0294 8.41579C12.8581 9.24476 12.4996 9.72966 11.7763 10.3211L11.4973 10.5424C10.791 11.0964 10.5927 11.3836 10.5927 12.0489C10.5927 12.3713 10.3313 12.6326 10.0089 12.6326C9.68653 12.6326 9.42516 12.3713 9.42516 12.0489C9.42516 11.0017 9.77624 10.4383 10.6297 9.7413L10.905 9.52313C11.5325 9.02974 11.772 8.73156 11.8861 8.17946C12.0071 7.59409 11.5743 6.75251 10.8922 6.41495C9.78568 5.8674 8.28709 6.55535 8.28709 8.09317C8.28709 8.41558 8.02573 8.67694 7.70332 8.67694C7.38092 8.67694 7.11956 8.41558 7.11956 8.09317Z"
        fill={strokeColor}
      />
      <Path
        d="M10.7681 14.227C10.7681 14.62 10.4496 14.9385 10.0566 14.9385C9.66369 14.9385 9.34516 14.62 9.34516 14.227C9.34516 13.8341 9.66369 13.5156 10.0566 13.5156C10.4496 13.5156 10.7681 13.8341 10.7681 14.227Z"
        fill={strokeColor}
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10.0002 1.11133C5.09102 1.11133 1.11133 5.09102 1.11133 10.0002C1.11133 14.9094 5.09102 18.8891 10.0002 18.8891C14.9094 18.8891 18.8891 14.9094 18.8891 10.0002C18.8891 5.09102 14.9094 1.11133 10.0002 1.11133ZM10.0002 2.4282C14.1821 2.4282 17.5722 5.81831 17.5722 10.0002C17.5722 14.1821 14.1821 17.5722 10.0002 17.5722C5.81831 17.5722 2.4282 14.1821 2.4282 10.0002C2.4282 5.81831 5.81831 2.4282 10.0002 2.4282Z"
        fill={strokeColor}
      />
    </Svg>
  );
};
export const HeaderReconnect = (props: HeaderProps) => {
  let width = props.width || normalize(WIDTH);
  let height = props.height || normalize(HEIGHT);
  let strokeColor = props.color || Color.black;

  return (
    <Svg width={width} height={height} viewBox="0 0 14 14" fill="none">
      <Path
        d="M12.8333 5.83333C12.8333 5.83333 11.6638 4.23979 10.7136 3.28898C9.76343 2.33816 8.4504 1.75 7 1.75C4.1005 1.75 1.75 4.1005 1.75 7C1.75 9.89949 4.1005 12.25 7 12.25C9.39347 12.25 11.4129 10.6483 12.0448 8.45833M12.8333 5.83333V2.33333M12.8333 5.83333H9.33333"
        stroke={strokeColor}
        stroke-width="1"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export const HeaderClose = (props: HeaderProps) => {
  let width = props.width || normalize(11);
  let height = props.height || normalize(14);
  let strokeColor = props.color || Color.black;

  return (
    <Svg width={width} height={height} viewBox="0 0 384 512" fill={strokeColor}>
      <Path
        d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
        fill={strokeColor}
      />
    </Svg>
  );
};

export const HeaderLiveAgent = (props: HeaderProps) => {
  let width = props.width || normalize(14);
  let height = props.height || normalize(14);
  let strokeColor = props.color || Color.black;

  return (
    <Svg width={width} height={height} viewBox="0 0 512 512" fill={strokeColor}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M 124.0 391.0 Q 144.0 377.0 168.0 385.0 Q 208.0 400.0 256.0 400.0 Q 351.0 397.0 407.0 350.0 Q 463.0 302.0 464.0 240.0 Q 463.0 178.0 407.0 130.0 Q 351.0 83.0 256.0 80.0 Q 161.0 83.0 105.0 130.0 Q 49.0 178.0 48.0 240.0 Q 48.0 289.0 84.0 329.0 Q 97.0 344.0 96.0 365.0 Q 93.0 392.0 84.0 414.0 Q 110.0 401.0 124.0 391.0 Z M 21.0 432.0 Q 24.0 428.0 26.0 424.0 Q 43.0 398.0 48.0 361.0 Q 1.0 309.0 0.0 240.0 Q 1.0 182.0 35.0 135.0 Q 69.0 88.0 127.0 60.0 Q 184.0 33.0 256.0 32.0 Q 328.0 33.0 385.0 60.0 Q 443.0 88.0 477.0 135.0 Q 511.0 182.0 512.0 240.0 Q 511.0 298.0 477.0 345.0 Q 443.0 392.0 385.0 420.0 Q 328.0 447.0 256.0 448.0 Q 200.0 448.0 152.0 430.0 Q 133.0 444.0 98.0 461.0 Q 75.0 471.0 47.0 477.0 Q 47.0 477.0 46.0 477.0 Q 46.0 477.0 45.0 477.0 Q 39.0 479.0 32.0 479.0 Q 32.0 479.0 32.0 479.0 Q 31.0 479.0 31.0 479.0 Q 24.0 480.0 16.0 480.0 Q 5.0 480.0 1.0 470.0 Q -2.0 460.0 4.0 453.0 Q 11.0 447.0 16.0 439.0 Q 18.0 436.0 21.0 432.0 L 21.0 432.0 Z M 256 140 c 13.3 0 24 10.7 24 24 v 84 h 56 c 7.1 0 10.7 8.6 5.7 13.6 l -80 80 c -3.1 3.1 -8.2 3.1 -11.3 0 l -80 -80 c -5 -5 -1.4 -13.6 5.7 -13.6 h 56 v -84 c 0 -13.3 10.7 -24 24 -24 z"
        fill={strokeColor}
      />
    </Svg>
  );
};

export const HeaderLeft = (props: HeaderProps) => {
  let width = props.width || normalize(WIDTH);
  let height = props.height || normalize(HEIGHT);
  let strokeColor = props.color || Color.black;

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14.3999 18L8.3999 12L14.3999 6"
        stroke={strokeColor}
        stroke-width="1.67"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export const HeaderMinimize = (props: HeaderProps) => {
  let width = props.width || normalize(14);
  let height = props.height || normalize(14);
  let strokeColor = props.color || Color.black;

  return (
    <Svg width={width} height={height} viewBox="0 0 448 512" fill={strokeColor}>
      <Path
        d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"
        fill={strokeColor}
      />
    </Svg>
  );
};
