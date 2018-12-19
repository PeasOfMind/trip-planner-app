'use strict';

const user = {
    username: null,
    authToken: null
};
// const MOCK_TRIP_DATA = {
//     trips: [ 
//         {
//             "id": '1111111',
//             "name": 'Christmas Vacation', 
//             "destination": {
//                 "location": 'Paris',
//                 "country": 'France'
//             },
//             "savedPlaces": [
//                 {
//                     "name": 'Baguette',
//                     "address": '123 Main Street, Fancy France Street, 75000',
//                     "type": 'Restaurant'
//                 },
//                 {
//                     "name": 'Eiffel Tower',
//                     "address": 'Champ de Mars, 5 Avenue Anatole France, 75007',
//                     "type":  'Landmark'
//                 },
//                 {
//                     "name": 'Le 10 Bis Hotel',
//                     "address": '10 B rue de Debarcadere, 75017',
//                     "type": 'Accomodation'
//                 }
//             ],
//             "packingList": [
//                 {
//                     "item": 'sunscreen',
//                     "packed": false
//                 },
//                 {
//                     "item": 'passport',
//                     "packed": true
//                 },
//                 {
//                     "item": 'foreign currency',
//                     "packed": false
//                 }
//             ],
//             "dates": {
//                 "start": new Date(2018, 12, 23),
//                 "end": new Date(2019, 1, 6)
//             }
//         },
//         {
//             "id": '222222',
//             "name": 'Summer Family Trip', 
//             "destination": {
//                 "location": 'Bangkok',
//                 "country": 'Thailand'
//             },
//             "savedPlaces": [
//                 {
//                     "name": 'Temple of the Reclining Buddha',
//                     "address": '2 Sanamchai Road, Grand Palace, Pranakorn, 10200',
//                     "type": 'Restaurant'
//                 }
//             ],
//             "packingList": [
//                 {
//                     "item": 'sunscreen',
//                     "packed": false
//                 },
//                 {
//                     "item": 'passport',
//                     "packed": true
//                 },
//                 {
//                     "item": 'foreign currency',
//                     "packed": false
//                 }
//             ],
//             "dates": {
//                 "start": new Date(2019, 3, 15),
//                 "end": new Date(2019, 3, 22)
//             }
//         } 
//     ]
// }

function getActiveTrips(callback){
    fetch('/api/trips')
    .then(response => {
        if (response.ok) return response.json();
        throw new Error (response.statusText);
    })
    .then(callback);
}

function getSelectedTrip(callback, id, shouldEdit){
    fetch(`/api/trips/${id}`)
    .then(response => {
        if (response.ok) return response.json();
        throw new Error (response.statusText);
    })
    .then(responseJson => callback(responseJson, shouldEdit));
}

function getSelectedPlace(callback, id, placeId){
    fetch(`/api/trips/${id}/places/${placeId}`)
    .then(response => {
        if (response.ok) return response.json();
        throw new Error (response.statusText);
    })
    .then(responseJson => callback(responseJson))
}

function getSelectedItem(callback, id, itemId){
    fetch(`/api/trips/${id}/packingList/${itemId}`)
    .then(response => {
        if (response.ok) return response.json();
        throw new Error (response.statusText);
    })
    .then(responseJson => callback(responseJson))
}

function addNewTrip(callback, updateData){
    fetch('/api/trips', {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(updateData)
    })
    .then(response => {
        if (response.ok) return response.json();
        throw new Error (response.statusText);
    })
    .then(responseJson => callback(responseJson));
}

function addNewPlace(callback, id, updateData){
    fetch(`/api/trips/${id}/places`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(updateData)
    })
    .then(response => {
        if (response.ok) return response.json();
        throw new Error (response.statusText);
    })
    .then(responseJson => callback(responseJson));
}

function addNewItem(callback, id, updateData){
    fetch(`/api/trips/${id}/packingList`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(updateData)
    })
    .then(response => {
        if (response.ok) return response.json();
        throw new Error (response.statusText);
    })
    .then(responseJson => callback(responseJson));
}

