/**
 *
 */
import {CommonFunctionsService} from '../common/services/common-functions-service';

class StarRatingDirective {

    constructor() {
      this.restrict = 'AE';
      this.templateUrl = 'ratings/ratings.html';
      this.scope = {
        ratingValue: '=ngModel',
        max: '=?',
        onRatingSelect: '&?',
        readonly: '=?'
      }
    }

    link(scope, element, attributes) {
      if (scope.max == undefined) {
        scope.max = 5;
      }
      let updateStars = () => {
        scope.stars = [];
        for (var i = 0; i < scope.max; i++) {
          scope.stars.push({
            filled: i < scope.ratingValue
          });
        }
      };
      scope.toggle = (index) => {
        if (scope.readonly == undefined || scope.readonly === false){
          scope.ratingValue = index + 1;
          scope.onRatingSelect({
            rating: index + 1
          });
        }
      };
      scope.$watch('ratingValue', (oldValue, newValue) => {
        if (newValue || newValue === 0) {
          updateStars();
        }
      });
    }

};
export {StarRatingDirective};
