module.exports = mongoose => {
    let schema = mongoose.Schema(
        {
            question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'university' },
            completion: String,
            accuracy: Number
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