function editTrip(callback, updateData){
    fetch(`/api/trips/${updateData.id}`, {
        method: "PUT",
        mode: "cors",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(updateData)
    })
    .then(() => getSelectedTrip(callback,updateData.id));
}

function editPlace(callback, id, placeId, updateData){
    fetch(`/api/trips/${id}/places/${placeId}`, {
        method: "PUT",
        mode: "cors",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(updateData)
    })
    .then(() => getSelectedPlace(callback, id, placeId));
}

function editItem(callback, id, itemId, updateData){
    fetch(`/api/trips/${id}/packingList/${itemId}`, {
        method: "PUT",
        mode: "cors",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(updateData)
    })
    .then(() => getSelectedItem(callback, id, itemId));
}


function deleteTripFromDatabase(callback, id){
    fetch(`/api/trips/${id}`, {method: "DELETE"})
    .then(response => {
        if (!response.ok) throw new Error (response.statusText);
    })
    .then(callback);
}

function deletePlaceFromTrip(callback, id, placeId){
    fetch(`/api/trips/${id}/places/${placeId}`, {method: "DELETE"})
    .then(response => {
        if (!response.ok) throw new Error (response.statusText);
    })
    .then(() => callback(id, true));
}

function deletePackingListFromTrip(callback, id){
    fetch(`/api/trips/${id}/packingList`, {method: "DELETE"})
    .then(response => {
        if (!response.ok) throw new Error (response.statusText);
    })
    .then(() => callback(id, true))
}

function deletePackingItemFromTrip(callback,id, itemId){
    fetch(`/api/trips/${id}/packingList/${itemId}`, {method: "DELETE"})
    .then(response => {
        if (!response.ok) throw new Error (response.statusText);
    })
    .then(() => callback(id, true));
}

function displayNewTrip(currentTrip){
    $('#details-form').remove();
    displayActiveTrips(currentTrip);
}

function loginAndDisplayDash(loginInfo){
    fetch('/api/auth/login', {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(loginInfo)
    })
    .then(response => {
        if (response.ok) return response.json();
        throw new Error (response.statusText);
    })
    .then(responseJson => {
        user.authToken = responseJson.authToken;
        user.username = responseJson.username;
        getAndDisplayActiveTrips();
    });
}

function createNewUser(newInfo){
    fetch('/api/users/', {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(newInfo)
    })
    .then(response => {
        if (response.ok) return response.json();
        throw new Error (response.statusText);
    })
    .then(() => {
        loginAndDisplayDash(newInfo);
    });
}

function addAndDisplayNewTrip(){
    const updateData = {destination: {}, dates: {}};
    updateData.name = $('#js-trip-name').val();
    updateData.destination.location = $('#js-location').val();
    updateData.destination.country = $('#js-country').val();
    updateData.dates.start = $('#js-start-date').val();
    updateData.dates.end = $('#js-end-date').val();
    addNewTrip(displayNewTrip, updateData);
}

function updateAndDisplayItemDetails(inputData, id, itemId){
    const updateData = {};
    updateData.item = inputData.find('.js-item').val();
    if (itemId) {
        updateData.id = itemId;
        editItem(displayUpdatedItem, id, itemId, updateData);
    } else {
        updateData.packed = false;
        addNewItem(displayNewItem, id, updateData);
    }
}

function displayUpdatedItem(currentItem){
    $(`li[data-list-id=${currentItem.id}]`).empty()
    .text(currentItem.item)
    .append('<button class="js-edit item">Edit Item</button>' +
    '<button class="js-delete item">Delete Item</button>');
}

function displayNewItem(newItem){
    $('.add-item').remove()
    $('#item-list').append(`<li data-list-id="${newItem.id}" data-checked="${
    newItem.packed}" ${newItem.packed ? "class = packing-item_checked" : ''
    }>${newItem.item} 
    <button class="js-edit item">Edit Item</button>
    <button class="js-delete item">Delete Item</button>
    </li>`)
    $('#packing-list').append('<button class="js-add item">Add Item</button>')
}

