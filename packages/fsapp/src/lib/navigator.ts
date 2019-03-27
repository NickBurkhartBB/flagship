import { Navigation, Options } from 'react-native-navigation';
import { AppConfigType, DrawerConfig, FSNavigatorOptions, FSNavigatorRoute } from '../types';

export class FSNavigator {
  componentId: string;
  toggleDrawerFn: (config: DrawerConfig) => void;
  appConfig: AppConfigType;

  constructor(options: FSNavigatorOptions) {
    if (!options.componentId) {
      throw new Error('Native navigator requires componentId in constructor');
    }
    this.componentId = options.componentId;
    this.toggleDrawerFn = options.toggleDrawerFn;
    this.appConfig = options.appConfig;
  }
  push<T = any>(route: FSNavigatorRoute<T>, options: Options = {}): void {
    Navigation.push(this.componentId, {
      component: {
        name: route.screen,
        passProps: route.passProps,
        options
      }
    });
  }
  showModal<T = any>(route: FSNavigatorRoute<T>, options: Options = {}): void {
    Navigation.showModal({
      component: {
        name: route.screen,
        passProps: route.passProps,
        options
      }
    });
  }
  pop(): void {
    Navigation.pop(this.componentId);
  }
  toggleDrawer(config: DrawerConfig): void {
    this.toggleDrawerFn(config);
  }
  switchToTab<T = any>(route: FSNavigatorRoute<T>, options: Options = {}): void {
    const currentTabIndex = (this.appConfig.tabs || []).find((tabScreen: any) => {
      return tabScreen.screen === route.screen;
    });
    if (currentTabIndex > -1) {
      Navigation.mergeOptions(this.componentId, {
        bottomTabs: {
          currentTabIndex
        }
      });
    }
  }
  popToRoot(): void {
    Navigation.popToRoot(this.componentId);
  }
}
