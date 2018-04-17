/**
 *
 */
import {CommonFunctionsService} from '../common/services/common-functions-service';

class PrivacyPolicyController {
    constructor($rootScope, $http, $q, $timeout, socialLoginService, $cookies) {
      this.rootScope_ = $rootScope;
      this.socialLoginService_ = socialLoginService;
      if (CommonFunctionsService.getUserAuthSetupStatus() == undefined) {
        CommonFunctionsService.setupUserAuth(this.rootScope_, $q, this.http_);
      }
  	  //Providing sufficient time for angular-social-login to load FB SDK.
      //TODO: Write our own social login plugin.
      $timeout(() => {
          CommonFunctionsService.checkLoginStatus(this.rootScope_, $q, this.socialLoginService_, $cookies);
      }, 3000);
    }
};

PrivacyPolicyController.$inject = ['$rootScope', '$http', '$q', '$timeout', 'socialLoginService', '$cookies'];

export {PrivacyPolicyController};
