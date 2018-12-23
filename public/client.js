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
    fetch('/api/trips', {
        headers: {
            'Authorization': `Bearer ${user.authToken}`
        }
    })
    .then(response => {
        if (response.ok) return response.json();
        throw new Error (response.statusText);
    })
    .then(callback);
}

function getSelectedTrip(callback, id, shouldEdit){
    fetch(`/api/trips/${id}`, {
        headers: {
            'Authorization': `Bearer ${user.authToken}`
        }
    })
    .then(response => {
        if (response.ok) return response.json();
        throw new Error (response.statusText);
    })
    .then(responseJson => callback(responseJson, shouldEdit));
}

function getSelectedPlace(callback, id, placeId){
    fetch(`/api/trips/${id}/places/${placeId}`,{
        headers: {
            'Authorization': `Bearer ${user.authToken}`
        }
    })
    .then(response => {
        if (response.ok) return response.json();
        throw new Error (response.statusText);
    })
    .then(responseJson => callback(responseJson))
}

function getSelectedItem(callback, id, itemId){
    fetch(`/api/trips/${id}/packingList/${itemId}`, {
        headers: {
            'Authorization': `Bearer ${user.authToken}`
        }
    })
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
            "Content-Type": "application/json; charset=utf-8",
            'Authorization': `Bearer ${user.authToken}`
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
            "Content-Type": "application/json; charset=utf-8",
            'Authorization': `Bearer ${user.authToken}`
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
            "Content-Type": "application/json; charset=utf-8",
            'Authorization': `Bearer ${user.authToken}`
        },
        body: JSON.stringify(updateData),
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
            "Content-Type": "application/json; charset=utf-8",
            'Authorization': `Bearer ${user.authToken}`
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
            "Content-Type": "application/json; charset=utf-8",
            'Authorization': `Bearer ${user.authToken}`
        },
        body: JSON.stringify(updateData)
    })
    .then(() => getSelectedPlace(callback, id, placeId));
}

function editItem(callback, id, updateData){
    fetch(`/api/trips/${id}/packingList/${updateData.id}`, {
        method: "PUT",
        mode: "cors",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            'Authorization': `Bearer ${user.authToken}`
        },
        body: JSON.stringify(updateData)
    })
    .then(() => getSelectedItem(callback, id, updateData.id));
}


function deleteTripFromDatabase(callback, id){
    fetch(`/api/trips/${id}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${user.authToken}`
        }
    })
    .then(response => {
        if (!response.ok) throw new Error (response.statusText);
    })
    .then(callback);
}

function deletePlaceFromTrip(callback, id, placeId){
    fetch(`/api/trips/${id}/places/${placeId}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${user.authToken}`
        }
    })
    .then(response => {
        if (!response.ok) throw new Error (response.statusText);
    })
    .then(() => callback(id, true));
}