function prefillItemForm(currentItem){
    //fill in values with current item details
    $(`li[data-list-id=${currentItem.id}]`).find('.js-item')
    .val(currentItem.item);           
}

//display the item as an editable input
function getAndDisplayItemForm(id, itemId){
    $(`li[data-list-id=${itemId}]`).empty().append(`
    <form class="item-form">
    <input type="text" class="js-item">
    <input type="submit" class="js-submit-item" value="Submit Edits">
    </form>`);
    getSelectedItem(prefillItemForm, id, itemId);
}

//display a new item to input
function addItemForm(){
    $('#packing-list').children('.js-add').remove();
    $('#packing-list').append(`<form class="add-item item-form">
    <input type="text" class="js-item">
    <input type="submit" class="js-submit-item" value="Add To Packing List">
    </form>`);
}

//display a new place to input
function addPlaceForm(){
    $('#saved-places').children('.js-add').remove();
    $('#saved-places').append(`<form class="add-place js-place-form">
    <label for="place-name">Place Name</label>
    <input type="text" name="place-name" class="js-place-name">
    <label for="address">Address</label>
    <input type="text" name="address" class="js-address">
    <label for="place-type">Place Type</label>
    <input type="text" name="place-type" class="js-place-type">
    <input type="submit" class="js-submit-place" value="Add to Bookmarked Places">
    </form>`);
}

//update place details in database
function updateAndDisplayPlaceDetails(inputData, id, placeId){
    const updateData = {};
    updateData.name = inputData.find('.js-place-name').val();
    updateData.address = inputData.find('.js-address').val();
    updateData.type = inputData.find('.js-place-type').val();
    if (placeId) {
        updateData.id = placeId;
        editPlace(displayUpdatedPlace, id, placeId, updateData);
    } else addNewPlace(displayNewPlace, id, updateData);
}

function displayUpdatedPlace(currentPlace){
    $(`div[data-place-id='${currentPlace.id}']`).empty()
    .append('<button class="js-edit place">Edit Place Details</button>' + 
    '<button class="js-delete place">Delete Place</button>')
    .append(displayOnePlace(currentPlace));
}

function displayNewPlace(newPlace){
    $('.add-place').remove()
    $('#saved-places').append(
        `<div class="saved-place" data-place-id="${newPlace.id}">
        <button class="js-edit place">Edit Place Details</button>
        <button class="js-delete place">Delete Place</button>
        ${displayOnePlace(newPlace)} </div>`)
    .append('<button class="js-add place">Add A New Place</button>');
}

//update trip details in database
function updateAndDisplayTripDetails(updateTrip){
    updateTrip.name = $('#js-trip-name').val();
    updateTrip.destination.location = $('#js-location').val();
    updateTrip.destination.country = $('#js-country').val();
    updateTrip.dates.start = $('#js-start-date').val();
    updateTrip.dates.end = $('#js-end-date').val();
    editTrip(displayUpdatedTripDetails, updateTrip);
}

function prefillPlaceForm(currentPlace){
    //fill in values with current place details
    const currentForm = $(`div[data-place-id='${currentPlace.id}']`);
    currentForm.find('.js-place-name').val(currentPlace.name);
    currentForm.find('.js-address').val(currentPlace.address);
    currentForm.find('.js-place-type').val(currentPlace.type);
}

function prefillDetailsForm(currentTrip){
    //fill in values with current trip details
    const startDate = new Date(currentTrip.dates.start).toISOString().split('T')[0];
    const endDate = new Date(currentTrip.dates.end).toISOString().split('T')[0];    
    $('#js-trip-name').val(currentTrip.name);
    $('#js-location').val(currentTrip.destination.location);
    $('#js-country').val(currentTrip.destination.country);
    $('#js-start-date').val(startDate);
    $('#js-end-date').val(endDate);
}

