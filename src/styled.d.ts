import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    bgColor: string;
    textColor: string;
    boardColor: string;
    cardColor: string;
    cardHoverBgColor: string;
    headerIconHoverColor: string;
    headerIconActiveColor: string;
    boardIconColor: string;
    boardIconHoverColor: string;
    boardIconActiveColor: string;
  }
}