function deletePackingListFromTrip(callback, id){
    fetch(`/api/trips/${id}/packingList`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${user.authToken}`
        }
    })
    .then(response => {
        if (!response.ok) throw new Error (response.statusText);
    })
    .then(() => callback(id, true))
}

function deletePackingItemFromTrip(callback,id, itemId){
    fetch(`/api/trips/${id}/packingList/${itemId}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${user.authToken}`
        }
    })
    .then(response => {
        if (!response.ok) throw new Error (response.statusText);
    })
    .then(() => callback(id, true));
}

function loginAndDisplayDash(loginInfo, isNewUser){
    fetch('/api/auth/login', {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
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
        getAndDisplayActiveTrips(isNewUser);
    })
    .catch(() => {
        displayLoginError();
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
        return response.json();
        // if (response.ok) return response.json();
        // throw new Error (response.statusText);
    })
    .then(responseJson => {
        //check if response was okay (200-299)
        if (responseJson.code < 300 && responseJson.code >= 200) {
            loginAndDisplayDash(newInfo, true);
        } else {
            displaySignupError(responseJson.location, responseJson.message);
        }
    });
    // .then(() => {
    //     loginAndDisplayDash(newInfo, true);
    // })
    // .catch(err => {
    //     console.log(err);
    // });
}

function displayNewTrip(currentTrip){
    $('#details-form').remove();
    displayActiveTrips(currentTrip);
}

function addAndDisplayNewTrip(){
    const updateData = {destination: {}, dates: {}};
    updateData.name = $('#js-trip-name').val();
    updateData.destination = $('#js-location').val();
    // updateData.destination.country = $('#js-country').val();
    updateData.dates.start = $('#js-start-date').val();
    updateData.dates.end = $('#js-end-date').val();
    addNewTrip(displayNewTrip, updateData);
}

function updateAndDisplayItemDetails(inputData, id){
    const updateData = {};
    updateData.id = inputData.attr('data-list-id');
    if (updateData.id) {
        //toggles between true and false
        const previousState = inputData.attr('data-checked');
        updateData.packed = !(inputData.attr('data-checked') === 'true');
        editItem(displayUpdatedItem, id, updateData);
    } else {
        updateData.item = inputData.find('.js-item').val();
        updateData.packed = false;
        addNewItem(displayNewItem, id, updateData);
    }
}

function displayUpdatedItem(currentItem){
    const selectedLi = $(`li[data-list-id=${currentItem.id}]`);
    selectedLi.empty().attr('data-checked', currentItem.packed)
    .text(currentItem.item);
    if (currentItem.packed) selectedLi.addClass('packing-item_checked');
    else selectedLi.removeClass('packing-item_checked');

}

function displayNewItem(newItem){
    $('.add-item-form').remove();
    //if the no items header exists, replace with regular header and add list 
    if($('.js-no-items').length > 0) {
        $('#packing-list').empty().append('<h4 class="packing-header">Packing List</h4><ul id="item-list"></ul>')
    }
    $('#item-list').append(`<div class="item-container"><li data-list-id="${newItem.id}" data-checked="${
    newItem.packed}" ${newItem.packed ? "class=packing-item_checked" : ''
    }>${newItem.item} </li>
    <button class="js-delete item delete-item">\u00D7</button></div>`)
    $('#packing-list').append('<button class="js-add item add-item"><i class="fas fa-plus-circle"></button>')
}

// function prefillItemForm(currentItem){
//     //fill in values with current item details
//     $(`li[data-list-id=${currentItem.id}]`).find('.js-item')
//     .val(currentItem.item);           
// }

// //display the item as an editable input
// function getAndDisplayItemForm(id, itemId){
//     $(`li[data-list-id=${itemId}]`).empty().append(`
//     <form class="item-form">
//     <input type="text" class="js-item">
//     <input type="submit" class="js-submit-item" value="Submit Edits">
//     </form>`);
//     getSelectedItem(prefillItemForm, id, itemId);
// }

//display a new item to input
function addItemForm(){
    $('#packing-list').children('.js-add').remove();
    $('.packing-header').after(`<form class="add-item-form item-form">
    <div class="form-container">
    <input type="text" class="js-item" placeholder="packing list item">
    <input type="submit" class="js-submit-item" value="Add">
    <input type="button" class="js-remove-form" value="Cancel">
    </div>
    </form>`);
}

//display a new place to input
function addPlaceForm(){
    $('#saved-places').children('.js-add').remove();
    $('.places-header').after(`<form class="add-place-form js-place-form">
    <div class="place-form-entry">
    <label for="place-name">Name</label>
    <input type="text" name="place-name" class="js-place-name">
    </div>
    <div class="place-form-entry">
    <label for="address">Address</label>
    <input type="text" name="address" class="js-address">
    </div>
    <div class="place-form-entry">
    <label for="place-type">Type</label>
    <input type="text" name="place-type" class="js-place-type">
    </div>
    <input type="submit" class="js-submit-place" value="Add Place">
    <button class="js-remove-form">Cancel</button>
    </form>`);
}

