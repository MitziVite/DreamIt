const mongoose = require('mongoose');

const goalSchema = mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Title is required'],
        trim: true
    },
    description: { 
        type: String,
        trim: true,
        default: ''
    },
    dueDate: { 
        type: Date,
        default: null
    },
    completed: { 
        type: Boolean, 
        default: false 
    }
}, {
    timestamps: true,
    collection: 'Goals'  // Make sure this matches the existing collection name
});

// Add more detailed logging
goalSchema.pre('find', function() {
    console.log('🔍 Querying Goals collection...');
    console.log('🔍 Query conditions:', JSON.stringify(this.getQuery()));
});

goalSchema.post('find', function(docs) {
    console.log(`📊 Found ${docs?.length || 0} goals`);
    if (docs?.length > 0) {
        console.log('📄 Sample goal:', JSON.stringify(docs[0], null, 2));
    } else {
        console.log('❌ No goals found in the collection');
    }
});

module.exports = mongoose.model('Goal', goalSchema, 'Goals');  // Explicitly set collection name