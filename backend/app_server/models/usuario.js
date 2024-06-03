const mongoose = require("mongoose");
const mediaSchema = require("./mediaSchema");

const Schema = mongoose.Schema;

const comentarioSchema = new Schema({
	// --------
	comentario: {
		type: String,
		default: "",
	},
	// --------
	usuario: {
		type: "ObjectId",
		ref: "User",
	},
	likes: [
		{
			type: "ObjectId",
			ref: "User",
		},
	],
	fecha: {
		type: Date,
		default: Date.now,
	},
});

const reviewSchema = new Schema({
	media: {
		type: mediaSchema,
		required: true,
	},
	descripcion: {
		type: String,
		default: "",
	},
	calificacion: {
		type: Number,
		default: 0,
		min: 0,
		max: 5,
		get: (v) => {
			const base = Math.trunc(v);
			const resto = v - base;
			if (resto >= 0.5) return base + 0.5;
			else return base;
			//Math.round(v);
		},
		set: (v) => {
			const base = Math.trunc(v);
			const resto = v - base;
			if (resto >= 0.5) return base + 0.5;
			else return base;
			//Math.round(v);
		},
	},
	fecha: {
		type: Date,
		default: Date.now,
	},
	likes: [
		{
			type: "ObjectId",
			ref: "User",
		},
	],
	mediaRecuerda: [mediaSchema],
	comentarios: [comentarioSchema],
});

const mediaRecordarScheme = new Schema({
	media: {
		type: mediaSchema,
		required: true,
	},
	fecha: {
		type: Date,
		default: Date.now,
	},
});

const notificacionSchema = new Schema({
	tipo: {
		type: String,
		enum: {
			values: [
				"like-review",
				"like-comentario",
				"nuevo-seguidor",
				"comentario-review",
			],
			message: "{VALUE} no es un tipo de notificacion",
		},
		required: true,
	},
	userOtro: {
		type: "ObjectId",
		ref: "User",
	},
});

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
	},
	loginCon: {
		type: String,
		enum: {
			values: [
				"correo",
				"google",
				"github",
			],
			message: "{VALUE} no es un tipo de login",
		},
		required: true,
	},
	descripcion: {
		type: String,
		default: "",
	},
	imagen: String,
	fechaNacimiento: {
		type: Date,
		default: Date.now,
	},
	reviews: [reviewSchema],
	seguidores: [
		{
			type: "ObjectId",
			ref: "User",
		},
	],
	seguidos: [
		{
			type: "ObjectId",
			ref: "User",
		},
	],
	masTarde: [mediaRecordarScheme],
	notificaciones: [notificacionSchema],
	baneado: {
		type: Boolean,
		default: false,
	},
	fechaCreacion: {
		type: Date,
		default: Date.now,
	},
	admin: {
		type: Boolean,
		default: false,
	},
});

const usuarioModelo = mongoose.model("User", userSchema);

module.exports = usuarioModelo;
