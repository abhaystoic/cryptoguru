/**
 *
 */
import {CommonFunctionsService} from '../common/services/common-functions-service';
import {ExchangesService} from './exchanges-service';

class ExchangesController {

    /*@ngInject*/
    constructor($rootScope, $scope, $http, $q, $timeout, socialLoginService, $cookies) {
      this.rootScope_ = $rootScope;
      this.rootScope_.activeTab = 'exchanges';
      this.http_ = $http;
      this.exchangesService_ = new ExchangesService(this.http_);
      this.socialLoginService_ = socialLoginService;
      this.allExchanges = {};
      this.exchangesData = [];
      this.priceMap = {};
      this.priceMap_old = {};
      this.priceDiffMap = {};
      this.priceDiffMap_old = {};
      this.scope_ = $scope;
      this.currencyConversionRate = CommonFunctionsService.getCurrencyConversionRate();
      this.preferredCurrencySymbol = CommonFunctionsService.getPreferredCurrencySymbol();
      this.init_();
      if (CommonFunctionsService.getUserAuthSetupStatus() == undefined) {
        CommonFunctionsService.setupUserAuth(this.rootScope_, $q, this.http_);
      }
      //Providing sufficient time for angular-social-login to load FB SDK.
      //TODO: Write our own social login plugin.
      $timeout(() => {
          CommonFunctionsService.checkLoginStatus(this.rootScope_, $q, this.socialLoginService_, $cookies);
      }, 3000);
    }

    init_() {
      this.exchangesService_.getAllExchanges()
                            .then(response => response)
                            .then(response => {
                              this.exchangesData = response;
                              for (let data of this.exchangesData) {
                                this.allExchanges[data.name] = data.url;
                              }
                            })
                            .then(response => {
                              this.getPrice();
                              this.updatePriceDiffMap();
                              this.periodicFuncID_1 = setInterval(() => this.getPrice(), 7000);
                              this.scope_.$on("$destroy", () => {
                                clearInterval(this.periodicFuncID_1);
                              });
                            });
    }

    getPrice() {
      this.currencyConversionRate = CommonFunctionsService.getCurrencyConversionRate();
      this.preferredCurrencySymbol = CommonFunctionsService.getPreferredCurrencySymbol();
      for (let [exchangeName, url] of Object.entries(this.allExchanges)) {
        this.exchangesService_.getPrice(url, exchangeName)
                              .then(response => {
                                if (['CEX.IO', 'itBit'].indexOf(exchangeName) > -1) {
                                  let usd_inr_url = 'http://api.fixer.io/latest?base=USD';
                                  this.http_
                                      .get(usd_inr_url)
                                      .then(usd_inr_response => {
                                        let conversion_rate = CommonFunctionsService.convertToFloat(usd_inr_response['data']['rates']['INR']);
                                        let price = CommonFunctionsService.convertToFloat(response);
                                        let converted_price = CommonFunctionsService.convertToFloat(price * conversion_rate);
                                        this.priceMap[exchangeName] = converted_price;//.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                      });
                                } else if (exchangeName == 'Coincheck'){
                                  let usd_inr_url = 'http://api.fixer.io/latest?base=JPY';
                                  this.http_
                                      .get(usd_inr_url)
                                      .then(usd_inr_response => {
                                        let conversion_rate = CommonFunctionsService.convertToFloat(usd_inr_response['data']['rates']['INR']);
                                        let price = CommonFunctionsService.convertToFloat(response);
                                        let converted_price = CommonFunctionsService.convertToFloat(price * conversion_rate);
                                        this.priceMap[exchangeName] = converted_price;//.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                      });
                                } else {
                                  this.priceMap[exchangeName] = CommonFunctionsService.convertToFloat(response);//.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                }
                              })
                              .then(this.updatePriceDiffMap(exchangeName));
      }
      this.priceMap_old = angular.copy(this.priceMap);
      this.priceDiffMap_old = angular.copy(this.priceDiffMap);
    }

    updatePriceDiffMap(exchangeName) {
      if (this.priceMap_old[exchangeName] > this.priceMap[exchangeName]) {
        this.priceDiffMap[exchangeName] = -1;
      } else if (this.priceMap_old[exchangeName] == this.priceMap[exchangeName]) {
        // Keep diff score same as the last one.
        this.priceDiffMap[exchangeName] = this.priceDiffMap_old[exchangeName];
      } else {
        this.priceDiffMap[exchangeName] = 1;
      }
    }
};

ExchangesController.$inject = ['$rootScope', '$scope', '$http', '$q', '$timeout', 'socialLoginService', '$cookies'];

export {ExchangesController};
