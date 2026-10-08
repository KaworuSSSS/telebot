#!/bin/bash

APP_DIR="/workspaces/telebot"
LOG="$APP_DIR/telegram_bot.log"

cd "$APP_DIR" || exit 1

echo "========================================" >> "$LOG"
echo " TELEGRAM TERMINAL WATCHDOG" >> "$LOG"
echo " INICIO: $(date)" >> "$LOG"
echo "========================================" >> "$LOG"

while true
do
    echo "[WATCHDOG] Iniciando bot: $(date)" >> "$LOG"

    "$APP_DIR/venv/bin/python" "$APP_DIR/terminal_bot.py" >> "$LOG" 2>&1

    EXIT_CODE=$?

    echo "[WATCHDOG] Bot terminó. Código: $EXIT_CODE" >> "$LOG"
    echo "[WATCHDOG] Reiniciando en 5 segundos..." >> "$LOG"

    sleep 5
done
