#!/bin/bash

APP_DIR="/workspaces/telebot"
LOG="$APP_DIR/telegram_bot.log"

cd "$APP_DIR"

echo "========================================" >> "$LOG"
echo " TELEGRAM TERMINAL WATCHDOG" >> "$LOG"
echo " INICIO: $(date)" >> "$LOG"
echo "========================================" >> "$LOG"

while true
do
    echo "[WATCHDOG] Iniciando bot: $(date)" >> "$LOG"

    python3 terminal_bot.py >> "$LOG" 2>&1

    EXIT_CODE=$?

    echo "[WATCHDOG] Bot terminó con código $EXIT_CODE" >> "$LOG"
    echo "[WATCHDOG] Reiniciando en 5 segundos..." >> "$LOG"

    sleep 5
done
