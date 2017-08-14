import randomstring from 'randomstring';
import WeDeploy from 'wedeploy';

export default class WeDeployUtil {
	static addRandomTicket(callback) {
		var ticketKey = randomstring.generate();

		WeDeploy
			.data('https://database-github.wedeploy.io')
			.create(
				'ticket',
				{
					"id": ticketKey
				}
			)
			.then(
				function(ticket) {
					callback(ticketKey);
				}
			);
	}

	static addUser(username, accesstoken, callback) {
		WeDeploy
			.data('https://database-github.wedeploy.io')
			.create(
				'user',
				{
					'id': username,
					'username': username,
					'accesstoken': accesstoken
				}
			)
			.then(
				function(user) {
					callback(user);
				}
			);
	}

	static addVacation(username, repository, enabled, comment, callback) {
		WeDeploy
			.data('https://database-github.wedeploy.io')
			.create(
				'vacation',
				{
					'username': username,
					'repository': repository,
					'enabled': enabled,
					'comment': comment
				}
			)
			.then(
				function(vacation) {
					callback(vacation);
				}
			);
	}

	static deleteTicket(ticketKey) {
		var data = WeDeploy.data('https://database-github.wedeploy.io');

		data.delete('ticket/' + ticketKey);
	}

	static getUserAccessToken(username, callback) {
		WeDeploy
			.data('https://database-github.wedeploy.io')
			.where('username', '=', username)
			.limit(1)
			.get('user')
			.then(
				function(user) {
					callback(user);
				}
			);
	}

	static isVacationEnabled(username, repository, callback) {
		WeDeploy
			.data('https://database-github.wedeploy.io')
			.where('username', '=', username)
			.where('repository', '=', repository)
			.limit(1)
			.get('vacation')
			.then(
				function(vacation) {
					if (vacation && vacation.length == 1) {
						if (!!vacation[0].enabled) {
							callback(vacation[0]);
						}
					}
				}
			);
	}

	static updateUser(username, accesstoken, callback) {
		WeDeploy
			.data('https://database-github.wedeploy.io')
			.update(
				'user/' + username,
				{
					'accesstoken': accesstoken
				}
			)
			.then(
				function(user) {
					callback(user);
				}
			);
	}

	static validateTicket(ticketKey, callback) {
		WeDeploy
			.data('https://database-github.wedeploy.io')
			.where('id', '=', ticketKey)
			.limit(1)
			.get('ticket')
			.then(
				function(ticket) {
					if (ticket && ticket.length == 1) {
						callback(ticket);
					}
				}
			);
	}
	
}