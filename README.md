# Sistema de Gestión de Incidencias para Operaciones de Delivery

Aplicación full-stack diseñada para optimizar la gestión de incidencias en operaciones de empresas de delivery con flotas de repartidores.

La plataforma permite que los riders reporten incidencias en segundos desde el móvil, mientras que los gestores operativos pueden visualizar, priorizar y resolver incidencias desde un panel centralizado.

---

## Problema que Resuelve

El cliente debe gestionar las incidencias operativas comunes de una pequeña flota de repartidores de forma "manual", pero la aplicación que usan no cuenta con un módulo de reporte de incidencias al encargado regional. Los repartidores reportan problemas mediante llamadas telefónicas o mensajes, lo que provoca:

- ❌ Falta de visibilidad operativa
- ❌ Pérdida de información
- ❌ Respuestas tardías
- ❌ Falta de métricas de rendimiento

Este sistema introduce un flujo digital estructurado para la gestión de incidencias.

### Beneficios Principales

- ✅ Eliminación de reportes por teléfono
- ✅ Visibilidad centralizada de incidencias
- ✅ Priorización automática
- ✅ Seguimiento de SLA
- ✅ Historial completo y trazabilidad

---

## Caso de Uso

Diseñado para empresas de delivery con flotas de aproximadamente 100 repartidores o más.

Los riders pueden reportar:

### Problemas Técnicos

- Fallos en la app del rider
- Problemas de GPS
- Errores de geolocalización

### Problemas de Entrega

- Pinchazo
- Tienda cerrada
- Pedidos retrasados

### Problemas Operativos

- Ausencias
- Conflictos de horario
- Reasignaciones

---

## Características

### Para Riders

- Reportar incidencias en menos de 30 segundos
- Categorización intuitiva
- Seguimiento del estado de incidencias
- Historial personal
- Interfaz optimizada para móvil

### Para Gestores Operativos

- Dashboard centralizado
- Métricas en tiempo real
- Sistema automático de prioridades
- Seguimiento de SLA
- Filtros avanzados
- Gestión del ciclo de vida de incidencias:
  ```
  Nuevo → En Revisión → Resuelto / Descartado
  ```
- Ajuste manual de prioridades
- Historial completo de cambios
- Gestión de riders (CRUD)
- Estadísticas operativas

---

## Demo gifs

### Rider

![Rider](/docs/gifs/rider.gif)

### Gestor (admin)

![Admin](/docs/gifs/admin.gif)

## Capturas de Pantalla

### Login

![Login](/docs/screenshots/login_page.png)

### Dashboard del Gestor (admin)

![Dashboard del Gestor](/docs/screenshots/admin_dashboard.png)

### Gestión de Incidencias (admin)

![Gestión de Incidencias](/docs/screenshots/admin_incidentes.png)

### Detalle de Incidencias (admin)

![Detalle de Incidencias](/docs/screenshots/admin_gestion_incidente.png)

### Gestión de Riders (admin)

![Gestión de Riders](/docs/screenshots/admin_gestion_riders.png)

### Crear Riders (admin)

![Crear Riders](/docs/screenshots/admin_creacion_rider.png)

### Dashboard del rider (rider)

![Dashboard del rider](/docs/screenshots/rider_dashboard.png)

### Reporte de Incidencias (rider)

![Reporte de Incidencias](/docs/screenshots/reporte_incidente.png)

---

## Stack Tecnológico

### Backend

| Tecnología | Uso                 |
| ---------- | ------------------- |
| Node.js    | Runtime             |
| Express.js | Framework HTTP      |
| MongoDB    | Base de datos       |
| Mongoose   | ODM                 |
| JWT        | Autenticación       |
| bcrypt     | Hash de contraseñas |

### Seguridad

- Hash de contraseñas con bcrypt
- Autenticación JWT
- Control de acceso basado en roles (RBAC)

### Frontend

| Tecnología   | Uso                          |
| ------------ | ---------------------------- |
| React 18     | UI Framework                 |
| Vite         | Build tool                   |
| React Router | Navegación                   |
| Tailwind CSS | Estilos                      |
| Axios        | HTTP Client con interceptors |

### Gestión de Estado

- Context API
- Custom Hooks (`useUsers`, `useIncidents`)

---

## Arquitectura del Sistema

El proyecto sigue una arquitectura en capas basada en **MVC con servicios** para separar responsabilidades.

### Esquema de la arquitectura

![Esquema de la arquitectura](/docs/screenshots/arquitectura_esquema.png)

---

## Instalación

### Prerrequisitos

- Node.js >= 18
- MongoDB >= 6
- npm o yarn

### Variables de Entorno

**Backend** — crear `.env` dentro de `backend/`

```env
PORT=

MONGODB_URI=

JWT_SECRET=
JWT_EXPIRES_IN=

DEFAULT_ADMIN_USERNAME=
DEFAULT_ADMIN_PASSWORD=
```

**Frontend** — crear `.env` dentro de `frontend/`

```env
VITE_API_URL=
```

---

## Ejecutar el Proyecto

**Backend**

```bash
cd backend
npm install
npm run dev
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

---

## Estructura del Proyecto

```
incident-management-system
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middlewares
│   ├── models
│   ├── routes
│   ├── services
│   └── validators
│
├── frontend
│   ├── api
│   ├── assets
│   ├── components
│   ├── context
│   ├── hooks
│   ├── pages
│   ├── routes
│   ├── styles
│   └── utils
│
└── README.md
```

---

## Características Técnicas Destacadas

### Sistema de Priorización Automática

Las incidencias se clasifican automáticamente según tipo y subtipo.

**Beneficios:**

- Eliminación de sesgos humanos
- Clasificación consistente
- Respuesta más rápida a incidencias críticas

### Gestión de SLA

Cada incidencia tiene seguimiento de tiempos de respuesta.

**Incluye:**

- Alertas visuales
- Temporizador de SLA
- Métricas de cumplimiento

### Sistema de Auditoría

Registro completo de cambios:

- ¿Quién realizó la acción?
- ¿Cuándo ocurrió?
- ¿Qué valores cambiaron?

### Responsive & Mobile First

- Diseño mobile-first
- Optimizado para uso de riders
- Preparado para PWA

---

## Roadmap

- [ ] Notificaciones Push (Firebase)
- [ ] Actualizaciones en tiempo real con Socket.io
- [ ] Rate limiting
- [ ] Seguridad adicional con Helmet
- [ ] Dashboard analítico con gráficos
- [ ] Exportación de reportes CSV / Excel
- [ ] Modo oscuro
- [ ] Internacionalización (i18n)
