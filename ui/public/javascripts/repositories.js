var socket = io.connect('https://github-vacation.wedeploy.io');

function enable(owner, repo) {
	var saveButton = $('#repositoryCard' + repo + ' button');

	saveButton.attr('class', 'btn btn-warning');
	saveButton.html('<i class="fa fa-spinner fa-spin"></i> Saving...');

	setTimeout(
		function () {
			socket.emit(
				'saveVacation',
				{
					'owner': owner,
					'repo': repo,
					'vacationMode': ($('#vacationMode' + repo).is(":checked")),
					'closePull': ($('#closePull' + repo).is(":checked")),
					'comment': $('#comment' + repo).val()
				}
			);
		},
		500);
}

socket.on(
	'vacationSaved',
	function (data) {
		var saveButton = $('#repositoryCard' + data.repo + ' button');

		saveButton.attr('class', 'btn btn-success');
		saveButton.html('<i class="fa fa-check"></i> Saved');

		setTimeout(
			function () {
				var saveButton = $('#repositoryCard' + data.repo + ' button');

				saveButton.attr('class', 'btn btn-primary');
				saveButton.html('Save');
			},
			2000);
	}
);

socket.on(
	'vacationEnabled',
	function (data) {
		var card = $('#card' + data.repository);
		var closePull = $('#closePull' + data.repository);
		var comment = $('#comment' + data.repository);
		var saveButton = $('#saveButton' + data.repository);

		if (data.enabled) {
			card.removeClass('text-secondary');
			closePull.removeAttr("disabled");
			comment.removeAttr("disabled");
			comment.removeClass('text-secondary');
			saveButton.removeClass('btn-secondary');
			saveButton.addClass('btn-primary');
			saveButton.removeAttr("disabled");

		}
		else {
			card.addClass('text-secondary');
			closePull.attr("disabled", true);
			comment.attr("disabled", true);
			comment.addClass('text-secondary');
			saveButton.removeClass('btn-primary');
			saveButton.addClass('btn-secondary');
			saveButton.attr("disabled", true);
		}
	}
);

$(document).ready(function() {
	$('input.enable-vacation').change(
		function () {
			socket.emit(
				'enableVacation',
				{
					'enable': this.checked,
					'owner': this.getAttribute('data-owner'),
					'repo': this.getAttribute('data-repository')
				}
			);
		}
	);
});