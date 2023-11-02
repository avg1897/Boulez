module.exports = mongoose => {
    let schema = mongoose.Schema(
        {
            university_id: String,
            username: String,
            password: String,
            token: String,
            createdAt: { type: Date, default: Date.now },
        },
        { timestamps: true }
    );

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Chat = mongoose.model("University", schema);
    return Chat;
};