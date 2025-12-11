from flask import Flask, render_template, request, jsonify
from entities.winner import Winner

app = Flask(__name__)

# Esta será la ruta index (de la página principal)
@app.route('/')
def index():
    return render_template('index.html')

# Ruta para guardar un ganador, ahora recibe también los intentos
@app.route('/winner', methods=['POST'])
def save_winner():
    try:
        data = request.get_json()
        print("Datos recibidos:", data)

        # Se agrega el campo 'attempts' extraído del JSON enviado por el frontend
        winner = Winner(
            id=0,
            name=data['name'],
            email=data['email'],
            phrase=data['phrase'],
            attempts=data.get('attempts', 0)
        )

        result = winner.save()
        print("Resultado del save:", result)

        if result != 0:
            return jsonify({"success": True, "id": result}), 201
        else:
            return jsonify({"success": False}), 500

    except Exception as e:
        print("error:", e)
        return jsonify({"success": False, "error": str(e)}), 500

# Ruta para obtener la lista de ganadores 
@app.route('/winners', methods=['GET'])
def get_winners():
    return render_template('winners.html', winners = Winner.get_all())

# Nueva ruta para eliminar un ganador por ID
@app.route('/winner/delete/<int:id>', methods=['POST'])
def delete_winner(id):
    try:
        success = Winner.delete(id)
        if success:
            return jsonify({"success": True}), 200
        else:
            return jsonify({"success": False, "message": "No se encontró el registro"}), 404
    except Exception as e:
        print("error:", e)
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)