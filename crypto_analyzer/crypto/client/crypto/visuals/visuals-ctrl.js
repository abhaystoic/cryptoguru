/**
 *
 */
import {APIService} from '../common/services/api-service';

class VisualController {

    /*@ngInject*/
    constructor($scope, $http, $cookies) {
        this.http_ = $http;
        initChartist(); // Available at index.html.
    }
};

VisualController.$inject = ['$scope', '$http', '$cookies'];

export {VisualController};
