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

---
## Arquitectura – Airtable → Webhook → DWH → KPI Factory

Este repositorio forma parte de un ecosistema mayor de automatización de datos y procesos.

Flujo general:

```text
[Airtable Form]
     |
     |  (Airtable Automation + Script JS)
     v
[Webhook HTTP / Flask + Gunicorn + systemd]
     |
     |  (INSERT en PostgreSQL / DWH)
     v
[Data Warehouse]
     |
     |  (KPIs y scorecards – ver repo ev-kpi-factory)
     v
[Scorecards semanales / Google Sheets / BI]

---

## Integración con otros repos

Este webhook forma parte del ecosistema de automatización de eV.

Los datos recibidos aquí se almacenan en el Data Warehouse y posteriormente son utilizados por la fábrica de KPIs:

**ev-kpi-factory**  
https://github.com/eVhjnb/ev-kpi-factory

Allí se calculan:
- KPIs semanales,
- scorecards operativos,
- y se publican resultados en Google Sheets de forma automatizada.

Este repo (webhooks) es la *entrada* del sistema; el repo `ev-kpi-factory` es la parte de *explotación analítica*.

