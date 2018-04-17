/**
 * Provides access to the JSON endpoint which contains the data about the items.
 */
import {RequestOptions} from '../../../../../../node_modules/@angular/http';
import {CommonFunctionsService} from './common-functions-service';

class APIService {

    /*@ngInject*/
    constructor() {
      this.allCoinsCachedData = [];
      this.bitcoinCachedPrice = 'loading...';
      this.showIndianCoins = false;
      this.maxRecordsToShow = 2000;
    }

    // TODO: Inject $http in this service.
    // constructor($http) {
    //     this.http_ = $http;
    // }

    static getAllCoinsCachedData() {
      return this.allCoinsCachedData;
    }

    static setAllCoinsCachedData(data) {
      this.allCoinsCachedData = data;
    }

    static getBitcoinCachedPrice() {
      return this.bitcoinCachedPrice;
    }

    static setBitcoinCachedPrice(data) {
      this.bitcoinCachedPrice = data;
    }

    static setOnlyIndianCoinsFlag(showIndianCoins) {
      this.showIndianCoins = showIndianCoins;
    }

    static getOnlyIndianCoinsFlag() {
      return this.showIndianCoins;
    }

    static getDataForChart($http, coinID, minutes) {
        this.http_ = $http;
        var apiUrl = '/api/live_trends/';
        let headers = new Headers({
            'Content-Type': 'application/json',
        });
        let options = new RequestOptions({ headers: headers });
        const params = {
          'coinID': coinID,
          'minutes': minutes,
        };
        return this.http_
                   .post(apiUrl, params, options)
                   .then(response => response['data']['live_trends']);
    }

    static getBitcoinData($http, source) {
      this.http_ = $http;
      let api_map = {
        'bitcoin': 'https://blockchain.info/ticker',
        'zebpay': 'https://www.zebapi.com/api/v1/market/ticker-new/btc/inr',
        'unocoin': 'https://www.unocoin.com/trade?all',
      };
      return this.http_
                 .get(api_map[source])
                 .then(response => response['data']);
    }

    static getInitialAllCoinsData($http, numRecords) {
      if (numRecords > this.maxRecordsToShow) {
        numRecords = this.maxRecordsToShow;
      }
      this.http_ = $http;
      let headers = new Headers({
          'Content-Type': 'application/json',
      });
      let options = new RequestOptions({ headers: headers });
      const params = {
        'num_records': numRecords,
      };
      let api = '/api/get_all_coins/';
      return this.http_
                 .post(api, params, options)
                 .then(response => response['data']);
    }

    static getAllCoins($http, numRecords, showIndianCoins) {
      if (numRecords > this.maxRecordsToShow) {
        numRecords = this.maxRecordsToShow;
      }
      if (showIndianCoins) {
        numRecords = this.maxRecordsToShow; //Maximum available
        if (!numRecords) {
          numRecords = 2000;
        }
      }
      this.http_ = $http;
        let api = 'https://api.coinmarketcap.com/v1/ticker/?limit='+ numRecords +'&convert=INR';
        return this.http_
                   .get(api)
                   .then(response => response['data']);
    }

    static getInitialDetails($http, coinID) {
      this.http_ = $http;
      let headers = new Headers({
          'Content-Type': 'application/json',
      });
      let options = new RequestOptions({ headers: headers });
      const params = {
        'coin_id': coinID,
      };
      let api = '/api/get_initial_details/';
      return this.http_
                 .post(api, params, options)
                 .then(response => response['data']);
    }

    static getCoinDetails($http, coinID, preferredCurrency='INR') {
      this.http_ = $http;
      let api = 'https://api.coinmarketcap.com/v1/ticker/' +  coinID + '/?convert=' + preferredCurrency;
      return this.http_
                 .get(api)
                 .then(response => response['data']);
    }

    static sendMessage($http, formData) {
      this.http_ = $http;
      var apiUrl = '/api/send_message/';
      let headers = new Headers({
          'Content-Type': 'application/json',
      });
      let options = new RequestOptions({ headers: headers });
      return this.http_
                 .post(apiUrl, formData, options)
                 .then(response => response['data']);
    }

    static getFaqs($http) {
      this.http_ = $http;
      var apiUrl = '/api/get_faqs/';
      let headers = new Headers({
          'Content-Type': 'application/json',
      });
      let formData = {};
      let options = new RequestOptions({ headers: headers });
      return this.http_
                 .post(apiUrl, formData, options)
                 .then(response => response['data']);
    }

    static getCryptoNames($http) {
      this.http_ = $http;
      var apiUrl = '/api/get_crypto_names/';
      let headers = new Headers({
          'Content-Type': 'application/json',
      });
      let formData = {};
      let options = new RequestOptions({ headers: headers });
      return this.http_
                 .post(apiUrl, formData, options)
                 .then(response => response['data']);
    }

    static captureUser($http, formData) {
      this.http_ = $http;
      var apiUrl = '/api/capture_user/';
      let headers = new Headers({
          'Content-Type': 'application/json',
      });
      let options = new RequestOptions({ headers: headers });
      return this.http_
                 .post(apiUrl, formData, options)
                 .then(response => response['data']);
    }

    static saveUserSettings() {
      let apiUrl = '/api/save_user_settings/';
      let userDetails = CommonFunctionsService.getUserDetails();
      let headers = new Headers({
          'Content-Type': 'application/json',
      });
      let options = new RequestOptions({ headers: headers });
      let formData = {
        'email': userDetails['email'],
        'preferred_currency': CommonFunctionsService.getPreferredCurrency(),
        'enable_notification': CommonFunctionsService.getNotificationSetting(),
      }
      return this.http_
                 .post(apiUrl, formData, options)
                 .then(response => response['data']);
    }
};

export {APIService};
