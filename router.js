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

router.get('/:id/places/:placeId', (req, res) => {
    Trip.findById(req.params.id)
    .then(trip => {
        return trip.savedPlaces.id(req.params.placeId)
    })
    .then(currentPlace => res.json(currentPlace.serialize()))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'could not retrieve requested place'})
    })
})

router.get('/:id/packingList/:listId', (req, res) => {
    Trip.findById(req.params.id)
    .then(trip => {
        return trip.packingList.id(req.params.listId)
    })
    .then(currentItem => res.json(currentItem.serialize()))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'could not retrieve requested place'})
    })
})

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

router.post('/:id/places', (req,res) => {
    if ( !('name' in req.body) ){
        const message = `Missing 'name' in request body`;
        console.error(message);
        return res.status(400).send(message);
    }
    Trip.findById(req.params.id)
    .then(trip => {
        trip.savedPlaces.push(req.body);
        trip.save();
        return trip.savedPlaces[trip.savedPlaces.length -1];
    })
    .then(updatedPlace => res.status(201).json(updatedPlace.serialize()))
    .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Place details could not be saved'});
    });
});

//TODO: change put endpoint to /trips/:id/places/:placeId

router.put('/:id/places/:placeId', (req, res) => {
    Trip.findById(req.params.id)
    .then(trip => {
        if (trip && req.params.placeId && req.body.id && req.params.placeId === req.body.id){
            const editedPlace = trip.savedPlaces.id(req.params.placeId);
            editedPlace.name = req.body.name;
            editedPlace.address = req.body.address;
            editedPlace.type = req.body.type;
            // editedPlace.save();
            trip.save();
            return trip.savedPlaces.id(req.body.id);
        }
        return res.status(404).json({message: 'could not find trip id or place id'});
    })
    .then(updatedPlace => res.status(204).end())
    .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Place details could not be updated'});
    });
});

router.post('/:id/packingList', (req, res) => {
    if ( !('item' in req.body) ){
        const message = `Missing 'item name' in request body`;
        console.error(message);
        return res.status(400).send(message);
    }
    Trip.findById(req.params.id)
    .then(trip => {
        trip.packingList.push(req.body);
        trip.save();
        return trip.packingList[trip.packingList.length -1];
    })
    .then(updatedList => res.status(201).json(updatedList.serialize()))
    .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Packing list details could not be updated'});
    });
})

router.put('/:id/packingList/:listId', (req, res) => {
    Trip.findById(req.params.id)
    .then(trip => {
        if (trip && req.params.listId && req.body.id && req.params.listId === req.body.id){
            const editedList = trip.packingList.id(req.body.id);
            if (req.body.item) editedList.item = req.body.item;
            if (req.body.packed) editedList.packed = req.body.packed;
            trip.save();
            return trip.packingList.id(req.body.id);
        }
        return res.status(404).json({message: 'could not find trip id or place id'});
    })
    .then(updatedList => res.status(204).end())
    .catch(err => {
        console.err(err);
        res.status(500).json({message: 'Trip details could not be updated'});
    });
});

router.delete('/:id', (req,res) => {
    Trip.findByIdAndRemove(req.params.id)
    .then(() => {
        console.log(`Deleted trip with id '${req.params.id}'`);
        res.status(204).end();
    })
    .catch(err => res.status(500).json({message: 'Could not delete the trip'}));
});

router.delete('/:id/places/:placeId', (req,res) => {
    Trip.findById(req.params.id)
    .then((trip) => {
        trip.savedPlaces.id(req.params.placeId).remove();
        trip.save();
    })
    .then(() => {
        console.log(`Deleted saved place with id '${req.params.placeId}'`);
        res.status(204).end();
    })
    .catch(err => res.status(500).json({message: 'Could not delete the saved place'}));
});

router.delete('/:id/packingList', (req, res) => {
    Trip.findById(req.params.id)
    .then((trip) => {
        trip.packingList = [];
        trip.save();
    })
    .then(() => {
        console.log(`Deleted packing list in trip '${req.params.id}'`);
        res.status(204).end();
    })
    .catch(err => res.status(500).json({message: 'Could not delete the packing list'}));
})

router.delete('/:id/packingList/:listId', (req,res) => {
    Trip.findById(req.params.id)
    .then((trip) => {
        trip.packingList.id(req.params.listId).remove();
        trip.save();
    })
    .then(() => {
        console.log(`Deleted item with id '${req.params.listId}'`);
        res.status(204).end();
    })
    .catch(err => res.status(500).json({message: 'Could not delete the item'}));
});


module.exports = {router};