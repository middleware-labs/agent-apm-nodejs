const dgram = require('dgram');

class Socket {

    constructor (options) {
        options = options || {}
        this._host = options.host || '127.0.0.1'
        this._port = options.port || 34254
        this.socket = this.createConnection('udp4')
    }

    createConnection(type) {
        const server = dgram.createSocket(type)
        server.bind(this._port,this.host)
        server.on('error', (err) => {
            console.log(`server error:\n${err.stack}`);
            server.close();
        });
        server.on('listening', () => {
            const address = server.address();
            console.log(`server listening`,address);
        });
        return server
    }

    _send(msg) {
         this.socket.send((msg),this._port,this._host,(err)=>{
            if (err){
                console.log('err',err);
            }
            console.log(`Message sent to ${this._host}:${this._port}`)
        })
    }
}

module.exports = Socket