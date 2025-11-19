// airtable/offboarding_to_webhook.js

/**
 * Airtable Script – Offboarding form → Webhook
 *
 * Este script:
 * 1. Lee campos de un formulario en Airtable (mediante input variables).
 * 2. Normaliza algunos campos (arrays → string).
 * 3. Envía el payload como JSON a un endpoint webhook externo.
 * 4. Devuelve la respuesta del servidor para logging en Airtable.
 *
 * Se ejecuta desde la automatización de Airtable (Airtable Scripting).
 */

// 1) Leer configuración de entrada desde la automatización
let inputConfig = input.config();

// 2) Normalizar campos (por ejemplo, fields que vienen como arrays)
function sanitizeField(value) {
    if (Array.isArray(value)) {
        return value.join(", ");
    }
    return value;
}

// 3) Construir el payload a partir de las variables de entrada
//   ajusta nombres de campos a los de tu base / formulario.
let payload = {
    id: inputConfig.id,
    status: inputConfig.status,
    submission_date: inputConfig.submission_date,

    team_member_completing_this_form: inputConfig.team_member_completing_this_form,
    clients_company_name: inputConfig.clients_company_name,
    clients_name: inputConfig.clients_name,
    clients_email: inputConfig.clients_email,

    vas_name: inputConfig.vas_name,
    vas_email: inputConfig.vas_email,
    vas_crm_link: inputConfig.vas_crm_link,               
    agreement_number: inputConfig.agreement_number,
    agreement_crm_link: inputConfig.agreement_crm_link,    

    is_last_day_changing: inputConfig.is_last_day_changing,
    new_effective_last_day_of_work: inputConfig.new_effective_last_day_of_work,
    notification_date: inputConfig.notification_date,
    last_day_of_work: inputConfig.last_day_of_work,
    start_date_agreement_signed: inputConfig.start_date_agreement_signed,

    hours_per_week: inputConfig.hours_per_week,
    job_title_role: inputConfig.job_title_role,
    job_title_role_other: inputConfig.job_title_role_other,
    level_when_hired: inputConfig.level_when_hired,
    client_va_team_size: inputConfig.client_va_team_size,

    requested_by: inputConfig.requested_by,
    reason: inputConfig.reason,
    reason_other: inputConfig.reason_other,

    // Ejemplos de campos “multi-opción” normalizados
    business_needs_changed: sanitizeField(inputConfig.business_needs_changed),
    va_found_new_local_job: sanitizeField(inputConfig.va_found_new_local_job),
    va_found_new_remote_job: sanitizeField(inputConfig.va_found_new_remote_job),

    replacement_requested: inputConfig.replacement_requested,
    within_first_60_days: inputConfig.within_first_60_days,
    days_working_together: inputConfig.days_working_together,

    hide_va_profile: inputConfig.hide_va_profile,
    consequence_penalty: sanitizeField(inputConfig.consequence_penalty),
    client_hiring_with_other_company: sanitizeField(inputConfig.client_hiring_with_other_company),
    reason_no_replacement: sanitizeField(inputConfig.reason_no_replacement),

    amount_not_paid_to_va: inputConfig.amount_not_paid_to_va,
    is_new_process: inputConfig.is_new_process,
    perks_package_new_job: sanitizeField(inputConfig.perks_package_new_job),
    additional_comments: inputConfig.additional_comments
};

// 4) Enviar el payload a un webhook externo
//    reemplaza WEBHOOK_URL y AUTH_HEADER por valores reales
let response = await fetch("https://YOUR_WEBHOOK_ENDPOINT_URL/webhook", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        // Recomendado: usar auth tipo Bearer o una API Key genérica
        "Authorization": "Bearer YOUR_API_TOKEN"
    },
    body: JSON.stringify(payload)
});

// 5) Leer respuesta del webhook y exponerla como output de la automatización
let result = await response.text();
output.set("webhookResponse", result);
