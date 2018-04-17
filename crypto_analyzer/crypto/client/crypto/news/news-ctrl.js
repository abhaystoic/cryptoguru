/**
 *
 */
import {APIService} from '../common/services/api-service';

class NewsController {

    /*@ngInject*/
    constructor($rootScope) {
    	$rootScope.activeTab = 'news';
    }
};

NewsController.$inject = ['$rootScope'];

export {NewsController};
