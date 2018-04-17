/**
 *
 */
import {APIService} from '../common/services/api-service';
import {CommonFunctionsService} from '../common/services/common-functions-service';

class DashboardController {

    /*@ngInject*/
    constructor($scope, $rootScope, $http, $cookies, $q,
                $timeout, socialLoginService) {
        this.rootScope_ = $rootScope;
        this.rootScope_.activeTab = 'dashboard';
        this.progressMessage = 'Loading Bitcoin data...';
        this.progressCompletion = 10;
        this.showProgressBar = true;
        this.scope_ = $scope;
        this.http_ = $http;
        this.socialLoginService_ = socialLoginService;
        this.items = [];
        this.selection = [];
        this.allCoinsData = APIService.getAllCoinsCachedData();
        this.oldPriceMap = {};
        this.priceDiffMap = {};
        this.showSpinner = false;
        this.bitcoinPrice = APIService.getBitcoinCachedPrice();
        this.zebpayPrice = 'loading...';
        this.unocoinPrice = 'loading...';
        this.zebpayCommision = 0.0;
        this.zebpayCommisionPerc = 0.0;
        this.zebpayDiff = 0;
        this.zebpayPrice_copy = 0.0;
        this.recordCountsToShow = 29;
        this.maxRecordsToShow = 2000;
        this.loadedMore = true;
        this.showTabularView = false;
        this.showIndianCoins = APIService.getOnlyIndianCoinsFlag();
        this.showIndianCoinsCheckBox = this.showIndianCoins;
        this.indianCoinIDs = ['india-coin'];
        this.rating = {};
        this.searchText = '';
        this.currencyConversionRate = CommonFunctionsService.getCurrencyConversionRate();
        this.preferredCurrencySymbol = CommonFunctionsService.getPreferredCurrencySymbol();
        $(function () {
          $('[data-toggle="tooltip"]').tooltip()
        });

        //Set initial prices from DB.
        this.setInitialPrices();
        this.setZebpayData();
        this.setBitcoinPrices();
        this.setAltCoinPrices();
        // Display current bitcoin price every second.
        this.periodicFuncID_2 = setInterval(() => this.setZebpayData(), 1000);
        this.periodicFuncID_1 = setInterval(() => this.setBitcoinPrices(), 7000);
        this.periodicFuncID_3 = setInterval(() => this.setAltCoinPrices(), 7000);
        this.scope_.$on('$destroy', () => {
          clearInterval(this.periodicFuncID_1);
          clearInterval(this.periodicFuncID_2);
          clearInterval(this.periodicFcheckLoginStatusuncID_3);
        });
        this.rootScope_.$on('pullFreshData', () => {
          // For events like changing user settings.
          this.setZebpayData();
          this.setBitcoinPrices();
          this.setAltCoinPrices();
        });
        if (CommonFunctionsService.getUserAuthSetupStatus() == undefined) {
          CommonFunctionsService.setupUserAuth(this.rootScope_, $q, this.http_);
        }
        //Providing sufficient time for angular-social-login to load FB SDK.
        //TODO: Write our own social login plugin.
        $timeout(() => {
            CommonFunctionsService.checkLoginStatus(this.rootScope_, $q, this.socialLoginService_, $cookies);
        }, 3000);
    }

    applyFilter() {
      this.showSpinner = true;
      if (this.showIndianCoinsCheckBox) {
        this.showIndianCoins = true;
      } else {
        this.showIndianCoins = false;
      }
      APIService.setOnlyIndianCoinsFlag(this.showIndianCoins);
    }

    toggleViewToTabular(tabularView) {
      this.showTabularView = tabularView;
    }

