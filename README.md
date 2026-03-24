# AgroTecnia JyM B2B (Módulo Agrícola) 🌾🤖

Landing Page corporativa y plataforma B2B enfocada en el sector rural y agropecuario de los Llanos Orientales. Desarrollado por **JyM Tech Solutions (Matrícula Mercantil 495502)**.

---

## 🗺️ ROADMAP DEL PROYECTO (Hoja de Ruta)

Este proyecto no es solo una página web; es el inicio de un **SaaS (Software as a Service) Agrícola**. A continuación, detallamos las fases estratégicas y técnicas:

### FASE 1: Construcción y Prototipado (ACTUAL) 🟡
- [x] Inicialización del entorno con Vite + React.
- [x] Configuración de Tailwind CSS y Lucide React (Íconos).
- [x] Creación de `App.jsx` con diseño "Mobile First" pensado para conectividad y lectura en fincas.
- [x] Módulos UI: Hero, Servicios (Agronomía, Zootecnia, IA, Clima), Dolores del Campo y Formulario de Diagnóstico.

### FASE 2: Despliegue y Pruebas Piloto (Próximos Pasos) 🔴
- [ ] **Despliegue a Vercel:** Conectar este repositorio de GitHub a Vercel para que esté online y accesible mediante URL.
- [ ] **Piloto "Dani":** Enviar el enlace en vivo a Dani. Su llenado del formulario servirá como prueba de Interfaz de Usuario (UI) y aseguramiento de calidad (QA).
- [ ] **Captación en Cascada:** Dani comparte el enlace con colegas y vecinos. Se valida la recepción del mensaje e interés del mercado.

### FASE 3: Backend & Base de Datos (Integración) 🔴
- [ ] **Conexión a Supabase:** Remplazar el envío del formulario estático por una inyección directa a tu base de datos central de clientes B2B (`leads_agricolas`).
- [ ] **Notificación Activa:** Configurar un "Edge Function" en Supabase o webhook simple para que te notifique a tu WhatsApp apenas caiga un nuevo Lead. *(Eliminando a Make del proceso)*.

### FASE 4: Módulo de IA "AgroBot" (Largo Plazo) 🔴
- [ ] **Desarrollo del Botpress/WhatsApp Bot:** Crear los flujos específicos de "AgroBot" (Bitácora de Notas de voz gestionadas con Whisper/Llama, Alertas meteorológicas).
- [ ] **API Groq/Gemini Vision:** Integrar la lectura de fotos fitosanitarias (diagnóstico de plagas) directo desde el canal de chat.
- [ ] **Dashboard Cliente:** Habilitar un inicio de sesión dentro de esta página para que fincas más grandes vean un resumen en gráficos de sus gastos y cosechas.

---

## 🛠️ Stack Tecnológico
* **Frontend:** React + Tailwind CSS
* **Despliegue:** Vercel (Próximamente)
* **Base de Datos / Backend:** Supabase (Próximamente)
* **Inteligencia Artificial:** Groq / Gemini (Próximamente Integrado)

## 💻 Instrucciones de Desarrollo Local
Para previsualizar cómo va la página:

```bash
npm install # Instalar dependencias 
npm run dev # Levantar el servidor local
```
