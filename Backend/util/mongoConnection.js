const mongoose = require("mongoose");

module.exports = async () => {
	const uri = process.env.MONGODB_URI || process.env.DB || process.env.MONGODB_CONNECTION_STRING;
	if (!uri) {
		console.warn("⚠️ Warning: No MongoDB URI provided in environment variables (MONGODB_URI, DB, or MONGODB_CONNECTION_STRING).");
		return;
	}
	try {
		await mongoose.connect(uri);
		console.log("Connected to database successfully");
	} catch (error) {
		console.error("Could not connect to MongoDB:", error.message);
	}
};