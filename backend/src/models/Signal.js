import mongoose from 'mongoose';

const signalSchema = new mongoose.Schema(
  {
    asset: { type: String, required: true, uppercase: true, trim: true, index: true },
    direction: { type: String, enum: ['BUY', 'SELL'], required: true },
    entry: { type: Number, required: true },
    takeProfit: { type: Number, required: true },
    stopLoss: { type: Number, required: true },
    note: { type: String, default: '', maxlength: 500 },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
      index: true,
    },
    result: {
      type: String,
      enum: ['pending', 'win', 'loss', 'breakeven'],
      default: 'pending',
      index: true,
    },
    pips: { type: Number, default: 0 },
    publishedAt: { type: Date, default: Date.now, index: true },
    isPremiumOnly: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

signalSchema.index({ publishedAt: -1 });
signalSchema.index({ isPremiumOnly: 1, publishedAt: -1 });

export const Signal = mongoose.model('Signal', signalSchema);
