import { Stack } from "react-bootstrap";

export default function Estrellas({ calificacion }) {
	if (calificacion == undefined) return;
	let numEstrellasCompleta = Math.trunc(calificacion);
	let mediaEstrella;
	if (numEstrellasCompleta == 0) {
		mediaEstrella = calificacion % 1 >= 0.25 && calificacion % 1 <= 0.75;
		if (calificacion % 1 > 0.75) numEstrellasCompleta++;
	} else {
		mediaEstrella =
			calificacion % numEstrellasCompleta >= 0.25 &&
			calificacion % numEstrellasCompleta <= 0.75;
		if (calificacion % numEstrellasCompleta > 0.75) numEstrellasCompleta++;
	}

	let numEstrellasVacio = 5 - numEstrellasCompleta;
	if (mediaEstrella) numEstrellasVacio = numEstrellasVacio - 1;
	return (
		<Stack
			className="justify-content-center fs-4 text-primary"
			direction="horizontal"
			gap={1}
		>
			{[...Array(numEstrellasCompleta)].map((e, i) => (
				<i key={i} className="fa-solid fa-star text-primary"></i>
			))}
			{mediaEstrella && (
				<i className="fa-solid fa-star-half-stroke text-primary"></i>
			)}
			{[...Array(numEstrellasVacio)].map((e, i) => (
				<i key={i} className="fa-regular fa-star text-primary"></i>
			))}
		</Stack>
	);
}
