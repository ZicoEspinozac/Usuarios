# Usuarios

Este proyecto es una aplicación de gestión de usuarios que incluye un backend y un frontend. El backend está construido con Node.js y Prisma, y el frontend está construido con React y Ant Design. La aplicación está dockerizada para facilitar su despliegue y ejecución.

## Requisitos

- Docker
- Docker Compose (opcional, si decides usarlo)

## Configuración

### Variables de Entorno

Asegúrate de configurar las variables de entorno necesarias en los archivos `.env` tanto para el backend como para el frontend.

#### Backend

Crea un archivo `.env` en el directorio `Backend` con el siguiente contenido:

```properties
DATABASE_URL="mysql://root:root@<IP_DE_TU_BASE_DE_DATOS>:3306/usuario"
JWT_SECRET=mi_clave_secreta
```

#### Frontend

Crea un archivo `.env` en el directorio `frontend` con el siguiente contenido:

```properties
REACT_APP_API_URL=http://localhost:8080
```

### Backend

Navega al directorio del backend:

```sh
cd Backend
```

Construye la imagen Docker:

```sh
docker build -t backend-app .
```

Ejecuta el contenedor Docker:

```sh
docker run -p 8080:8080 backend-app
```

### Frontend

Navega al directorio del frontend:

```sh
cd frontend
```

Construye la imagen Docker:

```sh
docker build -t frontend-app .
```

Ejecuta el contenedor Docker:

```sh
docker run -p 3000:3000 frontend-app
```

## Uso

Una vez que ambos contenedores estén corriendo, puedes acceder a la aplicación en tu navegador web:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:8080](http://localhost:8080)
