import type { HostComponent } from 'react-native';

export const createNotSupportedComponent = (message: string) => () => {
  console.error(message);
  return null;
};

export type NativeComponent<H = unknown> =
  | HostComponent<H>
  | ReturnType<typeof createNotSupportedComponent>;
