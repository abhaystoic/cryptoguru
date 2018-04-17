import {DashboardController} from './dashboard/dashboard-ctrl';
import {NewsController} from './news/news-ctrl';
// import {VisualsController} from './visuals/visuals-ctrl';
import {ChartsController} from './charts/charts-ctrl';
import {CoinDetailsController} from './details/details-ctrl';
import {ContactUsController} from './contact_us/contact-us-ctrl';
import {ExchangesController} from './exchanges/exchanges-ctrl';
import {FAQsController} from './faqs/faqs-ctrl';
import {AdsDirective} from './ads/ads-dir';
import {FooterDirective} from './footer/footer-dir';
import {LazyLoadDirective} from './lazy_load/lazy-load-dir';
import {PrivacyPolicyController} from './privacy_policy/privacy-policy-ctrl';
import {StarRatingDirective} from './ratings/ratings-dir';
import {SideNavDirective} from './side-nav/side-nav-dir';
import {TopNavDirective} from './top-nav/top-nav-dir';
import {APIService} from './common/services/api-service';
import {CommonFunctionsService} from './common/services/common-functions-service';
import {convertToPreferredCurrency} from './common/filters';
import {formatNames} from './common/filters';
import {upDownOrStable} from './common/filters';
import {socialLogin} from 'angularjs-social-login';
var app = angular.module('cryptoApp', ['ngRoute', 'ngCookies', 'socialLogin']);

// app.constant('config', {
//     apiUrl: '../crypto/'
// });

app.controller('ChartsController', ChartsController);
app.controller('ContactUsController', ContactUsController);
app.controller('DashboardController', DashboardController);
app.controller('ExchangesController', ExchangesController);
app.controller('FAQsController', FAQsController);
app.controller('NewsController', NewsController);
app.controller('PrivacyPolicyController', PrivacyPolicyController);
// app.controller('VisualsController', VisualsController);
app.directive('cryptoAds', () => new AdsDirective());
app.directive('cryptoFooter', () => new FooterDirective());
app.directive('lazyLoad', () => new LazyLoadDirective());
app.directive('sideNav', () => new SideNavDirective());
app.directive('starRating', () => new StarRatingDirective());
app.directive('topNav', ['$timeout', ($timeout) => new TopNavDirective($timeout)]);
app.service('APIService', APIService);
app.service('CommonFunctionsService', CommonFunctionsService);
app.filter('convertToPreferredCurrency', convertToPreferredCurrency);
app.filter('formatNames', formatNames);
app.filter('upDownOrStable', upDownOrStable);
app.config(['$routeProvider', '$httpProvider', '$locationProvider', 'socialProvider',
    ($routeProvider, $httpProvider, $locationProvider, socialProvider) => {
      $routeProvider
        .when('/', {
            controller: DashboardController,
            controllerAs: 'dashboardCtrl',
            templateUrl: 'dashboard/dashboard.html',
        })
        .when('/details/:coinID/:coinSymbol', {
            controller: CoinDetailsController,
            controllerAs: 'coinDetailsCtrl',
            templateUrl: 'details/details.html',
        })
        .when('/exchanges', {
            controller: ExchangesController,
            controllerAs: 'exchangesCtrl',
            templateUrl: 'exchanges/exchanges.html',
        })
        .when('/charts', {
            controller: ChartsController,
            controllerAs: 'chartsCtrl',
            templateUrl: 'charts/charts.html',
        })
        .when('/news', {
            controller: NewsController,
            controllerAs: 'newsCtrl',
            templateUrl: 'news/news.html',
        })
        .when('/privacy-policy', {
            controller: PrivacyPolicyController,
            controllerAs: 'privacyPolicyCtrl',
            templateUrl: 'privacy_policy/privacy-policy.html',
        })
        .when('/contact-us', {
            controller: ContactUsController,
            controllerAs: 'contactUsCtrl',
            templateUrl: 'contact_us/contact-us.html',
        })
        .when('/faqs', {
            controller: FAQsController,
            controllerAs: 'faqsCtrl',
            templateUrl: 'faqs/faqs.html',
        })
        .otherwise({ redirectTo: '/' });
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    	$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        $locationProvider.html5Mode({
          enabled: true,
          requireBase: false
        });
        socialProvider.setFbKey({appId: "1968330623489604", apiVersion: "v2.12"});
    }
]);
