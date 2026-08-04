# APERP Control Bodega — Frontend

Interfaz web para la migración del sistema APERP de Control de Bodega. El proyecto conserva la estructura React existente y consume las reglas de negocio, seguridad y contexto multiempresa desde el backend Node.js.

## Tecnologías

- React 19 y React Router 7.
- Vite 7 y `vite-plugin-pwa`.
- Material UI 7 y Emotion.
- Axios para comunicación HTTP.
- Formik y Yup para formularios.
- TanStack Query para datos remotos.

No se incorpora un segundo framework visual. La identidad APERP se implementa mediante el tema MUI, componentes React y recursos SVG propios del repositorio.

## Ejecución

```powershell
npm install
npm run start
```

La aplicación usa `/free` como ruta base. En desarrollo, la API se obtiene desde `VITE_API_URL`; si no está definida, se usa el host actual en el puerto `3000`.

Comprobaciones principales:

```powershell
npm run build
npm run lint
```

## Estructura relevante

- `src/api/`: clientes HTTP; no contiene reglas de negocio.
- `src/contexts/`: autenticación, empresa activa y configuración visual.
- `src/layout/Dashboard/`: encabezado, navegación lateral y pie de la aplicación autenticada.
- `src/pages/maestros/`: mantenedores GeneXus y configuración cabecera-detalle.
- `src/pages/seguridad/`: usuarios, programas, roles y asignaciones.
- `src/sections/auth/`: experiencia de inicio de sesión.
- `src/themes/`: paleta y personalización de componentes MUI.

## Seguridad y multiempresa

El frontend muestra el contexto recibido al autenticar, pero no autoriza por sí solo ni permite que una pantalla reemplace la empresa de sesión. El backend determina el usuario y la empresa efectivos, y aplica los permisos compatibles con `GECODEMP`, `AsigSist`, `Asig`, `AsigProg` y `AsigProg1`.

## Mantenedores de dos niveles

Los niveles de transacción GeneXus se manejan como en CONEX:

1. El nivel uno selecciona y mantiene la cabecera.
2. El nivel dos se presenta dentro del contexto de esa cabecera.
3. La empresa y las llaves heredadas no se vuelven a solicitar al usuario.
4. El detalle no se expone como un maestro independiente.

El patrón genérico está en `src/pages/maestros/gxMaestroCrud.jsx`. La presentación puede evolucionar sin trasladar al frontend las reglas que pertenecen al backend.

## Identidad visual

La remasterización utiliza el azul APERP, navegación azul profundo, fondos claros de trabajo y un isotipo SVG escalable. Incluye login adaptable, logo, favicon, encabezado, menú lateral, inicio y estados visuales de los mantenedores.

La especificación de diseño y migración se conserva en el repositorio backend, dentro de `docs/migration/aperp-ui-remaster.md`.

## Origen de componentes

El proyecto partió de Mantis Free React Material UI Dashboard Template. Se mantiene la atribución y licencia de sus componentes originales conforme a su licencia MIT; la interfaz y reglas descritas aquí corresponden a APERP Control Bodega.
