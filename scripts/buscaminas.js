$(document).ready(function(){
	let userNames = [];
	let currentPlayer;
	document.addEventListener("contextmenu", (e) => {
		e.preventDefault();
	});

	//Constructor for player
	function Player(name){
		const username = name;
		let points = 0;
		let active = false;
		//getters
		const getName = () => username;
		const getPoints = () => points; 
		//Setter for points
		const setPoints = (value) => {
			points = value;
		};
		return {username, points, active, getName, getPoints, setPoints};
	}





	//Ejecutar una parte del codigo u otra segun el documento html en el que estemos
	if (window.location.pathname.includes('Index.html')) {
		console.log(window.location.pathname);

		$("#bJugar").on("click", (e) => {
			e.preventDefault();
			comprobar($("#iNombre").val());
			
			//console.log(currentPlayer);
			setTimeout(() =>{
				window.location.assign("web/Juego.html");
			}, 500);//window.location.assign("web/Juego.html");
			
		})

		//function to check if the name exist
		function comprobar(name){
			if (name === "" || name === null){
				alert("Introduce un nombre")
			}else{

				currentPlayer = Player(name);

				console.log(currentPlayer.getName(), currentPlayer.getPoints(), currentPlayer.active);

				enviar(currentPlayer.getName(), currentPlayer.getPoints(), currentPlayer.active);
			}
		}
		async function enviar(name, points, active) {
			objeto = {"username": name, "points": points, "active": active};
			console.log(objeto);
			const response = await fetch('http://localhost:5000/api/anadir', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(objeto)
			});
		
			const data = await response.json();
			console.log(data);
		}

		

	}
	
	// Funcionalidad para la página 2
	if (window.location.pathname.includes('Juego.html')) {
		console.log(window.location.pathname);
		console.log(window.location.href);
		console.log(window.location.hostname);
		const filas = 5; 
    	const columnas = 8;
		
		let virtualTablero = new Array(5);
		for (let i = 0; i < virtualTablero.length; i++) {
    		virtualTablero[i] = new Array(8).fill(0);
		}
		console.log(virtualTablero);
		let win = false;
		getNombres();
		crearTablero();
		generarNumeros();
		function crearTablero(){
			const tablero = document.querySelector("#tablero");
			tablero.classList = "tabla";
			//$("#tablero")
			for(let i= 0 ; i<5; i++){
				const tr = document.createElement("tr");
				tr.classList = "fila";
				for(let j= 0 ; j<8; j++){
					const td = document.createElement("td");
					td.id = "c"+i+"_"+j;
					td.classList = "celda";
					
					
					td.addEventListener("click", (element) => {
						celdaSeleccionada(element.target);
					});
					td.addEventListener("contextmenu", (e) => {
						e.preventDefault();
						banderita(e.target);
					});
					tr.appendChild(td);
				}
				tablero.appendChild(tr);
				
			}
			seleccionarMinar();
		}
		
		function banderita(celda){
			console.log("banderas");
			console.log(celda.classList.value);
			if(celda.classList.value ==="celda"){
				celda.classList = "celda bandera";
			}else if (celda.classList.value ==="celda bandera"){
				celda.classList = "celda";
			}
		}

		function seleccionarMinar(){
			//Posiciones aleatorias de 8*5 y devuelve true o false
			 
    		const numMinas = 5; 
			
			// Colocar  minas aleatoriamente
			let minasColocadas = 0;
			while (minasColocadas < numMinas) {
				let fila = Math.floor(Math.random() * filas);
				let columna = Math.floor(Math.random() * columnas);
				
				//celda = $(`#${fila}+${columna}`)
				const td = document.querySelector(`#c${fila}_${columna}`)
				console.log(td);
				if (/*td.className !== "celda mina" &&*/ virtualTablero[fila][columna] !== 10) { 
					//td.className = "celda mina";
					virtualTablero[fila][columna] = 10;
					console.log(fila, columna);
					minasColocadas++;
				}
			}
		}

		//Una vez geneadas las minas hay que poner los numeros por proximidad
		function generarNumeros(){
		
			// Recorrer el tablero para encontrar minas (valor 10)
			for (let i = 0; i < filas; i++) {
				for (let j = 0; j < columnas; j++) {
					if (virtualTablero[i][j] === 10) { 
						
						for (let x = -1; x <= 1; x++) {
							for (let y = -1; y <= 1; y++) {
								const nuevaFila = i + x;
								const nuevaColumna = j + y;
		
								// Verificamos celdas adyacentes
								if (nuevaFila >= 0 && nuevaFila < filas &&
									nuevaColumna >= 0 && nuevaColumna < columnas &&
									virtualTablero[nuevaFila][nuevaColumna] !== 10) {

									virtualTablero[nuevaFila][nuevaColumna]++; 

								}
							}
						}
					}
				}
			}
		}

		//Coge el id de la celda y comprueba que habia en esa casilla despues se pone en el html
		function celdaSeleccionada(celda){
			const id = celda.id;
			let fila = celda.id[1];
			let columna = celda.id[3];
			const selector = `#${id}`;
			$(selector).off("click");
			$(selector).off("contextmenu");
			let valor = virtualTablero[fila][columna];
			celda.classList = `celda ${valor}`;
			celda.innerText = valor; 
			console.log(valor)
			
			if (valor === 10){
				//Bloquear todo y cerrar el juego hacer post de la puntuacion¡
				alert("Has perdido");
				const celdas = document.querySelectorAll(".celda");
				console.log(celdas);
				
				//hacer un post con la puntuacion nueva
				//calcularPuntacion(); este comprueba las clases bandera bien colocadas
				//Mandar a la pagina main 

			}else if (valor === 0){
				//Descubre las celdas colindantes con valor ya que no seran minas
				ceroCelda(fila, columna);

			}
			
		}

		//Mostrar todos los ceros alrededor de uno pulsado
		function ceroCelda(fila, columna){

			for (let i = -1; i <= 1; i++) {
				for (let j = -1; j <= 1; j++) {
					let filaSuma = Number(fila)+i;
					
					let columnaSuma = Number(columna)+j; 
					console.log (filaSuma, columnaSuma);
					if ( filaSuma >= 0 && filaSuma < filas && columnaSuma >= 0 && columnaSuma < columnas) {
						const id = `#c${filaSuma}_${columnaSuma}`;
						const celda = document.querySelector(id);
						console.log(celda);
						let valor = virtualTablero[filaSuma][columnaSuma];
						celda.classList = `celda ${valor}`;
						celda.innerText = valor; 
					}
				}
			}
		}


		// Un metodo get para el array
		
		async function getNombres() {
			
			const response = await fetch('http://localhost:5000/api/cargar');
		
			const data = await response.json();
			console.log(data);
			crearRanking(data);
		}

		function crearRanking(datos){

		}

	
	}
		
});