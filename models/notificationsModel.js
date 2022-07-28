import mongoose from 'mongoose'
import Counter from './counterModel'

const NotificationsSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    notification: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    action: {
        type: Object,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    checked: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

NotificationsSchema.pre('save', function (next) {
    let doc = this;
    Counter.findByIdAndUpdate({ _id: 'notificationId' }, { $inc: { seq: 1 } }, { new: true, upsert: true })
        .then(function (count) {
            doc._id = count.seq;
            next();
        }).catch(function (error) {
            console.error("counter error-> : " + error);
            throw error;
        });
});

let Dataset = mongoose.models.notifications || mongoose.model('notifications', NotificationsSchema);

export default Dataset