
const hostname = process.env.CONTAINER_NAME_MONGO || "boulez_node_db"
const port = process.env.PORT || 27017
const user = process.env.MONGODB_USERNAME || ""
const pass = process.env.MONGODB_PASSWORD || ""
const dbName = process.env.MONGODB_DB_NAME || "db"

module.exports = {
    url: `mongodb://${user}:${pass}@${hostname}:${port}/${dbName}`
};