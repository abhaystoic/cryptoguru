/**
 *
 */

class SideNavDirective {

    constructor($rootScope) {
        this.restrict = 'E';
        this.templateUrl = 'side-nav/side-nav.html';
    }
};

SideNavDirective.$inject = ['$rootScope'];

export {SideNavDirective};
