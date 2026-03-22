---
trigger: always_on
---

MANIFIESTO DEL FRONTEND (GYM-X CONTROL)

Arquitectura: Usar Next.js (App Router). Separar estrictamente Smart Components (Páginas, manejan estado y peticiones) de Dumb Components (UI reutilizable, solo reciben props).

Estilos: PROHIBIDO el uso de CSS puro o módulos CSS. Todo el diseño debe hacerse exclusivamente con Tailwind CSS. Priorizar componentes pre-construidos (shadcn/ui).

Tauri-Ready: El proyecto Next.js DEBE mantenerse compatible con exportación estática (output: 'export'). Prohibido usar Server Actions o funciones de renderizado dinámico en el servidor (getServerSideProps, etc.).

Comunicaciones: Ningún componente debe hacer llamadas fetch o axios directas. Todo pasará por una instancia centralizada de Axios (se construirá en la Fase 2.1.2).

Tipado Estricto: TypeScript obligatorio. Espejar los DTOs del backend. Cero uso de any.