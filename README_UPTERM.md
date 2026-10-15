# Guía práctica: conectar dos GitHub Codespaces con Upterm

## 🎯 Resultado esperado

Conectar el segundo Codespace al primero para controlar su terminal mediante SSH, sin instalar programas en Windows.

**Servidor:** `KaworuSSSS/telebot`

**Cliente:** segundo Codespace.

Cuando funcione, aparecerá una terminal similar a:

```text
@KaworuSSSS ➜ /workspaces/telebot (main) $
```

---

# PASO 1. Abrir los dos Codespaces

## 🖥️ SERVIDOR — Primer Codespace

Abre el Codespace donde está el proyecto `telebot`.

### COPIAR Y PEGAR

```bash
cd /workspaces/telebot
pwd
```

**Resultado esperado:**

```text
/workspaces/telebot
```

Mantén este Codespace activo.

## 💻 CLIENTE — Segundo Codespace

Abre el segundo Codespace y su terminal.

No ejecutes todavía el comando de conexión.

---

# PASO 2. Comprobar que Upterm está instalado

## 🖥️ SERVIDOR — Primer Codespace

### COPIAR Y PEGAR

```bash
upterm --version
```

Si aparece una versión, continúa al paso 3.

Si aparece `command not found`, consulta la instalación oficial:

https://github.com/owenthereal/upterm

Si tienes Go instalado, puedes intentar instalar Upterm con:

```bash
go install github.com/owenthereal/upterm/cmd/upterm@latest
```

Si el ejecutable no aparece en el PATH, ejecuta:

```bash
export PATH="$(go env GOPATH)/bin:$PATH"
```

Comprueba de nuevo:

```bash
upterm --version
```

---

# PASO 3. Crear la llave SSH del cliente

## 💻 CLIENTE — Segundo Codespace

Este paso se realiza una sola vez, siempre que conserves la llave creada.

