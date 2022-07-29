const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@nodejs.3l6dj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

module.exports = uri;
