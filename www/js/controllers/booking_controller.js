bookingzClient.controller('BookingController',
  ['$scope',
    '$http',
    'API_URL_DEVELOP',
    function ($scope, $http, API_URL_DEVELOP) {

      $scope.bookNow = function (resource) {

        var today = new Date,
          start = [
              today.getFullYear(),
              today.getMonth() + 1,
              today.getDate()
            ].join('-') + ' ' +
            [today.getHours(),
              today.getMinutes()].join(':'),
          thirtyMinutes = dateAdd(today, 'minute', 30),
          end = [
              thirtyMinutes.getFullYear(),
              thirtyMinutes.getMonth() + 1,
              thirtyMinutes.getDate()
            ].join('-') + ' ' +
            [thirtyMinutes.getHours(),
              thirtyMinutes.getMinutes()].join(':');


        var data = {
          time_start: start,
          time_end: end,
          client: 'Rummet är bokat'
        };

        var config = {
          headers: {
            'Accept': 'application/json;'
          }
        };

        $http.post(API_URL_DEVELOP + `/api/resources/${resource.uuid}/create_booking`, data, config)
          .success(function (data) {
            console.log(data);
            location.reload();
          })
          .error(function (data) {
            console.log(data);
          });
      };


      /**
       * Adds time to a date. Modelled after MySQL DATE_ADD function.
       * Example: dateAdd(new Date(), 'minute', 30)  //returns 30 minutes from now.
       * https://stackoverflow.com/a/1214753/18511
       *
       * @param date  Date to start with
       * @param interval  One of: year, quarter, month, week, day, hour, minute, second
       * @param units  Number of units of the given interval to add.
       */
      function dateAdd(date, interval, units) {
        var ret = new Date(date); //don't change original date
        var checkRollover = function () {
          if (ret.getDate() != date.getDate()) ret.setDate(0);
        };
        switch (interval.toLowerCase()) {
          case 'year'   :
            ret.setFullYear(ret.getFullYear() + units);
            checkRollover();
            break;
          case 'quarter':
            ret.setMonth(ret.getMonth() + 3 * units);
            checkRollover();
            break;
          case 'month'  :
            ret.setMonth(ret.getMonth() + units);
            checkRollover();
            break;
          case 'week'   :
            ret.setDate(ret.getDate() + 7 * units);
            break;
          case 'day'    :
            ret.setDate(ret.getDate() + units);
            break;
          case 'hour'   :
            ret.setTime(ret.getTime() + units * 3600000);
            break;
          case 'minute' :
            ret.setTime(ret.getTime() + units * 60000);
            break;
          case 'second' :
            ret.setTime(ret.getTime() + units * 1000);
            break;
          default       :
            ret = undefined;
            break;
        }
        return ret;
      }
    }]);