//update place details in database
function updateAndDisplayPlaceDetails(inputData, id, placeId){
    const updateData = {};
    updateData.name = inputData.find('.js-place-name').val();
    updateData.address = inputData.find('.js-address').val();
    //if user didn't provide place type, assign it as "Unspecified"
    if (inputData.find('.js-place-type').val() === '') updateData.type = "Unspecified";
    else updateData.type = inputData.find('.js-place-type').val();

    //if a placeId exists, edit place instead of adding new place
    if (placeId) {
        updateData.id = placeId;
        editPlace(displayUpdatedPlace, id, placeId, updateData);
    } else addNewPlace(displayNewPlace, id, updateData);
}

function displayUpdatedPlace(currentPlace){
    $(`div[data-place-id='${currentPlace.id}']`).empty()
    .append('<button class="js-edit place edit-place"><i class="far fa-edit"></i></button>' + 
    '<button class="js-delete place delete-place"><i class="far fa-trash-alt"></i></button>')
    .append(displayOnePlace(currentPlace));
}

function displayNewPlace(newPlace){
    $('.add-place-form').remove();
    //if the no places header exists, replace with regular header
    if($('.js-no-places').length > 0){
        $('#saved-places').empty().append('<h4 class="places-header">Bookmarked Places</h4>');
    }
    $('#saved-places').append(
        `<div class="saved-place" data-place-id="${newPlace.id}">
        <button class="js-edit place edit-place"><i class="far fa-edit"></i></button>
        <button class="js-delete place delete-place"><i class="far fa-trash-alt"></i></button>
        ${displayOnePlace(newPlace)} </div>`)
    .append('<button class="js-add place add-place"><i class="fas fa-plus-circle"></i></button>');
}

//update trip details in database
function updateAndDisplayTripDetails(updateTrip){
    updateTrip.name = $('#js-trip-name').val();
    updateTrip.destination = $('#js-location').val();
    // updateTrip.destination.country = $('#js-country').val();
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
    $('#js-location').val(currentTrip.destination);
    // $('#js-country').val(currentTrip.destination.country);
    $('#js-start-date').val(startDate);
    $('#js-end-date').val(endDate);
}

// //Add buttons to edit packing list (add, edit, delete)
// function displayListOptions(){
//     $('button.list').remove();
//     $('#item-list li').append('<button class="js-edit item"><i class="far fa-edit"></i></button>' +
//     '<button class="js-delete item"><i class="far fa-trash-alt"></i></button>');
//     $('#packing-list').append('<button class="js-add item"><i class="fas fa-plus-circle"></i></button>');
// }

//Turn the saved place into an editable form
function getAndDisplayPlaceForm(selectedId, placeId){
    $(`div[data-place-id='${placeId}']`).empty().append(`
    <form class="place-form js-place-form">
        <div class="place-form-entry">
        <label for="place-name">Name</label>
        <input type="text" name="place-name" class="js-place-name">
        </div>
        <div class="place-form-entry">
        <label for="address">Address</label>
        <input type="text" name="address" class="js-address">
        </div>
        <div class="place-form-entry">
        <label for="place-type">Type</label>
        <input type="text" name="place-type" class="js-place-type">
        </div>
        <input type="submit" class="js-submit-place" value="Save Edits">
        <button class="js-remove-form">Cancel</button>
    </form>`);
    getSelectedPlace(prefillPlaceForm, selectedId, placeId);
}

