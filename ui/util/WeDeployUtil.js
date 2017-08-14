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