/**
 *
 */
import {APIService} from '../common/services/api-service';
import {CommonFunctionsService} from '../common/services/common-functions-service';

class FAQsController {

    /*@ngInject*/
    constructor($rootScope, $http, $q, $timeout, socialLoginService, $cookies) {
      this.rootScope_ = $rootScope;
      this.http_ = $http;
      this.rootScope_.activeTab = 'faqs';
      this.socialLoginService_ = socialLoginService;
      this.showFaqs = false;
      this.faqs = [];
      if (CommonFunctionsService.getUserAuthSetupStatus() == undefined) {
        CommonFunctionsService.setupUserAuth(this.rootScope_, $q, this.http_);
      }
      //Providing sufficient time for angular-social-login to load FB SDK.
      //TODO: Write our own social login plugin.
      $timeout(() => {
          CommonFunctionsService.checkLoginStatus(this.rootScope_, $q, this.socialLoginService_, $cookies);
      }, 3000);
      APIService.getFaqs(this.http_)
                .then(response => {
                  if (response['status'] == 'success') {
                    this.showFaqs = true;
                    this.faqs = response['faqs'];
                  } else {
                    this.showError = false;
                    this.serverResponseMsg = response['msg'];
                  }
                });
    }
};

FAQsController.$inject = ['$rootScope', '$http', '$q', '$timeout', 'socialLoginService', '$cookies'];

export {FAQsController};
