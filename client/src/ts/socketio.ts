import io from 'socket.io-client';

export class SocketIO {
    socket: any;
    url: string = '';

    constructor(url: string) {
        this.url = url;
    }

    connect() {
        this.socket = io(this.url)
        this.socket.on('connect', () => console.log('connect ' + this.socket.id));
    }

    emit(eventname: string, data: any) {
        this.socket.emit(eventname, data)
    }

    receive(eventname: string, callback: Function) {
        this.socket.on(eventname, callback)
    }
}