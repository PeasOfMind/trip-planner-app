'use strict'

const MOCK_TRIP_DATA = {
    trips: [ 
        {
            id: '1111111',
            name: 'Christmas Vacation', 
            destination: {
                location: 'Paris',
                country: 'France'
            },
            savedPlaces: [
                {
                    name: 'Baguette',
                    address: '123 Main Street, Fancy France Street, 75000',
                    type: "Restaurant",
                },
                {
                    name: 'Eiffel Tower',
                    address: 'Champ de Mars, 5 Avenue Anatole France, 75007',
                    type:  'Landmark',
                },
                {
                    name: 'Le 10 Bis Hotel',
                    address: '10 B rue de Debarcadere, 75017',
                    type: 'Accomodation'
                }
            ],
            packingList: [
                {
                    item: 'sunscreen',
                    packed: false
                },
                {
                    item: 'passport',
                    packed: true
                },
                {
                    item: 'foreign currency',
                    packed: false
                }
            ],
            dates: {
                start: new Date(2018, 12, 23),
                end: new Date(2019, 1, 6)
            }
        },
        {
            id: '222222',
            name: 'Summer Family Trip', 
            destination: {
                location: 'Bangkok',
                country: 'Thailand'
            },
            savedPlaces: [
                {
                    name: 'Temple of the Reclining Buddha',
                    address: '2 Sanamchai Road, Grand Palace, Pranakorn, 10200',
                    type: 'Restaurant',
                }
            ],
            packingList: [
                {
                    item: 'sunscreen',
                    packed: false
                },
                {
                    item: 'passport',
                    packed: true
                },
                {
                    item: 'foreign currency',
                    packed: false
                }
            ],
            dates: {
                start: new Date(2019, 3, 15),
                end: new Date(2019, 3, 22)
            }
        } 
    ]
}

function editDatabase(callback, id, inputData, index){
    callback(MOCK_TRIP_DATA, id, inputData, index);
}

//update place details in database
function updateAndDisplayPlaceDetails(data, id, inputData, index){
    for (let i = 0; i < data.trips.length; i++) {
        let currentTrip = data.trips[i];
        if (currentTrip.id === id){
            const currentPlace = currentTrip.savedPlaces[index];
            currentPlace.name = inputData.find('.js-place-name').val();
            currentPlace.address = inputData.find('.js-address').val();
            currentPlace.type = inputData.find('.js-place-type').val();
            $(`div[data-place-index='${index}']`).empty()
            .append('<button class="js-edit place">Edit Place Details</button>')
            .append(displayOnePlace(currentPlace));
        }
    }
}

//update trip details in database
function updateAndDisplayTripDetails(data, id){
    for (let index = 0; index < data.trips.length; index++) {
        let currentTrip = data.trips[index];
        if (currentTrip.id === id){
            currentTrip.name = $('#js-trip-name').val();
            currentTrip.destination.location = $('#js-location').val();
            currentTrip.destination.country = $('#js-country').val();
            const newStart = $('#js-start-date').val().split('-');
            const newEnd = $('#js-end-date').val().split('-');
            currentTrip.dates.start = new Date(newStart[0], newStart[1], newStart[2]);
            currentTrip.dates.end = new Date(newEnd[0], newEnd[1], newEnd[2]);
            $('#trip-details').empty().append(displayTripDetails(currentTrip))
            .prepend('<button class="js-edit details">Edit Trip Details</button>');
        }
    }
}

function getFormData(callback, id, index){
    callback(MOCK_TRIP_DATA, id, index);
}

function prefillPlaceForm(data, id, index){
    //fill in values with current place details
    const currentForm = $(`div[data-place-index='${index}']`);
    for (let i = 0; i < data.trips.length; i++){
        let currentTrip = data.trips[i];
        if (currentTrip.id === id){
            const currentPlace = currentTrip.savedPlaces[index];
            currentForm.find('.js-place-name').val(currentPlace.name);
            currentForm.find('.js-address').val(currentPlace.address);
            currentForm.find('.js-place-type').val(currentPlace.type);
        }
    }
}

function prefillDetailsForm(data, id){
    //fill in values with current trip details
    for (let index = 0; index < data.trips.length; index++){
        let currentTrip = data.trips[index];
        if (currentTrip.id === id){
            $('#js-trip-name').val(currentTrip.name);
            $('#js-location').val(currentTrip.destination.location);
            $('#js-country').val(currentTrip.destination.country);
            $('#js-start-date').val(currentTrip.dates.start.toISOString().split('T')[0]);
            $('#js-end-date').val(currentTrip.dates.end.toISOString().split('T')[0]);            
        }
    }
}

