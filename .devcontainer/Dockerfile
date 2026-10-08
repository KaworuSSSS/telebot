FROM mcr.microsoft.com/devcontainers/python:3.12

WORKDIR /workspaces/telebot

COPY container_start.sh /usr/local/bin/container_start.sh

RUN chmod +x /usr/local/bin/container_start.sh

CMD ["/usr/local/bin/container_start.sh"]
