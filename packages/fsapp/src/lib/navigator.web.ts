import { AppConfigType, DrawerConfig, FSNavigatorOptions, FSNavigatorRoute } from '../types';
import pushRoute from './push-route';
import { Options } from 'react-native-navigation';

export class FSNavigator {
  history: any;
  appConfig: AppConfigType;
  toggleDrawerFn: (config: DrawerConfig) => void;

  constructor(options: FSNavigatorOptions) {
    this.history = options.history;
    this.appConfig = options.appConfig;
    this.toggleDrawerFn = options.toggleDrawerFn;
  }
  push<T = any>(route: FSNavigatorRoute<T>, options: Options = {}): void {
    pushRoute(route, this.history, this.appConfig);
  }
  showModal<T = any>(route: FSNavigatorRoute<T>, options: Options = {}): void {
    pushRoute(route, this.history, this.appConfig);
  }
  pop(): void {
    this.history.goBack();
  }
  toggleDrawer(config: DrawerConfig): void {
    this.toggleDrawerFn(config);
  }
  switchToTab<T = any>(route: FSNavigatorRoute<T>, options: Options = {}): void {
    pushRoute(route, this.history, this.appConfig);
  }
  popToRoot(): void {
    pushRoute(this.appConfig.screen, this.history, this.appConfig);
  }
}
