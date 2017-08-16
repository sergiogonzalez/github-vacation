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
			WeDeployUtil.isVacationEnabled(
				repository.owner.login,
				repository.name,
				function(vacation) {
					GitHubUtil.addComment(
						repository.owner.login,
						repository.name,
						pullRequestId,
						vacation.comment,
						function() {}
					);

					GitHubUtil.closePullRequest(
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