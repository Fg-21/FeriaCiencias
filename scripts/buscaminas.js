$(document).ready(function(){
	let userNames = [];
	let currentPlayer;


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
			//window.location.assign("web/Juego.html");
			
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
		let win = false;
		//obtenerNombres();
		crearTablero()
		function crearTablero(){
			const tablero = document.querySelector("#tablero");
			tablero.classList = "tabla";
			//$("#tablero")
			for(let i= 0 ; i<5; i++){
				const tr = document.createElement("tr");
				tr.classList = "fila";
				for(let j= 0 ; j<8; j++){
					const td = document.createElement("td");
					td.id = i+"+"+j;
					td.classList = "celda";
					//seleccionarMinar(td);
					
					td.addEventListener("click", (element) => {
						celdaSeleccionada(element);
					});
					tr.appendChild(td);
				}
				
				tablero.appendChild(tr);
			}
		}


		function seleccionarMinar(){
			//Posiciones aleatorias de 8*5 y devuelve true o false 
		}


		//Una vez geneadas las minas hay que poner los numeros por proximidad
		function generarNumeros(){

		}

		//Coge el id de la celda y comprueba que habia en esa casilla despues se pone en el html
		function celdaSeleccionada(celda){
			//Con un queryselector del id
			
		}


		// Un metodo get para el array
		function obtenerNombres(){
			
		}

		// Código específico para página 2
	}
});