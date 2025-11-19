# webhooks/webhook_offboarding_example.py

"""
Webhook receptor para formularios enviados desde Airtable.

Este endpoint:
1. Valida un token de autorización enviado por Airtable.
2. Recibe un JSON con los datos del formulario.
3. Inserta los datos en una tabla de PostgreSQL (Data Warehouse).
4. Devuelve una respuesta JSON indicando éxito o error.

"""

from flask import Flask, request, jsonify
import psycopg2
import os

app = Flask(__name__)

# -------------------------------------------------------------------
# Configuración mediante variables de entorno
# -------------------------------------------------------------------

DB_HOST = os.getenv("DB_HOST", "YOUR_DB_HOST")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "YOUR_DB_NAME")
DB_USER = os.getenv("DB_USER", "YOUR_DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD", "YOUR_DB_PASSWORD")

SECRET_TOKEN = os.getenv("WEBHOOK_SECRET", "YOUR_SECRET_TOKEN")

TARGET_TABLE = "vl_analytics.letgo_form"   # TODO: Cambiar si usas otro esquema/tabla.


# -------------------------------------------------------------------
# Ruta principal del webhook
# -------------------------------------------------------------------

@app.route("/webhook", methods=["POST"])
def webhook():
    # Validación del token
    auth_header = request.headers.get("Authorization")
    expected_auth = f"Bearer {SECRET_TOKEN}"

    if auth_header != expected_auth:
        return jsonify({"error": "Unauthorized"}), 401

    # Obtener JSON del request
    data = request.get_json()
    if not data:
        return jsonify({"error": "Empty or invalid JSON"}), 400

    # Inserción en base de datos
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cursor = conn.cursor()

        # ---------------------------------------------------------------
        # Insert dinámico basado en keys del JSON
        # ---------------------------------------------------------------
        # Esto es mucho más seguro y escalable que una query gigante fija.
        columns = ", ".join(data.keys())
        placeholders = ", ".join([f"%({key})s" for key in data.keys()])

        insert_query = f"""
            INSERT INTO {TARGET_TABLE} ({columns})
            VALUES ({placeholders});
        """

        cursor.execute(insert_query, data)
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"status": "success"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------------------------------------------
# Main (solo para testing local)
# -------------------------------------------------------------------

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000)
