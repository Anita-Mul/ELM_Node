'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const bugSchema = new Schema({
    assign: {type: String, default: ''},
    trace: {type: String, default: ''},
    msgId: {type: String, default: ''},
    status: {type: Number, default: 1},
    updatedAt: {type: Date, default: Date.now()},
    createdAt: {type: Date, default: Date.now()},
})

const Bug = mongoose.model('Bug', bugSchema);

export default Bug;