### COPIAR Y PEGAR

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
ssh-keygen -t ed25519 -N "" -f ~/.ssh/upterm_client
```

Si te avisa que el archivo ya existe, no lo sobrescribas si quieres conservar la llave anterior.

### MOSTRAR LA LLAVE PÚBLICA

```bash
cat ~/.ssh/upterm_client.pub
```

### ACCIÓN MANUAL

1. Copia la línea completa que empieza con `ssh-ed25519`.
2. Guarda esa línea temporalmente para el siguiente paso.
3. No compartas el archivo `~/.ssh/upterm_client`: es la llave privada.

---

# PASO 4. Autorizar la llave del cliente

## 🖥️ SERVIDOR — Primer Codespace

### COPIAR Y PEGAR

```bash
mkdir -p ~/.upterm
chmod 700 ~/.upterm
touch ~/.upterm/authorized_keys
```

### AGREGAR LA LLAVE PÚBLICA

Copia el siguiente comando y sustituye `PEGA_AQUI_LA_LLAVE_PUBLICA` por la línea que obtuviste en el paso 3.

```bash
grep -qxF 'PEGA_AQUI_LA_LLAVE_PUBLICA' ~/.upterm/authorized_keys || echo 'PEGA_AQUI_LA_LLAVE_PUBLICA' >> ~/.upterm/authorized_keys
```

**Importante:** reemplaza el texto de ejemplo en las dos partes del comando. Conserva las comillas simples que rodean la llave.

### PROTEGER EL ARCHIVO

```bash
chmod 600 ~/.upterm/authorized_keys
```

### VERIFICAR LA CONFIGURACIÓN

```bash
cat ~/.upterm/authorized_keys
```

Comprueba que aparece la llave pública del cliente.

---

# PASO 5. Iniciar el servidor Upterm

## 🖥️ SERVIDOR — Primer Codespace

### COPIAR Y PEGAR

```bash
upterm host --authorized-keys ~/.upterm/authorized_keys
```

### ACCIÓN MANUAL

Espera a que aparezca una dirección SSH similar a:

```text
ssh IDENTIFICADOR@uptermd.upterm.dev
```

Copia el identificador que aparezca en tu sesión actual.

**No cierres esta terminal.** Debe permanecer activa mientras el cliente se conecta.

---

# PASO 6. Conectar el cliente al servidor

## 💻 CLIENTE — Segundo Codespace

Utiliza el identificador que copiaste del servidor.

### COPIAR Y PEGAR

Sustituye `IDENTIFICADOR` por el valor actual de tu sesión:

```bash
ssh -tt -i ~/.ssh/upterm_client -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new IDENTIFICADOR@uptermd.upterm.dev
```

### RESULTADO ESPERADO

```text
@KaworuSSSS ➜ /workspaces/telebot (main) $
```

Si aparece ese prompt, ya estás dentro de la terminal remota del servidor.

---

# PASO 7. Comprobar que la conexión funciona

## 💻 CLIENTE — Terminal conectada al servidor

Ejecuta estos comandos dentro de la sesión remota.

### COPIAR Y PEGAR

```bash
hostname
pwd
git status --short
```

### RESULTADO ESPERADO

La ruta debe ser:

```text
/workspaces/telebot
```

El nombre del host será el del Codespace servidor.

`git status --short` muestra cambios pendientes en el repositorio. No los borres ni los restaures sin revisar su contenido.

---

# PASO 8. Desconectarse

## 💻 CLIENTE — Terminal remota

### COPIAR Y PEGAR

```bash
exit
```

Esto cierra la conexión y devuelve el control a la terminal local del segundo Codespace.

No necesariamente detiene el servidor Upterm.

---

# PASO 9. Volver a conectar más tarde

## 🖥️ SERVIDOR — Primer Codespace

Comprueba que el proceso de Upterm siga activo. Si necesitas iniciar una sesión nueva, ejecuta:

```bash
upterm host --authorized-keys ~/.upterm/authorized_keys
```

Copia el identificador SSH que muestre.

## 💻 CLIENTE — Segundo Codespace

Ejecuta de nuevo el comando de conexión con el identificador actual:

```bash
ssh -tt -i ~/.ssh/upterm_client -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new IDENTIFICADOR@uptermd.upterm.dev
```

---

# SOLUCIÓN DE ERRORES

## ❌ `upterm: command not found`

Upterm no está instalado o no se encuentra en el PATH. Consulta el paso 2.

## ❌ `Permission denied (publickey)`

Comprueba la llave pública en el servidor:

```bash
cat ~/.upterm/authorized_keys
```

Comprueba que estás usando la llave privada correcta en el cliente:

```bash
ls -l ~/.ssh/upterm_client
```

Si acabas de modificar las llaves autorizadas, detén la sesión Upterm con `Ctrl+C` en la terminal del servidor e inicia una nueva:

```bash
upterm host --authorized-keys ~/.upterm/authorized_keys
```

Utiliza el nuevo identificador si cambia.

## ❌ `PTY is required`

Conéctate desde la terminal integrada del segundo Codespace usando la opción `-tt`.

## ❌ La conexión se cierra

Comprueba que el primer Codespace sigue activo y que el servidor Upterm está ejecutándose. Si es necesario, inicia una sesión nueva y utiliza su identificador actual.

---

# SEGURIDAD

- Nunca compartas la llave privada.
- No subas llaves privadas al repositorio.
- No elimines llaves existentes de `authorized_keys` sin revisarlas.
- Mantén activo el Codespace servidor mientras lo necesites.
- Comprueba siempre `hostname` y `pwd` antes de ejecutar comandos importantes.
- Upterm permite acceso remoto a la terminal, pero no arranca automáticamente el bot de Telegram.
- GitHub Codespaces puede detenerse por inactividad o por límites de la plataforma.

---

# RESUMEN RÁPIDO

| Acción | Dónde |
|---|---|
| Abrir `/workspaces/telebot` | Servidor |
| Verificar instalación de Upterm | Servidor |
| Generar la llave SSH | Cliente |
| Autorizar la llave pública | Servidor |
| Iniciar `upterm host` | Servidor |
| Ejecutar el comando SSH | Cliente |
| Verificar `hostname` y `pwd` | Cliente conectado |
| Ejecutar `exit` | Cliente conectado |

## ESTADO FINAL

La conexión se considera correcta cuando el segundo Codespace muestra el prompt remoto y `pwd` devuelve:

```text
/workspaces/telebot
```

En ese momento, puedes ejecutar comandos en el servidor desde el cliente.
