#!/bin/bash

APP_DIR="/workspaces/telebot"
LOG="$APP_DIR/container_start.log"

echo "========================================" >> "$LOG"
echo " TELEGRAM CONTAINER START" >> "$LOG"
echo " $(date)" >> "$LOG"
echo "========================================" >> "$LOG"

cd "$APP_DIR" || exit 1

# Ejecutar watchdog como proceso principal del contenedor
exec /bin/bash "$APP_DIR/watchdog.sh"
