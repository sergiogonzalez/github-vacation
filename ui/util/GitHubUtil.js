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
				'client_id': '346c1c6568cf98e8d250',
				'client_secret': '8c80e360761eaa0770deae4435b2031567fd1bf1',
				'code': code,
				'redirect_uri': 'https://github-github.wedeploy.io/login',
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
						'email': json.email,
						'username': json.login,
						'name': json.name
					};

					callback(user);
				}
			}
		);
	}

	static addWebHook(accessToken, owner, repo, callback) {
		var headers = {
			'Accept': 'application/vnd.github.v3+json',
			'Authorization': 'token ' +  accessToken,
			'User-Agent': 'My Cool Application'
		};

		var options = {
			url: 'https://api.github.com/repos/' + owner + '/' + repo + '/hooks',
			method: 'POST',
			headers: headers,
			body: {
				'name': 'web',
				'events': ['pull_request'],
				'active': true,
				'config': {
					'url': 'https://github-github.wedeploy.io/close_pull',
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

	static addComment(accessToken, owner, repo, pullId, comment, callback) {
		var headers = {
			'Accept': 'application/vnd.github.v3+json',
			'Authorization': 'token ' +  accessToken,
			'User-Agent': 'My Cool Application'
		};

		var options = {
			url: 'https://api.github.com/repos/' + owner + '/' + repo + '/issues/' + pullId + '/comments',
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

	static closePullRequest(accessToken, owner, repo, pullId, callback) {
		var headers = {
			'Accept': 'application/vnd.github.v3+json',
			'Authorization': 'token ' +  accessToken,
			'User-Agent': 'My Cool Application'
		};

		var options = {
			url: 'https://api.github.com/repos/' + owner + '/' + repo + '/pulls/' + pullId,
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

					var repos = [];

					for(var repo in json) {
						repos.push({'name': json[repo].name, 'owner': json[repo].owner.login});
					}

					callback(repos);
				}
			}
		);
	}

}