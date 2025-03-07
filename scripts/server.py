from flask import Flask, request, jsonify
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

#ruta a json
JSON_RUTA = "db.json"

@app.route('/api/anadir', methods=['POST'])
def añadir():
    data = request.get_json()
    print(data)
    #Lo que vayamos a usar
    escribir(data)
    # Devolvemos el objeto con notacion javascript  
    array = darInfo()
    return  jsonify(array) #A devolver

@app.get('/api/cargar')
def cargar():
    return jsonify(darInfo())


def darInfo():
    try:
        read_jugadores = open(JSON_RUTA, "r")
        read =read_jugadores.read()
        read_jugadores.close()
        array_diccionario = json.loads(read)
        return array_diccionario
    except (FileNotFoundError, json.JSONDecodeError):
        # Si el archivo no existe, crearlo con una estructura vacía
        with open(JSON_RUTA, "w") as new_file:
            json.dump([], new_file, indent=4)  # Inicializa como lista vacía
        return []
    
    
    

def escribir(nuevo_objeto):
    # open ruta a JSON
    # Preceso para cargar datos en una variabke como diccionario en python
    array = darInfo()
    # Hacemos modificaciones
    array = comprobaciones(array, nuevo_objeto)
    # Abrimos el archivo para guardar las modificaciones
    sobreescribir = open(JSON_RUTA, "w")
    json.dump(array, sobreescribir, indent=4)
    sobreescribir.close()

def comprobaciones(array, objeto):
    # Variable para comprobar si se cumplio la condicion
    existe = False
    # Jugador activo
    objeto["active"] = True
    for diccionario in array:
        diccionario["active"] = False
        if diccionario["username"] == objeto["username"]:
            diccionario["active"] = True
            existe = True
    if (not existe):
        array.append(objeto)
    return array




        
    

if __name__ == '__main__':
    app.run(debug=True, port=5000)
