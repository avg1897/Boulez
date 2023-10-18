module.exports = mongoose => {
    let schema = mongoose.Schema(
        {
            university_id: String,
            prompt: String,
            boulezAnswer: { type: Object, default: {} },
            accepted: { type: Boolean, default: true }
        },
        { timestamps: true }
    );

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Chat = mongoose.model("chats", schema);
    return Chat;
};