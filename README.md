# ev-airtable-webhooks

Automatización entre Airtable y un servidor externo mediante webhooks.

Este repositorio muestra cómo conectar formularios operativos (por ejemplo, offboarding o procesos internos) con un backend propio, usando:

- **Airtable Scripting** (JavaScript)
- **Webhooks HTTP (JSON)**
- **Python en servidor Ubuntu (ejemplo)**

El objetivo es:
- centralizar información de formularios,
- normalizar y enriquecer datos,
- enviarlos a un Data Warehouse o a pipelines de análisis,
- mantener trazabilidad de procesos (offboardings, reemplazos, etc.).

---

## Estructura

```text
ev-airtable-webhooks/
  airtable/
    offboarding_to_webhook.js
  webhooks/
    webhook_offboarding_example.py
  README.md
