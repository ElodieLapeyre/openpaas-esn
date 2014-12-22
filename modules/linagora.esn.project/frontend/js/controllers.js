'use strict';

angular.module('esn.project')
  .controller('projectController', ['$scope', 'projectService', 'session', 'project',
    function($scope, projectService, session, project) {
      $scope.project = project;

      $scope.canRead = function() {
        return projectService.canRead(project);
      };

      $scope.isProjectManager = function() {
        return projectService.isManager($scope.project, session.user);
      };

      $scope.canWrite = function() {
        return projectService.canWrite($scope.project);
      };

      $scope.writable = $scope.canWrite();
    }])
  .controller('projectsController', ['$scope', '$log', '$location', 'projectAPI', 'domain', 'user',
    function($scope, $log, $location, projectAPI, domain, user) {
      $scope.projects = [];
      $scope.error = false;
      $scope.loading = false;
      $scope.user = user;
      $scope.domain = domain;
      $scope.selected = '';

      $scope.getAll = function() {
        $scope.selected = 'all';
        $scope.loading = true;
        projectAPI.list(domain._id).then(
          function(response) {
            $scope.projects = response.data;
          },
          function(err) {
            $log.error('Error while getting projects', err);
            $scope.error = true;
            $scope.projects = [];
          }
        ).finally (
          function() {
            $scope.loading = false;
          }
        );
      };

      $scope.getMembership = function() {
        $scope.selected = 'membership';
        return $scope.getAll();
      };

      $scope.getModerator = function() {
        $scope.selected = 'moderator';
        return $scope.getAll();
      };

      $scope.getAll();
  }])
  .controller('projectsAStrackerController', ['$rootScope', '$scope', 'AStrackerHelpers', 'ASTrackerNotificationService', function($rootScope, $scope, AStrackerHelpers, ASTrackerNotificationService) {
      $scope.activityStreams = ASTrackerNotificationService.streams;
      $scope.show = false;
      $scope.load = true;

      AStrackerHelpers.getActivityStreamsWithUnreadCount('project', function(err, result) {
        if (err) {
          $scope.error = 'Error while getting unread message: ' + err;
          return;
        }

        result.forEach(function(element) {
          element.objectType = 'project';
          element.href = '/#/projects/' + element.target._id;
          element.img = '/api/projects/' + element.target._id + '/avatar';
          ASTrackerNotificationService.subscribeToStreamNotification(element.uuid);
          ASTrackerNotificationService.addItem(element);
        });
        $scope.load = false;
        $scope.show = result.length > 0;
      });
  }]);
