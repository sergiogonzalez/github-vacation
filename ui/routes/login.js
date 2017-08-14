import express from 'express';
import GitHubUtil from '../util/GitHubUtil.js';
import WeDeployUtil from '../util/WeDeployUtil.js';

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	if (!req.query.code) {
		WeDeployUtil.addRandomTicket(
			function (ticketKey) {
				var tokenRequestUrl = GitHubUtil.getTokenRequestUrl(
					'346c1c6568cf98e8d250',
					'https://github-github.wedeploy.io/login',
					'user:email,write:repo_hook,repo',
					ticketKey);

				res.redirect(tokenRequestUrl);
			}
		);
	}
	else {
		var code = req.query.code;
		var state = req.query.state;

		WeDeployUtil.validateTicket(
			state,
			function (ticket) {
				WeDeployUtil.deleteTicket(state);

				GitHubUtil.getAccessToken(
					code, state,
					function (accessToken) {
						req.session.access_token = accessToken;

						GitHubUtil.getUserInformation(
							accessToken,
							function(user) {
								req.session.email = user.email;
								req.session.username = user.username;

								WeDeployUtil.getUserAccessToken(
									req.session.username,
									function(user) {
										if (user && user.length == 1) {
											WeDeployUtil.updateUser(req.session.username, req.session.access_token, function(user) {});
										}
										else {
											WeDeployUtil.addUser(req.session.username, req.session.access_token, function(user) {});
										}
									}
								);

								res.redirect('/repositories');
							}
						);
					}
				)
			}
		);
	}
});

module.exports = router;