function displayDetailsForm(isNew){
    return `<form id="details-form" class="js-details-form">
    <div class="details-form-entry">
    <label for="trip-name">Trip Name</label>
    <input type="text" name="trip-name" id="js-trip-name">
    </div>
    <div class="details-form-entry">
    <label for="location">Location(s)</label>
    <input type="text" name="location" id="js-location">
    </div>
    <div class="details-form-entry">
    <label for="start-date">Start Date</label>
    <input type="date" name="start-date" id="js-start-date">
    </div>
    <div class="details-form-entry">
    <label for="end-date">End Date</label>
    <input type="date" name="end-date" id="js-end-date">
    </div>
    <input type="submit" id="js-submit-details" ${isNew ? `value="Add Trip"`: `value="Save Edits"`}>
    <input type="button" class="js-remove-form" value="Cancel">
</form>`
}

//Turn the trip details section into a editable form
function getAndDisplayDetailsForm(selectedId){
    $('#trip-details').empty().append(`${displayDetailsForm(false)}`)
    getSelectedTrip(prefillDetailsForm, selectedId);
}

function displayUpdatedTripDetails(currentTrip){
    $('#trip-details').empty().append(displayTripDetails(currentTrip))
    .prepend('<button class="js-edit details"><i class="far fa-edit"></i></button>');
}

// function generateListButtons(currentTrip){
//     if(currentTrip.packingList.length > 0){
//         $('#packing-list').prepend('<button class="js-delete list delete-list"><i class="far fa-trash-alt"></i></button>');
//     } else {
//         $('#packing-list').prepend('<button class="js-add item add-list"><i class="fas fa-plus-circle"></i></button>');
//     }
// }

function displayPackingList(currentTrip, shouldEdit){
    let listArray = [];
    if (currentTrip.packingList.length > 0){
        for (let index = 0; index < currentTrip.packingList.length; index++){
            let listItem = currentTrip.packingList[index]; 
            listArray.push(`<div class="item-container"><li data-list-id="${listItem.id}" data-checked="${
        listItem.packed}" ${listItem.packed ? "class=packing-item_checked" : ''}>${listItem.item}</li>
        ${shouldEdit ? '<button class="js-delete item delete-item">\u00D7</button>' : ''}</div>`)
        }
        const listHTML = listArray.join('');
        return `<h4 class="packing-header">Packing List</h4>
        <ul id="item-list">${listHTML}</ul>`
    } else return '<h4 class="packing-header js-no-items">No Items Yet</h4>'
}

function displayOnePlace(place){
    return `<h5 class="place-name">${place.name}</h5>
    <p class="place-address">${place.address}</p>
    <p class="place-type">Type: ${place.type}</p>`
}

function displaySavedPlaces(currentTrip, shouldEdit){
    let placeHTML = ['<h4 class="places-header">Bookmarked Places</h4>'];
    if (currentTrip.savedPlaces.length > 0){
        for (let index = 0; index < currentTrip.savedPlaces.length; index++) {
            let place = currentTrip.savedPlaces[index];
            placeHTML.push(`<div class="saved-place" data-place-id="${place.id}">
            ${shouldEdit ? `<button class="js-edit place edit-place"><i class="far fa-edit"></i></button>
            <button class="js-delete place delete-place"><i class="far fa-trash-alt"></i></button>`: ''}
            ${displayOnePlace(place)}
            </div>`);
        }
        return placeHTML.join('');
    } else return '<h4 class="places-header js-no-places">No Bookmarked Places Yet</h4>';
}

function displayTripDetails(currentTrip){
    const startDate = new Date(currentTrip.dates.start).toLocaleDateString();
    const endDate = new Date(currentTrip.dates.end).toLocaleDateString();
    return `<h2 class="trip-name">${currentTrip.name}</h2>
    <h3 class="destination">${currentTrip.destination}</h3>
    <h3 class="date">${startDate} to ${endDate}</h3>`
}

//Displays the current trip that the user has selected

