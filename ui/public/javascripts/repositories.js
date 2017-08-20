var socket = io.connect(process.env.WEDEPLOY_UI_BASE_URL);

function enable(owner, repo) {
	var card = $('#card' + repo);

	card.ploading({
		action: 'show',
		spinner: 'wave'
	});

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

function addSuccessMessage(message) {
	var html = $('<div class="alert alert-success alert-dismissible fade show report-message" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + message + '</div>');

	$('#reportMessages').prepend(html);
	setTimeout(
		function () {
			html.alert('close');
		},
		3500);
}

socket.on(
	'vacationSaved',
	function (data) {
		var card = $('#card' + data.repo);

		card.ploading({
			action: 'hide'
		});

		addSuccessMessage('Vacation for repository <strong>' + data.repo + '</strong> was saved successfully.')
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
			card.removeClass('disabled-repository');
			closePull.removeAttr("disabled");
			comment.removeAttr("disabled");
			comment.removeClass('text-secondary');
			saveButton.removeClass('btn-secondary');
			saveButton.addClass('btn-primary');
			saveButton.removeAttr("disabled");
			addSuccessMessage('Repository <strong>' + data.repository + '</strong> was enabled successfully.')
		}
		else {
			card.addClass('text-secondary');
			card.addClass('disabled-repository');
			closePull.attr("disabled", true);
			comment.attr("disabled", true);
			comment.addClass('text-secondary');
			saveButton.removeClass('btn-primary');
			saveButton.addClass('btn-secondary');
			saveButton.attr("disabled", true);
			addSuccessMessage('Repository <strong>' + data.repository + '</strong> was disabled successfully.')
		}

		var card = $('#card' + data.repository);

		card.ploading({
			action: 'hide'
		});
	}
);

$(document).ready(function() {
	$('input.enable-vacation').change(
		function () {
			var card = $('#card' + this.getAttribute('data-repository'));

			card.ploading({
				action: 'show',
				spinner: 'wave'
			});
			
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