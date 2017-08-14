import express from 'express';
import GitHubUtil from '../util/GitHubUtil.js';

var router = express.Router();

router.get('/', function(req, res, next) {
	GitHubUtil.getRepositories(
		req.session.username,
		req.session.access_token,
		function(repositories) {
			res.render(
				'repositories',
				{
					repositories: repositories,
					title: 'Repositories' 
				}
			);
		}
	);
});

module.exports = router;