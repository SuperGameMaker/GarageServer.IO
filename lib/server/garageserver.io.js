var garageServerGame = require('./garageservergame');

function GarageServer (socketio, options) {
    this.io = socketio;
    this.registerSocketEvents(options);
    this.game = new garageServerGame.createGame(socketio, options);
}

GarageServer.prototype.registerSocketEvents = function (options) {
    var self = this;
    
    self.io.of('/garageserver.io').on('connection', function (socket) {
        console.log('garageserver.io:: socket ' + socket.id + ' connection');
        self.onPlayerConnect(socket, options);
        
        socket.on('disconnect', function () {
            console.log('garageserver.io:: socket ' + socket.id + ' disconnect');
            self.onPlayerDisconnect(socket, options);
        });
        
        socket.on('input', function (input) {
            console.log('garageserver.io:: socket input ' + input);
            self.onPlayerInput(socket, input, options);
        });
        
        socket.on('ping', function (data) {
            console.log('garageserver.io:: socket ping');
            self.onPing(socket, data, options);
        });
    });
};

GarageServer.prototype.onPlayerConnect = function (socket, options) {
    this.game.addPlayer(socket);
    if(options.onPlayerConnect) {
        options.onPlayerConnect(socket);
    }
};

GarageServer.prototype.onPlayerDisconnect = function (socket, options) {
    this.game.removePlayer(socket);
    socket.broadcast.emit('removePlayer', socket.id);
    if(options.onPlayerDisconnect) {
        options.onPlayerDisconnect(socket);
    }
};

GarageServer.prototype.onPlayerInput = function (socket, input, options) {
    this.game.addPlayerInput(socket, input);
    if(options.onPlayerInput) {
        options.onPlayerInput(socket, input);
    }
};

GarageServer.prototype.onPing = function(socket, data, options) {
    socket.emit('ping', data);
    if(options.onPing) {
        options.onPing(socket, data);
    }
};

exports.createGarageServer = function (io, options){
    return new GarageServer(io, options); 
};