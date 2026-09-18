declare module '@react-native-community/netinfo' {
  export interface NetInfoState {
    type: string;
    isConnected: boolean | null;
    isInternetReachable: boolean | null;
    details: any;
  }

  export type NetInfoSubscription = () => void;

  export interface NetInfoType {
    addEventListener(listener: (state: NetInfoState) => void): NetInfoSubscription;
    fetch(requestedInterface?: string): Promise<NetInfoState>;
  }

  const NetInfo: NetInfoType;
  export default NetInfo;
}