//Add buttons to edit packing list (add, edit, delete)
function displayListOptions(){
    $('button.list').remove();
    $('#item-list li').append('<button class="js-edit item">Edit Item</button>' +
    '<button class="js-delete item">Delete Item</button>');
    $('#packing-list').append('<button class="js-add item">Add Item</button>');
}

//Turn the saved place into an editable form
function getAndDisplayPlaceForm(selectedId, placeId){
    $(`div[data-place-id='${placeId}']`).empty().append(`
    <form class="place-form js-place-form">
        <label for="place-name">Place Name</label>
        <input type="text" name="place-name" class="js-place-name">
        <label for="address">Address</label>
        <input type="text" name="address" class="js-address">
        <label for="place-type">Place Type</label>
        <input type="text" name="place-type" class="js-place-type">
        <input type="submit" class="js-submit-place" value="Submit Edits">
    </form>`);
    getSelectedPlace(prefillPlaceForm, selectedId, placeId);
}

function displayDetailsForm(isNew){
    return `<form id="details-form" class="js-details-form">
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
    <input type="submit" id="js-submit-details" ${isNew ? `value="Add New Trip"`: `value="Submit Edits"`}>
</form>`
}

//Turn the trip details section into a editable form
function getAndDisplayDetailsForm(selectedId){
    $('#trip-details').empty().append(`${displayDetailsForm(false)}`)
    getSelectedTrip(prefillDetailsForm, selectedId);
}

function displayUpdatedTripDetails(currentTrip){
    $('#trip-details').empty().append(displayTripDetails(currentTrip))
    .prepend('<button class="js-edit details">Edit Trip Details</button>');
}

function generateListButtons(currentTrip){
    if(currentTrip.packingList.length > 0){
        $('#packing-list').prepend('<button class="js-edit list">Edit Packing List</button>' + 
        '<button class="js-delete list">Delete Packing List</button>');
    } else {
        $('#packing-list').prepend('<button class="js-add item">Add Item</button>');
    }
}

function displayPackingList(currentTrip){
    let listArray = [];
    if (currentTrip.packingList.length > 0){
        for (let index = 0; index < currentTrip.packingList.length; index++){
            let listItem = currentTrip.packingList[index]; 
            listArray.push(`<li data-list-id="${listItem.id}" data-checked="${
                listItem.packed}" ${listItem.packed ? "class = packing-item_checked" : ''}>${listItem.item}</li>`)
        }
        const listHTML = listArray.join('');
        return `<h4>Packing List</h4>
        <ul id="item-list">${listHTML}</ul>`
    } else return '<h4>No Items in Packing List Yet</h4>'
}

function displayOnePlace(place){
    return `<h5 class="place-name">${place.name}</h5>
    <p class="place-address">Address: ${place.address}</p>
    <p class="place-type">Type: ${place.type}</p>`
}

function displaySavedPlaces(currentTrip, shouldEdit){
    let placeHTML = ['<h4>Bookmarked Places</h4>'];
    if (currentTrip.savedPlaces.length > 0){
        for (let index = 0; index < currentTrip.savedPlaces.length; index++) {
            let place = currentTrip.savedPlaces[index];
            placeHTML.push(`<div class="saved-place" data-place-id="${place.id}">
            ${shouldEdit ? `<button class="js-edit place">Edit Place Details</button>
            <button class="js-delete place">Delete Place</button>`: ''}
            ${displayOnePlace(place)}
            </div>`);
        }
        return placeHTML.join('');
    } else return '<h4>No Bookmarked Places Yet</h4>';
}

function displayTripDetails(currentTrip){
    const startDate = new Date(currentTrip.dates.start).toLocaleDateString();
    const endDate = new Date(currentTrip.dates.end).toLocaleDateString();
    return `<h2 class="trip-name">${currentTrip.name}</h2>
    <h3 class="destination">${currentTrip.destination.location}, ${currentTrip.destination.country}</h3>
    <h4 class="date">Dates</h4>
    <p>${startDate} to ${endDate}</p>`
}

