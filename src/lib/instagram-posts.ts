export type InstagramPost = {
  slug: string;
  image: string;
  blobUrl: string;
  type: "educacion" | "dolor" | "producto";
  typeLabel: string;
  topic: string;
  framework: string;
  objective: string;
  caption: string;
  hashtags: string[];
};

export const instagramPosts: InstagramPost[] = [
  {
    slug: "01-educacion-escribile-primero",
    image: "/instagram/posts/01-educacion-escribile-primero.png",
    blobUrl: "https://xiaqcgfxwuzlizyt.public.blob.vercel-storage.com/instagram/01-educacion-escribile-primero.png",
    type: "educacion",
    typeLabel: "Educación",
    topic: "Escribile primero",
    framework: "Problem → Agitate → Solve",
    objective: "Engagement",
    caption: `¿Cuántos clientes perdiste sin darte cuenta?

No se fueron por el precio. No se fueron por el servicio.
Se fueron porque dejaron de escucharte.

En el rubro inmobiliario, el cliente que no recibe un mensaje tuyo en 3 meses ya se olvidó de que existís.

No hace falta llamar todos los días. Hace falta estar presente en el momento justo.

Un "feliz cumple", un aviso de vencimiento, un simple "¿cómo va todo?" cambian la relación.

Escribile vos primero. Siempre.`,
    hashtags: ["#inmobiliaria", "#whatsappbusiness", "#gestiondeclientes", "#seguimientodeclientes", "#onmind"],
  },
  {
    slug: "02-producto-conecta-whatsapp",
    image: "/instagram/posts/02-producto-conecta-whatsapp.png",
    blobUrl: "https://xiaqcgfxwuzlizyt.public.blob.vercel-storage.com/instagram/02-producto-conecta-whatsapp.png",
    type: "producto",
    typeLabel: "Producto",
    topic: "Conectá tu WhatsApp",
    framework: "Before → After → Bridge",
    objective: "Awareness",
    caption: `Antes: planillas, alarmas en el celu, notitas pegadas en el monitor.

Después: conectás tu WhatsApp, importás tus contactos, y cada mensaje sale solo cuando tiene que salir.

OnMind no es un sistema complicado. Escaneás un QR (como WhatsApp Web), cargás tus contactos y listo. Los mensajes se programan solos según las fechas importantes de cada cliente.

Sin apps nuevas que aprender. Sin meses de implementación.

¿Querés verlo en acción? Escribinos por DM.`,
    hashtags: ["#inmobiliaria", "#whatsappbusiness", "#gestiondeclientes", "#tecnologiainmobiliaria", "#onmind"],
  },
  {
    slug: "03-dolor-cumpleanos",
    image: "/instagram/posts/03-dolor-cumpleanos.png",
    blobUrl: "https://xiaqcgfxwuzlizyt.public.blob.vercel-storage.com/instagram/03-dolor-cumpleanos.png",
    type: "dolor",
    typeLabel: "Dolor del rubro",
    topic: "Cumpleaños",
    framework: "Hook → Story → Lesson",
    objective: "Engagement",
    caption: `"Che, ayer fue mi cumpleaños y ni un mensaje me mandaste."

Eso no te lo dice el cliente. Lo piensa. Y cuando necesita algo, llama a otro.

Con 300 contactos no podés acordarte del cumpleaños de cada uno. Y tu cliente no espera que te acuerdes de todo — pero cuando le llega un mensaje justo ese día, siente que le importás.

Son esos detalles los que mantienen vivo el vínculo.

¿Cuántos cumpleaños se te pasaron este mes?`,
    hashtags: ["#inmobiliaria", "#atencionalpersonalizada", "#gestiondeclientes", "#whatsappbusiness", "#onmind"],
  },
  {
    slug: "04-educacion-5-fechas",
    image: "/instagram/posts/04-educacion-5-fechas.png",
    blobUrl: "https://xiaqcgfxwuzlizyt.public.blob.vercel-storage.com/instagram/04-educacion-5-fechas.png",
    type: "educacion",
    typeLabel: "Educación",
    topic: "5 fechas clave",
    framework: "List / Carousel teaser",
    objective: "Engagement",
    caption: `Fechas que tu inmobiliaria no puede dejar pasar 👇

1. Vencimientos de alquiler — el cliente necesita saber que estás encima antes de que expire.
2. Renovaciones de contrato — si no lo contactás vos, lo contacta otro.
3. Cumpleaños del cliente — un mensaje simple que dice "me importás".
4. Aniversario de la operación — "hace un año cerramos juntos" genera lealtad.
5. Fechas del rubro — día del corredor, fin de año, cambio de temporada.

¿Las estás siguiendo? Si dependés de tu memoria, se te van a escapar.

Guardá este post para no olvidarte.`,
    hashtags: ["#inmobiliaria", "#gestiondeclientes", "#fechasimportantes", "#seguimientodeclientes", "#onmind"],
  },
  {
    slug: "05-dolor-cerro-con-otro",
    image: "/instagram/posts/05-dolor-cerro-con-otro.png",
    blobUrl: "https://xiaqcgfxwuzlizyt.public.blob.vercel-storage.com/instagram/05-dolor-cerro-con-otro.png",
    type: "dolor",
    typeLabel: "Dolor del rubro",
    topic: "Cerró con otro",
    framework: "Hook → Story → Lesson",
    objective: "Engagement",
    caption: `"No sabía que seguías trabajando."

Esa frase duele. Porque el cliente no se fue enojado. Se fue porque se olvidó de vos.

Pasa más seguido de lo que pensamos. Cerrás una operación, el cliente queda contento, y después... silencio. Meses sin contacto. Cuando necesita algo de nuevo, busca en Google o le pregunta a un conocido.

No hacía falta mucho. Un mensaje cada tanto, un saludo en su cumpleaños, un recordatorio de que estás ahí.

¿Te pasó alguna vez? Contanos en los comentarios.`,
    hashtags: ["#inmobiliaria", "#clientesinmobiliarios", "#gestiondeclientes", "#whatsappbusiness", "#onmind"],
  },
  {
    slug: "06-educacion-seguimiento",
    image: "/instagram/posts/06-educacion-seguimiento.png",
    blobUrl: "https://xiaqcgfxwuzlizyt.public.blob.vercel-storage.com/instagram/06-educacion-seguimiento.png",
    type: "educacion",
    typeLabel: "Educación",
    topic: "Seguimiento",
    framework: "Contrarian take",
    objective: "Engagement",
    caption: `"Seguimiento" suena a persecución. Y nadie quiere ser perseguido.

Pero estar presente no es insistir. Es aparecer en el momento correcto, con el mensaje correcto.

Hay una diferencia enorme entre:
→ "Hola, tengo una propiedad que te puede interesar" (frío, genérico)
→ "Hola Juan, ¿cómo va todo en el depto de Pocitos? El mes que viene se cumple un año" (cercano, oportuno)

El primero es spam. El segundo es vínculo.

¿Cuál estás mandando vos?`,
    hashtags: ["#inmobiliaria", "#comunicacionconclientes", "#whatsappbusiness", "#gestiondeclientes", "#onmind"],
  },
  {
    slug: "07-dolor-vencimiento",
    image: "/instagram/posts/07-dolor-vencimiento.png",
    blobUrl: "https://xiaqcgfxwuzlizyt.public.blob.vercel-storage.com/instagram/07-dolor-vencimiento.png",
    type: "dolor",
    typeLabel: "Dolor del rubro",
    topic: "Vencimiento",
    framework: "Hook → Story → Lesson",
    objective: "Engagement",
    caption: `El peor momento para enterarte de un vencimiento es cuando el cliente te llama para reclamar.

Pasó: se venció el alquiler, nadie avisó, el inquilino se quejó, el propietario te llamó. Y vos quedaste mal con los dos.

Un vencimiento no debería ser una sorpresa. Es una fecha que ya conocés desde el día que firmaste el contrato.

El problema no es que no te importe. Es que con 100, 200, 300 clientes, tu memoria no alcanza.

La solución es simple: que algo te avise antes. Siempre antes.`,
    hashtags: ["#inmobiliaria", "#gestiondealquileres", "#vencimientodecontrato", "#gestiondeclientes", "#onmind"],
  },
  {
    slug: "08-producto-cumpleanos",
    image: "/instagram/posts/08-producto-cumpleanos.png",
    blobUrl: "https://xiaqcgfxwuzlizyt.public.blob.vercel-storage.com/instagram/08-producto-cumpleanos.png",
    type: "producto",
    typeLabel: "Producto",
    topic: "Cumpleaños automático",
    framework: "Before → After → Bridge",
    objective: "Awareness",
    caption: `¿Y si cada cliente recibiera un mensaje de cumpleaños sin que vos tengas que hacer nada?

Así funciona OnMind: cargás la fecha de cumpleaños del contacto (o la importás con los datos) y listo. El mensaje se programa solo.

No tenés que acordarte. No tenés que poner alarmas. No tenés que revisar una planilla cada mañana.

OnMind genera los mensajes programados automáticamente. Cumpleaños, fechas del negocio, plan de seguimiento — todo sale cuando tiene que salir.

Vos solo cargás los datos una vez.

¿Querés ver cómo funciona? Escribinos por DM.`,
    hashtags: ["#inmobiliaria", "#whatsappbusiness", "#mensajesprogramados", "#gestiondeclientes", "#onmind"],
  },
  {
    slug: "09-educacion-vinculo",
    image: "/instagram/posts/09-educacion-vinculo.png",
    blobUrl: "https://xiaqcgfxwuzlizyt.public.blob.vercel-storage.com/instagram/09-educacion-vinculo.png",
    type: "educacion",
    typeLabel: "Educación",
    topic: "Vínculo",
    framework: "Contrarian take",
    objective: "Engagement",
    caption: `No perdés clientes por el precio. Los perdés por el silencio.

El cliente que cerró con vos hace 2 años no se fue con otro porque era más barato. Se fue porque no supo más de vos.

En el rubro inmobiliario, las relaciones son todo. Pero mantener el vínculo con cientos de clientes es imposible si dependés solo de tu memoria.

No es cuestión de trabajar más. Es cuestión de tener un sistema que te recuerde quién necesita un mensaje hoy.

Presencia > descuentos. Siempre.

Guardá este post si pensás igual.`,
    hashtags: ["#inmobiliaria", "#gestiondeclientes", "#fidelizacion", "#whatsappbusiness", "#onmind"],
  },
];

export const frameworkDescriptions: Record<string, string> = {
  "Problem → Agitate → Solve": "Plantea un problema, lo hace sentir, y ofrece la salida.",
  "Before → After → Bridge": "Muestra el antes y el después, y explica cómo llegar.",
  "Hook → Story → Lesson": "Abre con algo que atrapa, cuenta una historia y cierra con la lección.",
  "List / Carousel teaser": "Lista de puntos concretos. Genera guardados.",
  "Contrarian take": "Dice algo que va contra lo que todos asumen. Genera debate y shares.",
};

export const objectiveDescriptions: Record<string, string> = {
  "Engagement": "Busca interacción: comentarios, guardados, shares.",
  "Awareness": "Busca que conozcan OnMind. Muestra el producto.",
};

export type InstagramPostWithStatus = InstagramPost & {
  publishedAt?: Date;
  igMediaId?: string;
};

export function getPostBySlug(slug: string): InstagramPost | undefined {
  return instagramPosts.find((p) => p.slug === slug);
}
