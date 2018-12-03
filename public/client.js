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

function connectToDatabase(callback, id, index){
    callback(MOCK_TRIP_DATA, id, index);
}

function updateAndDisplayItemDetails(data, id, inputData, index){
    for (let i = 0; i < data.trips.length; i++) {
        let currentTrip = data.trips[i];
        if (currentTrip.id === id){
            const input = inputData.find('.js-item').val();
            //check if this update is for an existing item
            if (index) {
                const currentItem = currentTrip.packingList[index];
                currentItem.item = input;
                $(`li[data-list-index=${index}]`).empty()
                .text(currentItem.item)
                .append('<button class="js-edit item">Edit Item</button>' +
                '<button class="js-delete item">Delete Item</button>');
            } else {
                //if no index then item is new and needs to be added to database
                currentTrip.packingList.push({
                    item: input,
                    packed: false
                });
                $('#item-list').append(`<li data-list-index="${
                    currentTrip.packingList.length-1}">${input}
                    <button class="js-edit item">Edit Item</button>
                    <button class="js-delete item">Delete Item</button></li>`);
            }
        }
    }
}

function prefillItemForm(data, id, index){
    //fill in values with current item details
    for (let i = 0; i < data.trips.length; i++){
        let currentTrip = data.trips[i];
        if (currentTrip.id === id){
            $(`li[data-list-index=${index}]`).find('.js-item')
            .val(currentTrip.packingList[index].item);           
        }
    }
}

//display the item as an editable input
function getAndDisplayItemForm(id, index){
    $(`li[data-list-index=${index}]`).empty().append(`
    <form class="item-form">
    <input type="text" class="js-item">
    <input type="submit" class="js-submit-item" value="Submit Edits">
    </form>`);
    connectToDatabase(prefillItemForm, id, index);
}

//display a new item to input
function addItemForm(){
    $('#packing-list').children('.js-add').remove();
    $('#packing-list').prepend(`<form class="item-form">
    <input type="text" class="js-item">
    <input type="submit" class="js-submit-item" value="Add To Packing List">
    </form>`);
}

//display a new place to input
function addPlaceForm(){
    $('#saved-places').children('.js-add').remove();
    $('#saved-places').prepend(`<form class="place-form js-place-form">
    <label for="place-name">Place Name</label>
    <input type="text" name="place-name" class="js-place-name">
    <label for="address">Address</label>
    <input type="text" name="address" class="js-address">
    <label for="place-type">Place Type</label>
    <input type="text" name="place-type" class="js-place-type">
    <input type="submit" class="js-submit-place" value="Submit Edits">
    </form>`);
}

