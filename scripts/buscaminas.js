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
			e.preventDefault()
			console.log("me eejco");
			comprobar($("#iNombre").val());
			
			//console.log(currentPlayer);
			window.location.assign("web/Juego.html");
			
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

		//
		function obtenerNombres(){
			$.ajax({ 
				//
				url: "scripts/db.json", 
				method: "GET", 
				dataType: "json", // Convierte la respuesta a objeto JSON 
				success: function(data) { //200 o 201
				console.log(data);
				userNames = data;
				}, 
				error: function(xhr, status, error) { 
				console.log(`Error: ${xhr.status} - ${error}`); 
				} 
			});
		}
		

	}
	
	// Funcionalidad para la página 2
	if (window.location.pathname.includes('Juego.html')) {
		console.log(window.location.pathname);
		console.log(window.location.href);
		console.log(window.location.hostname);
		let win = false;
		obtenerNombres();
		function obtenerNombres(){
			$.ajax({ 
				//
				url: "../scripts/players.json", 
				method: "GET", 
				dataType: "json", // Convierte la respuesta a objeto JSON 
				success: function(data) { //200 o 201
				console.log(data);
				userNames = data;
				}, 
				error: function(xhr, status, error) { 
				console.log(`Error: ${xhr.status} - ${error}`); 
				} 
			});
		}

		// Código específico para página 2
	}
});