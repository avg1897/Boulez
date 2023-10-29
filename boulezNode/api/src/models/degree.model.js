module.exports = (mongoose) => {
    let schema = mongoose.Schema(
        {
            name: String,
        },
        {}
    );

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model("Degree", schema);
};