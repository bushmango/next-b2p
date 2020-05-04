export interface Styles {
  'inputText': string;
  'notResizable': string;
  'borderless': string;
  'readOnly': string;
}

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