//Add buttons to edit packing list (add, edit, delete)
function displayListOptions(){
    $('button.list').remove();
    $('#packing-list').prepend('<button id="js-add-item">Add Item</button>');
    $('#item-list li').append('<button class="js-edit-item">Edit Item</button>' +
    '<button class="js-delete-item">Delete Item</button>');
}

//Turn the saved place into an editable form
function getAndDisplayPlaceForm(selectedId, index){
    $(`div[data-place-index='${index}']`).empty().append(`
    <form class="place-form js-place-form">
        <label for="place-name">Place Name</label>
        <input type="text" name="place-name" class="js-place-name">
        <label for="address">Address</label>
        <input type="text" name="address" class="js-address">
        <label for="place-type">Place Type</label>
        <input type="text" name="place-type" class="js-place-type">
        <input type="submit" class="js-submit-place" value="Submit Edits">
    </form>`);
    getFormData(prefillPlaceForm, selectedId, index);
}

//Turn the trip details section into a editable form
function getAndDisplayDetailsForm(selectedId){
    $('#trip-details').empty().append(`
    <form id="details-form" class="js-details-form">
        <label for="trip-name">Trip Name</label>
        <input type="text" name="trip-name" id="js-trip-name">
        <label for="location">Location</label>
        <input type="text" name="location" id="js-location">
        <label for="country">Country</label>
        <input type="text" name="country" id="js-country">
        <label for="start-date">Start Date</label>
        <input type="date" name="start-date" id="js-start-date">
        <label for="end-date">End Date</label>
        <input type="date" name="end-date" id="js-end-date">
        <input type="submit" id="js-submit-details" value="Submit Edits">
    </form>`)
    getFormData(prefillDetailsForm, selectedId);
}

//Add edit buttons to each section of current trip
function displayEditFeatures(){
    $('button.edit-trip').remove();
    $('#trip-details').prepend('<button class="js-edit details">Edit Trip Details</button>');
    $('.saved-place').prepend('<button class="js-edit place">Edit Place Details</button>');
    $('#packing-list').prepend('<button class="js-edit list">Edit Packing List</button>');
}

//Displays the current trip that the user has selected

function getSelectedTrip(callback, id){
    setTimeout(function(){callback(MOCK_TRIP_DATA, id)}, 100);
}

function displayPackingList(tripObject){
    let listHTML = [];
    for (let index = 0; index < tripObject.packingList.length; index++){
        let listItem = tripObject.packingList[index];
        listHTML.push(`<li data-list-index="${index}">${listItem.item}</li>`)
    }
    return listHTML.join('');
}

function displayOnePlace(place){
    return `<h5 class="place-name">${place.name}</h5>
    <p class="place-address">Address: ${place.address}</p>
    <p class="place-type">Type: ${place.type}</p>`
}

function displaySavedPlaces(tripObject){
    let placeHTML = [];
    for (let index = 0; index < tripObject.savedPlaces.length; index++) {
        let place = tripObject.savedPlaces[index];
        placeHTML.push(`<div class="saved-place" data-place-index="${index}">
        ${displayOnePlace(place)}
        </div>`);
    }
    return placeHTML.join('');
}

function displayTripDetails(currentTrip){
    return `<h2 class="trip-name">${currentTrip.name}</h2>
    <h3 class="destination">${currentTrip.destination.location}, ${currentTrip.destination.country}</h3>
    <h4 class="date">Dates</h4>
    <p>${currentTrip.dates.start.toLocaleDateString()} to ${currentTrip.dates.end.toLocaleDateString()}</p>`
}

function displaySelectedTrip(data, id){
    for (let index = 0; index < data.trips.length; index++){
        let currentTrip = data.trips[index];
        if (currentTrip.id === id){
            $('#active-trips').empty();
            $('#current-trip').attr('data-id', currentTrip.id);
            $('#current-trip').html(`<div id="trip-details">
            ${displayTripDetails(currentTrip)}
            </div>
            <h4 class="saved-places">Bookmarked Places</h4>
            ${displaySavedPlaces(currentTrip)}
            <div id="packing-list">
            <h4>Packing List</h4>
            <ul id="item-list">${displayPackingList(currentTrip)}</ul>
            </div>
            <button class="edit-trip">Edit Trip</button>
            <button class="delete-trip">Delete Trip</button>
            <button class="dashboard-redirect">Back to Dashboard
            </button>`)
        }
    }
    $('#active-trips').prop('hidden', true);
    $('#current-trip').prop('hidden', false);
}