    setInitialPrices() {
      this.showSpinner = true;
      APIService.getInitialAllCoinsData(this.http_, this.recordCountsToShow)
                .then(
                  response => {
                    this.allCoinsData = response['coin_data'];
                    let bitcoinInfo = response['bitcoin_data'];
                    let convertedPrice = this.currencyConversionRate * bitcoinInfo['price_inr']
                    this.bitcoinPrice = (convertedPrice);
                    this.bitcoinLastHour = bitcoinInfo['percent_change_1h'];
                    if (this.progressCompletion < 60) {
                      this.progressCompletion = 60;
                    }
                    this.showSpinner = false;
                  }
                );
    }

    setCurrencyConversionRate() {
      this.currencyConversionRate = CommonFunctionsService.getCurrencyConversionRate();
      this.preferredCurrencySymbol = CommonFunctionsService.getPreferredCurrencySymbol();
    }

    setZebpayData() {
      this.setCurrencyConversionRate();
      APIService.getBitcoinData(this.http_, 'zebpay')
                .then(
                  response => {
                    let convertedPrice;
                    this.zebpayPrice = response['buy'];
                    if (this.progressCompletion < 80) {
                      this.progressMessage = 'Loading Altcoin data...';
                      this.progressCompletion = 80;
                      // this.showSpinner = false;
                      this.calculateZebpayFluctuations();
                    }
                  }
                );
      this.zebpayCommision = this.convertToFloat(
        this.convertToFloat(this.zebpayPrice) -
        this.convertToFloat(this.bitcoinPrice)
      );
      this.zebpayCommisionPerc = ((this.zebpayCommision) / this.convertToFloat(this.zebpayPrice)) * 100;
      this.zebpayCommisionPerc = this.convertToFloat(this.zebpayCommisionPerc);
    }

    setBitcoinPrices() {
      this.setCurrencyConversionRate();
      APIService.getCoinDetails(this.http_, 'bitcoin')
                .then(
                  response => {
                    let bitcoinInfo = response[0];
                    // let currencySymbol = CommonFunctionsService.getPreferredCurrency().toLowerCase();
                    // let priceKey = 'price_' + currencySymbol;
                    this.bitcoinPrice = bitcoinInfo['price_inr'];
                    this.bitcoinLastHour = bitcoinInfo['percent_change_1h'];
                    APIService.setBitcoinCachedPrice(this.bitcoinPrice);
                    // if (this.progressCompletion < 30) {
                    //   this.progressCompletion = 30;
                    // }
                  }
                );
    }

    convertToFloat(value) {
      return parseFloat(Number(value).toFixed(2));
    }

    setAltCoinPrices() {
      this.setCurrencyConversionRate();
      APIService.getAllCoins(this.http_, this.recordCountsToShow, this.showIndianCoins)
                .then(
                  response => {
                    if (this.loadedMore == false || this.recordCountsToShow >= this.maxRecordsToShow) {
                      this.loadedMore = true;
                    }
                    this.progressCompletion = 60;
                    if (this.showIndianCoins) {
                      this.allCoinsData = response;
                    } else {
                      this.allCoinsData = response.slice(0, this.recordCountsToShow);
                    }
                    APIService.setAllCoinsCachedData(this.allCoinsData, this.recordCountsToShow);
                    this.progressCompletion = 80;
                    this.progressMessage = 'Fetching market fluctuations...';
                    this.showSpinner = false;
                    this.calculateFluctuations();
                    if (this.progressCompletion != 100) {
                      this.progressMessage = 'Complete';
                      this.progressCompletion = 100;
                      this.showProgressBar = false;
                      this.showSpinner = false;
                    }
                  }
                );
    }

