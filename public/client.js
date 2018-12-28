'use strict';

const user = {
    username: null,
    authToken: null
};

//COMMUNICATION WITH THE DATABASE//
function getActiveTrips(callback){
    let ok;
    fetch('/api/trips', {
        headers: {
            'Authorization': `Bearer ${user.authToken}`
        }
    })
    .then(response => {
        ok = response.ok;
        return response.json();
    })
    .then(responseJson => {
        if (ok) return callback(responseJson);
        return Promise.reject(responseJson);
    })
    .catch(err => displayDashboardError(err.message));
}

function getSelectedTrip(callback, id, shouldEdit){
    let ok;
    fetch(`/api/trips/${id}`, {
        headers: {
            'Authorization': `Bearer ${user.authToken}`
        }
    })
    .then(response => {
        ok = response.ok;
        return response.json();
    })
    .then(responseJson => {
        if (ok) return callback(responseJson, shouldEdit);
        return Promise.reject(responseJson);
    })
    .catch(err => displayTripError(err.message, id));
}

function getSelectedPlace(callback, id, placeId){
    let ok;
    fetch(`/api/trips/${id}/places/${placeId}`,{
        headers: {
            'Authorization': `Bearer ${user.authToken}`
        }
    })
    .then(response => {
        ok = response.ok;
        return response.json();
    })
    .then(responseJson => {
        if (ok) return callback(responseJson);
        return Promise.reject(responseJson);
    })
    .catch(err => displayPlaceError(err.message));
}

function getSelectedItem(callback, id, itemId){
    let ok;
    fetch(`/api/trips/${id}/packingList/${itemId}`, {
        headers: {
            'Authorization': `Bearer ${user.authToken}`
        }
    })
    .then(response => {
        ok = response.ok;
        return response.json();
    })
    .then(responseJson => {
        if (ok) return callback(responseJson);
        return Promise.reject(responseJson);
    })
    .catch(err => displayItemError(err.message));
}

function addNewTrip(callback, updateData){
    let ok;
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
        ok = response.ok;
        return response.json();
    })
    .then(responseJson => {
        if (ok) return callback(responseJson);
        return Promise.reject(responseJson);
    })
    .catch(err => displayTripError(err.message));
}

function addNewPlace(callback, id, updateData){
    let ok;
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
        ok = response.ok;
        return response.json();
    })
    .then(responseJson => {
        if (ok) return responseJson;
        return Promise.reject(responseJson);
    })
    .then(responseJson => callback(responseJson))
    .catch(err => displayPlaceError(err.message));
}

function addNewItem(callback, id, updateData){
    let ok;
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
        ok = response.ok;
        return response.json();
    })
    .then(responseJson => {
        if (ok) return responseJson;
        return Promise.reject(responseJson);
    })
    .then(responseJson => callback(responseJson))
    .catch(err => displayItemError(err.message));
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
    .then(response => {
        if (response.ok) return getSelectedTrip(callback,updateData.id);
        return Promise.reject(response.json());
    })
    .catch(err => {
        displayTripError(err.message);
    })
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
    .then(response => {
        if (response.ok) return getSelectedPlace(callback, id, placeId);
        return Promise.reject(response.json());;
    })
    .catch(err => {
        displayPlaceError(err.message);
    });
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
    .then(response => {
        if (response.ok) return getSelectedItem(callback, id, updateData.id);
        return Promise.reject(response.json());
    })
    .catch(err => {
        displayItemError(err.message);
    })
}


function deleteTripFromDatabase(callback, id){
    let ok;
    fetch(`/api/trips/${id}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${user.authToken}`
        }
    })
    .then(response => {
        if (response.ok) return callback();
        return Promise.reject(response.json());
    })
    .catch(err => {
        displayTripError(err.message);
    });
}

