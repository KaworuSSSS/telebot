# 🖥️ Telegram Remote Terminal para GitHub Codespaces

Sistema para controlar remotamente una terminal Linux de **GitHub Codespaces** utilizando un bot de **Telegram** y Python.

La arquitectura es:

```text
┌─────────────────────┐
│      TELEGRAM       │
│                     │
│  /pwd               │
│  /ls                │
│  /git status        │
│  /python3 --version │
└──────────┬──────────┘
           │
           │ HTTPS / Telegram Bot API
           ▼
┌─────────────────────┐
│     PYTHON BOT      │
│                     │
│ python-telegram-bot │
└──────────┬──────────┘
           │
           │ subprocess
           ▼
┌─────────────────────┐
│  LINUX CODESPACE    │
│                     │
│ /workspaces/telebot │
│                     │
│ bash / Linux        │
└─────────────────────┘
```

---

## 📋 Descripción

Este proyecto convierte un **GitHub Codespace** en una terminal Linux controlable remotamente desde Telegram.

En lugar de utilizar servicios como:

* Tmate
* Upterm
* SSH público
* Port forwarding

el sistema utiliza la conexión saliente del bot hacia Telegram.

Esto tiene una ventaja importante:

> No es necesario abrir un puerto entrante en el Codespace.

El flujo es:

```text
Telegram
   ↓
Telegram Bot API
   ↓
Python
   ↓
subprocess
   ↓
Linux Shell
   ↓
GitHub Codespace
```

---

# 🚀 1. Requisitos

Necesitamos:

* GitHub
* GitHub Codespaces
* Telegram
* Python 3
* Internet
* Una cuenta de Telegram
* Un bot creado mediante BotFather

---

# 🤖 2. Crear el Bot de Telegram

En Telegram buscar:

```text
@BotFather
```

Abrir la conversación y ejecutar:

```text
/newbot
```

BotFather solicitará:

### Nombre del bot

Por ejemplo:

```text
Codespace Terminal
```

Después solicitará el username.

Debe terminar en:

```text
bot
```

Por ejemplo:

```text
KaworuTerminalBot
```

BotFather entregará un TOKEN similar a:

