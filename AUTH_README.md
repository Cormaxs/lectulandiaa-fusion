# Sistema de Autenticación - Lectulandiaa

## 📋 Descripción
Sistema completo de autenticación de usuarios implementado con Next.js API Routes, incluyendo registro, login y gestión de sesiones.

## 🚀 Endpoints de API

### POST `/api/users/register`
Registra un nuevo usuario en el sistema.

**Request Body:**
```json
{
  "username": "michaelscott",
  "password": "password123",
  "email": "m.scott@dundermifflin.com"
}
```

**Response (201 - Éxito):**
```json
{
  "message": "Usuario creado exitosamente",
  "user": {
    "id": "1234567890",
    "username": "michaelscott",
    "email": "m.scott@dundermifflin.com"
  }
}
```

**Response (400 - Error):**
```json
{
  "message": "Usuario o email ya existe"
}
```

### POST `/api/users/login`
Inicia sesión con un usuario existente.

**Request Body:**
```json
{
  "username": "tomas",
  "password": "Tomas123@"
}
```

**Response (200 - Éxito):**
```json
{
  "message": "Login exitoso",
  "user": {
    "id": "1234567890",
    "username": "tomas",
    "email": "tomas@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (401 - Error):**
```json
{
  "message": "Credenciales inválidas"
}
```

## 🎨 Páginas de Frontend

### `/auth/register`
Página de registro de nuevos usuarios con formulario validado.

### `/auth/login`
Página de inicio de sesión con redirección automática al éxito.

## 🔧 Características Técnicas

### Seguridad
- **Hashing de contraseñas**: bcryptjs para almacenamiento seguro
- **JWT Tokens**: Autenticación stateless con expiración de 7 días
- **Validación**: Email regex y longitud mínima de contraseña (6 caracteres)

### Almacenamiento
- **Temporal**: Array en memoria (desarrollo)
- **Producción**: Recomendado usar base de datos (MongoDB, PostgreSQL, etc.)

### Estado de Autenticación
- **localStorage**: Token y datos de usuario
- **Header dinámico**: Muestra opciones según estado de login
- **SSR Compatible**: Manejo de hidratación para evitar mismatches

## 📁 Estructura de Archivos

```
pages/
├── api/
│   └── users/
│       ├── register.js    # Endpoint de registro
│       └── login.js       # Endpoint de login
├── auth/
│   ├── register.js        # Página de registro
│   └── login.js           # Página de login
utils/
└── auth.js                # Utilidades de autenticación
styles/
└── Auth.module.css        # Estilos de páginas auth
components/layout/
└── Header.js              # Header con estado de usuario
```

## 🧪 Testing

### Registro de Usuario
```bash
curl -X POST http://localhost:3003/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123",
    "email": "test@example.com"
  }'
```

### Login de Usuario
```bash
curl -X POST http://localhost:3003/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

## 🔄 Próximos Pasos

### Para Producción
1. **Base de datos**: Implementar persistencia real
2. **Variables de entorno**: Mover JWT_SECRET a .env
3. **Validación avanzada**: Email verification, rate limiting
4. **Middleware**: Protección de rutas autenticadas
5. **Refresh tokens**: Para sesiones más largas

### Mejoras Opcionales
- Reset de contraseña
- Confirmación de email
- Perfiles de usuario
- Roles y permisos
- OAuth (Google, GitHub)

## 📝 Notas de Desarrollo

- El sistema actual usa almacenamiento en memoria (reinicia con el servidor)
- Para desarrollo local, el servidor corre en `http://localhost:3003`
- Los tokens JWT expiran en 7 días
- La validación de email es básica (regex simple)