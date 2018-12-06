'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const {Trip} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

function seedTripData(){
    console.info('seeding trip data');
    const seedData = [];

    for (let i=1; i<=3; i++){
        seedData.push(generateTripData());
    }
    return Trip.insertMany(seedData);
}

function generatePlaceData(num){
    const places = [];
    for (let i = 1; i <= num; i++){
        places.push({
            name: faker.random.words(),
            address: faker.address.streetAddress() + faker.address.streetName() + faker.address.zipCode(),
            type: faker.random.word()
        });
    }
    return places;
}

function generatePackingListData(num){
    const list = [];
    for (let i = 1; i <= num; i++){
        list.push({
            item: faker.random.word,
            packed: faker.random.boolean()
        });
    }
    return list;
}

function generateTripData(){
    return {
        name: faker.random.words(),
        destination: {
            location: faker.address.city(),
            country: faker.address.country()
        },
        savedPlaces: generatePlaceData(),
        packingList: generatePackingListData(),
        dates: {
            start: faker.date.recent(),
            end: faker.date.future()
        }
    }
}

function tearDownDb(){
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}



describe('Trip API resource', function(){

    before(function(){
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function (){
        return seedTripData();
    });

    afterEach(function (){
        return tearDownDb();
    });

    after(function(){
        return closeServer();
    });

    describe('Index Page', function(){
        it('should return index page for the root url', function(){
            return chai.request(app)
            .get('/')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            })
        })
    });

    describe('GET endpoint', function(){
        it('should return all existing trips', function(){

            let res;
            return chai.request(app)
            .get('/trips')
            .then(function(_res){
                res = _res;
                expect(res).to.have.status(200);
                expect(res.body.trips).to.have.lengthOf.at.least(1);
                return Trip.count();
            })
            .then(function(count){
                expect(res.body.trips).to.have.lengthOf(count);
            });
        });

        it('should return trips with the right fields', function(){
            let resTrip;
            return chai.request(app)
            .get('/trips')
            .then(function(res){
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body.trips).to.be.an('array');

                res.body.trips.forEach(function(trip){
                    expect(trip).to.be.an('object');
                    expect(trip).to.include.keys('id', 'name', 'destination', 'savedPlaces', 'packingList', 'dates');
                    resTrip = res.body.trips[0];
                    return Trip.findById(resTrip.id);
                })
            })
            .then(function(trip){

                expect(resTrip.id).to.equal(trip.id);
                expect(resTrip.name).to.equal(trip.name);
                expect(resTrip.destination).to.equal(trip.destination);
                expect(resTrip.savedPlaces).to.equal(trip.savedPlaces);
                //TODO: check each entry of the savedPlaces 
                expect(resTrip.packingList).to.equal(trip.packingList);
                //TODO: check each entry of PackingList
                expect(resTrip.dates.start).to.equal(trip.dates.start);
                expect(resTrip.dates.end).to.equal(trip.dates.end);
            });
        });




    });



})