//Displays the current trip that the user has selected

function displaySelectedTrip(currentTrip, shouldEdit){
    $('#active-trips').empty();
    $('#current-trip').attr('data-id', currentTrip.id);
    $('#current-trip').html(`<div id="trip-details">
    ${shouldEdit ? '<button class="js-edit details">Edit Trip Details</button>' : ''}
    ${displayTripDetails(currentTrip)}
    </div>
    <div id="saved-places">
    ${displaySavedPlaces(currentTrip, shouldEdit)}
    ${shouldEdit ? '<button class="js-add place">Add A New Place</button>': ''}
    </div>
    <div id="packing-list">
    ${displayPackingList(currentTrip)}
    </div>
    ${shouldEdit ? '': '<button class="edit-trip">Edit Trip</button>'}
    <button class="delete-trip">Delete Trip</button>
    <button class="dashboard-redirect">Back to Dashboard
    </button>`)
    if (shouldEdit) generateListButtons(currentTrip);
    $('#active-trips').prop('hidden', true);
    $('#current-trip').prop('hidden', false);
}

function getAndDisplaySelectedTrip(id, shouldEdit){
    getSelectedTrip(displaySelectedTrip, id, shouldEdit);
}

function displayOneTrip(currentTrip){
    $('#active-trips').append(`<div data-id=${currentTrip.id}>
    <h2>${currentTrip.name}</h2>
    <h3>${currentTrip.destination.location}</h3>
    <button class="view-trip">View Trip</button>
    <button class="edit-trip">Edit Trip</button>
    <button class="delete-trip">Delete Trip</button>
    </div>`);
}

//Show all trips that user has created
function displayActiveTrips(responseJson){
    if(responseJson.trips){
        for (let index = 0; index < responseJson.trips.length; index++) {
            let currentTrip = responseJson.trips[index];
            displayOneTrip(currentTrip);
        }
    }
    else displayOneTrip(responseJson);
    $('#active-trips').append('<button class="add-trip">Add New Trip</button>').prop('hidden', false);
    $('#logout-button').prop('hidden', false);
}

function getAndDisplayActiveTrips(){
    $('#login-page').prop('hidden', true);
    $('#signup-page').prop('hidden', true);
    $('#current-trip').prop('hidden', true);
    getActiveTrips(displayActiveTrips);
}

// function displaySignupForm(){
//     $('#login-page').empty().append(`<form id="signup-form" class="js-signup-form">
//     <label for="new-username">Username</label>
//     <input type="text" name="new-username" id="js-new-username">
//     <label for="new-password">Password</label>
//     <input type="text" name="new-password" id="js-new-password">
//     <label for="confirm-password">Confirm Password</label>
//     <input type="text" name="confirm-password" id="js-confirm-password">
//     <input type="submit" id="js-submit-signup" value="Sign Up for Account">
// </form>`)
// }

function displayLogin(){
    $('#active-trips').empty().prop('hidden', true);
    $('#current-trip').empty().prop('hidden', true);        
    $('#logout-button').prop('hidden', true);
    $('#login-page').prop('hidden', false);
}

