import request from 'request';

export default class GitHubUtil {
	static getAccessToken(code, state, callback) {
		var headers = {
			'Accept': 'application/json'
		};

		var options = {
			url: 'https://github.com/login/oauth/access_token',
			method: 'POST',
			headers: headers,
			form: {
				'client_id': process.env.CLIENT_ID,
				'client_secret': process.env.CLIENT_SECRET,
				'code': code,
				'redirect_uri': process.env.WEDEPLOY_UI_BASE_URL + '/login',
				'state': state
			}
		};

		request(
			options,
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var json = JSON.parse(body);

					var accessToken = json.access_token;

					callback(accessToken);
				}
			}
		);
	}

	static getUserInformation(accessToken, callback) {
		var headers = {
			'Accept': 'application/vnd.github.v3+json',
			'Authorization': 'token ' +  accessToken,
			'User-Agent': 'My Cool Application'
		};

		var options = {
			url: 'https://api.github.com/user',
			method: 'GET',
			headers: headers
		};

		request(
			options,
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var json = JSON.parse(body);

					var user = {
						'avatar_url': json.avatar_url,
						'email': json.email,
						'username': json.login,
						'name': json.name
					};

					callback(user);
				}
			}
		);
	}

	static addWebHook(accessToken, repositoryOwner, repositoryName, callback) {
		var headers = {
			'Accept': 'application/vnd.github.v3+json',
			'Authorization': 'token ' +  accessToken,
			'User-Agent': 'My Cool Application'
		};

		var options = {
			url: 'https://api.github.com/repos/' + repositoryOwner + '/' + repositoryName + '/hooks',
			method: 'POST',
			headers: headers,
			body: {
				'name': 'web',
				'events': ['pull_request'],
				'active': true,
				'config': {
					'url': 'https://github-vacation.wedeploy.io/close_pull',
					'content_type': 'json'
				}
			},
			json: true
		};

		request(
			options,
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					callback();
				}
			}
		);
	}

	static addCollaborator(accessToken, repositoryOwner, repositoryName, callback) {
		var headers = {
			'Accept': 'application/vnd.github.v3+json',
			'Authorization': 'token ' +  accessToken,
			'User-Agent': 'My Cool Application',
			'Content-Length': 0
		};

		var options = {
			url: 'https://api.github.com/repos/' + repositoryOwner + '/' + repositoryName + '/collaborators/github-vacation',
			method: 'PUT',
			headers: headers
		};

		request(
			options,
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					callback();
				}
			}
		);
	}

	static addComment(repositoryOwner, repositoryName, pullId, comment, callback) {
		var headers = {
			'Accept': 'application/vnd.github.v3+json',
			'Authorization': 'token ' +  process.env.GITHUB_VACATION_TOKEN,
			'User-Agent': 'My Cool Application'
		};

		var options = {
			url: 'https://api.github.com/repos/' + repositoryOwner + '/' + repositoryName + '/issues/' + pullId + '/comments',
			method: 'POST',
			headers: headers,
			body: {
				'body': comment
			},
			json: true
		};

		request(
			options,
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					callback();
				}
			}
		);
	}

	static closePullRequest(repositoryOwner, repositoryName, pullId, callback) {
		var headers = {
			'Accept': 'application/vnd.github.v3+json',
			'Authorization': 'token ' +  process.env.GITHUB_VACATION_TOKEN,
			'User-Agent': 'My Cool Application'
		};

		var options = {
			url: 'https://api.github.com/repos/' + repositoryOwner + '/' + repositoryName + '/pulls/' + pullId,
			method: 'PATCH',
			headers: headers,
			body: {
				'state': 'closed'
			},
			json: true
		};

		request(
			options,
			function (error, response, body) {
				if (!error && response.statusCode == 200) {

					callback();
				}
			}
		);
	}

	static getTokenRequestUrl(clientId, redirectUri, scope, state) {
		return 'https://github.com/login/oauth/authorize?client_id=' + clientId +
			'&redirect_uri=' + redirectUri +
			'&scope=' + scope +
			'&state=' + state;
	}

	static getRepositories(username, accessToken, callback) {
		var headers = {
			'Accept': 'application/vnd.github.v3+json',
			'Authorization': 'token ' +  accessToken,
			'User-Agent': 'My Cool Application'
		};

		var options = {
			url: 'https://api.github.com/users/' + username + '/repos',
			method: 'GET',
			headers: headers
		};

		request(
			options,
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var json = JSON.parse(body);

					var repositories = [];

					for(var repository in json) {
						repositories.push({'name': json[repository].name, 'owner': json[repository].owner.login});
					}

					callback(repositories);
				}
			}
		);
	}

}