(function() {
  'use strict'

const Joi = require('joi')

module.exports.post = {
  body: {
    album: Joi.string().trim().min(1).max(255),
    artist: Joi.string().trim().min(1).max(255),
    genre: Joi.string().trim().min(1).max(255),
    //NOTE: year is a string b/c JSON is passed to API
    year: Joi.string().trim().min(4).max(4)
  }
}

})()