    calculateFluctuations() {
      this.allCoinsData_copy = [];
      this.oldPriceMap_copy = {};
      this.oldPriceMap_copy = angular.copy(this.oldPriceMap);
      this.oldPriceMap = {};
      this.allCoinsData_copy = angular.copy(this.allCoinsData);
      this.priceDiffMap_old = angular.copy(this.priceDiffMap);
      // Storing data recieved in this request.
      for (let coin of this.allCoinsData_copy) {
          coin['price_inr'] = parseFloat(Number(coin['price_inr']).toFixed(2));
          // Preparing map for next request.
          this.oldPriceMap[coin['id']] = coin['price_inr'];

          // Adding diff score to every data.
          if (this.oldPriceMap_copy[coin['id']] < coin['price_inr']) {
            this.priceDiffMap[coin['id']] = 1;
            if (coin['id'] == 'bitcoin') {
              this.notifyBitcoinChange(1);
            }
          }
          else if (this.oldPriceMap_copy[coin['id']] > coin['price_inr']) {
            this.priceDiffMap[coin['id']] = -1;
            if (coin['id'] == 'bitcoin') {
              this.notifyBitcoinChange(-1);
            }
          } else if(this.oldPriceMap_copy[coin['id']] == coin['price_inr']) {
            if(this.priceDiffMap_old[coin['id']]) {
              this.priceDiffMap[coin['id']] = this.priceDiffMap_old[coin['id']];
            } else {
              this.priceDiffMap[coin['id']] = 0;
            }
          } else if (parseFloat(coin['percent_change_1h']) < 0.0) {
            this.priceDiffMap[coin['id']] = -1;
            if (coin['id'] == 'bitcoin') {
              this.notifyBitcoinChange(-1);
            }
          } else if (parseFloat(coin['percent_change_1h']) > 0.0 ) {
            this.priceDiffMap[coin['id']] = 1;
            if (coin['id'] == 'bitcoin') {
              this.notifyBitcoinChange(1);
            }
          } else {
            this.priceDiffMap[coin['id']] = 0;
          }
          //Setting default to 2 for demo
          this.rating[coin['id']] = 2;
      }
    }

    notifyBitcoinChange(fluctuationScore) {
      if (CommonFunctionsService.getNotificationSetting()) {
        let message = '';
        let type = '';
        let icon = '';
        if (fluctuationScore == -1) {
          message = 'Bitcoin going down!';
          type = 'warning';
          icon = 'ti-stats-down';
        } else if (fluctuationScore == 1) {
          message = 'Bitcoin going up!';
          type = 'success';
          icon = 'ti-stats-up';
        }
        $.notify({
          icon: icon,
          message: message,

        },{
            type: type,
            timer: 4000
        });
      }
    }

    calculateZebpayFluctuations() {
      this.zebpayPrice = this.convertToFloat(this.zebpayPrice);
      this.zebpayPrice_copy = this.convertToFloat(this.zebpayPrice_copy);
      if (this.zebpayPrice_copy == this.zebpayPrice) {
      }
      else if (this.zebpayPrice_copy > this.zebpayPrice) {
        this.zebpayDiff = -1;
      } else {
        this.zebpayDiff = 1;
      }
      this.zebpayPrice_copy = angular.copy(this.zebpayPrice);
      if (this.progressCompletion != 100) {
        this.progressMessage = 'Complete';
        this.progressCompletion = 100;
        this.showProgressBar = false;
        // this.showSpinner = false;
      }
    }

    loadMoreRecords() {
      if (this.recordCountsToShow <= this.maxRecordsToShow) {
        this.loadedMore = false;
        this.recordCountsToShow += 30;
      } else {
        this.recordCountsToShow = this.maxRecordsToShow;
        this.loadedMore = true;
      }
      this.setAltCoinPrices();
    }

    showAltcoinsOrNot(coinID) {
      if (this.showIndianCoins) {
        if (this.indianCoinIDs.indexOf(coinID) > -1) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    }

    rateFunction(rating) {
      console.log('Rating selected: ' + rating);
    };

    updateSearchRecordsNumber() {
      if (this.searchText == '') {
        this.recordCountsToShow = 29;
      } else {
        this.recordCountsToShow = this.maxRecordsToShow;
      }
    }
};

DashboardController.$inject = ['$scope', '$rootScope', '$http', '$cookies', '$q', '$timeout', 'socialLoginService'];

export {DashboardController};
