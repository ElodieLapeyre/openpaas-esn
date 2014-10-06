'use strict';

var notificationModule = require('../../core/notification/user');

module.exports.list = function(req, res) {
  var user = req.user;

  var query = {};
  if (req.param('limit')) {
    var limit = parseInt(req.param('limit'));
    if (!isNaN(limit)) {
      query.limit = limit;
    }
  }

  if (req.param('offset')) {
    var offset = parseInt(req.param('offset'));
    if (!isNaN(offset)) {
      query.offset = offset;
    }
  }

  if (req.param('read')) {
    query.read = Boolean(req.param);
  }

  notificationModule.getForUser(user, query, function(err, notifications) {
    if (err) {
      return res.json(500, {error: {code: 500, message: 'Server Error', details: err.details}});
    }

    notifications = notifications || [];

    notificationModule.countForUser(user, query, function(err, count) {
      if (err) {
        count = notifications.length;
      }
      res.header('X-ESN-Items-Count', count);
      return res.json(200, notifications);
    });
  });
};