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
            name: String,
            headquarter: String,
            api_link: String,
            enabled: {type: Boolean, default: true},
            username: String,
            password: String,
            courses: {type: Array, default: []},
            generalRating: {type: Number, default: 0},
            trustPercentage: {type: Number, default: 1}
        },
        { timestamps: true }
    );

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        delete object.password
        object.id = _id;
        return object;
    });

    return mongoose.model("university", schema);
};