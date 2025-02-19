from flask import Flask, request, jsonify
import json

app = Flask(__name__)

#ruta a json
JSON_RUTA = "db.json"

@app.route('/api/añadir', methods=['POST'])
def añadir():
    data = request.get_json()
    #Lo que vayamos a usar
    escribir(data)
    # Devolvemos el objeto con notacion javascript  
    array = darInfo()
    return array #A devolver

def darInfo():
    #Extraigo el fragmento de codigo que permite modicar en python
    # Devolvemos el objeto con notacion javascript  
    read_jugadores = open(JSON_RUTA, "r")
    read =read_jugadores.read()
    read_jugadores.close()
    array_diccionario = json.loads(read)
    return array_diccionario

def escribir(nuevo_objeto):
    # open ruta a JSON
    # Preceso para cargar datos en una variabke como diccionario en python
    array = darInfo()
    # Hacemos modificaciones
    array = comprobaciones(array, nuevo_objeto)
    # Abrimos el archivo para guardar las modificaciones
    stringify = json.dump(array, indent=4)
    sobreescribir = open(JSON_RUTA, "w")
    sobreescribir.write(stringify)
    sobreescribir.close()

def comprobaciones(array, objeto):
    # Variable para comprobar si se cumplio la condicion
    existe = False
    # Jugador activo
    objeto.active = True
    for diccionario in array:
        if (diccionario.name == objeto.name):
            diccionario.points = 0
            existe = True
    if (not existe):
        array.append(objeto)
    return array



        
    

if __name__ == '__main__':
    app.run(debug=True, port=5000)
