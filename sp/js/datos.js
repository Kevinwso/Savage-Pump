/* ============================================================
   SAVAGE PUMP — DATOS DE LA TIENDA
   Este es el UNICO archivo que necesitas tocar para cambiar
   precios, productos, el numero de WhatsApp o el correo.
   ============================================================ */

var CONFIG = {
  marca: 'Savage Pump',
  // WhatsApp que RECIBE los pedidos (507 + numero, sin + ni espacios)
  whatsapp: '50766538166',
  telefonoVisible: '+507 6653-8166',
  instagram: 'savagepumpp',
  correo: 'nomerozerbill@gmail.com',
  moneda: '$'
};

/* Cada producto lleva UNA sola foto: el mockup con frente y espalda.
   Para agregar una prenda, copia un bloque completo y cambia los datos. */
var PRODUCTOS = [
  {
    id: 'spirit',
    nombre: 'Spirit',
    categoria: 'Oversize Tee',
    precio: 35,
    activo: true,
    descripcion: 'Disco de peso envuelto en llamas magenta con las leyendas Stay Hungry y Stay Humble. Mancuerna estampada al pecho. Algodon pesado, corte oversize de hombro caido.',
    foto: 'assets/sp-spirit.jpg',
    alt: 'Camiseta oversize negra Savage Pump Spirit: mancuerna al frente y disco de peso entre llamas magenta con Stay Hungry Stay Humble en la espalda'
  },
  {
    id: 'real-love',
    nombre: 'Real Love',
    categoria: 'Oversize Tee',
    precio: 35,
    activo: true,
    descripcion: 'Querubines sosteniendo un disco rojo con la leyenda Barbell Standard, y Real Love en letra gotica. Espada y logotipo al frente. Algodon pesado, corte oversize.',
    foto: 'assets/sp-real-love.jpg',
    alt: 'Camiseta oversize negra Savage Pump Real Love: espada al frente y querubines alrededor de un disco rojo en la espalda'
  },
  {
    id: 'mentality',
    nombre: 'Mentality',
    categoria: 'Oversize Tee',
    precio: 35,
    activo: true,
    descripcion: 'Figura alada entre relampagos rojos con el titulo Mentality en tipografia extrema. Emblema de llama al pecho. Algodon pesado, corte oversize.',
    foto: 'assets/sp-mentality.jpg',
    alt: 'Camiseta oversize negra Savage Pump Mentality: emblema de llama al frente y figura alada entre relampagos rojos en la espalda'
  },
  {
    id: 'faith',
    nombre: 'Faith, Courage, Patience',
    categoria: 'Oversize Tee',
    precio: 35,
    activo: true,
    descripcion: 'Llamas azules subiendo desde el bajo y dos manos encontrandose en la espalda. La frase Faith, Courage, Patience impresa al frente. Algodon pesado, corte oversize.',
    foto: 'assets/sp-faith.jpg',
    alt: 'Camiseta oversize negra Savage Pump Faith Courage Patience: frase al frente y llamas azules con dos manos en la espalda'
  },
  {
    id: 'creation',
    nombre: 'Creation',
    categoria: 'Oversize Tee',
    precio: 35,
    activo: true,
    descripcion: 'Pintura renacentista enmarcada y querubines impresos en la espalda. Corona de espinas con el usuario al pecho. Algodon pesado, corte oversize.',
    foto: 'assets/sp-creation.jpg',
    alt: 'Camiseta oversize negra Savage Pump Creation: corona de espinas al frente y pintura renacentista enmarcada con querubines en la espalda'
  },
  {
    id: 'fallen',
    nombre: 'Fallen',
    categoria: 'Oversize Tee',
    precio: 35,
    activo: true,
    descripcion: 'Angel levantando una barra sobre escombros, ilustrado a linea en blanco y negro, con el logotipo Savage Pump en tipografia extrema. Alas estampadas al pecho.',
    foto: 'assets/sp-fallen.jpg',
    alt: 'Camiseta oversize negra Savage Pump Fallen: alas al frente y angel levantando una barra sobre escombros en la espalda'
  },
  {
    id: 'break-limits',
    nombre: 'Break Limits',
    categoria: 'Oversize Tee',
    precio: 35,
    activo: true,
    descripcion: 'Dragon dorado entre grietas de lava con el titulo Break Limits. Mancuerna con rayo al pecho. Algodon pesado, corte oversize de hombro caido.',
    foto: 'assets/sp-break-limits.jpg',
    alt: 'Camiseta oversize negra Savage Pump Break Limits: mancuerna con rayo al frente y dragon dorado entre grietas de lava en la espalda'
  },
  {
    id: 'underdog',
    nombre: 'Underdog',
    categoria: 'Sin mangas',
    precio: 35,
    activo: true,
    descripcion: 'Camiseta sin mangas. Rottweiler mordiendo un disco de peso, enmarcado en placa metalica remachada. Brazo ilustrado y usuario al frente.',
    foto: 'assets/sp-underdog.jpg',
    alt: 'Camiseta sin mangas negra Savage Pump Underdog: brazo ilustrado al frente y rottweiler mordiendo un disco de peso en la espalda'
  }
];

var TALLAS = ['S', 'M', 'L', 'XL'];
