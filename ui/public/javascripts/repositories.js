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