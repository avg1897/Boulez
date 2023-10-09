module.exports = mongoose => {
    let schema = mongoose.Schema(
        {
            name: String,
            headquarter: String,
            api_link: String,
            enabled: {type: Boolean, default: true},
        },
        { timestamps: true }
    );

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model("university", schema);
};