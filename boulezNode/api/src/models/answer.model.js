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
            question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'university' },
            status: String,
            completion: String,
            accuracy: Number,
            error: String,
            rating: Number,
            response_timestamp: String
        },
        { timestamps: true }
    );

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model("Answer", schema);
};