function displaySelectedTrip(currentTrip, shouldEdit){
    $('#active-trips').empty();
    $('#current-trip').attr('data-id', currentTrip.id);
    $('#current-trip').html(`<div id="trip-details">
    ${shouldEdit ? '<button class="js-edit details"><i class="far fa-edit"></i></button>' : ''}
    ${displayTripDetails(currentTrip)}
    </div>
    <div id="saved-places">
    ${displaySavedPlaces(currentTrip, shouldEdit)}
    ${shouldEdit ? '<button class="js-add place add-place"><i class="fas fa-plus-circle"></i></button>': ''}
    </div>
    <div id="packing-list">
    ${shouldEdit ? '<button class="js-add item add-item"><i class="fas fa-plus-circle"></i></button>': ''}
    ${displayPackingList(currentTrip, shouldEdit)}
    </div>
    ${shouldEdit ? '<button class="view-trip">View Trip</button>': '<button class="edit-trip">Edit Trip</button>'}
    <button class="delete-trip">Delete Trip</button>
    <button class="dashboard-redirect">Back to Dashboard
    </button>`)
    $('#active-trips').prop('hidden', true);
    $('#current-trip').prop('hidden', false);
}

function getAndDisplaySelectedTrip(id, shouldEdit){
    getSelectedTrip(displaySelectedTrip, id, shouldEdit);
}

