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
            name: String,
            address: String,
            type: {type: String}
        }
    ],
    packingList: [
        {
            item: String,
            packed: Boolean
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