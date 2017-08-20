import express from 'express';
import GitHubUtil from '../util/GitHubUtil.js';
import WeDeployUtil from '../util/WeDeployUtil.js';

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	if (req.session.username) {
		res.redirect('/repositories');

		return;
	}

	if (!req.query.code) {
		WeDeployUtil.addRandomTicket(
			function (ticketKey) {
				var tokenRequestUrl = GitHubUtil.getTokenRequestUrl(
					process.env.CLIENT_ID,
					process.env.WEDEPLOY_UI_BASE_URL + '/login',
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
								req.session.avatar_url = user.avatar_url;

								WeDeployUtil.addUpdateUser(
									user.username,
									function (user) {
										res.redirect('/repositories');
									}
								);
							}
						);
					}
				)
			}
		);
	}
});

module.exports = router;
