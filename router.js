const express = require('express');
const router = express.Router();

const {Trip, Place, Pack} = require('./models');


router.get('/', (req,res) => {
    Trip.find()
    .then(trips => {
        res.json({trips: trips.map(trip => trip.serialize())});
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'something went wrong'})
    });
});

router.get('/:id', (req, res) => {
    Trip.findById(req.params.id)
    .then(trip => res.json(trip.serialize()))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'could not find requested trip'})
    });
});

router.post('/', (req, res) => {
    const requiredFields = ['name', 'destination', 'dates'];
    for (let i = 0; i < requiredFields.length; i++){
        const field = requiredFields[i];
        if (!(field in req.body)){
            const message = `Missing '${field}' in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    const newPost = {
        name: req.body.name,
        destination: {
            location: req.body.destination.location,
            country: req.body.destination.country
        },
        savedPlaces: req.body.savedPlaces ? JSON.parse(JSON.stringify(req.body.savedPlaces)) : [],
        packingList: req.body.packingList ? JSON.parse(JSON.stringify(req.body.packingList)) : [],
        dates: {
            start: new Date(req.body.dates.start),
            end: new Date(req.body.dates.end)
        }
    };

    Trip.create(newPost)
    .then(trip => res.status(201).json(trip.serialize()))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'New trip could not be saved.'});
    });
});

router.put('/:id', (req, res) => {
    if(!(req.params.id && req.body.id && req.params.id === req.body.id)){
        res.status(400).json({
            error: 'Request path id and request body id must match'
        });
    }

    //TODO: add update ability for saved places and packing list
    const updated = {
        name: req.body.name,
        destination: {
            location: req.body.destination.location,
            country: req.body.destination.country
        },
        dates: {
            start: new Date(req.body.dates.start),
            end: new Date(req.body.dates.end)
        }
    };

    Trip.findByIdAndUpdate(req.params.id, { $set: updated}, {new: true} )
    .then(updatedTrip => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Trip details could not be updated'})
    );

});

router.put('/places/:id', (req, res) => {
    Trip.findById(req.params.id)
    .then(trip => {
        if (req.body.updatePlace.id){
            trip.savedPlaces.id(req.body.updatePlace.id).update(req.body.updatePlace);
            return trip.savedPlaces.id(req.body.updatePlace.id);
        } else {
            trip.savedPlaces.push(req.body.updatePlace);
            return trip.savedPlaces[trip.savedPlaces.length -1];
        }
    })
    .then(updatedPlace => res.status(201).json(updatedPlace))
    .catch(err => res.status(500).json({message: 'Trip details could not be updated'}))
});

router.put('/packingList/:id', (req, res) => {
    Trip.findById(req.params.id)
    .then(trip => {
        if (req.body.updatePacking.id){
            trip.packingList.id(req.body.updatePacking.id).update(req.body.updatePacking);
            return trip.savedPlaces.id(req.body.updatePacking.id);
        } else {
            trip.packingList.push(req.body.updatePacking);
            return trip.packingList[trip.packingList.length -1];
        }
    })
    .then(updatedList => res.status(201).json(updatedList))
    .catch(err => res.status(500).json({message: 'Trip details could not be updated'}))
});

router.delete('/:id', (req,res) => {
    Trip.findByIdAndRemove(req.params.id)
    .then(() => {
        console.log(`Deleted trip with id '${req.params.id}'`);
        res.status(204).end();
    })
    .catch(err => res.status(500).json({message: 'Could not process the delete request'}))
});

module.exports = {router};