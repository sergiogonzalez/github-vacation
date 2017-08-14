import bodyParser from 'body-parser';
import express from 'express';
import GitHubUtil from '../util/GitHubUtil.js';
import WeDeployUtil from '../util/WeDeployUtil.js';

var router = express.Router();
var jsonParser = bodyParser.json();

router.post(
	'/',
	jsonParser,
	function(req, res, next) {
		var json = JSON.parse(JSON.stringify(req.body));
	
		var action = json.action;
		var pullRequestId = json.number;
		var repository = json.repository;
	
		if (action == 'opened') {
			WeDeployUtil.getUserAccessToken(
				repository.owner.login,
				function(user) {
					GitHubUtil.addComment(
						user[0].accesstoken,
						repository.owner.login,
						repository.name,
						pullRequestId,
						'Test Comment',
						function() {}
					);
	
					GitHubUtil.closePullRequest(
						user[0].accesstoken,
						repository.owner.login,
						repository.name,
						pullRequestId,
						function() {}
					);
				}
			);
		}

		res.send('Closed');
	}
);

module.exports = router;