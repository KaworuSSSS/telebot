import socket
import threading

HOST = "0.0.0.0"
PORT = 1883


def handle_client(client, address):
    print(f"[+] Cliente conectado: {address}")

    try:
        while True:
            data = client.recv(4096)

            if not data:
                break

            print(f"[{address}] Recibido: {data.hex()}")

            packet_type = data[0] >> 4

            packet_names = {
                1: "CONNECT",
                2: "CONNACK",
                3: "PUBLISH",
                4: "PUBACK",
                5: "PUBREC",
                6: "PUBREL",
                7: "PUBCOMP",
                8: "SUBSCRIBE",
                9: "SUBACK",
                10: "UNSUBSCRIBE",
                11: "UNSUBACK",
                12: "PINGREQ",
                13: "PINGRESP",
                14: "DISCONNECT",
                15: "AUTH",
            }

            name = packet_names.get(packet_type, "DESCONOCIDO")

            print(f"[{address}] MQTT: {name}")

    except Exception as e:
        print(f"[!] Error {address}: {e}")

    finally:
        client.close()
        print(f"[-] Cliente desconectado: {address}")



def start_server():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

    server.bind((HOST, PORT))
    server.listen(100)

    print("================================")
    print("     MI BROKER MQTT")
    print("================================")
    print(f"Escuchando en {HOST}:{PORT}")

    while True:
        client, address = server.accept()

        thread = threading.Thread(
            target=handle_client,
            args=(client, address),
            daemon=True
        )

        thread.start()


if __name__ == "__main__":
    start_server()

