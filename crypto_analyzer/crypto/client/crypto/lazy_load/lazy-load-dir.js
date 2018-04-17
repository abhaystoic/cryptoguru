/**
 *
 */

class LazyLoadDirective {

    constructor($scope) {
        this.restrict = 'A';
        this.scope_ = $scope;
    }

    link(scope, element, attrs) {
    	var visibleHeight = element[0].offsetHeight;
      var threshold = 500;
      element.bind('scroll', function() {
        if (element[0].scrollTop + element[0].offsetHeight >= element[0].scrollHeight) {
          scope.$apply(attrs.lazyLoad);
        }
      });
    }
};

LazyLoadDirective.$inject = ['$scope'];

export {LazyLoadDirective};
