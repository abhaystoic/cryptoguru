/**
 *
 */
import {APIService} from '../common/services/api-service';
import {CommonFunctionsService} from '../common/services/common-functions-service';

class ChartsController {

    /*@ngInject*/
    constructor($scope, $rootScope, $http, $window, $q, $timeout,
                socialLoginService, $cookies) {
      this.http_ = $http;
      this.scope_ = $scope;
      this.rootScope_ = $rootScope;
      this.socialLoginService_ = socialLoginService;
      this.window_ = $window;
    	this.rootScope_.activeTab = 'charts';
      this.allCoins = [];
      this.loading = true;
      // this.loadSearch();
      this.selectedCoin = 'bitcoin';
      this.duration = 1440; // 2 days.
      this.prepareListOfAllCoins();
      this.createChart();
      this.periodicFuncID = setInterval(() => this.createChart(), 7000);
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

    loadSearch() {
      $('.selectpicker').selectpicker({
        style: 'btn-info',
        size: 4
      });
    }

    prepareListOfAllCoins() {
      APIService.getCryptoNames(this.http_)
                .then(
                  response => {
                    this.allCoins = response['crypto_coins'];
                  }
                );
    }

    loadOtherCoin() {
      this.loading = true;
    }

    changeDuration() {
      this.loading = true;
    }

    createChart() {
      let currencyConversionRate = CommonFunctionsService.getCurrencyConversionRate();
      let preferredCurrencySymbol = CommonFunctionsService.getPreferredCurrencySymbol();
    	APIService.getDataForChart(this.http_, this.selectedCoin, this.duration)
    			  .then(
    			  	response => {
                this.loading = false;
                let dataForChart = [];
                for (let data of response) {
                  dataForChart.push({
                    'x': new Date(data['x']),
                    'y': currencyConversionRate * data['y'],
                  });
                }
                let screenWidth = this.window_.innerWidth;
                var chart = new CanvasJS.Chart("chartContainerSmall", {
                    title: {
                      text: "Live " + this.selectedCoin + " trends in " + preferredCurrencySymbol
                    },
                    toolTip: {
                      contentFormatter: function (e) {
                        var content = "";
                        for (var i = 0; i < e.entries.length; i++){
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
                      interval: 12,
                      intervalType: "hour",
                      valueFormatString: "DD MMM YYYY hh:mm:ss TT",
                      labelAngle: -20
                    },
                    height: 300,
                    width: screenWidth * 0.7,
                    data: [
                    {
                      type: "area",
                      dataPoints: dataForChart,
                    }
                    ]
                  });
                chart.render();
    			  	}
    			  );
    }
};

ChartsController.$inject = ['$scope', '$rootScope', '$http', '$window', '$q', '$timeout', 'socialLoginService', '$cookies'];

export {ChartsController};
