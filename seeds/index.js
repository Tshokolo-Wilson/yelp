
const mongoose = require ('mongoose');
const cities = require('./cities');
const {descriptors,places}  = require('./seedHelpers');
const Campground = require ('../models/campground');


mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;


  const sample = array => array[Math.floor(Math.random() * array.length)];

  const seedDB = async () =>{
    await Campground.deleteMany({});
    for(let i = 0; i< 50; i++) {
      const random1000 = Math.floor(Math.random() *1000);
      const rPrice = Math.floor(Math.random()* 20) +10
      const campG = new Campground({
        author: '66af50ba809df9265660d638',
        title: `${sample(descriptors)} ${sample(places)} `,
        location: `${cities[random1000].city},${cities[random1000].state}`,
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae repellendus expedita iure doloremque quam dolorem aperiam, excepturi et rerum nobis assumenda ipsa corrupti laboriosam fugit explicabo sequi fuga sunt. Sed.',
        price: rPrice,
        geometry:{
             type: "Point",
             coordinates: [
              cities[random1000].longitude,
              cities[random1000].latitude,
            
            ]
        },
        images: [
          {
      url: 'https://res.cloudinary.com/dprxwjcoa/image/upload/v1724342674/yelp/gzrdtg8dvxsz093qeuy3.jpg',
      filename: 'yelp/gzrdtg8dvxsz093qeuy3'
    },
    {
      url: 'https://res.cloudinary.com/dprxwjcoa/image/upload/v1724342674/yelp/l4b6zzfqlcxfqnah6g32.jpg',
      filename: 'yelp/l4b6zzfqlcxfqnah6g32'
    }
      
        ]
      });
      await campG.save();
    }
}

seedDB();