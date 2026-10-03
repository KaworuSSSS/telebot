🌐 Nova Browser — Chrome remoto en GitHub Codespaces

Este proyecto permite ejecutar Google Chrome dentro de un GitHub Codespace y acceder a su pantalla desde el navegador mediante Xvfb + x11vnc + noVNC.

No es necesario instalar Linux, Chrome, Node.js, VNC ni noVNC en la computadora local.

🧩 Arquitectura
Tu computadora
      │
      │ navegador
      ▼
GitHub Codespace
      │
      ├── Ubuntu
      │
      ├── Xvfb
      │     └── pantalla virtual :99
      │
      ├── Google Chrome
      │
      ├── x11vnc
      │     └── puerto 5900
      │
      └── noVNC
            └── puerto 6080
                  │
                  ▼
             Tu navegador

🚀 Configuración inicial
1. Crear un Codespace

Abre el repositorio en GitHub.

Pulsa:

Code
→ Codespaces
→ Create codespace on main


Espera a que GitHub abra VS Code en el navegador.

🐧 2. Comprobar Linux

Abre la terminal de VS Code y ejecuta:

uname -a


También:

cat /etc/os-release


El Codespace utilizado durante el desarrollo tenía Ubuntu y arquitectura x86_64.

🌐 3. Instalar Google Chrome

Ejecuta:

wget -O chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb


Después:

sudo apt install -y ./chrome.deb


Comprueba:

google-chrome --version

🖥️ 4. Instalar Xvfb

Xvfb crea una pantalla virtual para que Chrome pueda funcionar aunque el Codespace no tenga un monitor físico.

Ejecuta:

sudo apt update


Después:

sudo apt install -y xvfb


Inicia la pantalla virtual:

Xvfb :99 -screen 0 1920x1080x24 -ac &


Configura la pantalla:

export DISPLAY=:99


Comprueba:

echo $DISPLAY


Debe aparecer:

:99


Puedes comprobar Xvfb con:

pgrep -a Xvfb

🌐 5. Iniciar Chrome

Ejecuta:

export DISPLAY=:99


Después:

google-chrome \
  --no-sandbox \
  --disable-dev-shm-usage \
  --disable-gpu \
  --no-first-run \
  --no-default-browser-check \
  --user-data-dir=/tmp/nova-chrome \
  --remote-debugging-port=9222 \
  about:blank &


Puedes comprobar el puerto de depuración con:

curl http://127.0.0.1:9222/json/version


Si devuelve información de Chrome y webSocketDebuggerUrl, Chrome está funcionando.

🖱️ 6. Instalar x11vnc y noVNC

Ejecuta:

sudo apt update


Después:

sudo apt install -y x11vnc novnc


Comprueba x11vnc:

x11vnc -version


noVNC queda instalado normalmente en:

/usr/share/novnc


y su herramienta principal en:

/usr/share/novnc/utils/novnc_proxy

🔌 7. Iniciar x11vnc

Ejecuta:

x11vnc -display :99 -forever -shared -rfbport 5900 -nopw &


Esto conecta x11vnc con la pantalla virtual :99.

Puedes comprobar el puerto:

ss -ltn | grep 5900

🌐 8. Iniciar noVNC

Ejecuta:

/usr/share/novnc/utils/novnc_proxy --vnc localhost:5900 --listen 6080 &


Deberías ver:

WebSocket server settings:
  - Listen on :6080
  - Web server. Web root: /usr/share/novnc
  - proxying from :6080 to localhost:5900

🔓 9. Abrir el puerto 6080

En VS Code:

View
→ Ports


Busca el puerto:

6080


Haz clic derecho sobre él y selecciona:

Open in Browser


Se abrirá noVNC.

Si aparece un listado como:

Directory listing for /

app/
core/
include/
utils/
vendor/
vnc.html
vnc_auto.html
vnc_lite.html


haz clic en:

vnc.html


Después pulsa:

Connect


Ahora deberías poder controlar la pantalla virtual del Codespace.

🔄 Volver a abrirlo después

Cuando cierres el Codespace, los procesos anteriores pueden detenerse.

Cuando vuelvas a abrir el mismo Codespace, no necesitas reinstalar todo si los paquetes siguen instalados.

Primero comprueba Xvfb:

pgrep -a Xvfb


Si no aparece nada, inicia:

Xvfb :99 -screen 0 1920x1080x24 -ac &


Después:

export DISPLAY=:99

Iniciar Chrome
google-chrome \
  --no-sandbox \
  --disable-dev-shm-usage \
  --disable-gpu \
  --no-first-run \
  --no-default-browser-check \
  --user-data-dir=/tmp/nova-chrome \
  --remote-debugging-port=9222 \
  about:blank &

Iniciar x11vnc
x11vnc -display :99 -forever -shared -rfbport 5900 -nopw &

Iniciar noVNC
/usr/share/novnc/utils/novnc_proxy --vnc localhost:5900 --listen 6080 &


Después abre:

View → Ports


Busca:

6080


y selecciona:

Open in Browser


Finalmente:

vnc.html
→ Connect

⚡ Comprobación rápida

Si quieres comprobar rápidamente que todo está funcionando:

Xvfb
pgrep -a Xvfb

Chrome
curl http://127.0.0.1:9222/json/version

VNC
ss -ltn | grep 5900

noVNC
ss -ltn | grep 6080


Si los cuatro funcionan, el entorno está listo.

⚠️ Importante sobre seguridad

Durante las pruebas se utilizó:

-nopw


en x11vnc.

Eso significa que VNC no tiene contraseña propia.

No debes exponer directamente el puerto VNC (5900) a Internet.

La idea es acceder mediante el sistema de puertos de GitHub Codespaces y no publicar el puerto VNC directamente.

También evita compartir públicamente las URLs de acceso al Codespace.

🧪 Estado actual del proyecto

Actualmente el proyecto permite:

Ejecutar Ubuntu en GitHub Codespaces.

Ejecutar Google Chrome dentro del Codespace.

Crear una pantalla virtual con Xvfb.

Compartir la pantalla mediante x11vnc.

Controlarla desde el navegador mediante noVNC.

Próximo objetivo

Convertir este entorno en:

┌─────────────────────────────────────────┐
│              ✦ NOVA BROWSER             │
├─────────────────────────────────────────┤
│ ←   →   ⟳   🔒  [ dirección web       ]│
├─────────────────────────────────────────┤
│ + Nueva pestaña                         │
├─────────────────────────────────────────┤
│                                         │
│              Navegación                 │
│                                         │
└─────────────────────────────────────────┘


La meta es crear una interfaz propia llamada Nova Browser que controle el navegador que se ejecuta dentro del Codespace.
