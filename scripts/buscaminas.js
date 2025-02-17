let userNames = [];
let currentPlayer;

$("#bJugar").on("click", () => {
	comprobar($("iNombre").val());
})
obtenerNombres();


function envioNombre(objeto_js) {
	$.ajax({
	    url: "../JSON/players.json",
	    method: "POST",
	    data: JSON.stringify(objeto_js),
	    contentType: "application/json", // Especifica el tipo de contenido
	    dataType: "json", // La respuesta será interpretada como JSON
	    success: function(response) {
	        console.log(response);

	    },
	    error: function(xhr, status, error) {
	        console.log(`Error: ${xhr.status} - ${error}`);
	    }
	});
}

function obtenerNombres(){
	$.ajax({ 
		//
		url: "../JSON/players.json", 
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

//Constructor for player
function Player(name){
	const username = name;
	let points = 0;
	const getName = () => username;
	const getPoints = () => points; 	
}
//Setter for points
Object.defineProperty(Player, "add", {
  set : function (value) {this.points += value;}
});



//function create to check if the name exist
function comprobar(name){
	userNames.forEach((item, index, arr)=>{
		if(item.name === name){
			currentPlayer = item;
		}else{
			currentPlayer = new Player(name);
		}
	})
}