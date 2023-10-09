module.exports = mongoose => {
    let schema = mongoose.Schema(
        {
            university_id: String,
            request_id: String,
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