function displayOneTrip(currentTrip){
    $('#active-trips').append(`<div class="trip-preview" data-id=${currentTrip.id}>
    <h2>${currentTrip.name}</h2>
    <h3>${currentTrip.destination}</h3>
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

function getAndDisplayActiveTrips(isNewUser){
    $('#login-page').prop('hidden', true);
    $('#signup-page').prop('hidden', true);
    $('#current-trip').prop('hidden', true);
    if (isNewUser) {
        $('#active-trips').html(`<div id="new-user-msg"><h2>Account Created!</h2>
        <h3>Let's Get Started</h3></div>`);
    }
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

function displaySignupError(errLocation, errMessage){
    //reset previous errors
    $('#js-new-password').removeClass('error-field');
    $('#js-confirm-password').removeClass('error-field');
    $('.error-msg').remove();
    if (errLocation === 'username'){
        $('#js-new-username').addClass('error-field');
    } else {
        $('#js-new-password').val('').addClass('error-field');
        $('#js-confirm-password').val('').addClass('error-field');
    }
    $('#js-submit-signup').before(`<p class="error-msg"><i class="fas fa-exclamation-circle"></i> ${errLocation}: ${errMessage}</p>`)
}

function displayLoginError(){
    //reset error messages
    $('.error-msg').remove();
    $('#js-password')
    .after('<p class="error-msg"><i class="fas fa-exclamation-circle"></i> Incorrect username and/or password</p>')
    .addClass('error-field');
    $('#js-username').addClass('error-field');
}

function displayLogin(){
    $('#active-trips').empty().prop('hidden', true);
    $('#current-trip').empty().prop('hidden', true);        
    $('#logout-button').prop('hidden', true);
    $('#login-page').prop('hidden', false);
}

function validateDetailsForm(){
    const requiredFields = ['#js-trip-name', '#js-location','#js-start-date', '#js-end-date'];
    //find the first field where the input is empty. Return that field.
    return requiredFields.find(field => !( $(field).val() ));
    // if( !($('#js-trip-name').val()) ) return '#js-trip-name';
    // if( !($('#js-location').val()) ) return '#js-location';
    // if( !($('#js-start-date').val()) ) return '#js-start-date';
    // if( !($('#js-end-date').val()) ) return '#js-end-date';
}

function watchForSubmits(){
    //check if a new trip is submitted
    $('#active-trips').on('submit','.js-details-form',(event) => {
        event.preventDefault();
        const missingField = validateDetailsForm();
        if (missingField){
            //remove any previously marked error fields
            $('.js-details-form').find('.error-field').removeClass('error-field');
            $(missingField).addClass('error-field');
            //remove any previous error message
            $('.js-details-form').find('.error-msg').remove();
            //add current error message
            $('#js-submit-details').before(`<p class="error-msg">
            <i class="fas fa-exclamation-circle"></i> ${$(missingField).prev("label").html()} must not be empty</p>`)
        } else {
            if ($('#js-end-date').val() > $('#js-start-date').val()){
                addAndDisplayNewTrip();
            } else {
                //remove any previously marked error fields
                $('.js-details-form').find('.error-field').removeClass('error-field');
                $('#js-end-date').addClass('error-field');
                //remove any previous error message
                $('.js-details-form').find('.error-msg').remove();
                $('#js-submit-details').before('<p class="error-msg"><i class="fas fa-exclamation-circle"></i> End date must be after start date</p>');
            }
        }
    });

    //check to see if edits are submitted for trip details
    $('#current-trip').on('submit','.js-details-form',(event) => {
        event.preventDefault();
        const selected = $(event.currentTarget);
        const selectedId = selected.parents('#current-trip').attr('data-id');
        //check that no fields are empty
        const missingField = validateDetailsForm();
        if (missingField){
            //remove any previously marked error fields
            $('.js-details-form').find('.error-field').removeClass('error-field');
            $(missingField).addClass('error-field');
            //remove any previous error message
            $('.js-details-form').find('.error-msg').remove();
            //add current error message
            $('#js-submit-details').before(`<p class="error-msg">
            <i class="fas fa-exclamation-circle"></i> ${$(missingField).prev("label").html()} must not be empty</p>`)
        } else {
            //check if end date is greater than start date
            if ($('#js-end-date').val() > $('#js-start-date').val()){
                getSelectedTrip(updateAndDisplayTripDetails, selectedId);
            } else {
                $('#js-end-date').addClass('error-field');
                $('#js-submit-details').before('<p class="error-msg"><i class="fas fa-exclamation-circle"></i> End date must be after start date</p>');
            }
        }
    });

    //check to see if edits are submitted for place details
    $('#current-trip').on('submit', '.js-place-form', (event) => {
        event.preventDefault();
        const selected = $(event.currentTarget);
        const selectedId = selected.parents('#current-trip').attr('data-id');
        const placeId = selected.parent('div').attr('data-place-id');
        const fieldToValidate = selected.find('.js-place-name');
        if (!(fieldToValidate.val()) ){
            fieldToValidate.addClass('error-field');
            //remove any previous error message
            selected.find('.error-msg').remove();
            selected.find('.js-submit-place').before('<p class="error-msg"><i class="fas fa-exclamation-circle"></i> Place Name must not be empty</p>')
        } else {
            updateAndDisplayPlaceDetails(selected, selectedId, placeId);
        }
    });

    //check to see if any packing list items have been added
    $('#current-trip').on('submit', '.item-form', (event) =>{
        event.preventDefault();
        const selected = $(event.currentTarget);
        const selectedId = selected.parents('#current-trip').attr('data-id');
        // const itemId = selected.parent('li').attr('data-list-id');
        const fieldToValidate = selected.find('.js-item');
        if ( !(fieldToValidate.val()) ){
            fieldToValidate.addClass('error-field');
            //remove any previous error message
            selected.find('.error-msg').remove();
            selected.append('<p class="error-msg"><i class="fas fa-exclamation-circle"></i>Packing list entry must not be empty</p>')
        } else {
            updateAndDisplayItemDetails(selected, selectedId);
        }
    });
}

function watchForAdds(){
    $('#current-trip').on('click', 'button.js-add', (event) => {
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
        event.stopPropagation();
        const selected = $(event.currentTarget);
        const selectedId = selected.parents('#current-trip').attr('data-id');
        if (selected.hasClass('place')){
            //prompt user if they want to delete the place
            const confirmDelete = confirm('Are you sure you want to delete this place?');
            if (confirmDelete){
                //delete the place from the database and refresh page
                const placeId = selected.parent('div').attr('data-place-id');
                deletePlaceFromTrip(getAndDisplaySelectedTrip, selectedId, placeId);
            }
        // } else if (selected.hasClass('list')){
        //     //delete the packing list and refresh page
        //     deletePackingListFromTrip(getAndDisplaySelectedTrip, selectedId);
        } else if (selected.hasClass('item')){
            //delete an item on the packing list and refresh page
            const itemIndex = selected.prev('li').attr('data-list-id');
            deletePackingItemFromTrip(getAndDisplaySelectedTrip, selectedId, itemIndex);
        }
    });

    // $('#current-trip').on('click', 'span', (event) => {
    //     //delete an item on the packing list and refresh page
    //     const selected = $(event.currentTarget);
    //     const selectedId = selected.parents('#current-trip').attr('data-id');
    //     const itemIndex = selected.parent('li').attr('data-list-id');
    //     deletePackingItemFromTrip(getAndDisplaySelectedTrip, selectedId, itemIndex);
    // })
}

function watchForEdits(){
    $('#current-trip').on('click', 'button.js-edit', (event) => {
        const selected = $(event.currentTarget);
        const selectedId = selected.parents('#current-trip').attr('data-id');
        if (selected.hasClass('details')){
            //edit the trip details
            getAndDisplayDetailsForm(selectedId);
        } else if (selected.hasClass('place')){
            //edit the place details for one place
            const placeId = selected.parent('div').attr('data-place-id');
            getAndDisplayPlaceForm(selectedId, placeId);
        // } else if (selected.hasClass('list')){
        //     //edit the packing list
        //     displayListOptions();
        // } else if (selected.hasClass('item')){
        //     //edit an item on the packing list
        //     const itemId = selected.parent('li').attr('data-list-id');
        //     getAndDisplayItemForm(selectedId, itemId);
        }
    });

    //check if a packing list li item being clicked (completed)
    $('#current-trip').on('click', 'li', (event) => {
        const selected = $(event.currentTarget);
        const selectedId = selected.parents('#current-trip').attr('data-id');
        //toggles the packed value between true and false
        updateAndDisplayItemDetails(selected, selectedId)
    });
}

function watchForCancels(){
    $('#active-trips').on('click', '.js-remove-form', (event) => {
        event.preventDefault();
        const selectedForm = $(event.currentTarget).parents('form');
        if(selectedForm.hasClass('js-details-form')){
            $('.js-details-form').remove();
            $('#active-trips').append('<button class="add-trip">Add New Trip</button>');
        }
    });

    $('#current-trip').on('click', '.js-remove-form', (event) => {
        event.preventDefault();
        const selectedForm = $(event.currentTarget).parents('form');
        const selectedId = selectedForm.parents('#current-trip').attr('data-id');
        if(selectedForm.hasClass('js-details-form')){
            //just remove the form and show the original trip details
            getSelectedTrip(displayUpdatedTripDetails, selectedId);
        } else if (selectedForm.hasClass('add-item-form')){
            // $('.add-item-form').remove();
            $('#packing-list').prepend('<button class="js-add item add-item"><i class="fas fa-plus-circle"></i></button>');
        } else if (selectedForm.hasClass('add-place-form')){
            // $('.add-place-form').remove();
            $('#saved-places').prepend('<button class="js-add place add-place"><i class="fas fa-plus-circle"></i></button>');
        } else if (selectedForm.hasClass('place-form')){
            const placeId = selectedForm.parent('div').attr('data-place-id');
            getSelectedPlace(displayUpdatedPlace, selectedId, placeId);
        }
        selectedForm.remove();
    });
}

function watchTripPage(){
    $('#current-trip').on('click', 'button', (event) => {
        const selected = $(event.currentTarget);
        const selectedId = selected.parent('div').attr('data-id');
        if (selected.hasClass('edit-trip')){
            getAndDisplaySelectedTrip(selectedId, true);
        } else if (selected.hasClass('delete-trip')){
            //prompt user if they want to delete the trip
            const confirmDelete = confirm('Are you sure you want to delete this trip?');
            if (confirmDelete){
                $('#current-trip').empty();
                deleteTripFromDatabase(getAndDisplayActiveTrips, selectedId);
            }
        } else if (selected.hasClass('dashboard-redirect')){
            $('#current-trip').empty().removeAttr('data-id');
            getAndDisplayActiveTrips(); 
        } else if (selected.hasClass('view-trip')){
            //check to see if a form is active and prompt user of unsaved changes
            if($('#current-trip').find('form').length > 0 ) {
                const confirmView = confirm('Are you sure you want to switch to view mode? Doing so will discard any unsaved changes to your trip.');
                if (confirmView){
                    getAndDisplaySelectedTrip(selectedId);
                }
            } else {
                //otherwise, just go through with displaying selected trip
                getAndDisplaySelectedTrip(selectedId);
            }
        }
    });
}

function watchDashboard(){
    $('#active-trips').on('click', 'button', (event => {
        const selected = $(event.currentTarget);
        const selectedId = selected.parent('div').attr('data-id');
        if(selected.hasClass('view-trip')) {
            getAndDisplaySelectedTrip(selectedId);
        } else if (selected.hasClass('edit-trip')){
            //make display edit features a parameter of getAndDisplaySelectedTrip
            getAndDisplaySelectedTrip(selectedId, true);
        } else if (selected.hasClass('delete-trip')){
            //prompt user if they want to delete the trip
            const confirmDelete = confirm("Are you sure you want to delete this trip?");
            if (confirmDelete){
                $('#active-trips').empty();
                deleteTripFromDatabase(getAndDisplayActiveTrips,selectedId);
            }
        } else if (selected.hasClass('add-trip')){
            $('#new-user-msg').remove();
            $('.add-trip').remove();
            $('#active-trips').append(displayDetailsForm(true));
        }
    }));
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
        //reset the login form
        $('#js-username').val('').removeClass('error-field');
        $('#js-password').val('').removeClass('error-field');
        $('#login-page').prop('hidden', true);
        $('#signup-page').prop('hidden', false);
    });

    $('.js-signup-form').submit(event => {
        event.preventDefault();

        const newUsername = $('#js-new-username').val();
        const newPassword = $('#js-new-password').val();
        const confirmPassword = $('#js-confirm-password').val();
        
        if(newPassword !== confirmPassword){
            //reset previous errors
            $('#js-new-password').removeClass('error-field');
            $('#js-confirm-password').removeClass('error-field');
            $('.error-msg').remove();
            //add current error
            $('#js-new-password').val('').addClass('error-field');
            $('#js-confirm-password').val('').addClass('error-field')
            .after('<p class="error-msg"><i class="fas fa-exclamation-circle"></i> Passwords do not match. Try again.</p>');
        } else {
            $('#js-new-username').val('');
            $('#js-new-password').val('').removeClass('error-field');
            $('#js-confirm-password').val('').removeClass('error-field');
            $('.error-msg').remove();
            const signupInfo = {};
            if (newUsername) signupInfo.username = newUsername;
            if (newPassword) signupInfo.password = newPassword;
            createNewUser(signupInfo);
        }
    });

    $('#login-redirect').click(() => {
        //reset the signup form
        $('#js-new-username').val('').removeClass('error-field');
        $('#js-new-password').val('').removeClass('error-field');
        $('#js-confirm-password').val('').removeClass('error-field');
        $('.error-msg').remove();
        //switch to login page
        $('#login-page').prop('hidden', false);
        $('#signup-page').prop('hidden', true);
    })
}

function watchLogout(){
    $('#logout-button').click(event => {

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
    watchTripPage();
    watchLogout();
    watchForCancels();
    watchForEdits();
    watchForDeletes();
    watchForAdds();
    watchForSubmits();
});