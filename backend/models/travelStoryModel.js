const mongoose = require('mongoose');

const travelStorySchema = new mongoose.Schema({
  title:{
    type:String,
    required: [true, 'Travel story must have a title'],
  },
  story:{
    type:String,
    required: [true, 'Travel story must have a story'],
  },
  visitedLocation:{
    type:String,
    default:[],
  },
  isFavorite:{
    type:Boolean,
    default: false,
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt:{
    type: Date,
    default: Date.now,
  },
  imageUrl:{
    type: String,
    required: [true, 'Travel story must have an image'],
  },
  visitedDate:{
    type: Date,
    required: [true, 'Travel story must have a visited date'],
  }
});

module.exports = mongoose.model('TravelStory', travelStorySchema);