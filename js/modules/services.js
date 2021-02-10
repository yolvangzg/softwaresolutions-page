import * as request from './request.js';
"use strict";

// HTML Template about modal content
window.modalHTML = {
	info: `
	<div class="modal-header font-weight-bold">
		<h5 class="modal-title">Servicios</h5>
		<button type="button" class="close" data-dismiss="modal" aria-label="Close">
				<span aria-hidden="true"><i class="fas fa-times"></i></span>
		</button>
	</div>
	<div class="modal-body">
		<div class="container">
			<!-- <h3>Nombre: <span id="serviceName"></span></h3> -->
			<div class="modalImg">
				<img src="/" alt="" id="serviceImg" class="img-fluid rounded">
			</div>
			<div class="serviceDetails">
				<h5 class="my-3 h6 font-weight-bold">
				Categorías: 
					<span id="serviceCategory">
					
					</span>
				</h5>
				<p id="serviceShortDescription" class="lead"></p>
				<p class="modal-description" id="serviceDescription">
					Lorem, ipsum, dolor sit amet consectetur adipisicing elit. Ullam rem tenetur, eius. Sint consequuntur sit maiores expedita labore vitae aspernatur laboriosam tenetur cum fugit beatae pariatur, veniam recusandae vel quasi.
				</p>
			</div>
		</div>
	</div>
	<div class="modal-footer justify-content-start">
		<h5 class="h3">
			<small class="font-weight-normal">
				<span class="font-weight-bold">Precio: </span>
				<span id="servicePrice"></span>
			</small>
		</h5>
	</div>
	`,
	error: `
	<div class="modal-header font-weight-bold">
		<h5 class="modal-title">Servicios</h5>
		<button type="button" class="close" data-dismiss="modal" aria-label="Close">
				<span aria-hidden="true"><i class="fas fa-times"></i></span>
		</button>
	</div>
	<div class="modal-body">
		<div class="modal-error container d-flex justify-content-center align-items-center">
			<div class="d-flex flex-column text-center">
				<span class="h2 mb-3">Lo siento, un error ha ocurrido.</span>
				<span class="h5 mb-4">Vuelva a cargar el sitio para cargar el contenido. <br> <small>(Si el problema persiste, intente más tarde)</small></span>
				<i class="mb-4 fas fa-frown fa-7x"></i>
				<button class="btn btn-warning" onclick="location.reload()">Cargar de nuevo</button>
			</div>
		</div>
	</div>
	<div class="modal-footer justify-content-start">
		<h5 class="h3">
		&nbsp;
		</h5>
	</div>
	`
}
/* 
	It makes JSON request & send an addEventListener
	to each anchor in services, with a data-serviceIndex attribute
*/
export async function getAllAnchors () {
	// Make JSON request
	window.servicesInfo = await request.getServices();
	// Get All Services items
	const cardItems = document.querySelectorAll('#servicios .grid-item');
	cardItems.forEach(function(cardItem, index){
		// Get all links of each service
		var links = document.querySelectorAll('#service-' + (index) + ' .service-link');
		// On click open modal & set info
		for (var i = 0; i < links.length; i++) {
			links[i].dataset.serviceIndex = index;
			links[i].addEventListener('click', openModalService);
		}
	});
}
/*
	It get the JSON info from global constant,
	get the service index from data attribute,
	send it to sendInfoToModal function &
	open the modal
*/
function openModalService (event) {
	const modalContent = document.querySelector('#serviceModal .modal-content');
	// Check if request was successfull & info was catched in servicesInfo
	if (window.servicesInfo === null) {
		sendErrorToModal(modalContent);
	} else {
		// Get index service of parent
		const serviceIndex = parseInt(event.target.dataset.serviceIndex);
		sendInfoToModal(modalContent, window.servicesInfo[serviceIndex]);
	}
	// Toggle modal
	$('#serviceModal').modal('show');
}
/*
	It push a error message into the modal dialog window
*/
function sendErrorToModal (modalBody) {
	modalBody.innerHTML = window.modalHTML.error;
}
/*
	It push all the service information into the modal dialog window
*/
function sendInfoToModal(modalBody, service){
	modalBody.innerHTML = window.modalHTML.info;
	// Get Modal DOM model
	const modal = {
		name: [
			// document.getElementById('serviceName'),
			document.querySelector('#serviceModal .modal-title')
		],
		category: document.getElementById('serviceCategory'),
		shortDescription: document.getElementById('serviceShortDescription'),
		detailedDescription: document.getElementById('serviceDescription'),
		price: document.getElementById('servicePrice'),
		image: document.getElementById('serviceImg')
	}
	for (var property in modal){
		switch (property){
			case 'name':
				for (var i = 0; i < modal[property].length; i++) {
					modal[property][i].innerHTML = service[property];
				}
				break;
			case 'image':
				insertImage(modal[property], service[property]);
				break;
			case 'category':
				insertBadge(modal[property], service[property]);
				break;
			case 'price':
				insertPrice(modal[property], service[property]);
				break;
			default:
				modal[property].innerHTML = service[property];
		}
	}
}

// Push image parametter to tag
function insertImage(tag, info){
	tag.src = info.source;
	tag.alt = info.name;
}
// Push a sequence of badges tags into a parent tag
function insertBadge(parentTag, info){
	parentTag.innerHTML = "";
	const badgeTag = {
		open: '<span class="badge badge-primary mr-1">',
		close: '</span>'
	}
	info.forEach(function(value){
		parentTag.innerHTML += badgeTag.open + value + badgeTag.close;
	});
}
// Push a custom price expression into a tag
function insertPrice(tag, info){
	switch (info.type){
		case 'fixed':
			tag.innerHTML = '$' + info.value;
			break;
		case 'from':
			tag.innerHTML = 'Desde $' + info.value;
			break;
		case 'to':
			tag.innerHTML = 'Hasta $' + info.value;
			break;
		case 'hour':
			tag.innerHTML = '$' + info.value + ' por hora'
		case 'variable':
			tag.innerHTML = 'Acorde al trabajo';
			break;
	}
}