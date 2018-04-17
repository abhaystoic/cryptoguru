import {APIService} from './api-service';

class CommonFunctionsService {

  /*@ngInject*/
  constructor(){
    this.userAuthSetupStatus_ = false;
    let expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 365);
    this.cookieExpiry = {'expires': expireDate};
    this.preferredCurrency = 'INR';
    this.notificationSetting = true;
    this.currencyConversionRate = 1.0;
    this.preferredCurrencySymbol = '₹';
  }

  static getUserAuthSetupStatus() {
    return this.userAuthSetupStatus_;
  }

  static setUserAuthSetupStatus(status) {
    this.userAuthSetupStatus_ = status;
  }

  static convertToFloat(value) {
    return parseFloat(Number(value.toString().replace(/,/g, '')).toFixed(2));
  }

  /** This method will be called every time a page requiring log-in is loaded.
    * So it is safe to conclude that $cookie will be available to the service.
    */
  static checkLoginStatus($rootScope, $q, socialLoginService, $cookies) {
    this.cookies_ = $cookies;
    this.socialLoginService_ = socialLoginService;
    var fetchUserDetails = function(){
      var deferred = $q.defer();
      FB.api('/me?fields=name,email,picture', function(res){
        if(!res || res.error){
          deferred.reject('Error occured while fetching user details.');
        } else {
          deferred.resolve({
            name: res.name,
            email: res.email,
            uid: res.id,
            provider: "facebook",
            imageUrl: res.picture.data.url
          });
        }
      });
      return deferred.promise;
    };
    FB.getLoginStatus(function(response) {
      if(response.status === "connected"){
        fetchUserDetails().then(function(userDetails){
          userDetails["token"] = response.authResponse.accessToken;
          // socialLoginService.setProvider("facebook");
          $rootScope.$broadcast('event:social-sign-in-success', userDetails);
        });
      } else {
        $.notify({
          icon: 'ti-bell',
          message: 'Login for saving your preferences.',

        },{
            type: 'info',
            timer: 1000
        });
      }
    });
  }

  static setUserSettingsFromCookies_() {
    /* Dropped the idea temporarily of getting information from cookies. */
    // let cookiePreferredCurrency = this.cookies_.get('cryptoGuruPreferredCurrency');
    // console.log('cookiePreferredCurrency', cookiePreferredCurrency);
    if (cookiePreferredCurrency) {
      CommonFunctionsService.setPreferredCurrency(cookiePreferredCurrency);
    }
    let cookieNotificationSetting = this.cookies_.get('cryptoGuruCookieNotificationSetting');
    // console.log('cookieNotificationSetting', cookieNotificationSetting);
    if (cookieNotificationSetting) {
      CommonFunctionsService.setNotificationSetting(cookieNotificationSetting);
    }
  }

  /**
   * Registers an event that gets user's information.
   * Only FB login set up as of now.
   */
  static setupUserAuth($rootScope, $q, $http) {
    this.rootScope_ = $rootScope;
    this.http_ = $http;
    this.rootScope_.$on('event:social-sign-in-success', (event, userDetails) => {
      userDetails = {
        'email': 'iabhaygupta90@gmail.com'
      }
      this.rootScope_.userDetails = userDetails;
      if (userDetails) {
        const formData = {
          'email': userDetails['email'],
          // 'image_url': userDetails['imageUrl'],
          'name': userDetails['name'],
          'provider': userDetails['provider'],
          'token': userDetails['token'],
          'uid': userDetails['uid'],
        };
        APIService.captureUser(this.http_, formData)
                  .then(response => {
                    if (response['status'] == 'success') {
                      CommonFunctionsService.setPreferredCurrency(response['preferred_currency_code']);
                      CommonFunctionsService.setNotificationSetting(response['enable_notification']);
                      // CommonFunctionsService.notify(1, response['msg']);
                    } else {
                      // CommonFunctionsService.notify(-1, response['msg']);
                    }
                  });
      }
    });
    this.rootScope_.$on('event:social-sign-out-success', (event, status) => {
      this.rootScope_.userDetails = null;
    });
    CommonFunctionsService.setUserAuthSetupStatus(true);
  }

  static notify(loginStatus, message) {
      let type = '';
      let icon = '';
      if (loginStatus == -1) {
        type = 'warning';
        icon = 'ti-alert';
      } else if (loginStatus == 1) {
        type = 'success';
        icon = 'ti-bell';
      }
      $.notify({
        icon: icon,
        message: message,
      },{
          type: type,
          timer: 1000,
      });
    }

    static login() {
      console.log('login');
      this.rootScope_.$broadcast('event:social-sign-in-success');
      this.rootScope_.$broadcast('pullFreshData');
    }

    static logout() {
      console.log('logout');
      this.socialLoginService_.setProvider("facebook");
      this.socialLoginService_.logout();
      this.rootScope_.$on('event:social-sign-out-success', (event, status) => {
        this.rootScope_.userDetails = null;
      });
      this.setPreferredCurrency('INR');
      this.setNotificationSetting(true);
      this.rootScope_.$broadcast('pullFreshData');
    }

    static getNotificationSetting() {
      return this.notificationSetting;
    }

    static getPreferredCurrency() {
      if (!this.preferredCurrency) {
        this.preferredCurrency = 'INR';
      }
      return this.preferredCurrency;
    }

    static setPreferredCurrency(preferredCurrency) {
      let oldPreferredCurrency = this.preferredCurrency
      if (!oldPreferredCurrency) {
        oldPreferredCurrency = 'INR';
      }
      this.preferredCurrency = preferredCurrency;
      CommonFunctionsService.setCurrencyConversionRate(oldPreferredCurrency,
                                                       preferredCurrency);
      CommonFunctionsService.setPreferredCurrencySymbol(preferredCurrency);
      this.rootScope_.$broadcast('pullFreshData');
    }

    static setNotificationSetting(notificationSetting) {
      this.notificationSetting = notificationSetting;
    }

    static getUserDetails() {
      return this.rootScope_.userDetails;
    }

    static setCurrencyConversionRate(sourceCurrencyCode, targetCurrencyCode) {
      sourceCurrencyCode = 'INR';
      let apiUrl = 'http://api.fixer.io/latest?base=' + sourceCurrencyCode;
      this.http_
          .get(apiUrl)
          .then(response => {
            this.currencyConversionRate = response['data']['rates'][targetCurrencyCode];
            this.setPreferredCurrencySymbol(targetCurrencyCode);
          });
    }

    static getCurrencyConversionRate() {
      if (!this.currencyConversionRate) {
        this.currencyConversionRate = 1.0;
      }
      return this.currencyConversionRate;
    }

    static setPreferredCurrencySymbol(currencySymbol) {
      let currencySymbolMap = {
        'AUD': 'A$',
        'BRL': 'R$',
        'CAD': 'C$',
        'CHF': 'Fr.',
        'CNY': '¥',
        'CZK': 'Kč',
        'DKK': 'Kr.',
        'EUR': '€',
        'GBP': '£',
        'HKD': 'HK$',
        'HUF': 'Ft',
        'IDR': 'Rp',
        'ILS': '₪',
        'INR': '₹',
        'JPY': '圓',
        'KRW': '₩',
        'MXN': 'Mex$',
        'MYR': 'RM',
        'NOK': 'kr',
        'NZD': 'NZD$',
        'PHP': '₱',
        'PLN': 'zł',
        'RUB': '₽',
        'SEK': 'kr',
        'SGD': 'S$',
        'THB': '฿',
        'TRY': '₺',
        'ZAR': 'R',
        'USD': '$',
      }
      this.preferredCurrencySymbol = currencySymbolMap[currencySymbol];
    }

    static getPreferredCurrencySymbol() {
      if(!this.preferredCurrencySymbol) {
        this.preferredCurrencySymbol = '₹';
      }
      return this.preferredCurrencySymbol;
    }
};

export {CommonFunctionsService};
