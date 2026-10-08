#!/bin/bash

APP_DIR="/workspaces/telebot"
LOG="$APP_DIR/startup.log"
BOT="$APP_DIR/terminal_bot.py"

cd "$APP_DIR" || exit 1

echo "========================================" >> "$LOG"
echo " TELEGRAM STARTUP" >> "$LOG"
echo " $(date)" >> "$LOG"
echo "========================================" >> "$LOG"

# Evitar duplicados
if pgrep -f "$BOT" >/dev/null 2>&1; then
    echo "[STARTUP] Bot ya está ejecutándose" >> "$LOG"
    exit 0
fi

# Lanzar watchdog completamente desacoplado
setsid /bin/bash "$APP_DIR/watchdog.sh" \
    </dev/null \
    >> "$APP_DIR/watchdog.log" 2>&1 &

PID=$!

echo "$PID" > "$APP_DIR/watchdog.pid"

echo "[STARTUP] Watchdog iniciado PID=$PID" >> "$LOG"

exit 0
