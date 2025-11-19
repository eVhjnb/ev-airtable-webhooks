# Ops – Despliegue en Ubuntu con systemd + Gunicorn

Este directorio contiene archivos de ejemplo para desplegar el webhook en un servidor Ubuntu utilizando:

- Python 3 en entorno virtual (venv)
- Gunicorn como WSGI server
- systemd como process manager
- Socket Unix para exponer el servicio (`/run/ev-webhook.sock`)

---

## 1. Entorno virtual (venv)

cd /opt
git clone https://github.com/<user>/ev-airtable-webhooks.git
cd ev-airtable-webhooks

python3 -m venv /opt/venvs/ev-webhook
source /opt/venvs/ev-webhook/bin/activate

pip install -r requirements.txt

"""
ó Instalar paquetes PY todo junto:
  pip install psycopg2-binary flask
"""

---

## 2. Variables de entorno

sudo cp ops/env_example.env /etc/ev-webhook.env
sudo nano /etc/ev-webhook.env
-Ajustar valores reales (DB_HOST, DB_USER, WEBHOOK_SECRET, etc.)

---

## 3. systemd service

sudo cp ops/webhook_gunicorn.service /etc/systemd/system/ev-webhook.service
sudo systemctl daemon-reload
sudo systemctl enable ev-webhook.service
sudo systemctl start ev-webhook.service

sudo systemctl status ev-webhook.service

Si todo está correcto, Gunicorn quedará corriendo con:

working dir: /opt/ev-airtable-webhooks

socket: /run/ev-webhook.sock

---

## 4. Reverse proxy


location /webhook {
    proxy_pass http://unix:/run/ev-webhook.sock;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

-Reinicia Nginx después de aplicar cambios.



