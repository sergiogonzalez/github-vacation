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

					var repos = [];

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

						repos.push({'repository': repositories[repository], 'enabled': vacationEnabled, 'closePull': vacationClosePull, 'comment': vacationComment});
					}

					res.render(
						'repositories',
						{
							vacationRepositories: repos,
							title: 'Repositories',
							avatar_url: req.session.avatar_url,
							username: req.session.username
						}
					);
				}
			);
		}
	);
});

module.exports = router;