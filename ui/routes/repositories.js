import express from 'express';
import GitHubUtil from '../util/GitHubUtil.js';
import WeDeployUtil from '../util/WeDeployUtil.js';

var router = express.Router();

router.get('/', function(req, res, next) {
	GitHubUtil.getRepositories(
		req.session.username,
		req.session.access_token,
		function(repositories) {
			WeDeployUtil.getVacations(
				req.session.username,
				function(vacations) {

					var renderRepositories = [];

					for (var repository in repositories) {
						var vacationEnabled = false;
						var vacationClosePull = false;
						var vacationComment = '';

						for(var vacation in vacations) {
							if (vacations[vacation].repository == repositories[repository].name) {

								vacationEnabled = vacations[vacation].enabled;
								vacationClosePull = vacations[vacation].closePull;
								vacationComment = vacations[vacation].comment;

								break;
							}
						}

						renderRepositories.push({'repositoryName': repositories[repository].name, 'repositoryOwner': repositories[repository].owner, 'enabled': vacationEnabled, 'closePull': vacationClosePull, 'comment': vacationComment});
					}

					res.render(
						'repositories',
						{
							repositories: renderRepositories,
							title: 'Repositories',
							avatar_url: req.session.avatar_url,
							username: req.session.username,
							WEDEPLOY_UI_BASE_URL: process.env.WEDEPLOY_UI_BASE_URL
						}
					);
				}
			);
		}
	);
});

module.exports = router;