// Generated by CoffeeScript 1.9.1
var app;

app = angular.module('app', ['ui.router', 'restangular', 'satellizer']).config(function($stateProvider, $urlRouterProvider, $compileProvider, RestangularProvider, $authProvider) {
  $compileProvider.debugInfoEnabled(false);
  $('.modal-trigger').leanModal();
  $('ul.tabs').tabs();
  RestangularProvider.setBaseUrl('/api/v1');
  RestangularProvider.setRequestSuffix('/');
  $authProvider.loginUrl = '/api-token-auth/';
  $urlRouterProvider.otherwise('summary');
  $stateProvider.state('summary', {
    url: 'summary',
    templateUrl: 'static/partials/summary.html',
    resolve: {
      groups: function(Restangular) {
        return Restangular.all('groups').getList();
      },
      techniques: function(Restangular) {
        return Restangular.all('techniques').getList();
      }
    },
    controller: function($scope, groups, techniques) {
      $scope.groups = groups;
      return _.forEach($scope.groups, function(group) {
        return _.forEach(group.patrols, function(patrol) {
          return _.forEach(patrol.tests, function(test) {
            return test.technique_name = _.result(_.filter(techniques, {
              'id': test.technique
            })[0], 'name');
          });
        });
      });
    }
  }).state('ranking', {
    url: 'ranking',
    templateUrl: 'static/partials/ranking.html',
    resolve: {
      patrols: function(Restangular) {
        return Restangular.all('patrols').getList();
      }
    },
    controller: function($scope, patrols) {
      return $scope.patrols = patrols;
    }
  }).state('techniques', {
    url: 'techniques',
    templateUrl: 'static/partials/techniques.html',
    resolve: {
      techniques: function(Restangular) {
        return Restangular.all('techniques').getList();
      }
    },
    controller: function($scope, techniques) {
      return $scope.techniques = techniques;
    }
  }).state('tests', {
    url: 'tests',
    templateUrl: 'static/partials/tests.html',
    resolve: {
      tests: function(Restangular) {
        return Restangular.all('tests').getList();
      },
      patrols: function(Restangular) {
        return Restangular.all('patrols').getList();
      },
      techniques: function(Restangular) {
        return Restangular.all('techniques').getList();
      }
    },
    controller: function($state, $scope, techniques, tests, patrols) {
      $scope.tests = tests;
      _.forEach($scope.tests, function(test) {
        var patrol;
        test.technique_name = _.result(_.find(techniques, {
          'id': test.technique
        }), 'name');
        patrol = _.filter(patrols, {
          'id': test.patrol
        })[0];
        test.patrol_name = patrol.name;
        return test.group_name = patrol.group;
      });
      return _.delay(function() {
        return $state.reload('tests');
      }, 5000);
    }
  }).state('addtest', {
    url: 'addtest',
    templateUrl: 'static/partials/addtest.html',
    resolve: {
      patrols: function(Restangular) {
        return Restangular.all('patrols').getList();
      },
      groups: function(Restangular) {
        return Restangular.all('groups').getList();
      },
      techniques: function(Restangular) {
        return Restangular.all('techniques').getList();
      }
    },
    controller: function($state, $auth, $rootScope, $scope, Restangular, patrols, groups, techniques) {
      $('.modal-trigger').leanModal();
      $scope.newTest = {};
      $scope.feedback = '';
      $scope.search = {
        group: void 0
      };
      $scope.techniques = techniques;
      $scope.groups = groups;
      $scope.patrols = patrols;
      return $scope.save = function() {
        var saveThisTest;
        saveThisTest = {
          technique_score: $scope.newTest.technique_score,
          style_score: $scope.newTest.style_score,
          technique: _.result(_.find($scope.techniques, {
            'name': $scope.newTest.technique
          }), 'id'),
          patrol: _.result(_.find($scope.patrols, {
            'name': $scope.newTest.patrol,
            'group': $scope.search.group
          }), 'id'),
          user: $rootScope.username
        };
        Restangular.service('tests').post(saveThisTest).then(function() {
          $scope.feedback = {
            data: 'Test added successfully!'
          };
          return $state.reload('addtest');
        }, function(feedback) {
          return $scope.feedback = feedback;
        });
        return $('#confirm-add-test').closeModal();
      };
    }
  });
}).run(function($rootScope, $auth, $state) {
  $rootScope.login = function() {
    $auth.login({
      username: $rootScope.username,
      password: $rootScope.password
    });
    if ($rootScope.isAuth()) {
      return $state.go('addtest');
    } else {
      return $rootScope.msg = 'Error';
    }
  };
  $rootScope.logout = function() {
    $auth.logout();
    if (!$rootScope.isAuth()) {
      return $state.go('summary');
    }
  };
  $rootScope.isAuth = function() {
    if ($auth.getToken()) {
      return true;
    }
  };
  $rootScope.goHome = function() {
    $('ul.tabs').tabs('select_tab', 'tab4');
    return $state.go('summary');
  };
  return $state.go('summary');
});
