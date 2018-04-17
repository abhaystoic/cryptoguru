/**
 *
 */

class AdsDirective {

  constructor() {
    this.restrict = 'E';
    this.templateUrl = 'ads/ads.html';
  }

  controller() {
    // (adsbygoogle = window.adsbygoogle || []).push({});
   (adsbygoogle = window.adsbygoogle || []).push({
      google_ad_client: "ca-pub-1635047261368308",
      enable_page_level_ads: true
    });
  }
};

AdsDirective.$inject = [];

export {AdsDirective};
