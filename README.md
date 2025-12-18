 # Geometric Jump
 
 Proyecto con:
 - **Frontend**: React + Vite + p5.js
 - **Backend**: PHP (API) + MySQL/MariaDB (persistencia)
 
 ---
 
 ## Requisitos (Windows)
 
 - **XAMPP** instalado (ej: `C:\xampp`) con Apache + MySQL + PHP.
 - **Node.js** (recomendado 16+).
 
 ---
 
 ## 1) Ubicar el proyecto en `htdocs`
 
 Para que el backend quede fácil de servir, colocá el repo dentro de:
 
 ```text
 C:\xampp\htdocs\GeometricJump
 ```
 
 ---
 
 ## 2) Levantar el frontend (Vite)
 
 Abrí una terminal en la raíz del proyecto (`C:\xampp\htdocs\GeometricJump`) y ejecutá:
 
 ```bash
 npm install
 npm run dev
 ```
 
 Vite levanta el frontend (por defecto):
 
 ```text
 http://localhost:5173
 ```
 
 ---
 
 ## 3) Levantar el backend (PHP) en `localhost:8000`
 
 Este proyecto usa el servidor embebido de PHP y sirve la carpeta `backend`.
 
 ### Opción A (recomendada): usar la ruta completa de PHP en XAMPP
 
 En PowerShell (desde la raíz del proyecto), ejecutá:
 
 ```powershell
 C:\xampp\php\php.exe -S localhost:8000 -t backend
 ```
 
 Backend disponible en:
 
 ```text
 http://localhost:8000
 ```
 
 ### Opción B: agregar PHP al PATH (para poder usar `php ...`)
 
 1) Agregá esta carpeta a tu variable de entorno `Path`:
 
 ```text
 C:\xampp\php
 ```
 
 2) Cerrá y abrí la terminal y verificá:
 
 ```powershell
 php -v
 ```
 
 3) Ahora podés levantar el backend así:
 
 ```powershell
 php -S localhost:8000 -t backend
 ```
 
 ---
 
 ## 4) Base de datos (MySQL/MariaDB)
 
 1) Abrí **XAMPP Control Panel** y arrancá **MySQL**.
 2) Importá/ejecutá el esquema:
    - Archivo: `backend/init.sql`
    - Crea la DB `geometryjump` y las tablas necesarias.
 
 La conexión se configura en `backend/db.php` (host/user/pass según tu setup).
 
 ---
 
 ## Troubleshooting
 
 - **`php` no se reconoce como comando**
   - Usá `C:\xampp\php\php.exe ...` (Opción A) o agregá `C:\xampp\php` al `Path`.
 
 - **El frontend no conecta al backend**
   - Verificá que el backend esté corriendo en `http://localhost:8000`.
   - Verificá que el puerto `8000` no esté siendo usado por otro proceso.
