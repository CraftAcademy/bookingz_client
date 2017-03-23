angular.module('bookingz.filters', [])

  .filter("trust", ['$sce', function ($sce) {
    return function (htmlCode) {
      return $sce.trustAsHtml(htmlCode);
    }
  }]);
