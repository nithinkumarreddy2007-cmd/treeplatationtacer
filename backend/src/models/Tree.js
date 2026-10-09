import mongoose from 'mongoose';

const treeSchema = new mongoose.Schema(
  {
    treeSpecies: {
      type: String,
      required: [true, 'Tree species is required'],
      trim: true,
    },
    commonName: {
      type: String,
      required: [true, 'Common name is required'],
      trim: true,
    },
    location: {
      name: {
        type: String,
        required: [true, 'Location site/name is required'],
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },
      state: {
        type: String,
        default: '',
        trim: true,
      },
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
    },
    plantedDate: {
      type: Date,
      required: [true, 'Planting date is required'],
      default: Date.now,
    },
    person: {
      name: {
        type: String,
        required: [true, 'Planter / contact person name is required'],
        trim: true,
      },
      email: {
        type: String,
        default: '',
        trim: true,
      },
      phone: {
        type: String,
        default: '',
        trim: true,
      },
      organization: {
        type: String,
        default: '',
        trim: true,
      },
    },
    status: {
      type: String,
      enum: ['Planted', 'Healthy', 'Growing', 'Needs Attention', 'Deceased'],
      default: 'Planted',
      required: true,
    },
    heightCm: {
      type: Number,
      default: 30,
      min: [0, 'Height cannot be negative'],
    },
    healthNotes: {
      type: String,
      default: '',
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
      trim: true,
    },
    lastInspectedDate: {
      type: Date,
      default: Date.now,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast searching & filtering
treeSchema.index({ commonName: 'text', treeSpecies: 'text', 'location.name': 'text' });
treeSchema.index({ status: 1 });
treeSchema.index({ 'location.city': 1 });
treeSchema.index({ plantedDate: -1 });

const Tree = mongoose.model('Tree', treeSchema);

export default Tree;