function getAndDisplaySelectedTrip(id){
    getSelectedTrip(displaySelectedTrip, id);
}

//Show all trips that user has created

function getActiveTrips(callback){
    setTimeout(function(){ callback(MOCK_TRIP_DATA)}, 100);
}

function displayActiveTrips(data){
    for (let index = 0; index < data.trips.length; index++) {
        let currentTrip = data.trips[index];
        $('#active-trips').append(`<div data-id=${currentTrip.id}>
        <h2>${currentTrip.name}</h2>
        <h3>${currentTrip.destination.location}</h3>
        <button class="view-trip">View Trip</button>
        <button class="edit-trip">Edit Trip</button>
        <button class="delete-trip">Delete Trip</button>
        </div>`);
    }
    $('#active-trips').prop('hidden', false);
    $('#logout-button').prop('hidden', false);
}

function getAndDisplayActiveTrips(){
    $('#login-page').prop('hidden', true);
    $('#current-trip').prop('hidden', true);
    getActiveTrips(displayActiveTrips);
}

function watchEditPage(){
    $('#current-trip').on('click', 'button.js-edit', (event) => {
        event.preventDefault();
        const selected = $(event.currentTarget);
        const selectedId = selected.parents('#current-trip').attr('data-id');
        if (selected.hasClass('details')){
            getAndDisplayDetailsForm(selectedId);
        } else if (selected.hasClass('place')){
            const placeIndex = selected.parent('div').attr('data-place-index');
            getAndDisplayPlaceForm(selectedId, placeIndex);
        } else if (selected.hasClass('list')){
            displayListOptions();
        }
    });
    //check to see if edits are submitted for trip details
    $('#current-trip').on('submit','.js-details-form',(event) => {
        event.preventDefault();
        const selected = $(event.currentTarget);
        const selectedId = selected.parents('#current-trip').attr('data-id');
        editDatabase(updateAndDisplayTripDetails,selectedId);
        // } else if (selected.hasClass('js-submit-place')){
        //     //update place details in database
    });
    //check to see if edits are submitted for place details
    $('#current-trip').on('submit', '.js-place-form', (event) => {
        event.preventDefault();
        const selected = $(event.currentTarget);
        const selectedId = selected.parents('#current-trip').attr('data-id');
        const placeIndex = selected.parent('div').attr('data-place-index');
        console.log(selected.find('.js-place-name').val());
        editDatabase(updateAndDisplayPlaceDetails, selectedId, selected, placeIndex);
    })
}

function watchViewPage(){
    $('#current-trip').on('click', 'button', (event) => {
        event.preventDefault();
        const selected = $(event.currentTarget);
        const selectedId = selected.parent('div').attr('data-id');
        if (selected.hasClass('edit-trip')){
            displayEditFeatures();
        } else if (selected.hasClass('delete-trip')){
            console.info('Delete Trip');
        } else if (selected.hasClass('dashboard-redirect')){
            $('#current-trip').empty().removeAttr('data-id');
            getAndDisplayActiveTrips(); 
        }
    });
}

function watchDashboard(){
    $('#active-trips').on('click', 'button', (event => {
        event.preventDefault();
        const selected = $(event.currentTarget);
        const selectedId = selected.parent('div').attr('data-id');
        if(selected.hasClass('view-trip')) {
            getAndDisplaySelectedTrip(selectedId);
        } else if (selected.hasClass('edit-trip')){
            //How to make this a promise chain? Make sure displayEditFeatures doesn't run until DisplaySelected Trip runs
            getAndDisplaySelectedTrip(selectedId)
            displayEditFeatures();
        } else if (selected.hasClass('delete-trip')){
            console.info('Delete Trip');
        }
    }));
}

function watchLogin(){
    $('.js-login-form').submit( event => {
        event.preventDefault();

        //TODO: validate login information
        const validLogin = true;
        if(validLogin) {
            getAndDisplayActiveTrips();
        } 

    });
}

function watchLogout(){
    $('#logout-button').click(event => {
        event.preventDefault();

        //TODO: destroy JTW key
        $('#active-trips').empty().prop('hidden', true);
        $('#current-trip').empty().prop('hidden', true);        
        $('#logout-button').prop('hidden', true);
        $('#login-page').prop('hidden', false);
    });
}

//run everything
$(function (){
    watchLogin();
    watchDashboard();
    watchViewPage();
    watchLogout();
    watchEditPage();
});