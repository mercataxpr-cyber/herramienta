# HERRAMIENTA - Especificaciones y Decisiones v1.0

**Fecha:** 25 de agosto de 2026  
**Repositorio:** `mercataxpr-cyber/herramienta`  
**Prioridad:** UpPaidPR -> Vaquita Pay -> Herramienta  
**Estado:** Vision aprobada; implementacion futura.

## Decision principal

GitHub sera la **fuente de verdad del codigo**. Herramienta orquestara IA, ramas, diffs, aprobaciones, sincronizacion, previews y despliegues; no reemplazara GitHub ni Vercel.

## 1. Vision

Herramienta sera un workspace tipo AI Studio para desarrollar aplicaciones con GPT/Codex y agentes especializados. El usuario selecciona repositorio y rama, conversa con el agente, ve cambios reales, preview live, diff, tests, aprueba Git y prueba desde el celular mediante un QR vivo.

Flujo objetivo:

`Prompt -> Agente -> Sandbox/worktree -> archivos reales -> tests -> diff -> aprobacion -> commit/push -> GitHub -> Vercel Preview -> QR/movil -> merge -> Production`

## 2. Estado actual del ZIP

La base ya incluye React/Vite, Express, chat/orquestador, paneles de GitHub/Vercel/Supabase/Codex, preview, QR, historial, diff y aprobaciones.

Pendiente convertir en real:
- Git status dinamico.
- Commit/push real del workspace.
- Pull Request real.
- Sesion Codex real.
- Workspace/filesystem real para que el agente edite archivos.
- GitHub -> Herramienta mediante webhooks/fetch.
- Preview live basado en el workspace.
- Vercel como deploy principal desde Git.

## 3. Arquitectura

- **Herramienta Web:** chat, preview, ramas, diff, aprobaciones, QR.
- **Codex / Agentes:** leer, editar, probar y explicar.
- **Workspace Sandbox:** filesystem real, comandos, dev server, worktree por rama.
- **GitHub:** codigo, historial, branches, PR, merge. Source of truth.
- **Vercel:** Preview y Production.
- **Supabase:** auth, metadata, sesiones y realtime. No es source of truth del codigo.
- **Mobile Live Viewer:** URL estable + realtime.

## 4. ChatGPT / Codex

Mantener dos rutas:
1. **Codex autenticado con ChatGPT**, cuando el cliente oficial/CLI/SDK lo soporte para el flujo implementado.
2. **OpenAI API / Responses**, para multiusuario, automatizaciones, backend SaaS o fallback.

No hardcodear un unico modelo. No guardar credenciales sensibles en localStorage.

## 5. GitHub bidireccional

Herramienta tiene su **propia conexion GitHub**, independiente de la conexion GitHub de ChatGPT.

### Autenticacion
- GitHub App.
- Repositorios seleccionables.
- Permisos minimos.
- Tokens de corta duracion.
- Secretos cifrados en backend.

### Herramienta -> GitHub
- branch
- commit
- push
- PR
- merge con aprobacion
- checks/CI

### GitHub -> Herramienta
- webhooks de push/merge/PR
- fetch automatico
- refresco de worktree
- rebuild del preview
- conflicto visible, sin sobrescribir cambios

Estados UI:
- Sincronizado
- GitHub adelantado
- Cambios locales
- Divergente
- Conflicto

## 6. Vercel

Ruta primaria: **Herramienta -> GitHub -> Vercel**.

- Push/PR genera Preview.
- Merge a production branch genera Production.
- Herramienta consulta estado, URL y logs con la API de Vercel.
- Deploy directo desde Herramienta queda como fallback.

## 7. QR Live / Mobile

El QR se escanea una vez.

Preferencia: apuntar a una URL estable de Herramienta como `/mobile/{workspaceId}`.

- Antes del push: Live Workspace mediante sandbox/HMR/realtime.
- Despues del push: Vercel Preview.
- Cuando cambia la URL de deployment, el visor movil actualiza el destino sin exigir un QR nuevo.
- Distinguir claramente Live Workspace, Vercel Preview y Production.

## 8. Supabase

Usar para:
- auth
- metadata de proyectos/workspaces
- historial/sesiones
- approvals
- presencia
- realtime
- RLS

Para escala, preferir **Realtime Broadcast** para eventos de preview.

## 9. Agentes

- TEKI: orquestacion.
- NOVA: frontend/product UI.
- BAKI: backend/integraciones.
- MOBI: mobile/store.
- KORA: QA/gate.
- Agentes custom configurables.

Ningun agente hace merge o production deploy sin aprobacion.

## 10. Seguridad

- Read-only sin friccion.
- Diff antes de cambios sensibles.
- Push configurable con approval.
- Merge a main siempre aprobado.
- Production siempre aprobado.
- Delete/migraciones/secrets requieren confirmacion.
- Secretos solo backend seguro.
- Sandbox aislado.
- Audit log completo.

## 11. Costos

Estrategia: empezar con free tiers y pagar solo al escalar.

- GitHub Free mientras cumpla necesidades; Team si se requieren controles avanzados.
- Vercel: plan aplicable al prototipo; Pro cuando el uso comercial/produccion lo requiera.
- Supabase Free durante desarrollo; Pro desde $25/mes cuando se necesite.
- Codex: aprovechar plan ChatGPT elegible donde aplique; API/creditos por consumo cuando sea necesario.
- Evitar SaaS duplicados para CI, deploy o storage.

## 12. Roadmap

A. Workspace real.  
B. GitHub App + sync bidireccional.  
C. Codex real sobre workspace.  
D. Preview live + QR estable.  
E. Vercel desde GitHub.  
F. Supabase + seguridad.  
G. QA/agentes/gates.

## 13. Definition of Done

- Repo/rama real.
- Git bidireccional.
- Codex edita archivos reales.
- Diff/tests reales.
- Commit/push/PR/merge reales.
- Vercel Preview por rama.
- QR live de una sola lectura.
- Live Workspace vs Vercel Preview diferenciados.
- Production aprobada y auditada.
- Secretos seguros.

## Fuentes verificadas - 25/08/2026

- OpenAI: https://help.openai.com/en/articles/11369540
- Codex rate card: https://help.openai.com/en/articles/20001106
- OpenAI Developers: https://developers.openai.com/
- GitHub Apps auth: https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/about-authentication-with-a-github-app
- GitHub Pricing: https://github.com/pricing
- Vercel Git: https://vercel.com/docs/git
- Vercel REST API: https://vercel.com/docs/rest-api
- Supabase Realtime: https://supabase.com/docs/guides/realtime
- Supabase Pricing: https://supabase.com/pricing

> Los precios, modelos y capacidades externas deben verificarse nuevamente al comenzar la implementacion.
