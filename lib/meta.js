const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MetaSchema = new Schema({
    id: {
        type: 'String',
        required: true
    },
    slug: {
        type: 'String',
        required: true
    },
    name: {
        type: 'String',
        required: true
    },
    type: {
        type: 'String',
        required: true
    },
    genres: {
        type: ['String'],
        required: false
    },
    poster: {
        type: 'String',
        required: false
    },
    posterShape: {
        type: 'String',
        required: false
    },
    description: {
        type: 'String',
        required: false
    },
    releaseInfo: {
        type: 'String',
        required: false
    },
    imdbRating: {
        type: 'Number',
        required: false
    },
    year: {
        type: 'Number',
        required: false
    },
});

const Meta = mongoose.model('Meta', MetaSchema);

module.exports = Meta
module.exports.MetaSchema = MetaSchema