# OnMind — Documento de producto

**Fecha:** Abril 2026

> Una guía funcional de qué hace OnMind, cómo funciona y qué resuelve. Pensada para que cualquier persona — un creador de contenido, un cliente antes de una demo, alguien del equipo — entienda el producto a fondo en una lectura.

---

## Qué es OnMind

OnMind mantiene vivo el vínculo con tus clientes por WhatsApp **sin que tengas que escribir cientos de mensajes a mano**. Configurás una vez cómo querés comunicarte con cada tipo de cliente (cuántos mensajes al año, qué les vas a decir) y OnMind genera todo el calendario de mensajes y los envía por vos a lo largo del año.

El problema que resuelve es simple: sabés que tendrías que escribirles a todos tus clientes para mantenerte presente, pero no te da el tiempo. Los contactos se enfrían. Cuando necesitan comprar, vender, alquilar, contratar — llaman al que tienen más presente. OnMind hace que ese seas vos.

Lo usamos primero en **inmobiliario** (es el rubro de Martín, uno de los socios, que diseñó el método antes de que existiera el producto). Pero funciona igual en cualquier negocio donde el vínculo con el cliente sea recurrente y a largo plazo: estudios contables, asesores financieros, talleres mecánicos, profesionales de la salud, escuelas, comercios con clientela repetida.

---

## Cómo funciona

El modelo es un flujo de cuatro piezas. Configurás las primeras tres una vez; la cuarta se genera sola.

```
   Contactos          Categorías           Plantillas           Calendario anual
  (tu cartera) ──▶  (frecuencia anual) ──▶ (qué decir) ──▶  (mensajes programados)
                                                                      │
                                                                      ▼
                                                              WhatsApp del cliente
```

- **Contactos:** tu cartera. Cada uno con su nombre, teléfono, fechas y datos relevantes.
- **Categorías:** definen *cuántas veces al año* le vas a escribir a cada contacto y *con qué plantillas*. Por ejemplo: A+ recibe 12 mensajes al año, B recibe 4. Las categorías son configurables por cada negocio.
- **Plantillas:** los textos (con variables como `{nombre}`, `{empresa}`) que se van a enviar. Pueden tener imagen, audio o documento adjunto.
- **Calendario anual:** OnMind toma cada contacto, mira su categoría, distribuye los mensajes a lo largo del año en días hábiles y los va enviando. Vos solo revisás.

Conectás tu WhatsApp escaneando un QR (igual que WhatsApp Web). Tu número sigue siendo el tuyo, no reemplazás nada.

---

## Núcleo del producto

Esto es lo que más se usa día a día y lo que define el valor de OnMind.

### Plan de seguimiento automático

Es el corazón del producto. Cada contacto pertenece a una **categoría** que define cuántos mensajes recibe en el año y qué plantillas se usan. OnMind toma esa configuración y genera automáticamente todos los mensajes programados — distribuidos a lo largo del año, **solo en días hábiles**, evitando fines de semana y feriados.

Si en algún momento cambiás de idea — agregás una plantilla, cambiás la frecuencia de una categoría, retocás un texto — **se regeneran los mensajes pendientes** y el calendario se reconstruye con la configuración nueva. Los mensajes ya enviados no se tocan.

Si te vas de vacaciones, activás el **modo vacaciones** con fecha de inicio y fin: durante ese período los envíos se pausan. Cuando vuelve, todo retoma solo.

### Plantillas

Las plantillas son los textos reutilizables que OnMind usa para armar cada mensaje. Soportan **variables dinámicas** que se reemplazan automáticamente con los datos de cada contacto:

- `{nombre}`, `{apellido}`, `{nombreCompleto}`, `{apodo}`
- `{empresa}` (el nombre de tu negocio)
- `{profesion}`, `{equipo}` (equipo de fútbol favorito)
- `{operacion}` (compra, venta, alquiler)

Cada plantilla puede tener **texto + imagen + audio + documento** adjunto. El audio se graba directamente desde el micrófono en la interfaz (los mensajes con voz tienen un impacto distinto al texto puro).

Las plantillas vienen organizadas por categorías: cumpleaños, fechas especiales, seguimiento, mensajes por categoría de contacto, generales. Podés crear las tuyas, duplicar las existentes, o desactivar las que no usás. **Si editás una plantilla que ya tiene mensajes pendientes, OnMind los actualiza automáticamente** con los datos vigentes de cada contacto.

> **Por qué importa la variedad:** los mensajes de categoría se repiten varias veces al año. Si tenés pocas plantillas, los clientes empiezan a recibir textos parecidos. Cuantas más plantillas armes, más natural se siente el contacto.

### Contactos: tu cartera como un CRM liviano

OnMind es también un lugar donde tu cartera está ordenada. Cada contacto tiene una **ficha completa**:

