class Notify{
	constructor(){
		console.log('Notify is now startup.')
		this.noteType = Object.freeze({
			erfolg : '<div class="alert alert-success" role="alert">',
			hinweis : '<div class="alert alert-info" role="alert">',
			warnung : '<div class="alert alert-warning" role="alert">',
			fehler : '<div class="alert alert-danger" role="alert">'
		});
		this.displayText = null;
		console.log('Notify is currently running.')
	}
	
	setText(type, text){
		console.log('notify.js => Notyfy.setText() -> Start')
		this.displayText = type + text + '</div>';
	}
	
	makeModal(size='sm'){
		console.log('notify.js => Notyfy.makeModal() -> Start')
		document.getElementById('notifyDiv').innerHTML=`
<div class="modal fade" id="notify">
	<div class="modal-dialog modal-` + size + `">
		<div class="modal-content">
			<div class="modal-body" style="background-color: #C7C7C7">
				<form class="form-inline" action="/action_page.php">`
				+ this.displayText + `
				</form>
			</div>
			<button type="button" class="btn btn-secondary" data-dismiss="modal">OK</button>
		</div>
	</div>
</div>`;
	}
	
	showModal(){
		console.log('notify.js => Notyfy.showModal() -> Start')
		$('#notify').modal('show');
	}
	
	hideModal(){
		console.log('notify.js => Notyfy.hideModal() -> Start')
		$('#notify').modal('hide');
	}
	
	deleteModal(){
		console.log('notify.js => Notyfy.deleteModal() -> Start')
		document.getElementById('notifyDiv').innerHTML='';
	}
}