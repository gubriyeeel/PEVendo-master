from flask import Flask, request, jsonify
import serial.tools.list_ports

# TODO: change port to the correct port

app = Flask(__name__)
serialInst = serial.Serial()
serialInst.baudrate = 9600
serialInst.port = 'COM5'

@app.route('/api', methods=['POST'])
def api():
    try:
        data = request.get_json()
        command = data['command']
        print("Backend received command: " + command)
        serialInst.write(command.encode('utf-8'))
    
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)})
    

if __name__ == '__main__':
    serialInst.open()
    app.run(debug=True)
