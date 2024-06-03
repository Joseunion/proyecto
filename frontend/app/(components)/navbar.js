import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Stack from "react-bootstrap/Stack";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Form from "react-bootstrap/Form";
import { Modal, ListGroup } from "react-bootstrap";

const FinalNavbar = ({ isLogged, username, notificaciones, isAdmin }) => {
    const router = useRouter();
    const session = useSession();
    if (isLogged == true)
        return (
            <>
                <Nav className="d-block d-lg-none">
                    <Link
                        className="text-decoration-none"
                        href={ "/perfil/" + session.data.user.id}
                        passHref
                    >
                        <Nav.Link as="a">Perfil</Nav.Link>
                    </Link>
                    <Link
                        className="text-decoration-none"
                        href="/paramastarde"
                        passHref
                    >
                        <Nav.Link as="a">Para + tarde</Nav.Link>
                    </Link>
                    {isAdmin && (
                        <Link
                            className="text-decoration-none"
                            href="/admin"
                            passHref
                        >
                            <Nav.Link as="a">Admin</Nav.Link>
                        </Link>
                    )}
                    <hr className="text-white" />
                    <p className="text-dark-emphasis">Conectado como: <span className="text-primary-emphasis">{username}</span></p>
                    <Nav.Link
                        as="a"
                        onClick={() => {
                            signOut();
                            router.refresh();
                        }}
                        className="px-2 text-center rounded bg-primary text-white"
                    >
                        Cerrar sesión
                    </Nav.Link>
                </Nav>
                <Stack
                    className="d-none d-lg-flex"
                    direction="horizontal"
                    gap={3}
                >
                    <Dropdown
                        drop="down-centered"
                        data-bs-theme="light"
                        bg="light"
                    >
                        <Dropdown.Toggle variant="light" id="dropdown-basic">
                            <i className="fa-solid fa-bell"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                        {notificaciones.length === 0 ? (
                            <Dropdown.ItemText>No hay notificaciones</Dropdown.ItemText>
                        ) : (
                            notificaciones.slice(-5).reverse().map((n) => {
                                switch (n.tipo) {
                                    case "like-review":
                                        return (
                                            <Dropdown.ItemText key={n.id}>
                                                A{" "}
                                                <Link
                                                    className="text-decoration-none"
                                                    href={"/perfil/" + n.userOtro.id}
                                                    passHref
                                                >
                                                    <span className="text-primary">
                                                        @{n.userOtro.username}
                                                    </span>{" "}
                                                </Link>
                                                le ha gustado tu review
                                            </Dropdown.ItemText>
                                        );
                                    case "comentario-review":
                                        return (
                                            <Dropdown.ItemText key={n.id}>
                                                <Link
                                                    className="text-decoration-none"
                                                    href={"/perfil/" + n.userOtro.id}
                                                    passHref
                                                >
                                                    <span className="text-primary">
                                                        @{n.userOtro.username}
                                                    </span>{" "}
                                                </Link>
                                                ha comentado en tu review
                                            </Dropdown.ItemText>
                                        );
                                    case "like-comentario":
                                        return (
                                            <Dropdown.ItemText key={n.id}>
                                                A{" "}
                                                <Link
                                                    className="text-decoration-none"
                                                    href={"/perfil/" + n.userOtro.id}
                                                    passHref
                                                >
                                                    <span className="text-primary">
                                                        @{n.userOtro.username}
                                                    </span>{" "}
                                                </Link>
                                                le ha gustado tu comentario
                                            </Dropdown.ItemText>
                                        );
                                    case "nuevo-seguidor":
                                        return (
                                            <Dropdown.ItemText key={n.id}>
                                                <Link
                                                    className="text-decoration-none"
                                                    href={"/perfil/" + n.userOtro.id}
                                                    passHref
                                                >
                                                    <span className="text-primary">
                                                        @{n.userOtro.username}
                                                    </span>{" "}
                                                </Link>
                                                te ha comenzado a seguir
                                            </Dropdown.ItemText>
                                        );
                                    default:
                                        return null;
                                }
                            })
                        )}

                            {/*
                            <Dropdown.Divider />
                            <Dropdown.ItemText>
                                A <span className="text-primary">@Paco</span> le
                                ha gustado tu comentario
                            </Dropdown.ItemText> */}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown data-bs-theme="light" bg="light">
                        <Dropdown.Toggle variant="light" id="dropdown-basic">
                            {username}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Link
                                className="text-decoration-none"
                                href={ "/perfil/" + session.data.user.id}
                                passHref
                            >
                                <Dropdown.Item as="a">Perfil</Dropdown.Item>
                            </Link>
                            <Link
                                className="text-decoration-none"
                                href="/paramastarde"
                                passHref
                            >
                                <Dropdown.Item as="a">
                                    Para + tarde
                                </Dropdown.Item>
                            </Link>

                            {isAdmin && (
                                <Link
                                    className="text-decoration-none"
                                    href="/admin"
                                    passHref
                                >
                                    <Dropdown.Item as="a">Admin</Dropdown.Item>
                                </Link>
                            )}

                            <Dropdown.Item
                                as="button"
                                className="bg-primary text-white"
                                onClick={() => {
                                    signOut();
                                    router.refresh();
                                }}
                            >
                                Cerrar sesión
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Stack>
            </>
        );
    else
        return (
            <Link href={"/login"} className="btn btn-light">
                Iniciar sesión / Registrarse
            </Link>
        );
};

