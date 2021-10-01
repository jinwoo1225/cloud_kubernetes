from datetime import time
import socket
import os

HOST = os.environ.get("HOST") or socket.gethostname()
PORT = os.environ.get("PORT") or "3000"


class Client:
    def __init__(self, host, port) -> None:
        self.host = host
        self.port = port
        self.socket = socket.socket()
        self.socket.connect(
            (
                self.host,
                int(self.port)
            )
        )

    def send(self, data: str) -> None:
        print("-" * 40)
        print(f"connected : {HOST}:{PORT}")
        print(f"sending   : {data}")
        self.socket.send(data.encode())
        received = self.socket.recv(1024)

        if received.decode() == 'success':
            print("result    : success")


if __name__ == '__main__':
    import time
    import datetime as dt
    c = Client(HOST, PORT)

    while True:
        c.send(str(dt.datetime.now()))
        time.sleep(5)
