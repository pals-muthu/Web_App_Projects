const mongoose = require('mongoose');
const Campground = require('../models/campground');
const Review = require('./../models/review');
const { descriptors, places } = require('./seedHelpers');
const cities = require('./cities');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = "pk.eyJ1IjoicGFscy1tdXRodSIsImEiOiJja25jdHl1c24xYmdpMnBtdXEzYTg2Znl2In0.Io7G1FTEIKbBpVRfxtQZ9g";
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    // we're connected!
    console.log("DB connected");
});

const clearDb = async () => {
    await Campground.deleteMany({});
    await Review.deleteMany({});
}

const sampleData = array => array[Math.floor(Math.random() * array.length)]

const populateData = async () => {
    for (let i = 0; i < 100; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const location = `${cities[random1000].city}, ${cities[random1000].state}`
        const geometry = await geocoder.forwardGeocode({
            query: location,
            limit: 1
        }).send()
        const camp = new Campground({
            location,
            geometry: geometry.body.features[0].geometry,
            title: `${sampleData(descriptors)} ${sampleData(places)}`,
            // image: 'https://source.unsplash.com/collection/94533254/800X600',
            description: 'Camping is one of the most popular recreational activities on Vancouver Island in British Columbia, and campgrounds in BC are as varied as the wonderful terrain in which they are located. Campers can pitch tents in private campsites, in BC Recreation Campsites located on Crown land outside of parks, and alongside lakes or rivers, but the real camping highlight is a space in one of Vancouver Island’s magnificent provincial or national park campgrounds! ',
            author: '6066d67d6097430d30d445c6',
            price: Math.floor(Math.random() * 20) + 10,
            images: [
                {
                    url: 'https://res.cloudinary.com/dhvmx2r1v/image/upload/v1618059146/YelpCamp/rpmouwnrorvksrby2a5h.jpg',
                    filename: 'YelpCamp/rpmouwnrorvksrby2a5h'
                },
                {
                    url: 'https://res.cloudinary.com/dhvmx2r1v/image/upload/v1618059080/YelpCamp/xfngk2maxt6iy7kw3th0.jpg',
                    filename: 'YelpCamp/xfngk2maxt6iy7kw3th0'
                }
            ]

        })
        await camp.save();
        console.log(camp);
    }
}

const seedDB = async () => {
    // clear the existing contents before adding fresh ones.
    await clearDb();
    //create random Data
    await populateData();
    console.log("Db data dump complete.")

}

seedDB().then(() => {
    db.close();
})