var socket = io.connect(WEDEPLOY_UI_BASE_URL);

function enable(repositoryOwner, repositoryName) {
	var card = $('#card' + repositoryName);

	card.ploading({
		action: 'show',
		spinner: 'wave'
	});

	setTimeout(
		function () {
			socket.emit(
				'saveVacation',
				{
					'repositoryOwner': repositoryOwner,
					'repositoryName': repositoryName,
					'vacationMode': ($('#vacationMode' + repositoryName).is(":checked")),
					'closePull': ($('#closePull' + repositoryName).is(":checked")),
					'comment': $('#comment' + repositoryName).val()
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
		var card = $('#card' + data.repositoryName);

		card.ploading({
			action: 'hide'
		});

		addSuccessMessage('Vacation for repository <strong>' + data.repositoryName + '</strong> was saved successfully.')
	}
);

socket.on(
	'vacationEnabled',
	function (data) {
		var card = $('#card' + data.repositoryName);
		var closePull = $('#closePull' + data.repositoryName);
		var comment = $('#comment' + data.repositoryName);
		var saveButton = $('#saveButton' + data.repositoryName);

		if (data.enabled) {
			card.removeClass('text-secondary');
			card.removeClass('disabled-repository');
			closePull.removeAttr("disabled");
			comment.removeAttr("disabled");
			comment.removeClass('text-secondary');
			saveButton.removeClass('btn-secondary');
			saveButton.addClass('btn-primary');
			saveButton.removeAttr("disabled");
			addSuccessMessage('Repository <strong>' + data.repositoryName + '</strong> was enabled successfully.')
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
			addSuccessMessage('Repository <strong>' + data.repositoryName + '</strong> was disabled successfully.')
		}

		var card = $('#card' + data.repositoryName);

		card.ploading({
			action: 'hide'
		});
	}
);

$(document).ready(function() {
	$('input.enable-vacation').change(
		function () {
			var card = $('#card' + this.getAttribute('data-repository-name'));

			card.ploading({
				action: 'show',
				spinner: 'wave'
			});
			
			socket.emit(
				'enableVacation',
				{
					'enable': this.checked,
					'repositoryOwner': this.getAttribute('data-repository-owner'),
					'repositoryName': this.getAttribute('data-repository-name')
				}
			);
		}
	);
});