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
                start: 1543182659779,
                end: Date.now()
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
                    type: "Restaurant",
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
                start: 1543182659779,
                end: Date.now()
            }
        } 
    ]
}

function getSelectedTrip(callback, id){
    setTimeout(function(){callback(MOCK_TRIP_DATA, id)}, 100);
}

function displayPackingList(tripObject){
    let listHTML = [];
    for (index in tripObject.packingList){
        let listItem = tripObject.packingList[index];
        listHTML.push(`<li>${listItem.item}</li>`)
    }
    return listHTML.join('');
}

function displaySavedPlaces(tripObject){
    let placeHTML = [];
    for (index in tripObject.savedPlaces) {
        let place = tripObject.savedPlaces[index];
        placeHTML.push(`<div class="saved-place">
        <h5 class="place-name">${place.name}</h5>
        <p class="place-address">${place.address}</p>
        <p class="place-type">${place.type}</p>
        </div>`);
    }
    return placeHTML.join('');
}

function displaySelectedTrip(data, id){
    for (index in data.trips){
        let currentTrip = data.trips[index];
        if (currentTrip.id === id){
            $('#active-trips').empty();
            $('#current-trip').html(`<div id=${currentTrip.id}>
            <h2 class="trip-name">${currentTrip.name}</h2>
            <h3 class="destination">${currentTrip.destination.location}, ${currentTrip.destination.country}</h3>
            <h4 class="date">Dates</h4>
            <p>${currentTrip.dates.start.toLocaleDateString} to ${currentTrip.dates.end.toLocaleDateString}</p>
            <h4 class="savedPlaces">Bookmarked Places</h4>
            ${displaySavedPlaces(currentTrip)}
            <h4 class="packing-list">Packing List</h4>
            <ul>${displayPackingList(currentTrip)}</ul>
            <button class="edit-trip">Edit Trip</button>
            <button class="delete-trip">Delete Trip</button>
            <button class="dashboard-redirect">Back to Dashboard</button>
            </div>`)
        }
    }
    $('#active-trips').prop('hidden', true);
    $('#current-trip').prop('hidden', false);
}

function getAndDisplaySelectedTrip(id){
    getSelectedTrip(displaySelectedTrip, id);
}

function getActiveTrips(callback){
    setTimeout(function(){ callback(MOCK_TRIP_DATA)}, 100);
}

function displayActiveTrips(data){
    for (index in data.trips) {
        let currentTrip = data.trips[index];
        $('#active-trips').append(`<div id=${currentTrip.id}>
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

function watchViewPage(){
    $('#current-trip').on('click', 'button', (event) => {
        event.preventDefault();
        const selected = $(event.currentTarget);
        if (selected.hasClass('edit-trip')){
            console.info('Edit Trip');
        } else if (selected.hasClass('delete-trip')){
            console.info('Delete Trip');
        } else if (selected.hasClass('dashboard-redirect')){
            getAndDisplayActiveTrips(); 
        }
    });
}

function watchDashboard(){
    $('#active-trips').on('click', 'button', (event => {
        event.preventDefault();
        const selected = $(event.currentTarget);
        if(selected.hasClass('view-trip')) {
            const selectedId = selected.parent('div').prop('id');
            getAndDisplaySelectedTrip(selectedId);
        } else if (selected.hasClass('edit-trip')){
            console.info('Edit Trip');
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
        $('#logout-button').prop('hidden', true);
        $('#login-page').prop('hidden', false);
    });
}

$(watchLogin)
$(watchDashboard)
$(watchViewPage)
$(watchLogout)