function watchForSubmits(){
    //check to see if edits are submitted for trip details
    $('#current-trip').on('submit','.js-details-form',(event) => {
        event.preventDefault();
        const selected = $(event.currentTarget);
        const selectedId = selected.parents('#current-trip').attr('data-id');
        getSelectedTrip(updateAndDisplayTripDetails, selectedId);
    });

    //check to see if edits are submitted for place details
    $('#current-trip').on('submit', '.js-place-form', (event) => {
        event.preventDefault();
        const selected = $(event.currentTarget);
        const selectedId = selected.parents('#current-trip').attr('data-id');
        const placeId = selected.parent('div').attr('data-place-id');
        updateAndDisplayPlaceDetails(selected, selectedId, placeId);
    });

    //check to see if any packing list items have been edited or added
    $('#current-trip').on('submit', '.item-form', (event) =>{
        event.preventDefault();
        const selected = $(event.currentTarget);
        const selectedId = selected.parents('#current-trip').attr('data-id');
        const itemId = selected.parent('li').attr('data-list-id');
        updateAndDisplayItemDetails(selected, selectedId, itemId);
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
            //delete the place from the database and refresh page
            const placeId = selected.parent('div').attr('data-place-id');
            deletePlaceFromTrip(getAndDisplaySelectedTrip, selectedId, placeId);
        } else if (selected.hasClass('list')){
            //delete the packing list and refresh page
            deletePackingListFromTrip(getAndDisplaySelectedTrip, selectedId);
        } else if (selected.hasClass('item')){
            //delete an item on the packing list and refresh page
            const itemIndex = selected.parent('li').attr('data-list-id');
            deletePackingItemFromTrip(getAndDisplaySelectedTrip, selectedId, itemIndex);
        }
    });
}

//TODO: Remove Edit Trip button if already in edit mode

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
            const placeId = selected.parent('div').attr('data-place-id');
            getAndDisplayPlaceForm(selectedId, placeId);
        } else if (selected.hasClass('list')){
            //edit the packing list
            displayListOptions();
        } else if (selected.hasClass('item')){
            //edit an item on the packing list
            const itemId = selected.parent('li').attr('data-list-id');
            getAndDisplayItemForm(selectedId, itemId);
        }
    });
}

function watchViewPage(){
    $('#current-trip').on('click', 'button', (event) => {
        event.preventDefault();
        const selected = $(event.currentTarget);
        const selectedId = selected.parent('div').attr('data-id');
        if (selected.hasClass('edit-trip')){
            getAndDisplaySelectedTrip(selectedId, true);
        } else if (selected.hasClass('delete-trip')){
            $('#current-trip').empty();
            deleteTripFromDatabase(getAndDisplayActiveTrips, selectedId);
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
            //make display edit features a parameter of getAndDisplaySelectedTrip
            getAndDisplaySelectedTrip(selectedId, true);
        } else if (selected.hasClass('delete-trip')){
            $('#active-trips').empty();
            deleteTripFromDatabase(getAndDisplayActiveTrips,selectedId);
        } else if (selected.hasClass('add-trip')){
            $('.add-trip').remove();
            $('#active-trips').append(displayDetailsForm(true));
        }
    }));

    $('#active-trips').on('submit','.js-details-form',(event) => {
        event.preventDefault();
        addAndDisplayNewTrip();
    });
}

function watchLogin(){
    $('.js-login-form').submit(event => {
        event.preventDefault();

        const username = $('#js-username').val();
        const password = $('#js-password').val();

        $('#js-username').val('');
        $('#js-password').val('');

        loginAndDisplayDash({username, password});
    });

    $('#signup-redirect').click(event => {
        event.preventDefault();
        $('#js-username').val('');
        $('#js-password').val('');
        $('#login-page').prop('hidden', true);
        $('#signup-page').prop('hidden', false);
    });

    $('.js-signup-form').submit(event => {
        event.preventDefault();

        const newUsername = $('#js-new-username').val();
        const newPassword = $('#js-new-password').val();
        const confirmPassword = $('#js-confirm-password').val();
        
        if(newPassword !== confirmPassword){
            $('#js-new-password').val('');
            $('#js-confirm-password').val('');
            $('#login-page').append('<p>Passwords do not match. Try again.</p>');
        } else {
            $('#js-new-username').val('');
            $('#js-new-password').val('');
            $('#js-confirm-password').val('');
            createNewUser({username: newUsername, password: newPassword});
        }

        //TODO: add the account and sign into the dashboard
    });
}

function watchLogout(){
    $('#logout-button').click(event => {
        event.preventDefault();

        user.authToken = null;
        user.username = null;
        
        //return to login page
        displayLogin();
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