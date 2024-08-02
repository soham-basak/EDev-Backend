import mongoose, { Schema, Document } from 'mongoose';

interface ISubscription extends Document {
    email: string;
}

const SubscriptionSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
});

const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export default Subscription;