```text
1234567890:AAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### ⚠️ IMPORTANTE

El TOKEN es privado.

No debe:

* subirlo a GitHub
* colocarlo directamente dentro del código
* publicarlo en README
* compartirlo públicamente

---

# 📁 3. Crear el proyecto

Dentro del Codespace:

```bash
mkdir -p /workspaces/telebot
cd /workspaces/telebot
```

Comprobar ubicación:

```bash
pwd
```

Debe mostrar algo parecido a:

```text
/workspaces/telebot
```

---

# 🐍 4. Crear entorno virtual

Ejecutar:

```bash
python3 -m venv venv
```

Activarlo:

```bash
source venv/bin/activate
```

El terminal deberá mostrar algo parecido a:

```text
(venv) user@codespace:/workspaces/telebot$
```

---

# 📦 5. Instalar python-telegram-bot

Ejecutar:

```bash
pip install python-telegram-bot
```

También podemos comprobar:

```bash
pip show python-telegram-bot
```

---

# 🔐 6. Configurar el TOKEN

No debemos escribir el TOKEN dentro de `terminal_bot.py`.

En su lugar:

```bash
export TELEGRAM_BOT_TOKEN='TU_TOKEN'
```

Ejemplo:

```bash
export TELEGRAM_BOT_TOKEN='1234567890:AAxxxxxxxxxxxxxxxx'
```

Comprobar que existe:

```bash
echo $TELEGRAM_BOT_TOKEN
```

Si aparece el TOKEN significa que está configurado.

---

# 📝 7. Crear el programa

Crear:

```bash
nano terminal_bot.py
```

También podemos crearlo directamente:

````bash
cat > terminal_bot.py <<'PY'
import os
import subprocess

from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    ContextTypes,
    filters
)

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

AUTHORIZED_USER_ID = None

current_dir = "/workspaces/telebot"


def authorized(update: Update):

    if AUTHORIZED_USER_ID is None:
        return True

    return update.effective_user.id == AUTHORIZED_USER_ID


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):

    if not authorized(update):
        await update.message.reply_text("⛔ Acceso denegado.")
        return

    await update.message.reply_text(
        "🖥️ TELEGRAM TERMINAL\n\n"
        "Conectado al Codespace.\n\n"
        "Ejemplos:\n"
        "/pwd\n"
        "/ls\n"
        "/cd /workspaces/telebot\n"
        "/git status\n"
        "/python3 --version"
    )


async def terminal(update: Update, context: ContextTypes.DEFAULT_TYPE):

    global current_dir

    if not authorized(update):
        await update.message.reply_text("⛔ Acceso denegado.")
        return

    command = update.message.text[1:]

    if not command:
        return

    if command.startswith("cd "):

        new_dir = command[3:].strip()

        if not os.path.isabs(new_dir):
            new_dir = os.path.join(current_dir, new_dir)

        new_dir = os.path.abspath(new_dir)

        if os.path.isdir(new_dir):

            current_dir = new_dir

            await update.message.reply_text(
                f"📁 Directorio:\n{current_dir}"
            )

        else:

            await update.message.reply_text(
                f"❌ No existe:\n{new_dir}"
            )

        return

    try:

        result = subprocess.run(
            command,
            shell=True,
            cwd=current_dir,
            capture_output=True,
            text=True,
            timeout=60
        )

        output = result.stdout + result.stderr

        if not output:

            output = (
                f"✔️ Comando ejecutado\n"
                f"Código: {result.returncode}"
            )

        if len(output) > 4000:

            output = output[-4000:]

        await update.message.reply_text(
            f"📁 {current_dir}\n\n"
            f"```text\n{output}\n```",
            parse_mode="Markdown"
        )

    except subprocess.TimeoutExpired:

        await update.message.reply_text(
            "⏱️ El comando tardó demasiado."
        )

    except Exception as e:

        await update.message.reply_text(
            f"❌ Error:\n{e}"
        )


def main():

    if not TOKEN:

        print(
            "ERROR: falta "
            "TELEGRAM_BOT_TOKEN"
        )

        return

    app = Application.builder().token(TOKEN).build()

    app.add_handler(
        CommandHandler(
            "start",
            start
        )
    )

    app.add_handler(
        MessageHandler(
            filters.TEXT &
            filters.Regex(r"^/"),
            terminal
        )
    )

    print("================================")
    print(" TELEGRAM TERMINAL")
    print(" Codespace conectado")
    print("================================")

    print(
        f"Directorio: {current_dir}"
    )

    print(
        "Esperando comandos..."
    )

    app.run_polling()


if __name__ == "__main__":
    main()
PY
````

---

# ▶️ 8. Ejecutar el bot

Activar el entorno:

```bash
cd /workspaces/telebot
source venv/bin/activate
```

Configurar TOKEN:

```bash
export TELEGRAM_BOT_TOKEN='TU_TOKEN'
```

Ejecutar:

```bash
python3 terminal_bot.py
```

Deberá aparecer:

```text
================================
 TELEGRAM TERMINAL
 Codespace conectado
================================
Directorio: /workspaces/telebot
Esperando comandos...
```

---

# 📱 9. Probar desde Telegram

Abrir el bot y enviar:

```text
/start
```

Después:

```text
/pwd
```

Respuesta:

```text
/workspaces/telebot
```

---

## Ver archivos

```text
/ls
```

---

## Ver archivos detalladamente

```text
/ls -la
```

---

## Ver versión de Python

```text
/python3 --version
```

---

## Ver versión de Git

```text
/git --version
```

---

## Ver estado del repositorio

```text
/git status
```

---

# 📁 10. Cambiar de directorio

Ejemplo:

```text
/cd /workspaces
```

Después:

```text
/pwd
```

Podemos volver:

```text
/cd /workspaces/telebot
```

---

# 🧪 11. Ejecutar comandos Linux

El bot permite ejecutar comandos como:

```text
/df -h
```

```text
/free -h
```

```text
/uname -a
```

```text
/ls -la
```

```text
/ps aux
```

```text
/git status
```

```text
/python3 test.py
```

---

# 🔄 12. Ejecutar un programa Python

Por ejemplo:

```bash
nano test.py
```

Contenido:

```python
print("Hola desde el Codespace")
```

Guardar y desde Telegram:

```text
/python3 test.py
```

Respuesta:

```text
Hola desde el Codespace
```

---

# 🛑 13. Detener el bot

En el terminal del Codespace:

```text
CTRL + C
```

También se puede cerrar el proceso.

---

# 🔐 14. Seguridad

La primera versión utiliza:

```python
AUTHORIZED_USER_ID = None
```

Eso significa:

> Cualquier usuario que tenga acceso al bot podría intentar enviar comandos.

Esto **NO es recomendable para producción**.

La siguiente versión debe utilizar el Telegram User ID.

---

# 👤 15. Obtener Telegram User ID

Podemos modificar temporalmente el bot para mostrar:

```python
update.effective_user.id
```

El resultado será un número parecido a:

```text
123456789
```

Ese número identifica la cuenta de Telegram.

Después se configura:

```python
AUTHORIZED_USER_ID = 123456789
```

Ahora solamente esa cuenta podrá utilizar la terminal.

---

# 🛡️ 16. Modelo de seguridad recomendado

La arquitectura final debería ser:

```text
             TELEGRAM
                 │
                 ▼
        ┌─────────────────┐
        │ Telegram User ID│
        │   autorizado    │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │  Python Bot     │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ Command Handler │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ Linux Shell     │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ GitHub Codespace│
        └─────────────────┘
