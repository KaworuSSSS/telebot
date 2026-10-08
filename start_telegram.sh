#!/bin/bash

APP_DIR="/workspaces/telebot"
LOG="$APP_DIR/startup.log"
PIDFILE="$APP_DIR/watchdog.pid"

cd "$APP_DIR" || exit 1

echo "========================================" >> "$LOG"
echo " TELEGRAM TERMINAL STARTUP" >> "$LOG"
echo " $(date)" >> "$LOG"
echo "========================================" >> "$LOG"

# Si ya existe un watchdog funcionando, no iniciar otro
if [ -f "$PIDFILE" ]; then
    OLD_PID=$(cat "$PIDFILE")

    if kill -0 "$OLD_PID" 2>/dev/null; then
        echo "[STARTUP] Watchdog ya está funcionando: PID $OLD_PID" >> "$LOG"
        exit 0
    fi

    rm -f "$PIDFILE"
fi

# Detener procesos anteriores del bot
pkill -f "/workspaces/telebot/terminal_bot.py" 2>/dev/null || true

# Iniciar watchdog
nohup /bin/bash "$APP_DIR/watchdog.sh" \
    >> "$APP_DIR/watchdog.log" 2>&1 &

WATCHDOG_PID=$!

echo "$WATCHDOG_PID" > "$PIDFILE"

echo "[STARTUP] Watchdog iniciado: PID $WATCHDOG_PID" >> "$LOG"