//update place details in database
function updateAndDisplayPlaceDetails(data, id, inputData, index){
    for (let i = 0; i < data.trips.length; i++) {
        let currentTrip = data.trips[i];
        let currentPlace;
        if (currentTrip.id === id){
            if (!index) {
                index = currentTrip.savedPlaces.push(new Object)-1;
                console.log(index);
            }
            currentPlace = currentTrip.savedPlaces[index];
            currentPlace.name = inputData.find('.js-place-name').val();
            currentPlace.address = inputData.find('.js-address').val();
            currentPlace.type = inputData.find('.js-place-type').val();
            $(`div[data-place-index='${index}']`).empty()
            .append('<button class="js-edit place">Edit Place Details</button>' + 
            '<button class="js-delete place">Delete Place</button>')
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
    $('#packing-list').prepend('<button class="js-add item">Add Item</button>');
    $('#item-list li').append('<button class="js-edit item">Edit Item</button>' +
    '<button class="js-delete item">Delete Item</button>');
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
    connectToDatabase(prefillPlaceForm, selectedId, index);
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
    connectToDatabase(prefillDetailsForm, selectedId);
}

function generateListButtons(data, id){
    for (let index = 0; index < data.trips.length; index++){
        let currentTrip = data.trips[index];
        if (currentTrip.id === id){
            if(currentTrip.packingList.length > 0){
                $('#packing-list').prepend('<button class="js-edit list">Edit Packing List</button>' + 
                '<button class="js-delete list">Delete Packing List</button>');
            } else {
                $('#packing-list').prepend('<button class="js-add item">Add Item</button>');
            }
        }
    }
}

//Add edit buttons to each section of current trip
function displayEditFeatures(id){
    $('button.edit-trip').remove();
    $('#trip-details').prepend('<button class="js-edit details">Edit Trip Details</button>');
    $('#saved-places').prepend('<button class="js-add place">Save A New Place</button>')
    $('.saved-place').prepend('<button class="js-edit place">Edit Place Details</button>' + 
    '<button class="js-delete place">Delete Place</button>');
    // get the correct buttons for the packing list (based on if it's empty or not)
    connectToDatabase(generateListButtons, id);
}

//Displays the current trip that the user has selected

function getSelectedTrip(callback, id){
    setTimeout(function(){callback(MOCK_TRIP_DATA, id)}, 100);
}

function displayPackingList(tripObject){
    let listArray = [];
    if (tripObject.packingList.length > 0){
        for (let index = 0; index < tripObject.packingList.length; index++){
            let listItem = tripObject.packingList[index];
            listArray.push(`<li data-list-index="${index}">${listItem.item}</li>`)
        }
        const listHTML = listArray.join('');
        return `<h4>Packing List</h4>
        <ul id="item-list">${listHTML}</ul>`
    } else return '<h4>No Items in Packing List Yet</h4>'
    //TODO: add item button to packing list when packing list is empty
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
            <div id="saved-places">
            <h4>Bookmarked Places</h4>
            ${displaySavedPlaces(currentTrip)}
            </div>
            <div id="packing-list">
            ${displayPackingList(currentTrip)}
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

//delete item from packing list and refresh page
function deleteItemAndRefresh(data, id, index){
    for (let i = 0; i < data.trips.length; i++){
        let currentTrip = data.trips[i];
        if (currentTrip.id === id){
            currentTrip.packingList.splice(index, 1);
            getAndDisplaySelectedTrip(id);
            displayEditFeatures(id);
        }
    }
}

//delete entire packing list and refresh page
function deleteListAndRefresh(data, id){
    for (let index = 0; index < data.trips.length; index++){
        let currentTrip = data.trips[index];
        if (currentTrip.id === id){
            // currentTrip.packingList.splice(0, currentTrip.packingList.length);
            currentTrip.packingList.length = 0;
            getAndDisplaySelectedTrip(id);
            displayEditFeatures(id);
        }
    }
}

//delete place from database and refresh page
function deletePlaceAndRefresh(data, id, index){
    for (let i = 0; i < data.trips.length; i++){
        let currentTrip = data.trips[i];
        if (currentTrip.id === id){
            currentTrip.savedPlaces.splice(index, 1);
            getAndDisplaySelectedTrip(id);
            displayEditFeatures(id);
        }
    }
}

//delete trip from database and refresh page
function deleteTripAndRefresh(data, id){
    for (let index = 0; index < data.trips.length; index++){
        let currentTrip = data.trips[index];
        if (currentTrip.id === id){
            data.trips.splice(index, 1);
            getAndDisplayActiveTrips();
        }
    }
}

function watchForSubmits(){
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
        editDatabase(updateAndDisplayPlaceDetails, selectedId, selected, placeIndex);
    });

    //check to see if any packing list items have been edited or added
    $('#current-trip').on('submit', '.item-form', (event) =>{
        event.preventDefault();
        const selected = $(event.currentTarget);
        const selectedId = selected.parents('#current-trip').attr('data-id');
        const itemIndex = selected.parent('li').attr('data-list-index');
        editDatabase(updateAndDisplayItemDetails, selectedId, selected, itemIndex);
    });
}

function watchForAdds(){
    $('#current-trip').on('click', 'button.js-add', (event) => {
        event.preventDefault();
        const selected = $(event.currentTarget);
        const selectedId = selected.parents('#current-trip').attr('data-id');
        if (selected.hasClass('place')){
            addPlaceForm();
        } else if (selected.hasClass('item')){
            //add an item to the packing list
            addItemForm();
        }
    });
}

function watchForDeletes(){
    $('#current-trip').on('click', 'button.js-delete', (event) => {
        event.preventDefault();
        const selected = $(event.currentTarget);
        const selectedId = selected.parents('#current-trip').attr('data-id');
        if (selected.hasClass('place')){
            //delete the place from the database
            const placeIndex = selected.parent('div').attr('data-place-index');
            connectToDatabase(deletePlaceAndRefresh, selectedId, placeIndex);
        } else if (selected.hasClass('list')){
            //delete the packing list
            connectToDatabase(deleteListAndRefresh, selectedId);
        } else if (selected.hasClass('item')){
            //delete an item on the packing list
            const itemIndex = selected.parent('li').attr('data-list-index');
            connectToDatabase(deleteItemAndRefresh, selectedId, itemIndex);
        }
    });
}

function watchForEdits(){
    $('#current-trip').on('click', 'button.js-edit', (event) => {
        event.preventDefault();
        const selected = $(event.currentTarget);
        const selectedId = selected.parents('#current-trip').attr('data-id');
        if (selected.hasClass('details')){
            //edit the trip details
            getAndDisplayDetailsForm(selectedId);
        } else if (selected.hasClass('place')){
            //edit the place details for one place
            const placeIndex = selected.parent('div').attr('data-place-index');
            getAndDisplayPlaceForm(selectedId, placeIndex);
        } else if (selected.hasClass('list')){
            //edit the packing list
            displayListOptions();
        } else if (selected.hasClass('item')){
            //edit an item on the packing list
            const itemIndex = selected.parent('li').attr('data-list-index');
            getAndDisplayItemForm(selectedId, itemIndex);
        }
    });
}

function watchViewPage(){
    $('#current-trip').on('click', 'button', (event) => {
        event.preventDefault();
        const selected = $(event.currentTarget);
        const selectedId = selected.parent('div').attr('data-id');
        if (selected.hasClass('edit-trip')){
            displayEditFeatures(selectedId);
        } else if (selected.hasClass('delete-trip')){
            $('#current-trip').empty();
            connectToDatabase(deleteTripAndRefresh, selectedId);
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
            getAndDisplaySelectedTrip(selectedId);
            displayEditFeatures(selectedId);
        } else if (selected.hasClass('delete-trip')){
            $('#active-trips').empty();
            connectToDatabase(deleteTripAndRefresh,selectedId);
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
    watchForEdits();
    watchForDeletes();
    watchForAdds();
    watchForSubmits();
});