```

---

# 🌐 17. ¿Por qué no necesitamos abrir puertos?

El bot utiliza:

```text
Telegram Bot API
```

mediante una conexión saliente.

Por lo tanto:

```text
Internet
   │
   ▼
Telegram
   │
   ▼
Bot Python
   │
   ▼
Codespace
```

No necesitamos:

```text
SSH público
Puerto 22
Tmate
Upterm
Port forwarding
IP pública
```

Esto hace que el sistema sea especialmente práctico para Codespaces.

---

# ⚠️ 18. Limitaciones

La primera versión no es un terminal interactivo completo.

Por ejemplo, comandos como:

```text
top
nano
vim
python3
```

que esperan interacción continua no funcionan igual que una terminal SSH tradicional.

Esto se debe a que:

```text
Telegram
```

es un sistema basado en mensajes y no un terminal TTY.

Sin embargo, podemos implementar posteriormente una sesión basada en:

```text
PTY
```

para acercarnos mucho más al comportamiento de una terminal real.

---

# 🚀 19. Mejoras futuras

El proyecto puede evolucionar hasta convertirse en un verdadero administrador remoto.

### Terminal

```text
/shell ls -la
/shell git status
/shell python3 app.py
```

### Archivos

```text
/upload
/download archivo.txt
```

### Procesos

```text
/process
/kill PID
```

### Sistema

```text
/status
/memory
/disk
/cpu
```

### Git

```text
/git status
/git pull
/git add .
/git commit
/git push
```

### Docker

```text
/docker ps
/docker images
```

### Control del Codespace

```text
/start
/stop
/restart
```

---

# 🧠 20. Arquitectura completa futura

La versión avanzada podría quedar:

```text
                         TELEGRAM
                            │
                            ▼
                  ┌──────────────────┐
                  │   Telegram Bot   │
                  └────────┬─────────┘
                           │
                           ▼
                 ┌────────────────────┐
                 │ Authentication      │
                 │ Telegram User ID   │
                 └─────────┬──────────┘
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
         TERMINAL        FILES         SYSTEM
             │             │             │
             ▼             ▼             ▼
            PTY       Upload/Download  CPU/RAM
             │
             ▼
       ┌─────────────────┐
       │ Linux Codespace │
       └─────────────────┘
             │
       ┌─────┼──────┬────────┐
       ▼     ▼      ▼        ▼
     Python Git    Docker   Node
```

---

# 🎯 21. Objetivo final

El objetivo del proyecto es convertir Telegram en un **control remoto del entorno Linux**:

```text
📱 Telegram
      │
      │ comando
      ▼
🤖 Python Bot
      │
      ▼
🐧 Linux
      │
      ▼
💻 GitHub Codespace
```

De esta forma podemos administrar el proyecto prácticamente desde cualquier lugar con Telegram.

---

# 📌 22. Comandos rápidos

### Iniciar entorno

```bash
cd /workspaces/telebot
source venv/bin/activate
```

### Configurar TOKEN

```bash
export TELEGRAM_BOT_TOKEN='TU_TOKEN'
```

### Ejecutar

```bash
python3 terminal_bot.py
```

### Probar

```text
/start
/pwd
/ls
/ls -la
/git status
/python3 --version
```

---

# 📄 Licencia

Este proyecto puede utilizarse, modificarse y adaptarse libremente para fines personales, educativos y de automatización.

---

## 🔥 Resultado

Con este proyecto tenemos una alternativa sencilla a Tmate:

```text
TMATE

Terminal ←→ Internet ←→ Terminal


TELEGRAM TERMINAL

Telegram ←→ Bot Python ←→ Codespace
```

Y lo mejor:

**Telegram ya funciona como nuestro canal de control remoto.**
