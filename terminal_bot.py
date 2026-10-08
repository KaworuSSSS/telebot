import os
import subprocess
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

# ==============================
# CONFIGURACIÓN
# ==============================

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

# Lo dejaremos vacío inicialmente.
# Después pondremos aquí TU Telegram ID.
AUTHORIZED_USER_ID = None

# Directorio inicial de la terminal
current_dir = "/workspaces/telebot"


# ==============================
# AUTORIZACIÓN
# ==============================

def authorized(update: Update):
    if AUTHORIZED_USER_ID is None:
        return True

    return update.effective_user.id == AUTHORIZED_USER_ID


# ==============================
# /start
# ==============================

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):

    if not authorized(update):
        await update.message.reply_text("⛔ Acceso denegado.")
        return

    await update.message.reply_text(
        "🖥️ TELEGRAM TERMINAL\n\n"
        "Conectado al Codespace.\n\n"
        "Escribe cualquier comando Linux.\n\n"
        "Ejemplos:\n"
        "/pwd\n"
        "/ls\n"
        "/cd /workspaces/telebot\n"
        "/git status\n"
        "/python --version"
    )


# ==============================
# EJECUTAR COMANDOS
# ==============================

async def terminal(update: Update, context: ContextTypes.DEFAULT_TYPE):

    global current_dir

    if not authorized(update):
        await update.message.reply_text("⛔ Acceso denegado.")
        return

    command = update.message.text

    # Quitamos el /
    command = command[1:]

    if not command:
        return

    # --------------------------
    # CD
    # --------------------------

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

    # --------------------------
    # Ejecutar comando
    # --------------------------

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
            output = f"✔️ Comando ejecutado\nCódigo: {result.returncode}"

        # Telegram limita los mensajes
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


# ==============================
# MAIN
# ==============================

def main():

    if not TOKEN:
        print("ERROR: falta TELEGRAM_BOT_TOKEN")
        return

    app = Application.builder().token(TOKEN).build()

    app.add_handler(CommandHandler("start", start))

    # Cualquier mensaje que empiece con /
    from telegram.ext import MessageHandler, filters

    app.add_handler(
        MessageHandler(
            filters.TEXT & filters.Regex(r"^/"),
            terminal
        )
    )

    print("================================")
    print(" TELEGRAM TERMINAL")
    print(" Codespace conectado")
    print("================================")
    print(f"Directorio: {current_dir}")
    print("Esperando comandos...")

    app.run_polling()


if __name__ == "__main__":
    main()
