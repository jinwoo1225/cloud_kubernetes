import socket
import os
import _thread

PORT: str = os.environ.get("PORT") or "3000"


class Server:
    def __init__(self,  port: str) -> None:
        self.socket = socket.socket()
        self.port = port
        self.hostname = socket.gethostname()
        self.socket.bind((self.hostname, int(port)))
        self.socket.listen()

    def start(self) -> None:
        self.socket.listen()
        print(f"server is listening at {self.hostname}:{self.port}")

        print('waiting...')

        self.counter = 0
        self.counter_lock = _thread.allocate_lock()
        self.thread_count = 0

        while True:
            client_socket, addr = self.socket.accept()
            print(f"connected : {addr}")
            _thread.start_new_thread(self.talk, (client_socket, addr, ))
            self.thread_count += 1

    def talk(self, client, client_addr) -> None:
        while True:
            data = client.recv(1024)
            print("-" * 35, "threads :",self.thread_count)
            print(f"client  : {client_addr}")
            if not data:
                print("finished")
                break

            print(f"Data    : {data.decode()}")
            print(f"Counter : {self.counter}")

            client.send('success'.encode())
            self.counter_lock.acquire()
            self.counter += 1
            self.counter_lock.release()
        self.thread_count -= 1
        client.close()


if __name__ == '__main__':
    s = Server(PORT)
    s.start()
