# 🐾 PetHouse - Frontend (Equipo 4)

Este es el proyecto frontend del Sistema de Ventas para mascotas, desarrollado con **Angular 18** y **TailwindCSS**. 

Este repositorio forma parte del Proyecto Integrador 2 (GoTechy).

## 🚀 Requisitos Previos

Antes de ejecutar este proyecto, asegúrate de tener instalado en tu computadora:
- [Node.js](https://nodejs.org/) (Versión 18 o superior recomendada)
- Angular CLI (Puedes instalarlo globalmente ejecutando `npm install -g @angular/cli`)

## 🛠️ Instalación

Para descargar todas las dependencias necesarias del proyecto, abre una terminal en la raíz de esta carpeta y ejecuta:

```bash
npm install
```

## ▶️ Ejecutar el Proyecto

Una vez instaladas las dependencias, puedes levantar el servidor de desarrollo ejecutando:

```bash
npm start
```
*(Alternativamente puedes usar `ng serve`)*

**El frontend estará corriendo y disponible en:**
👉 **`http://localhost:4200/`**

La aplicación se recargará automáticamente si realizas cambios en los archivos fuente.

## 🔌 Conexión con el Backend

El frontend está configurado mediante `HttpClient` para comunicarse con la API del backend (Microservicio de Spring Boot). 
Por defecto, el frontend enviará las peticiones HTTP (GET, POST, etc.) hacia:

👉 **`http://localhost:8080/`**

> **Importante para el equipo Backend:** 
> Asegúrense de tener el servidor Spring Boot corriendo en el puerto `8080` y de tener configurados los **CORS** (`@CrossOrigin(origins = "http://localhost:4200")`) en sus Controladores para evitar bloqueos de seguridad en el navegador al probar los endpoints desde aquí.

## 📁 Estructura Principal

- `src/app/pages/home`: Contiene la Landing Page pública.
- `src/app/components/product-list`: Contiene la tabla administrativa y el Modal para probar la creación y listado de productos.
- `src/app/services`: Contiene los servicios encargados de la comunicación HTTP con el backend.
