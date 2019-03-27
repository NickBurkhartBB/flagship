import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import screenWrapper from '../components/screenWrapper';
import { AppConfigType } from '../types';
import { NativeModules } from 'react-native';
const { CodePush } = NativeModules;
import NativeConstants from '../lib/native-constants';
import { FSAppBase } from './FSAppBase';
import DevMenu from '../components/DevMenu';

function WrappedComponent(store: any, Component: any): any {
  return function inject(props: any): any {
    const EnhancedComponent = () => (
      <Provider store={store}>
        <Component
          {...props}
        />
      </Provider>
    );

    return <EnhancedComponent />;
  };
}

export class FSApp extends FSAppBase {
  constructor(appConfig: AppConfigType) {
    super(appConfig);

    if (CodePush) {
      CodePush.getUpdateMetadata(CodePush.codePushUpdateStateRunning).then((version: any) => {
        if (version) {
          this.appConfig.codePushVersionLabel = version.label;
        }
      });
    }

    this.startApp();
  }

  registerScreens(): void {
    const { screens } = this.appConfig;
    const enhancedScreens = Object.keys(screens).map(key => {
      const component = screens[key];

      return {
        key,
        screen: screenWrapper(component, this.appConfig, this.api)
      };
    });

    if (this.shouldShowDevMenu()) {
      enhancedScreens.push({
        key: 'devMenu',
        screen: screenWrapper(DevMenu, this.appConfig, this.api)
      });
    }

    enhancedScreens.forEach(({ key, screen }) => {
      Navigation.registerComponent(`${key}`, () => WrappedComponent(this.store, screen));
    });
  }

  shouldShowDevMenu(): boolean {
    return NativeConstants && NativeConstants.ShowDevMenu && NativeConstants.ShowDevMenu === 'true';
  }

  startApp(): void {
    if (this.appConfig.appType === 'singleScreen' && this.appConfig.screen) {
      Navigation.startSingleScreenApp({
        screen: this.appConfig.screen,
        drawer: this.appConfig.drawer,
        animationType: 'fade'
      });
    } else if (this.appConfig.tabs && this.appConfig.tabs.length) {
      Navigation.startTabBasedApp({
        tabs: this.appConfig.tabs,
        tabsStyle: this.appConfig.tabsStyle,
        appStyle: this.appConfig.appStyle,
        drawer: this.appConfig.drawer,
        animationType: 'fade'
      });
    } else {
      throw new Error('invalide settings for screens and appType in appConfig');
    }
  }
}
