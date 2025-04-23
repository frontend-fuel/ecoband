const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    greenScore: {
        type: Number,
        default: 0
    },
    streak: {
        type: Number,
        default: 0
    },
    streakStartDate: {
        type: Date,
        default: Date.now
    },
    lastActivityDate: {
        type: Date,
        default: Date.now
    },
    activityHistory: [{
        date: Date,
        score: Number,
        activities: [String]
    }]
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update streak
userSchema.methods.updateStreak = function() {
    const today = new Date();
    const lastActivity = this.lastActivityDate;
    
    // Reset streak if more than a day has passed
    if ((today - lastActivity) > (24 * 60 * 60 * 1000)) {
        this.streak = 1;
        this.streakStartDate = today;
    } else {
        this.streak += 1;
    }
    
    this.lastActivityDate = today;
};

module.exports = mongoose.model('User', userSchema);
