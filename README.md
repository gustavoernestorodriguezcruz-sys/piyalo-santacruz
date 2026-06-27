# PIYALO

Sistema estático de SEO local (Rank & Rent) enfocado en convertir visitas en mensajes de WhatsApp.
No requiere backend, bases de datos ni instalación.

---

## 🚀 1. INSTALACIÓN EN GITHUB (PASO A PASO)

1. Crear cuenta en GitHub: https://github.com
2. Crear repositorio → "New repository"
3. Nombre sugerido: `piyalo-santacruz`
4. Seleccionar: **PUBLIC**
5. Crear repositorio
6. Subir archivos con "Upload files"
7. Arrastrar toda la carpeta del proyecto
8. Commit changes

---

## 🌐 2. ACTIVAR WEB (GITHUB PAGES)

1. Ir a **SETTINGS** del repositorio
2. Ir a **PAGES**
3. En "Source" seleccionar:
   - Branch: `main`
   - Folder: `/ (root)`
4. Guardar
5. Esperar 1–2 minutos
6. Se generará un link público

---

## ✏️ 3. EDITAR SERVICIOS (SIN ROMPER EL SISTEMA)

Abre: `/data/services.json`

⚠️ **IMPORTANTE:**
- NO borres llaves `{ }`
- NO elimines comillas `" "`
- NO cambies la estructura

➕ **Para agregar más servicios:**

Copia un bloque de servicio completo y sepáralo con una coma `,`. Ejemplo de estructura limpia:
```json
    {
      "title": "",
      "category": "",
      "description": "",
      "whatsapp_number": "",
      "keywords": [""]
    }
