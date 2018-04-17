/**
 *
 */
import {CommonFunctionsService} from '../common/services/common-functions-service';
import {APIService} from '../common/services/api-service';

class TopNavDirective {

    constructor($timeout) {
      this.restrict = 'AE';
      this.templateUrl = 'top-nav/top-nav.html';
      this.message = '';
      this.timeout_ = $timeout;
    }

    saveUserSettings() {
      return APIService.saveUserSettings()
                .then(response => {
                  if (response['status'] == 'success') {
                    this.message = response['msg'];
                  };
                });
    }

    link(scope, element) {
      scope.message = '';
      scope.login = () => {
      	CommonFunctionsService.login();
      };
      scope.logout = () => {
      	CommonFunctionsService.logout();
      };
      scope.changePreferredCurrency = () => {
        CommonFunctionsService.setPreferredCurrency(scope.preferredCurrency);
        this.saveUserSettings()
            .then(() => {
              scope.message = this.message;
              $("#message-box").fadeIn("slow");
              this.timeout_(() => {
                  $("#message-box").fadeOut("slow");
                  scope.message = '';
                }, 2000);
            });
      };
      scope.changeNotificationSetting = (notificationSetting) => {
        CommonFunctionsService.setNotificationSetting(notificationSetting);
        this.saveUserSettings()
            .then(() => {
              scope.message = this.message;
              $("#message-box").fadeIn("slow");
              this.timeout_(() => {
                  $("#message-box").fadeOut("slow");
                  scope.message = '';
                }, 2000);
            });
      };
      scope.getPreferences = () => {
        $("#message-box").hide();
        let preferredCurrency = CommonFunctionsService.getPreferredCurrency();
        if (preferredCurrency) {
          scope.preferredCurrency = preferredCurrency;
        } else {
          scope.preferredCurrency = 'INR';
        }
        let notificationSetting = CommonFunctionsService.getNotificationSetting();
        scope.notificationSetting = notificationSetting;
      };
      // Removed support for CLP, PKR, TWD due to limitation of http://api.fixer.io/latest?base=INR
      scope.currencies = [
         'AUD', 'BRL', 'CAD', 'CHF', 'CNY', 'CZK',
         'DKK', 'EUR', 'GBP', 'HKD', 'HUF', 'IDR', 'ILS',
         'INR', 'JPY', 'KRW', 'MXN', 'MYR', 'NOK', 'NZD',
         'PHP', 'PLN', 'RUB', 'SEK', 'SGD', 'THB',
         'TRY', 'ZAR', 'USD'
      ];
    }
};

TopNavDirective.$inject = ['$timeout'];
export {TopNavDirective};
