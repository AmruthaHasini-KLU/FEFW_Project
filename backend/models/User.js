const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Borrower', 'Lender', 'Admin'], default: 'Borrower' },
  aadharId: { type: String },
  pan: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);