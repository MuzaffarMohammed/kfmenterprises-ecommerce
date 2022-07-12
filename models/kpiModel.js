import mongoose from 'mongoose'

const KPISchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    columns:{
        type: Array,
        required: true
    },
    singleAnalysis: Boolean
}, {
    timestamps: true
})

let Dataset = mongoose.models.kpi || mongoose.model('kpi', KPISchema)
export default Dataset