- Datos básicos (nombre, WhatsApp, email, dirección, localidad)
- Datos personales (cumpleaños, género, hobbies, mascotas, si es padre/abuelo)
- Origen y contexto (cómo llegó, motivo de contacto, fecha de primer contacto)
- Profesión, equipo de fútbol, redes sociales
- Etiquetas (clasificación flexible por colores)
- Tipos (Cliente, Prospecto, Proveedor — configurables)
- Notas (con notas destacadas que aparecen siempre visibles en la conversación)

La lista de contactos tiene **filtros avanzados** (categoría, tipo, etiquetas, operación, origen, profesión, equipo, género, familia, fechas especiales por mes…). Los filtros se guardan en la URL — podés compartir una búsqueda con un asistente.

Sobre los contactos seleccionados podés hacer **acciones masivas**: activar/desactivar, cambiar categoría (los mensajes pendientes se regeneran automáticamente), eliminar.

**Importación y exportación CSV.** Importás tu cartera entera desde una planilla; OnMind detecta el formato del teléfono (con o sin código de país), si un teléfono ya existe actualiza el contacto en vez de duplicarlo, y soporta múltiples fechas de cierre por contacto separadas por `;`.

### Fechas que no se escapan

Hay dos tipos de fechas que OnMind maneja por vos.

**Fechas especiales:** cumpleaños del contacto y celebraciones globales (Día del Padre, Día de la Madre, Día del Niño, Día del Abuelo). Las globales se envían solo a los contactos elegibles — el Día del Padre solo a quienes están marcados como padres con género masculino, por ejemplo. No tenés que armar listas a mano: combinás los filtros de Familia y Género y la audiencia se arma sola.

**Fechas de cierre:** registran un cierre de operación con una propiedad. Cuatro tipos:

- Alquiler Propietario
- Alquiler Inquilino
- Comprador
- Vendedor

Cada cierre puede tener **recordatorios automáticos** con un offset de días antes o después. Por ejemplo: 30 días antes del vencimiento de un alquiler le mandás al inquilino un mensaje preguntando si va a renovar. 30 días después de una venta, retomás el contacto con el comprador. Los recordatorios se mueven solos a un día hábil si caen en fin de semana o feriado.

Los **feriados de Uruguay vienen precargados** (recurrentes y los móviles del año en curso, como Carnaval o Semana de Turismo). Si tu negocio opera en otro país, podés desactivar los precargados y agregar los tuyos.

### Conversaciones unificadas

OnMind incluye una **bandeja de WhatsApp** donde tu equipo recibe y responde mensajes desde un solo lugar. Soporta texto, imágenes, video, documentos (hasta 16MB) y audio grabado desde el navegador. Los mensajes llegan en tiempo real — no hace falta recargar.

Cada mensaje enviado tiene un badge que indica de dónde salió: *Manual* (lo escribió alguien del equipo), *Externo* (desde el celular o WhatsApp Web), *Programado* (de un mensaje programado), o *Campaña*. Eso te deja claro siempre qué fue automático y qué fue humano.

> **Por qué esto importa para tu equipo:** WhatsApp Web te deja conectar 4 dispositivos. Con OnMind, **cuantos asistentes necesites** entran a la plataforma y responden en nombre de tu número desde una única conexión. Tu cartera sigue siendo tuya y vos decidís quién accede.

---

## Otras capacidades

### Campañas

Permiten enviar un mensaje a un grupo de contactos filtrados por múltiples criterios, con texto, imagen, audio o documento. Soportan envío inmediato o programado, y distribución en varios días (ej: 50 mensajes por día durante una semana). Útil para anuncios puntuales, novedades del negocio, comunicaciones de fin de año.

> **Importante — uso responsable.** WhatsApp (Meta) es muy estricto con los mensajes masivos. **El principal motivo de baneo es escribirle a un número que nunca te escribió primero.** Si conseguiste el contacto por Instagram, por una base de datos de terceros, o cualquier vía donde el otro no inició conversación con tu número de WhatsApp, para Meta eso es spam — aunque el mensaje sea inofensivo. En cambio, si le escribís a contactos de siempre (que ya conversaron con vos en algún momento) o respondés a los que inician la conversación, no hay problema: no es spam.
>
> Por eso, además del origen del contacto, una campaña mal usada — texto idéntico a muchos contactos al mismo tiempo, audiencia poco segmentada, mensajes que parecen promocionales — también puede derivar en bloqueos o suspensión del número. **Las campañas son una herramienta puntual, no la columna vertebral de la comunicación.** El plan de seguimiento (mensajes programados por categoría) es lo que te mantiene presente todo el año sin riesgo, porque distribuye los envíos en el tiempo y personaliza cada mensaje. Las campañas se usan con criterio, en momentos específicos, con audiencias bien filtradas y solo sobre contactos con los que ya hubo conversación previa.

### Configuración general

