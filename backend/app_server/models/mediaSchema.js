const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const mediaSchema = new Schema({
    tipo: {
        type: String,
        enum: {
            values: ["pelicula", "videojuego", "musica", "libro"],
            message: "{VALUE} no es un tipo de media",
        },
        required: true,
    },
    idMedia: {
        type: String,
        required: true,
    },
});

module.exports = mediaSchema;
