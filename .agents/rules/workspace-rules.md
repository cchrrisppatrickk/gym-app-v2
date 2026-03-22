---
trigger: always_on
---

📂 1. Estructura del Repositorio (Monorepo Simulado)
Para mantener todo organizado sin la complejidad extrema de herramientas como Turborepo, usaremos una estructura de carpetas raíz centralizada. El agente de desarrollo (Antigravity) no debe mezclar responsabilidades entre estas carpetas:

/backend ➔ Exclusivo para el proyecto NestJS y Prisma.

/frontend ➔ Exclusivo para Next.js, Tailwind y la configuración de Tauri (src-tauri).

/infra ➔ Archivos de Docker (docker-compose.yml, Dockerfiles), configuración de la base de datos y scripts de despliegue.

/n8n-workflows ➔ Archivos JSON exportados de los flujos de n8n para tener control de versiones de las automatizaciones.

💻 2. Convenciones de Código (TypeScript Estricto)
TypeScript será el único lenguaje permitido para la lógica de la aplicación.

Tipado Fuerte: Prohibido el uso de any. Si un tipo es desconocido, usar unknown y validarlo, o definir la interface / type correspondiente.

Manejo de DTOs en Modo Estricto: Para evitar errores de inicialización (TS2564) en las clases de transferencia de datos (DTOs), se debe usar obligatoriamente el operador de asignación definitiva (!) en las propiedades requeridas (ej. name!: string;) y el modificador opcional (?) en las no requeridas, ya que NestJS poblará estos valores en tiempo de ejecución.

Nomenclatura (Naming):

Archivos: kebab-case (ej. user-profile.component.tsx, auth.service.ts).

Clases e Interfaces: PascalCase (ej. CashRegisterService, UserDto).

Variables y Funciones: camelCase (ej. calculateTotal, saldoPendiente).

Constantes Globales: UPPER_SNAKE_CASE (ej. MAX_LOGIN_ATTEMPTS).

Idioma del Código: El código fuente (variables, funciones, clases) debe escribirse en Inglés para mantener el estándar de la industria, pero los mensajes de error visibles para el usuario y el frontend estarán en Español.

🏛️ 3. Reglas Arquitectónicas Inquebrantables
Estas reglas dictan cómo el código debe estructurarse internamente. El agente no puede tomar atajos.

Para el Backend (NestJS):

Estricta Separación en 3 Capas:

Controllers: Solo reciben la petición (Request), llaman al servicio y devuelven la respuesta (Response). Cero lógica de negocio aquí.

Services: Contienen toda la lógica, cálculos de fechas y reglas del gimnasio.

Repositories/Prisma: La única capa que ejecuta consultas a PostgreSQL.

Inyección de Dependencias: Todo servicio debe ser inyectable (@Injectable()). No se instanciarán clases manualmente con new.

Para el Frontend (Next.js + Tauri):

Aislamiento de Componentes: Las vistas (pages o app) solo ensamblan componentes. La lógica pesada de la interfaz debe vivir en Hooks personalizados (ej. useCashRegister()).

Estado Global: Utilizar Zustand o Context API solo cuando sea estrictamente necesario (ej. sesión del usuario, estado de la caja). Para lo demás, el estado debe ser local.

🗄️ 4. Reglas de Base de Datos (Prisma)
Fuente Única de la Verdad: El archivo schema.prisma es el corazón del sistema. Cualquier cambio en las tablas o relaciones debe hacerse primero aquí, no directamente en SQL.

Cliente Prisma Estándar (Prohibido Driver Adapters): Para evitar fallos de conexión local (como el error SCRAM-SERVER-FIRST-MESSAGE), se utilizará exclusivamente el cliente nativo de Prisma. Queda estrictamente prohibido instalar o configurar adaptadores experimentales orientados a la nube (como @prisma/adapter-pg o librerías externas como pg). El PrismaService debe limitarse a instanciar new PrismaClient() de forma limpia.

Soft Deletes (Borrado Lógico): Nunca eliminaremos registros de usuarios, pagos o membresías (DELETE). Usaremos un campo isActive: Boolean o deletedAt: DateTime? para mantener el historial intacto y no romper las estadísticas financieras.

🤖 5. Directivas de Asistencia (Antigravity/AI Rules)
Al solicitar la generación de un nuevo módulo o archivo, el agente deberá seguir este flujo:

Pensar antes de codificar: Presentar una breve viabilidad de lo que se va a modificar antes de escupir código.

Archivos Pequeños: Si un archivo supera las 200-300 líneas de código, el agente debe sugerir refactorizarlo y dividirlo en módulos más pequeños.

Seguridad por Defecto: Todos los endpoints del backend deben asumir que están protegidos por el Guard de JWT, a menos que se especifique que son públicos (como el /login).