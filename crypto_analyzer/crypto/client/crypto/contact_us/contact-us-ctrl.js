/**
 *
 */
import {APIService} from '../common/services/api-service';
import {CommonFunctionsService} from '../common/services/common-functions-service';

class ContactUsController {

    /*@ngInject*/
    constructor($scope, $rootScope, $http, $q, $timeout, socialLoginService, $cookies) {
        this.rootScope_ = $rootScope;
        this.rootScope_.activeTab = 'contact-us';
        this.scope_ = $scope;
        this.http_ = $http;
        this.socialLoginService_ = socialLoginService;
        this.showForm = true;
        this.serverResponseMsg = null;
        this.req_success = true;
        if (CommonFunctionsService.getUserAuthSetupStatus() == undefined) {
          CommonFunctionsService.setupUserAuth(this.rootScope_, $q, this.http_);
        }
        //Providing sufficient time for angular-social-login to load FB SDK.
        //TODO: Write our own social login plugin.
        $timeout(() => {
            CommonFunctionsService.checkLoginStatus(this.rootScope_, $q,
                                                    this.socialLoginService_, $cookies);
        }, 3000);
    }

    sendMessage() {
    	const formData = {
      		'first_name': this.first_name,
      		'last_name': this.last_name,
      		'email': this.email,
          'message': this.message,
    	};
      APIService.sendMessage(this.http_, formData)
                .then(response => {
                  if (response['status'] == 'success') {
                    this.showForm = false;
                  } else {
                    this.showForm = true;
                    this.req_success = false;
                  }
                  this.serverResponseMsg = response['msg'];
                });

    }

    sendAnotherMessage() {
      this.showForm = true;
      this.first_name = '';
      this.last_name = '';
      this.email = '';
      this.message = '';
      this.req_success = true;
    }
};

ContactUsController.$inject = ['$scope', '$rootScope', '$http', '$q', '$timeout', 'socialLoginService', '$cookies'];

export {ContactUsController};
