'use strict'

const mongoose = require('mongoose');

const tripSchema = mongoose.Schema({
    name: {type: String, required: true},
    destination: {
        location: {type: String, required: true},
        country: {type: String, required: true}
    },
    savedPlaces: [
        {
            name: {type: String, required: true},
            address: {type: String, required: true},
            type: {type: String, required: true},
        }
    ],
    packingList: [
        {
            item: {type: String, required: true},
            packed: {type: Boolean, required: true}
        }
    ],
    dates: {
        start: {type: Date, required: true},
        end: {type: Date, required: true}
    }
});

//TODO: break out address in savedPlaces into building, street, and zipcode

tripSchema.methods.serialize = function(){
    return {
        id: this._id,
        name: this.name,
        destination: this.destination,
        savedPlaces: this.savedPlaces,
        packingList: this.packingList,
        dates: this.dates
    }
}

const Trip =  mongoose.model('Trip', tripSchema);

module.exports = {Trip};