const probar = () => {
    const notificacion = new Notificacion({
        userDestinatario: null,
        tipo: "like-review",
        userOtro: null,
    });

    const usuario = new Usuario({
        username: "juan",
        email: "juan@gmail.com",
        reviews: [
            {
                media: {
                    tipo: "pelicula",
                    idMedia: "peliID",
                },
                calificacion: 2.7,
            },
        ],
    });

    usuario.save();

    notificacion.save();
};
