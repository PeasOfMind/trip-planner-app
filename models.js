'use strict'

const mongoose = require('mongoose');

const placeSchema = mongoose.Schema({
    name: {type: String, required: true},
    address: String,
    type: {type: String}
});

const packingSchema = mongoose.Schema({
    item: String,
    packed: Boolean
})

const tripSchema = mongoose.Schema({
    name: {type: String, required: true},
    destination: {
        location: {type: String, required: true},
        country: {type: String, required: true}
    },
    savedPlaces: [placeSchema],
    packingList: [packingSchema],
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
const Place = mongoose.model('Place', placeSchema);
const Pack = mongoose.model('Pack', packingSchema);

module.exports = {Trip, Place, Pack};