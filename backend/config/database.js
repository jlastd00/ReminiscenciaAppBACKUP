import mongoose from "mongoose";
import properties from './properties.js'

mongoose.connect(properties.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(db => console.log('Connected to', properties.DB))
    .catch(err => console.error(err));
