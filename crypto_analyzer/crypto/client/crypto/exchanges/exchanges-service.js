import {RequestOptions} from '../../../../../node_modules/@angular/http';

class ExchangesService {

    /*@ngInject*/
    constructor($http){
      this.http_ = $http;
    }

    getAllExchanges() {
      var apiUrl = '/api/get_all_exchanges/';
      let headers = new Headers({
          'Content-Type': 'application/json',
      });
      let formData = {};
      let options = new RequestOptions({ headers: headers });
      return this.http_
                 .post(apiUrl, formData, options)
                 .then(response => response['data']['exchanges']);
    }

    getPrice(url, exchangeName) {
      let headers = new Headers({
          'Content-Type': 'application/json, X-CSAPI-Allow',
          'Access-Control-Allow-Origin': true,
      });
      let formData = {};
      let options = new RequestOptions({ headers: headers });
      return this.http_
                 .get(url, formData, options)
                 .then(response => this.processResponse(response['data'], exchangeName));
    }

    /**
     * Processes the response received from the API based on the exchange name.
     */
    processResponse(responseData, exchangeName) {
      let processedResponse = '';
      let coin_names_cat_1 = ['Zebpay', 'Unocoin'];
      let coin_names_cat_2 = ['WeMoveCoins'];
      let coin_names_cat_3 = ['Coinsecure'];
      let coin_names_cat_4 = ['Coindelta'];
      let exchange_cat_usd_only_key = {
        'CEX.IO': 'lprice',
        'itBit': 'lastPrice',
      };
      if (coin_names_cat_1.indexOf(exchangeName) > -1) {
        return responseData['buy'];
      } else if (coin_names_cat_2.indexOf(exchangeName) > -1) {
        return responseData.split(' ')[0];
      } else if (coin_names_cat_3.indexOf(exchangeName) > -1) {
        return responseData['lastPrice'];
      } else if (coin_names_cat_4.indexOf(exchangeName) > -1) {
        return responseData[0]['Last'];
      } else if (exchange_cat_usd_only_key.hasOwnProperty(exchangeName)) {
        return responseData[exchange_cat_usd_only_key[exchangeName]];
      }
    }
}

export {ExchangesService};
