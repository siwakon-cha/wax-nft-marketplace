import 'react-dropdown/style.css';
import '../styles/Footer.css';
import '../styles/Search.css';
import '../styles/SearchPage.css';
import '../styles/DropsPage.css';
import '../styles/Sets.css';
import '../styles/Collection.scss';
import '../styles/Notifications.css';
import '../styles/Popup.css';
import '../styles/Ranking.css';
import '../styles/globals.css';
import '../styles/App.css';
import '../styles/Trade.css';
import '../styles/Account.css';
import '../styles/Author.css';
import '../styles/Navigation.css';
import '../styles/Frontpage.css';
import '../styles/AssetPreview.scss';
import '../styles/SetPreview.scss';
import '../styles/Buttons.css';

import {withUAL, UALProvider} from "ual-reactjs-renderer";
import Waxplorer from "../components/waxplorer";
import Navigation from "../components/navigation/Navigation";
import {Anchor} from "ual-anchor";
import {Wombat} from "ual-wombat";
import {Wax} from "@eosdacio/ual-wax";
import {Starteos} from "ual-starteos";
import {Scatter} from 'ual-scatter';
import {Ledger} from 'ual-ledger';
import CookieConsent from "react-cookie-consent";
import PopupWrapper from "../components/popups/PopupWrapper";
import PopupWrapperSearch from "../components/popups/PopupWrapperSearch";
import BackgroundImage from "../components/backgroundimage/BackgroundImage";
import { QueryClient, QueryClientProvider } from 'react-query'
import React from "react";

const queryClient = new QueryClient();

const dev = process.env.NODE_ENV !== 'production';

const waxNet = {
  chainId: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
  rpcEndpoints: [{
    protocol: 'https',
    host: 'api2.hivebp.io',
    port: 443,
  }, {
    protocol: 'https',
    host: 'api.wax.alohaeos.com',
    port: 443,
  }, {
    protocol: 'https',
    host: 'wax.eosdac.io',
    port: 443,
  }, {
    protocol: 'https',
    host: 'waxapi.ledgerwise.io',
    port: 443,
  }]
};

const anchor = new Anchor([waxNet], {
  appName: 'NFTHive.io'
});

const wombat = new Wombat([waxNet], {
    appName: 'NFTHive.io'
});

const scatter = new Scatter([waxNet], {
  appName: 'NFTHive.io'
});

const ledger = new Ledger([waxNet], {
  appName: 'NFTHive.io'
});

const wax = new Wax([waxNet], {
  appName: 'NFTHive.io',
});

const starteos = new Starteos([waxNet], {
  appName: 'NFTHive.io',
});

const wallets = [wax, anchor];

if (!dev) {
    wallets.push(wombat);
    wallets.push(scatter);
}

wallets.push(starteos);
wallets.push(ledger);

function MyApp ({ Component, pageProps }) {
    const AppContainer = (props) => {
        return (
            <div className="App">
                <PopupWrapperSearch {...props} />
                <PopupWrapper {...props} />
                <Navigation {...props} />
                <BackgroundImage {...props} />
                <Component {...props} />
            </div>
        );
    };

    const AppWithUAL = withUAL(AppContainer);

    return (
        <Waxplorer>
          <UALProvider chains={[waxNet]} authenticators={wallets} appName={'NFTHive.io'}>
              <CookieConsent>
                  This website uses cookies to enhance the user experience.
              </CookieConsent>
              <QueryClientProvider client={queryClient}>
                <AppWithUAL {...pageProps} />
              </QueryClientProvider>
          </UALProvider>
        </Waxplorer>
    );
}

export default MyApp
