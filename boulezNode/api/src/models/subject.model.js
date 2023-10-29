module.exports = (mongoose) => {
    let schema = mongoose.Schema(
        {
            name: String,
            degree: {type: Array, default: []}
        },
        {}
    );

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model("Subject", schema);
};