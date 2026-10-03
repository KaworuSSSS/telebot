#!/usr/bin/env bash

set -e

DISPLAY_NUM=":99"
VNC_PORT="5900"
NOVNC_PORT="6080"
CHROME_PORT="9222"
SCREEN="1920x1080x24"
CHROME_DIR="/tmp/nova-chrome"

echo "🚀 Iniciando Nova Browser..."

# Pantalla virtual
if ! pgrep -f "Xvfb $DISPLAY_NUM" > /dev/null; then
    echo "🖥️ Iniciando Xvfb..."
    Xvfb "$DISPLAY_NUM" -screen 0 "$SCREEN" -ac > /tmp/nova-xvfb.log 2>&1 &
    sleep 2
else
    echo "✅ Xvfb ya está funcionando."
fi

export DISPLAY="$DISPLAY_NUM"

# Chrome
if ! curl -sf "http://127.0.0.1:$CHROME_PORT/json/version" > /dev/null 2>&1; then
    echo "🌐 Iniciando Chrome..."

    google-chrome \
        --no-sandbox \
        --disable-dev-shm-usage \
        --disable-gpu \
        --no-first-run \
        --no-default-browser-check \
        --user-data-dir="$CHROME_DIR" \
        --remote-debugging-port="$CHROME_PORT" \
        about:blank \
        > /tmp/nova-chrome.log 2>&1 &

    sleep 3
else
    echo "✅ Chrome ya está funcionando."
fi

# x11vnc
if ! ss -ltn 2>/dev/null | grep -q ":$VNC_PORT "; then
    echo "🖱️ Iniciando x11vnc..."

    x11vnc \
        -display "$DISPLAY_NUM" \
        -forever \
        -shared \
        -rfbport "$VNC_PORT" \
        -nopw \
        > /tmp/nova-x11vnc.log 2>&1 &

    sleep 2
else
    echo "✅ x11vnc ya está funcionando."
fi

# noVNC
if ! ss -ltn 2>/dev/null | grep -q ":$NOVNC_PORT "; then
    echo "🌎 Iniciando noVNC..."

    /usr/share/novnc/utils/novnc_proxy \
        --vnc "localhost:$VNC_PORT" \
        --listen "$NOVNC_PORT" \
        > /tmp/nova-novnc.log 2>&1 &

    sleep 2
else
    echo "✅ noVNC ya está funcionando."
fi

echo ""
echo "======================================"
echo "       🚀 NOVA BROWSER LISTO"
echo "======================================"
echo ""
echo "🖥️ Display:     $DISPLAY_NUM"
echo "🌐 Chrome:      $CHROME_PORT"
echo "🖱️ VNC:         $VNC_PORT"
echo "🌎 noVNC:       $NOVNC_PORT"
echo ""
echo "Abre el puerto 6080 desde:"
echo "View → Ports → 6080 → Open in Browser"
echo ""
echo "======================================"
