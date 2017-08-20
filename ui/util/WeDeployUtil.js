import randomstring from 'randomstring';
import WeDeploy from 'wedeploy';

export default class WeDeployUtil {
	static addRandomTicket(callback) {
		var ticketKey = randomstring.generate();

		WeDeploy
			.data(process.env.WEDEPLOY_DB_BASE_URL)
			.auth(process.env.WEDEPLOY_TOKEN)
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

	static addUpdateUser(username, callback) {
		WeDeployUtil.getUser(
			username,
			function(user) {
				if (!user || user.length == 0) {
					WeDeploy
						.data(process.env.WEDEPLOY_DB_BASE_URL)
						.auth(process.env.WEDEPLOY_TOKEN)
						.create(
							'user',
							{
								'id': username,
								'username': username
							}
						)
						.then(
							function(user) {
								callback(user);
							}
						);
				}
				else {
					callback(user);
				}
			}
		);
	}

	static addUpdateVacation(username, repository, enabled, closePull, comment, callback) {
		WeDeploy
			.data(process.env.WEDEPLOY_DB_BASE_URL)
			.auth(process.env.WEDEPLOY_TOKEN)
			.where('username', '=', username)
			.where('repository', '=', repository)
			.limit(1)
			.get('vacation')
			.then(
				function(vacation) {
					if (vacation && vacation.length == 1) {
						WeDeploy
							.data(process.env.WEDEPLOY_DB_BASE_URL)
							.auth(process.env.WEDEPLOY_TOKEN)
							.update(
								'vacation/' + vacation[0].id,
								{
									'enabled': enabled,
									'closePull': closePull,
									'comment': comment
								}
							)
							.then(
								function(vacation) {
									callback(vacation);
								}
							);
					}
					else {
						WeDeploy
							.data(process.env.WEDEPLOY_DB_BASE_URL)
							.auth(process.env.WEDEPLOY_TOKEN)
							.create(
								'vacation',
								{
									'username': username,
									'repository': repository,
									'enabled': enabled,
									'closePull': closePull,
									'comment': comment
								}
							)
							.then(
								function(vacation) {
									callback(vacation);
								}
							);
					}
				}
			);

	}

	static enableVacation(username, repository, enabled, callback) {
		WeDeploy
			.data(process.env.WEDEPLOY_DB_BASE_URL)
			.auth(process.env.WEDEPLOY_TOKEN)
			.where('username', '=', username)
			.where('repository', '=', repository)
			.limit(1)
			.get('vacation')
			.then(
				function(vacation) {
					if (vacation && vacation.length == 1) {
						WeDeploy
							.data(process.env.WEDEPLOY_DB_BASE_URL)
							.auth(process.env.WEDEPLOY_TOKEN)
							.update(
								'vacation/' + vacation[0].id,
								{
									'enabled': enabled
								}
							)
							.then(
								function(vacation) {
									callback(enabled);
								}
							);
					}
					else {
						WeDeploy
							.data(process.env.WEDEPLOY_DB_BASE_URL)
							.auth(process.env.WEDEPLOY_TOKEN)
							.create(
								'vacation',
								{
									'username': username,
									'repository': repository,
									'enabled': enabled
								}
							)
							.then(
								function(vacation) {
									callback(enabled);
								}
							);
					}
				}
			);

	}

	static deleteTicket(ticketKey) {
		var data = WeDeploy
			.data(process.env.WEDEPLOY_DB_BASE_URL)
			.auth(process.env.WEDEPLOY_TOKEN);

		data.delete('ticket/' + ticketKey);
	}

	static getUser(username, callback) {
		WeDeploy
			.data(process.env.WEDEPLOY_DB_BASE_URL)
			.auth(process.env.WEDEPLOY_TOKEN)
			.where('username', '=', username)
			.limit(1)
			.get('user')
			.then(
				function(user) {
					callback(user);
				}
			);
	}

	static getVacations(username, callback) {
		WeDeploy
			.data(process.env.WEDEPLOY_DB_BASE_URL)
			.auth(process.env.WEDEPLOY_TOKEN)
			.where('username', '=', username)
			.get('vacation')
			.then(
				function(vacation) {
					callback(vacation);
				}
			);
	}

	static isVacationEnabled(username, repository, callback) {
		WeDeploy
			.data(process.env.WEDEPLOY_DB_BASE_URL)
			.auth(process.env.WEDEPLOY_TOKEN)
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

	static validateTicket(ticketKey, callback) {
		WeDeploy
			.data(process.env.WEDEPLOY_DB_BASE_URL)
			.auth(process.env.WEDEPLOY_TOKEN)
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