export default function CustomNavbar() {
    const [notificaciones, setNotificaciones] = useState([]);
    const [perfiles, setPerfiles] = useState([])
    const [show, setShow] = useState(false);
    const [noResultado, setNoResultado] = useState(false)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const session = useSession();

    const handleSearchPerfil = (e) => {
        e.preventDefault();
        const perfil = e.target.FormPerfil.value;
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "api/users/buscar/usuario?nombreUsuario=" + perfil,
                {
                    method: "GET",
                }
            )
                .then((data) => data.json())
                .then((json) => {
                    if (json.length == 0) setNoResultado(true)
                    else setNoResultado(false)
                    setPerfiles(json)
                })
            .catch((error) => {
                console.error("Error al buscar perfiles:", error);
            });
    };

    useEffect(() => {
        const getNotificaciones = async () => {
            if (session.status === "authenticated") {
                const resLogin = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${session.data.user.id}/notificaciones`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${session.data.user.token}`,
                        },
                    }
                );
                setNotificaciones((await resLogin.json()).notificaciones);
            }
        };

        getNotificaciones();
    }, [session]);

    if (session.status !== "loading") {
        const isLogged = session.data?.user != undefined;
        return (
            <>
            <Navbar bg="dark" data-bs-theme="dark" collapseOnSelect expand="lg">
                <Container
                //className="text-center"
                >
                    <Link className="text-decoration-none" href="/" passHref>
                        <Navbar.Brand>RemindsMeOf</Navbar.Brand>
                    </Link>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Link
                                className="text-decoration-none"
                                href="/"
                                passHref
                            >
                                <Nav.Link as="a">Inicio</Nav.Link>
                            </Link>
                            <Link
                                className="text-decoration-none"
                                href="/peliculas"
                                passHref
                            >
                                <Nav.Link as="a">Películas</Nav.Link>
                            </Link>
                            <Link
                                className="text-decoration-none"
                                href="/juegos"
                                passHref
                            >
                                <Nav.Link as="a">Juegos</Nav.Link>
                            </Link>
                            <Link
                                className="text-decoration-none"
                                href="/musica"
                                passHref
                            >
                                <Nav.Link as="a">Música</Nav.Link>
                            </Link>
                            <Link
                                className="text-decoration-none"
                                href="/libros"
                                passHref
                            >
                                <Nav.Link as="a">Libros</Nav.Link>
                            </Link>
                            <Link 
                                className="text-decoration-none"
                                href={"#"}
                                onClick={() => setShow(true)}
                            >
                                <Nav.Link>Buscar perfil</Nav.Link>
                            </Link>
                        </Nav>
                        {!isLogged && <hr className="text-white md-d-none" />}
                        <Nav>
                            <FinalNavbar
                                username={session.data?.user.name}
                                isLogged={isLogged}
                                notificaciones={notificaciones}
                                isAdmin={session.data?.user.admin}
                            />
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Modal centered show={show} onHide={handleClose} >
                <Modal.Header closeButton>
                    <Modal.Title>Buscar perfil</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSearchPerfil}>
                        <div className="pt-1 w-full d-flex flex-column flex-sm-row gap-2 gap-sm-3 pb-3">
                            <div className="flex-fill">
                                <Form.Control
                                    id="FormPerfil"
                                    placeholder="Buscar por nombre de usuario"
                                />
                            </div>
                            <div className="d-grid gap-2">
                                <Button type="submit">Buscar</Button>
                            </div>
                        </div>
                    </Form>
                    
                            <ListGroup>
                                {perfiles.map((p, index) => (
                                    <ListGroup.Item key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{ marginRight: '20px' }}>
                                                <div style={{ overflow: 'hidden', width: '50px', height: '50px', borderRadius: '50%' }}>
                                                    <img src={p.imagen ? p.imagen : 'https://w7.pngwing.com/pngs/1000/665/png-transparent-computer-icons-profile-s-free-angle-sphere-profile-cliparts-free.png'} alt="Imagen de perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                            </div>
                                            <div>
                                                <Link
                                                    className="text-decoration-none"
                                                    href={"/perfil/" + p.id}
                                                    passHref
                                                >
                                                    <span className="text-primary">@{p.username}</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>

                            {noResultado && <p className="text-center ml-2">No se ha encontrado a ningún usuario con ese nombre</p>}
                        
                </Modal.Body>
            </Modal>
    </>
        );
    }
}
