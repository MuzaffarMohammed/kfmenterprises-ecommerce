import mongoose from 'mongoose'

const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
})

let Dataset = mongoose.models.counter || mongoose.model('counter', CounterSchema)
export default Dataset