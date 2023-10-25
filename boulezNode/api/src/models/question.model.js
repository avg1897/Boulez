module.exports = (mongoose) => {
    const { v4: uuidv4 } = require('uuid');
    let schema = mongoose.Schema(
        {
            uniqueId: {
                type: String,
                required: true,
                default: () => uuidv4(7),
                index: { unique: true },
            },
            university_id: String,
            subject_id: String,
            request_id: String,
            request_timestamp: String,
            prompt: String,
            responseIds: Array,
        },
        { timestamps: true }
    );

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model("question", schema);
};