- **Datos del negocio:** logo, nombre y descripción. El nombre se usa como variable `{empresa}` en las plantillas.
- **Modo vacaciones:** pausa todos los envíos automáticos y campañas durante el período que definas.
- **Regenerar mensajes:** elimina los mensajes pendientes de todos los contactos activos y los genera de nuevo con la configuración actual de categorías y plantillas. Útil después de cambios grandes.
- **Feriados:** ABM completo (Uruguay precargado, agregables, recurrentes o de año específico).

### Usuarios y roles

Dos roles:

- **Administrador:** acceso total. Invita usuarios, configura la instancia de WhatsApp, accede a todas las opciones.
- **Operador:** acceso a contactos, conversaciones, campañas y plantillas. No invita usuarios ni cambia configuración crítica.

Las invitaciones se envían por email. Podés reenviar, copiar el enlace o cancelar invitaciones pendientes desde el panel.

### Conexión de WhatsApp

Cada cuenta se conecta a **un número de WhatsApp**. La conexión se hace escaneando un QR desde *Dispositivos vinculados* en la app de WhatsApp. Si la conexión se pierde, los mensajes pendientes quedan en cola hasta que reconectás. Hay un envío de prueba para verificar que la instancia está respondiendo.

---

## Qué NO es / qué NO resuelve

Para evitar confusiones — sobre todo en una demo o en contenido — conviene tener claro lo que OnMind **no** hace:

- **No es un chatbot.** No responde leads nuevos por vos. Si te llega un cliente nuevo por WhatsApp, lo seguís atendiendo vos o tu equipo, como siempre. OnMind suma el contacto a tu cartera automáticamente, pero la conversación inicial es humana.
- **No es spam.** El valor está en el mensaje justo en el momento justo, distribuido en el tiempo. No es una herramienta para descargas masivas.
- **No es un CRM gigante** que requiera tres meses de implementación. Arrancás en un día.
- **No reemplaza tu WhatsApp.** Tu WhatsApp Business sigue funcionando normal en tu celular. OnMind se conecta a tu número y suma capacidades — no te saca nada.
- **No resuelve "responder rápido a leads nuevos".** Eso sigue siendo trabajo humano. OnMind resuelve mantener vivo el vínculo con la cartera que ya tenés.

---

## Cómo se empieza

Arrancar es **simple**, pero el resultado depende de cómo se prepare el arranque. La app es muy fácil de usar; el trabajo está en pensar bien tres cosas antes de importar contactos. Hacerlo bien una vez te ahorra meses de reconfiguración después.

**Paso 1 — Pensar y configurar las categorías.** Es la decisión más importante. Las categorías definen *cuántos mensajes al año* recibe cada contacto y *con qué plantillas*. Sin categorías bien pensadas, todo lo demás cojea. Es la columna del CSV que define el comportamiento del sistema.

**Paso 2 — Crear las plantillas.** Es un trabajo puntual, más o menos costoso según cuánta variedad quieras. Cuantas más plantillas tengas — sobre todo en las categorías de mayor frecuencia — más natural se sienten los mensajes a lo largo del año. Acá vale la pena invertir tiempo: las plantillas son lo que va a llegar a tus clientes durante meses.

**Paso 3 — Preparar el CSV de contactos prolijo.** Antes de importar, dedicar tiempo a ordenar los datos: teléfono, nombre, **categoría** (la columna más importante), email, fechas especiales (cumpleaños), fechas de cierre, etiquetas. Una planilla bien armada deja todo configurado de arranque. Una planilla desprolija te obliga a corregir contacto por contacto después.

**Paso 4 — Importar y conectar WhatsApp.** Escaneás el QR, importás el CSV, OnMind genera todos los mensajes del año. De acá en adelante son **minutos al día**: revisás los mensajes pendientes, respondés conversaciones, atendés a tus clientes.

> El trabajo previo es real, pero se hace una sola vez. La recompensa es un sistema que después corre solo y te mantiene presente con toda tu cartera durante todo el año.

---

## Glosario

- **Categoría** — nivel de relación con un contacto (ej: A+, A, B, C). Define cuántos mensajes recibe al año y con qué plantillas. Configurable por cada negocio.
- **Plantilla** — texto reutilizable (con variables, imagen, audio o documento opcionales) que OnMind usa para armar cada mensaje.
- **Mensaje programado** — mensaje pendiente de envío, generado automáticamente a partir de una categoría o una fecha. Se envía solo en días hábiles.
- **Fecha especial** — cumpleaños del contacto o celebración global (Día del Padre, Madre, Niño, Abuelo) con elegibilidad automática.
- **Fecha de cierre** — registro de un cierre de operación (alquiler propietario, alquiler inquilino, comprador, vendedor) con recordatorios configurables antes o después.
- **Instancia de WhatsApp** — el número de WhatsApp conectado a OnMind. Una cuenta tiene una sola instancia.
- **Campaña** — envío masivo a un grupo filtrado de contactos. Herramienta puntual, no reemplaza el plan de seguimiento.

---

*¿Querés ver OnMind funcionando? Una demo de 20 minutos: **onmindcrm.com***
