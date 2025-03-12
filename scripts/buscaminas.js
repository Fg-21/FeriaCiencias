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
		window.location.assign("web/Juego.html");
		
	}



	//Ejecutar una parte del codigo u otra segun el documento html en el que estemos
	if (window.location.pathname.includes('Index.html')) {
		console.log(window.location.pathname);
		$("#iNombre").on('keyup', function (e) {
			var keycode = e.keyCode || e.which;
			  if (keycode == 13) {
				e.preventDefault();
				comprobar($("#iNombre").val());
			  }
		  });
		$("#bJugar").on("click", (e) => {
			e.preventDefault();
			comprobar($("#iNombre").val());
			
			//console.log(currentPlayer);
			//window.location.assign("web/Juego.html");
			
		})

	

		

	}
	


	// Funcionalidad para la página 2
	if (window.location.pathname.includes('Juego.html')) {
		console.log(window.location.pathname);
		console.log(window.location.href);
		console.log(window.location.hostname);
		const filas = 5; 
    	const columnas = 8;
		let datosRanking;
		let timer;
		let minutes = 0;
		let seconds = 0;
		let descubiertasCont = 0;
		let virtualTablero = new Array(5);
		for (let i = 0; i < virtualTablero.length; i++) {
    		virtualTablero[i] = new Array(8).fill(0);
		}
		$("#botonVolver").hide();
		console.log(virtualTablero);
		let end = false;
		getNombres();
		crearTablero();
		generarNumeros();
		startTimer();
		function auxClick(element)  {
			celdaSeleccionada(element.target);
		}


		function auxDroite(e) {
			e.preventDefault();
			banderita(e.target);
		}

		function volver(){
			$("#botonVolver").show();
			$("#botonVolver").on("click", () =>{
				enviarPuntos(currentPlayer.username, currentPlayer.points, currentPlayer.active);
				
			});
		}
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
					
					
					td.addEventListener("click", auxClick);
					td.addEventListener("contextmenu", auxDroite);

					tr.appendChild(td);
				}
				tablero.appendChild(tr);
				
			}
			seleccionarMinar();
		}
		
		function banderita(celda){
			console.log("banderas");
			celda.innerHTML = ""; 
					
			console.log(celda.classList.value);
			if(celda.classList.value === "celda"){
				celda.classList.value = "celda bandera";
				const imagen = document.createElement("img");
       			imagen.src = "../img/bandera.png"; 
        		imagen.alt = "Bandera"; 
        		imagen.style.width = "20px"; 
        		imagen.style.height = "20px";
        		celda.appendChild(imagen);
			}else if (celda.classList.value ==="celda bandera"){
				celda.classList.value = "celda";
				
			}
			
		}

		function seleccionarMinar(){
			//Posiciones aleatorias de 8*5 y devuelve true o false
			 
    		const numMinas = 6; 
			
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
			
			//const id = celda.id;
			let fila = celda.id[1];
			let columna = celda.id[3];
			//const selector = `#${id}`;
			celda.removeEventListener("click", auxClick);
			celda.removeEventListener("contextmenu", auxDroite);
			let valor = virtualTablero[fila][columna];
			celda.classList = `celda ${valor} descubierta`;
			celda.style.backgroundColor = "#4080bf";
			if (valor === 10){
				celda.innerHTML = "";
				const imagen = document.createElement("img");
				celda.innerHTML = ""; 
				imagen.src= "../img/mina.png";
				console.log(imagen, celda);
				imagen.style.width = "25px"; 
				imagen.style.height = "25px";
				celda.appendChild(imagen);
			}else if(valor === 0){
				celda.innerText = ""; 
			}else{
				celda.innerText = valor;
			}
			
			descubiertasCont++;
			
			if(!end){
				if (valor === 10){
					//Bloquear todo y cerrar el juego hacer post de la puntuacion¡
					end = true;
					
					stopTimer();
					
					let puntos = calcularPuntacion();
					//alert("Has perdido");
					const puntuacion = document.querySelector("#puntos");
					puntuacion.innerHTML = puntos;
					mensajeFinal("Has Perdido");
					currentPlayer.points = puntos;// y hacer POST
					console.log(currentPlayer);
					//añadirlo en local, despuesse hara el push
						
					datosRanking.slice(datosRanking.findIndex(per => per.username === currentPlayer.name),1,currentPlayer);
					crearRanking(datosRanking);
					volver();
					//Vamo a bloquear todas las casillas
					const celdas = document.querySelectorAll(".celda");
					celdas.forEach(element => {
						
						celdaSeleccionada(element);
					});
					//hacer un post con la puntuacion nuevo
					
					
					//Mandar a la pagina main 
					
				}else if (valor === 0){
					//Descubre las celdas colindantes con valor ya que no seran minas
					ceroCelda(fila, columna);
					
				}
				
			}
			if(descubiertasCont >= 34 && !end){
				let puntos = calcularPuntacion()+100;
				end = true;
				const puntuacion = document.querySelector("#puntos");
				puntuacion.innerHTML = puntos;
				currentPlayer.points = puntos;
				stopTimer();
				mensajeFinal("Has Ganado");
				volver();
			}
		}

		//Mostrar todos los ceros alrededor de uno pulsado
		function ceroCelda(fila, columna){

			for (let i = -1; i <= 1; i++) {
				for (let j = -1; j <= 1; j++) {
					let filaSuma = Number(fila)+i;
					
					let columnaSuma = Number(columna)+j; 
					
					if ( filaSuma >= 0 && filaSuma < filas && columnaSuma >= 0 && columnaSuma < columnas) {
						const id = `#c${filaSuma}_${columnaSuma}`;
						const celda = document.querySelector(id);
						
						if (!celda.classList.contains("descubierta")){
							celdaSeleccionada(celda);
						}
						
					}
				}
			}
		}
		function mensajeFinal(txt){
			mensaje = document.querySelector("#tMensaje");
			mensaje.innerText = txt;
		}
		function calcularPuntacion(){
			let nuevaPuntuacion = 0;			

			seconds += minutes*60;
			nuevaPuntuacion -= (seconds/10)*5;
		
			nuevaPuntuacion += (descubiertasCont)*2;
			console.log(nuevaPuntuacion);
			if(nuevaPuntuacion<0){
				nuevaPuntuacion = 0;
			}
			return parseInt(nuevaPuntuacion);
		}

		function startTimer() {
			timer = setInterval(updateTimer, 1000);
		}

		function stopTimer() {
			console.log("stop");		
			clearInterval(timer);
			console.log(seconds, minutes);
		}

		function updateTimer() {
			seconds++;
			if (seconds === 60) {
				seconds = 0;
				minutes++;
			}
			updateDisplay();
		}

		function updateDisplay() {
			const display = document.querySelector("#dTiempo");
			display.textContent = `${menorDiez(minutes)}:${menorDiez(seconds)}`;
		}

		function menorDiez(value) {
			return value < 10 ? `0${value}` : value;
		}
		
		async function enviarPuntos(name, points, active) {
			objeto = {"username": name, "points": points, "active": active};
			console.log(objeto);
			const response = await fetch('http://localhost:5000/api/anadir', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(objeto)
			});
		
			const data = await response.json();
			window.location.assign("../Index.html");	
			console.log(data);
		}
		

		// Un metodo get para el array
		
		async function getNombres() {
			
			const response = await fetch('http://localhost:5000/api/cargar');
		
			const data = await response.json();
			console.log(data);
			crearRanking(data);
			datosRanking = data
		}

		function crearRanking(datos){
			let datosOrdenados;
			datosOrdenados = datos.sort((a, b) => b.points - a.points);
			const table = document.querySelector("#tableroHS");
			table.innerHTML = "";
			datosOrdenados.forEach((item, index) => {
				if(item.active){
					currentPlayer = item;
				}
				if (index < 5){
					const tr = document.createElement("tr");
					tr.className = "filaleaderboard";
					
					const rankCell = document.createElement("td");
					rankCell.textContent = index + 1;
					rankCell.className = "celdaleaderboard";
					tr.appendChild(rankCell);

				
					const usernameCell = document.createElement("td");
					usernameCell.textContent = item.username;
					usernameCell.className = "celdaleaderboard";
					tr.appendChild(usernameCell);

					
					const pointsCell = document.createElement("td");
					pointsCell.textContent = item.points;
					tr.appendChild(pointsCell);
					pointsCell.className = "celdaleaderboard";
					
					table.appendChild(tr);
				}
				//Elegir el current player
				
            });
		}

	
	}
		
});