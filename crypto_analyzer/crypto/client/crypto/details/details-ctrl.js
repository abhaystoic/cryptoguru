/**
 *
 */
import {APIService} from '../common/services/api-service';
import {CommonFunctionsService} from '../common/services/common-functions-service';

class CoinDetailsController {

    /*@ngInject*/
    constructor($scope, $rootScope, $http, $routeParams, $q, $timeout, socialLoginService, $cookies) {
      this.showSpinner = true;
      this.showZebpaySpinner = true;
      this.scope_ = $scope;
      this.http_ = $http;
      this.socialLoginService_ = socialLoginService;
      this.rootScope_ = $rootScope;
      this.routeParams_ = $routeParams;
      this.coinDetails = {};
      this.zebpayDetails = {};
      this.availabilityPerc = -1;
      this.coinID = this.routeParams_.coinID;
      this.coinSymbol = this.routeParams_.coinSymbol;
      this.preferredCurrencySymbol = CommonFunctionsService.getPreferredCurrencySymbol();
      this.getInitialDetails();
      this.periodicFuncID = setInterval(() => this.getCoinDetails(), 7000);
      // this.ignoreKeys = ['id', 'name', '24h_volume_usd', 'market_cap_usd', 'currency',
      //                    'virtualCurrency', 'last_updated', 'price_usd'];
      this.ignoreKeys = ['id', 'last_updated', 'price_usd'];
      this.noCurrencySymbolFields = ['name', 'virtualCurrency', 'volume'];
      this.iconMap = {
        'symbol': 'ti-direction',
        'rank': 'ti-medall',
        'price_btc': 'fa fa-btc',
        'available_supply': 'ti-shopping-cart', //Create visual progress bar for available supply.
        'total_supply': 'ti-shopping-cart-full',
        'max_supply': 'ti-truck',
        'percent_change_1h': 'ti-exchange-vertical',
        'percent_change_24h': 'ti-exchange-vertical',
        'percent_change_7d': 'ti-exchange-vertical',
        'price_inr': 'fa fa-inr',
        '24h_volume_inr': 'ti-time',
        'market_cap_inr': 'ti-target',
        'zebpay_market': 'ti-bar-chart',
        'zebpay_buy': 'ti-thumb-up',
        'zebpay_sell': 'ti-thumb-down',
        'zebpay_volume': 'ti-server',
      }
      this.allCurrencies = [
        'aud', 'brl', 'cad', 'chf', 'cny', 'czk',
        'dkk', 'eur', 'gbp', 'hkd', 'huf', 'idr', 'ils',
        'inr', 'jpy', 'krw', 'mxn', 'myr', 'nok', 'nzd',
        'php', 'pln', 'rub', 'sek', 'sgd', 'thb',
        'try', 'zar', 'usd'
      ];
      this.needBiggerCard = ['max_supply', '24h_volume', 'market_cap',
                             'available_supply', 'total_supply', 'percent_change_7d',
                             'percent_change_24h', 'percent_change_1h', 'price'];
      this.scope_.$on("$destroy", () => {
        clearInterval(this.periodicFuncID);
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

    getSymbol(key) {
      if (this.noCurrencySymbolFields.indexOf(key) > -1) {
        return '';
      }
      return this.preferredCurrencySymbol;
    }

    getInitialDetails() {
      APIService.getInitialDetails(this.http_, this.coinID)
                .then(
                  response => {
                    let max_supply = null;
                    this.coinDetails = response['coin_details'];
                    let available_supply = this.coinDetails['available_supply'];
                    if (this.coinDetails['max_supply']) {
                      max_supply = this.coinDetails['max_supply'];
                    } else if (this.coinDetails['total_supply']) {
                      max_supply = this.coinDetails['total_supply'];
                    }
                    if (max_supply && available_supply) {
                      this.availableCount = max_supply - available_supply;
                      this.availabilityPerc = ((this.availableCount) / max_supply) * 100;
                      this.availabilityPerc = parseFloat(Number(this.availabilityPerc).toFixed(2));
                    }
                    this.showSpinner = false;
                  }
                );
      this.drawGraph();
      this.getZebpayData();
    }

    getCoinDetails() {
      this.preferredCurrencySymbol = CommonFunctionsService.getPreferredCurrencySymbol();
      let preferredCurrency = CommonFunctionsService.getPreferredCurrency();
    	APIService.getCoinDetails(this.http_, this.coinID, preferredCurrency)
                .then(
                  response => {
                    let max_supply = null;
                    this.coinDetails = response[0];
                    let available_supply = this.coinDetails['available_supply'];
                    if (this.coinDetails['max_supply']) {
                      max_supply = this.coinDetails['max_supply'];
                    } else if (this.coinDetails['total_supply']) {
                      max_supply = this.coinDetails['total_supply'];
                    }
                    if (max_supply && available_supply) {
                      this.availableCount = max_supply - available_supply;
                      this.availabilityPerc = ((this.availableCount) / max_supply) * 100;
                      this.availabilityPerc = parseFloat(Number(this.availabilityPerc).toFixed(2));
                    }
                    this.showSpinner = false;
                  }
                );
      this.drawGraph();
      this.getZebpayData();
    }

    getZebpayData() {
      if (this.coinID == 'bitcoin') {
        this.showZebpaySpinner = true;
        APIService.getBitcoinData(this.http_, 'zebpay')
                  .then(
                    response => {
                      this.zebpayDetails = response;
                      this.showZebpaySpinner = false;
                    }
                  );
      }
    }

    getIcon(key) {
      return this.iconMap[key];
    }

    checkIfNeedsBiggerCard(key) {
      if (this.needBiggerCard.indexOf(key) > -1) {
        return true;
      } else {
        for(let val of this.allCurrencies) {
          if (key.endsWith('_' + val)) return true;
        }
      }
      return false;
    }

    getCardSize(key) {
      if (this.checkIfNeedsBiggerCard(key)) {
        return 'col-lg-6 col-sm-6';
      }
      return 'col-lg-3 col-sm-6';
    }

    drawGraph() {
        APIService.getDataForChart(this.http_, this.coinID, 10)
                  .then(
                    response => {
                      let dataForChart = [];
                      for (let data of response) {
                        dataForChart.push({
                          'x': new Date(data['x']),
                          'y': data['y'],
                        });
                      }
                      var chart = new CanvasJS.Chart("chartContainerSmall", {
                          title: {
                            text: "LIVE Trends"
                          },
                          toolTip: {
                            contentFormatter: function (e) {
                              var content = "";
                              for (var i = 0; i < e.entries.length; i++) {
                                content = CanvasJS.formatDate(e.entries[i].dataPoint.x, "hh:mm:ss TT DD/MM/YYYY");
                                content = e.entries[i].dataPoint.y + ' at ' + content;
                              }
                              return content;
                            }
                          },
                          axisY:{
                            includeZero: false
                          },
                          axisX: {
                            title: "Time",
                            interval: 10,
                            intervalType: "minute",
                            // valueFormatString: "DD MMM YYYY hh:mm:ss TT",
                          },
                          data: [
                          {
                            type: "spline",
                            dataPoints: dataForChart,
                          }
                          ]
                        });
                      chart.render();
                    }
                  );
    }
};

CoinDetailsController.$inject = ['$scope', '$rootScope', '$http', '$routeParams', '$q', '$timeout', 'socialLoginService', '$cookies'];

export {CoinDetailsController};