function deletePlaceFromTrip(callback, id, placeId){
    fetch(`/api/trips/${id}/places/${placeId}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${user.authToken}`
        }
    })
    .then(response => {
        if (response.ok) return callback(id, true);
        return Promise.reject(response.json());
    })
    .catch(err => {
        displayPlaceError(err.message);
    })
}

function deletePackingItemFromTrip(callback, id, itemId){
    fetch(`/api/trips/${id}/packingList/${itemId}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${user.authToken}`
        }
    })
    .then(response => {
        if (response.ok) return callback(id, true);
        return Promise.reject(response.json());
    })
    .catch(err => {
        displayItemError(err.message);
    });
}

function createNewUser(newInfo){
    let ok;
    fetch('/api/users', {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(newInfo)
    })
    .then(response => {
        ok = response.ok;
        return response.json();
    })
    .then(responseJson => {
        if (ok) return responseJson;
        return Promise.reject(responseJson);
    })
    .then(responseJson => {
        user.username = responseJson.username;
        user.authToken = responseJson.authToken;
        getAndDisplayActiveTrips(true);
    })
    .catch(err => {
        displaySignupError(err.location, err.message);
    });
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
        throw new Error;
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

//UPDATE FUNCTIONS//

function displayUpdatedItem(currentItem){
    const selectedLi = $(`li[data-list-id=${currentItem.id}]`);
    selectedLi.attr('data-checked', currentItem.packed);
    selectedLi.find('span').attr('aria-checked', currentItem.packed);
}

function displayNewItem(newItem){
    $('.add-item-form').find('.item-update').remove();
    $('.add-item-form').append(`<p class="item-update">${newItem.item} added!</p>`);
    //if the no items header exists, replace with regular header and add list 
    if($('.js-no-items').length > 0) {
        $('#packing-list').empty().append('<h4 class="packing-header">Packing List</h4><ul id="item-list"></ul>')
    }
    $('#item-list').append(`<li data-list-id="${newItem.id}" 
    data-checked="${newItem.packed}" class="item-container">
    <span role="checkbox" aria-checked=${newItem.packed} tabindex="0">
    ${newItem.item} 
    </span>
    <button class="js-delete item delete-item" aria-label="delete ${newItem.item}">\u00D7</button>
    </li>`)
    $('#packing-list').append('<button class="js-add item add-item" aria-label="add item"><i class="fas fa-plus-circle"></button>')
}


function updateAndDisplayItemDetails(inputData, id){
    const updateData = {};
    updateData.id = inputData.parent('li').attr('data-list-id');
    if (updateData.id) {
        //toggles between true and false
        updateData.packed = !(inputData.attr('aria-checked') === 'true');
        editItem(displayUpdatedItem, id, updateData);
    } else {
        //this is a new item and needs to be added
        updateData.item = inputData.find('.js-item').val();
        inputData.find('.js-item').val('');
        updateData.packed = false;
        addNewItem(displayNewItem, id, updateData);
    }
}

function displayUpdatedPlace(currentPlace){
    $(`div[data-place-id='${currentPlace.id}']`).empty()
    .append(`<button class="js-edit place edit-place" aria-label="edit ${currentPlace.name} place"><i class="far fa-edit"></i></button>
    <button class="js-delete place delete-place" aria-label="delete ${currentPlace.name} place"><i class="far fa-trash-alt"></i></button>`)
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
        <button class="js-edit place edit-place" aria-label="edit ${newPlace.name} place"><i class="far fa-edit"></i></button>
        <button class="js-delete place delete-place" aria-label="delete ${newPlace.name} place"><i class="far fa-trash-alt"></i></button>
        ${displayOnePlace(newPlace)} </div>`)
    .prepend('<button class="js-add place add-place" aria-label="add place"><i class="fas fa-plus-circle"></i></button>');
}

//update place details in database
function updateAndDisplayPlaceDetails(inputData, id, placeId){
    const updateData = {};
    updateData.name = inputData.find('.js-place-name').val();
    updateData.address = inputData.find('.js-address').val();
    //if user didn't provide notes, write "No Notes"
    if (inputData.find('.js-place-notes').val() === '') updateData.notes = "No Notes";
    else updateData.notes = inputData.find('.js-place-notes').val();

    //if a placeId exists, edit place instead of adding new place
    if (placeId) {
        updateData.id = placeId;
        editPlace(displayUpdatedPlace, id, placeId, updateData);
    } else addNewPlace(displayNewPlace, id, updateData);
}

function displayNewTrip(currentTrip){
    $('#details-form').remove();
    displayActiveTrips(currentTrip);
}

function addAndDisplayNewTrip(){
    const updateData = {destination: {}, dates: {}};
    updateData.name = $('#js-trip-name').val();
    updateData.destination = $('#js-location').val();
    updateData.dates.start = $('#js-start-date').val();
    updateData.dates.end = $('#js-end-date').val();
    addNewTrip(displayNewTrip, updateData);
}

function displayUpdatedTripDetails(currentTrip){
    $('#trip-details').empty().append(displayTripDetails(currentTrip))
    .prepend('<button class="js-edit details" aria-label="edit trip details"><i class="far fa-edit"></i></button>');
}

//update trip details in database
function updateAndDisplayTripDetails(updateTrip){
    updateTrip.name = $('#js-trip-name').val();
    updateTrip.destination = $('#js-location').val();
    updateTrip.dates.start = $('#js-start-date').val();
    updateTrip.dates.end = $('#js-end-date').val();
    editTrip(displayUpdatedTripDetails, updateTrip);
}

//FORM FUNCTIONS//

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


function prefillPlaceForm(currentPlace){
    //fill in values with current place details
    const currentForm = $(`div[data-place-id='${currentPlace.id}']`);
    currentForm.find('.js-place-name').val(currentPlace.name);
    currentForm.find('.js-address').val(currentPlace.address);
    currentForm.find('.js-place-notes').val(currentPlace.notes);
}

function generatePlaceForm(isNewPlace){
    return `<form class="${isNewPlace ? 'add-place-form' : 'edit-place-form'} js-place-form">
    <div class="place-form-entry">
    <label for="place-name">Name</label>
    <input type="text" name="place-name" class="js-place-name">
    </div>
    <div class="place-form-entry">
    <label for="address">Address</label>
    <input type="text" name="address" class="js-address">
    </div>
    <div class="place-form-entry">
    <label for="place-notes">Notes</label>
    <textarea name="place-notes" class="js-place-notes" rows="2" cols="100">
    </textarea>
    </div>
    <input type="submit" class="js-submit-place" value="${isNewPlace ? 'Add Place': 'Submit Edits'}">
    <input type="button" class="js-remove-form" value="Cancel">
    </form>`
}

function prefillDetailsForm(currentTrip){
    //fill in values with current trip details
    const startDate = new Date(currentTrip.dates.start).toISOString().split('T')[0];
    const endDate = new Date(currentTrip.dates.end).toISOString().split('T')[0];    
    $('#js-trip-name').val(currentTrip.name);
    $('#js-location').val(currentTrip.destination);
    $('#js-start-date').val(startDate);
    $('#js-end-date').val(endDate);
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

//Turn the saved place into an editable form
function getAndDisplayPlaceForm(selectedId, placeId){
    $(`div[data-place-id='${placeId}']`).empty().append(generatePlaceForm());
    getSelectedPlace(prefillPlaceForm, selectedId, placeId);
}

//display a new place to input
function addPlaceForm(){
    $('#saved-places').children('.js-add').remove();
    $('.places-header').after(generatePlaceForm(true));
}

//Turn the trip details section into a editable form
function getAndDisplayDetailsForm(selectedId){
    $('#trip-details').empty().append(`${displayDetailsForm(false)}`)
    getSelectedTrip(prefillDetailsForm, selectedId);
}

//DISPLAY FUNCTIONS//

function displayPackingList(currentTrip, shouldEdit){
    let listArray = [];
    if (currentTrip.packingList.length > 0){
        for (let index = 0; index < currentTrip.packingList.length; index++){
            let listItem = currentTrip.packingList[index]; 
            listArray.push(`
            <li data-list-id="${listItem.id}" data-checked="${listItem.packed}" class="item-container">
            <span role="checkbox" aria-checked=${listItem.packed} tabindex="0">
            ${listItem.item}</span>
            ${shouldEdit ? `<button class="js-delete item delete-item" aria-label="delete ${listItem.item}">\u00D7</button>` : ''}
            </li>`)
        }
        const listHTML = listArray.join('');
        return `<h4 class="packing-header">Packing List</h4>
        <ul id="item-list">${listHTML}</ul>`
    } else return '<h4 class="packing-header js-no-items">No Items Yet</h4>'
}

function displayOnePlace(place){
    return `<h5 class="place-name">${place.name}</h5>
    <p class="place-address">${place.address}</p>
    <p class="place-notes">Notes: ${place.notes}</p>`
}

function displaySavedPlaces(currentTrip, shouldEdit){
    let placeHTML = ['<h4 class="places-header">Bookmarked Places</h4>'];
    if (currentTrip.savedPlaces.length > 0){
        for (let index = 0; index < currentTrip.savedPlaces.length; index++) {
            let place = currentTrip.savedPlaces[index];
            placeHTML.push(`<div class="saved-place" data-place-id="${place.id}">
            ${shouldEdit ? `<button class="js-edit place edit-place" aria-label="edit ${place.name} place"><i class="far fa-edit"></i></button>
            <button class="js-delete place delete-place" aria-label="delete ${place.name} place"><i class="far fa-trash-alt"></i></button>`: ''}
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
    ${shouldEdit ? '<button class="js-edit details" aria-label="edit trip details"><i class="far fa-edit"></i></button>' : ''}
    ${displayTripDetails(currentTrip)}
    </div>
    <div id="saved-places">
    ${shouldEdit ? '<button class="js-add place add-place" aria-label="add place"><i class="fas fa-plus-circle"></i></button>': ''}
    ${displaySavedPlaces(currentTrip, shouldEdit)}
    </div>
    <div id="packing-list">
    ${shouldEdit ? '<button class="js-add item add-item" aria-label="add item"><i class="fas fa-plus-circle"></i></button>': ''}
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

function displayLogin(){
    $('#active-trips').empty().prop('hidden', true);
    $('#current-trip').empty().prop('hidden', true);        
    $('#logout-button').prop('hidden', true);
    $('#login-page').prop('hidden', false);
}

//DISPLAY ERROR FUNCTIONS//

function displayDashboardError(errMessage){
    //reset previous errors
    $('.error-msg').remove();
    $('#active-trips').append(`<p class="error-msg" aria-live="assertive">
    <i class="fas fa-exclamation-circle"></i> ${errMessage}</p>`);
}

function displayTripError(errMessage, id){
    //reset previous errors
    $('.error-msg').remove();
    $(`${id ? `div[data-id=${id}]` : '.js-details-form'}`).append(`<p class="error-msg" aria-live="assertive">
    <i class="fas fa-exclamation-circle"></i> ${errMessage}</p>`);
}

function displayPlaceError(errMessage){
    //reset previous errors
    $('.error-msg').remove();
    $('#saved-places').append(`<p class="error-msg" aria-live="assertive">
    <i class="fas fa-exclamation-circle"></i> ${errMessage}</p>`);
}

function displayItemError(errMessage){
    //reset previous errors
    $('.error-msg').remove();
    $('#item-list').after(`<p class="error-msg" aria-live="assertive">
    <i class="fas fa-exclamation-circle"></i> ${errMessage}</p>`);
}

function displaySignupError(errLocation, errMessage){
    //reset previous errors
    $('.js-new-password').removeClass('error-field');
    $('.js-confirm-password').removeClass('error-field');
    $('.error-msg').remove();
    if (errLocation === 'username'){
        $('.js-new-username').addClass('error-field').attr('aria-invalid', false);
    } else {
        $('.js-new-password').val('').addClass('error-field').attr('aria-invalid', false);
        $('.js-confirm-password').val('').addClass('error-field').attr('aria-invalid', false);
    }
    $('#js-submit-signup').before(`<p class="error-msg" aria-live="assertive">
    <i class="fas fa-exclamation-circle"></i> ${errLocation}: ${errMessage}</p>`)
}

function displayLoginError(){
    //reset error messages
    $('.error-msg').remove();
    $('.js-password')
    .after('<p class="error-msg" aria-live="assertive"><i class="fas fa-exclamation-circle"></i> Incorrect username and/or password</p>')
    .addClass('error-field').attr('aria-invalid', false);
    $('.js-username').addClass('error-field').attr('aria-invalid', false);
}

function validateDetailsForm(){
    const requiredFields = ['#js-trip-name', '#js-location','#js-start-date', '#js-end-date'];
    //find the first field where the input is empty. Return that field.
    return requiredFields.find(field => !( $(field).val() ));
}

//EVENT LISTENERS//

function watchForSubmits(){
    //check if a new trip is submitted
    $('#active-trips').on('submit','.js-details-form',(event) => {
        event.preventDefault();
        //remove any previously marked errors
        $('.js-details-form').find('.error-field').removeClass('error-field').attr('aria-invalid', false);
        //remove any previous error message
        $('.js-details-form').find('.error-msg').remove();

        const missingField = validateDetailsForm();
        if (missingField){
            $(missingField).addClass('error-field').attr('aria-invalid', true);
            //add current error message for missing field
            $('#js-submit-details').before(`<p class="error-msg" aria-live="assertive">
            <i class="fas fa-exclamation-circle"></i> ${$(missingField).prev("label").html()} must not be empty</p>`)
        } else {
            if ($('#js-end-date').val() < $('#js-start-date').val()){
                //add error message for end date being earlier than start date
                $('#js-end-date').addClass('error-field').attr('aria-invalid', true);
                $('#js-submit-details').before('<p class="error-msg" aria-live="assertive"><i class="fas fa-exclamation-circle"></i> End date must be after start date</p>');
            } else {
                addAndDisplayNewTrip();
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
            $('#js-submit-details').before(`<p class="error-msg" aria-live="assertive">
            <i class="fas fa-exclamation-circle"></i> ${$(missingField).prev("label").html()} must not be empty</p>`)
        } else {
            //check if end date is greater than start date
            if ($('#js-end-date').val() > $('#js-start-date').val()){
                getSelectedTrip(updateAndDisplayTripDetails, selectedId);
            } else {
                $('#js-end-date').addClass('error-field');
                $('#js-submit-details').before('<p class="error-msg" aria-live="assertive"><i class="fas fa-exclamation-circle"></i> End date must be after start date</p>');
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
            selected.find('.js-submit-place').before('<p class="error-msg" aria-live="assertive"><i class="fas fa-exclamation-circle"></i> Place Name must not be empty</p>')
        } else {
            updateAndDisplayPlaceDetails(selected, selectedId, placeId);
        }
    });

    //check to see if any packing list items have been added
    $('#current-trip').on('submit', '.item-form', (event) =>{
        event.preventDefault();
        const selected = $(event.currentTarget);
        const selectedId = selected.parents('#current-trip').attr('data-id');
        const fieldToValidate = selected.find('.js-item');
        if ( !(fieldToValidate.val()) ){
            fieldToValidate.addClass('error-field');
            //remove any previous error message
            selected.find('.error-msg').remove();
            selected.append('<p class="error-msg" aria-live="assertive"><i class="fas fa-exclamation-circle"></i> Packing list entry must not be empty</p>')
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
        } else if (selected.hasClass('item')){
            //delete an item on the packing list and refresh page
            const itemIndex = selected.parent('li').attr('data-list-id');
            deletePackingItemFromTrip(getAndDisplaySelectedTrip, selectedId, itemIndex);
        }
    });
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
        }
    });

    //check if a packing list li item being clicked (completed)
    $('#current-trip').on('click', 'span', (event) => {
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
            $('#packing-list').prepend('<button class="js-add item add-item" aria-label="add item"><i class="fas fa-plus-circle"></i></button>');
        } else if (selectedForm.hasClass('add-place-form')){
            $('#saved-places').prepend('<button class="js-add place add-place" aria-label="add place"><i class="fas fa-plus-circle"></i></button>');
        } else if (selectedForm.hasClass('edit-place-form')){
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
            //check to see if a form is active and prompt user of unsaved changes
            if($('#current-trip').find('form').length > 0 ) {
                const confirmRedirect = confirm('Are you sure you want to return to dashboard? Doing so will discard any unsaved changes to your trip.');
                if (confirmRedirect){
                    $('#current-trip').empty().removeAttr('data-id');
                    getAndDisplayActiveTrips(); 
                }
            } else {
                //otherwise, just go through with displaying active trips
                $('#current-trip').empty().removeAttr('data-id');
                getAndDisplayActiveTrips(); 
            }
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

        const username = $('.js-username').val();
        const password = $('.js-password').val();

        //reset the login form
        $('.js-username').val('').removeClass('error-field').attr('aria-invalid', false);
        $('.js-password').val('').removeClass('error-field').attr('aria-invalid', false);;

        loginAndDisplayDash({username, password});
    });

    $('#signup-redirect').click(() => {
        //reset the login form
        $('.js-username').val('').removeClass('error-field').attr('aria-invalid', false);
        $('.js-password').val('').removeClass('error-field').attr('aria-invalid', false);
        $('#login-page').prop('hidden', true);
        $('#signup-page').prop('hidden', false);
    });
}

function watchSignup(){
    $('.js-signup-form').submit(event => {
        event.preventDefault();

        const newUsername = $('.js-new-username').val();
        const newPassword = $('.js-new-password').val();
        const confirmPassword = $('.js-confirm-password').val();
        
        //reset previous errors
        $('.js-new-username').removeClass('error-field').attr('aria-invalid', false);
        $('.js-new-password').val('').removeClass('error-field').attr('aria-invalid', false);
        $('.js-confirm-password').val('').removeClass('error-field').attr('aria-invalid', false);
        $('.error-msg').remove();

        if(newPassword !== confirmPassword){
            //add current error
            $('.js-new-password').addClass('error-field').attr('aria-invalid', true);
            $('.js-confirm-password').addClass('error-field').attr('aria-invalid', true)
            .after('<p class="error-msg" aria-live="assertive"><i class="fas fa-exclamation-circle"></i> Passwords do not match. Try again.</p>');
        } else {
            $('.js-new-username').val('');
            const signupInfo = {};
            if (newUsername) signupInfo.username = newUsername;
            if (newPassword) signupInfo.password = newPassword;
            createNewUser(signupInfo);
        }
    });

    $('#login-redirect').click(() => {
        //reset the signup form
        $('.js-new-username').val('').removeClass('error-field').attr('aria-invalid', false);
        $('.js-new-password').val('').removeClass('error-field').attr('aria-invalid', false);
        $('.js-confirm-password').val('').removeClass('error-field').attr('aria-invalid', false);
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
    watchSignup();
    watchDashboard();
    watchTripPage();
    watchLogout();
    watchForCancels();
    watchForEdits();
    watchForDeletes();
    watchForAdds();
    watchForSubmits();
});