const fashionImages = [
  "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
];

const accessoryImages = [
  "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1506629905607-d9e0f2059483?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=80"
];

const beautyImages = [
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1503236823255-94609f598e71?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80"
];

const homeImages = [
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80"
];

const premiumImages = [
  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1506629905607-d9e0f2059483?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80"
];

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  currency: string;
  image: string;
  description: string;
  tags: string[];
}

export const products: Product[] = [
  { id: "ropa-001", name: "Blazer estructurado arena", category: "ropa", brand: "Patprimo", price: 89, currency: "USD", image: fashionImages[0], description: "Blazer versátil de corte moderno para oficina, reuniones y ocasiones casuales elegantes.", tags: ["moda", "oficina", "casual"] },
  { id: "ropa-002", name: "Camisa oxford blanca esencial", category: "ropa", brand: "Patprimo", price: 49, currency: "USD", image: fashionImages[1], description: "Camisa básica de algodón con silueta limpia, ideal para looks diarios y combinaciones formales.", tags: ["básico", "oficina", "moda"] },
  { id: "ropa-003", name: "Pantalón chino slim oliva", category: "ropa", brand: "Patprimo", price: 59, currency: "USD", image: fashionImages[2], description: "Pantalón chino cómodo con ajuste slim y acabado suave para uso urbano.", tags: ["casual", "moda", "oficina"] },
  { id: "ropa-004", name: "Vestido camisero lino natural", category: "ropa", brand: "Patprimo", price: 74, currency: "USD", image: fashionImages[3], description: "Vestido camisero fresco con textura de lino y estilo relajado premium.", tags: ["moda", "casual", "premium"] },
  { id: "ropa-005", name: "Jean high rise azul medio", category: "ropa", brand: "Seven Seven", price: 69, currency: "USD", image: fashionImages[4], description: "Jean de tiro alto con lavado azul medio y ajuste favorecedor.", tags: ["denim", "urbano", "moda"] },
  { id: "ropa-006", name: "Chaqueta denim vintage", category: "ropa", brand: "Seven Seven", price: 82, currency: "USD", image: fashionImages[5], description: "Chaqueta denim con acabado vintage para looks urbanos y de temporada.", tags: ["denim", "streetwear", "moda"] },
  { id: "ropa-007", name: "Camiseta gráfica city mood", category: "ropa", brand: "Seven Seven", price: 34, currency: "USD", image: fashionImages[6], description: "Camiseta gráfica de algodón con diseño urbano para uso diario.", tags: ["streetwear", "casual", "moda"] },
  { id: "ropa-008", name: "Jogger cargo negro", category: "ropa", brand: "Seven Seven", price: 58, currency: "USD", image: fashionImages[7], description: "Jogger cargo con bolsillos funcionales y silueta relajada.", tags: ["urbano", "casual", "streetwear"] },
  { id: "ropa-009", name: "Top tejido marfil", category: "ropa", brand: "Ostu", price: 42, currency: "USD", image: fashionImages[0], description: "Top tejido de tacto suave para looks frescos y femeninos.", tags: ["moda", "casual", "lifestyle"] },
  { id: "ropa-010", name: "Falda midi satinada cacao", category: "ropa", brand: "Ostu", price: 63, currency: "USD", image: fashionImages[1], description: "Falda midi satinada con caída fluida y acabado elegante.", tags: ["moda", "premium", "casual"] },
  { id: "ropa-011", name: "Set coordinado terracota", category: "ropa", brand: "Ostu", price: 88, currency: "USD", image: fashionImages[2], description: "Conjunto coordinado de dos piezas para un look cómodo y sofisticado.", tags: ["moda", "lifestyle", "premium"] },
  { id: "ropa-012", name: "Sobrecamisa soft beige", category: "ropa", brand: "Ostu", price: 67, currency: "USD", image: fashionImages[3], description: "Sobrecamisa liviana para capas de temporada y estilo relajado.", tags: ["casual", "moda", "lifestyle"] },
  { id: "ropa-013", name: "Legging sculpt negro", category: "ropa", brand: "Atmos Movement", price: 54, currency: "USD", image: fashionImages[4], description: "Legging deportivo con soporte medio, ideal para entrenamiento y uso diario.", tags: ["athleisure", "deportivo", "moda"] },
  { id: "ropa-014", name: "Top deportivo balance", category: "ropa", brand: "Atmos Movement", price: 39, currency: "USD", image: fashionImages[5], description: "Top deportivo respirable para yoga, running suave y entrenamiento funcional.", tags: ["athleisure", "deportivo", "wellness"] },
  { id: "ropa-015", name: "Hoodie performance gris", category: "ropa", brand: "Atmos Movement", price: 72, currency: "USD", image: fashionImages[6], description: "Hoodie cómodo con diseño minimalista para movilidad y descanso.", tags: ["athleisure", "casual", "deportivo"] },
  { id: "ropa-016", name: "Short active dry-fit", category: "ropa", brand: "Atmos Movement", price: 45, currency: "USD", image: fashionImages[7], description: "Short liviano de secado rápido para actividad física y clima cálido.", tags: ["athleisure", "deportivo", "running"] },
  { id: "ropa-017", name: "Camisa resort azul cielo", category: "ropa", brand: "Patprimo", price: 52, currency: "USD", image: fashionImages[0], description: "Camisa fresca de manga corta con estilo resort urbano.", tags: ["casual", "moda", "verano"] },
  { id: "ropa-018", name: "Jean wide leg crudo", category: "ropa", brand: "Seven Seven", price: 76, currency: "USD", image: fashionImages[1], description: "Jean wide leg en tono crudo con estética contemporánea.", tags: ["denim", "moda", "urbano"] },
  { id: "ropa-019", name: "Cardigan relaxed taupe", category: "ropa", brand: "Ostu", price: 69, currency: "USD", image: fashionImages[2], description: "Cardigan suave de punto abierto para looks cómodos y elegantes.", tags: ["casual", "lifestyle", "moda"] },
  { id: "ropa-020", name: "Chaqueta windbreaker active", category: "ropa", brand: "Atmos Movement", price: 95, currency: "USD", image: fashionImages[3], description: "Chaqueta liviana cortaviento con estética deportiva premium.", tags: ["athleisure", "premium", "deportivo"] },

  { id: "acc-001", name: "Gafas solares urban black", category: "accesorios", brand: "Seven Seven", price: 39, currency: "USD", image: accessoryImages[0], description: "Gafas de sol con montura negra y diseño urbano para uso diario.", tags: ["accesorios", "urbano", "moda"] },
  { id: "acc-002", name: "Reloj minimal acero", category: "accesorios", brand: "Patprimo", price: 119, currency: "USD", image: accessoryImages[1], description: "Reloj de acero con diseño sobrio para looks formales y casuales.", tags: ["accesorios", "oficina", "premium"] },
  { id: "acc-003", name: "Collar dorado esencial", category: "accesorios", brand: "Ostu", price: 44, currency: "USD", image: accessoryImages[2], description: "Collar dorado delicado para complementar outfits lifestyle.", tags: ["accesorios", "moda", "regalo"] },
  { id: "acc-004", name: "Sneakers blancos city", category: "accesorios", brand: "Seven Seven", price: 79, currency: "USD", image: accessoryImages[3], description: "Sneakers blancos de silueta limpia para looks urbanos.", tags: ["calzado", "streetwear", "moda"] },
  { id: "acc-005", name: "Bolso tote arena", category: "accesorios", brand: "Ostu", price: 68, currency: "USD", image: accessoryImages[4], description: "Bolso tote amplio en tono neutro para trabajo, compras y viajes cortos.", tags: ["accesorios", "lifestyle", "moda"] },
  { id: "acc-006", name: "Morral tech negro", category: "accesorios", brand: "Patprimo", price: 86, currency: "USD", image: accessoryImages[5], description: "Morral funcional con compartimentos para portátil y accesorios diarios.", tags: ["accesorios", "oficina", "tech"] },
  { id: "acc-007", name: "Pulsera premium obsidiana", category: "accesorios", brand: "Ostu", price: 38, currency: "USD", image: accessoryImages[6], description: "Pulsera de inspiración mineral con acabado sobrio y elegante.", tags: ["accesorios", "regalo", "premium"] },
  { id: "acc-008", name: "Aretes aro dorado", category: "accesorios", brand: "Ostu", price: 36, currency: "USD", image: accessoryImages[7], description: "Aretes de aro con acabado dorado para uso diario o noche.", tags: ["accesorios", "moda", "regalo"] },
  { id: "acc-009", name: "Gorra active verde", category: "accesorios", brand: "Atmos Movement", price: 29, currency: "USD", image: accessoryImages[0], description: "Gorra liviana con ajuste posterior para entrenamiento y uso urbano.", tags: ["athleisure", "deportivo", "accesorios"] },
  { id: "acc-010", name: "Botella térmica matte", category: "accesorios", brand: "Atmos Movement", price: 32, currency: "USD", image: accessoryImages[1], description: "Botella térmica reusable para hidratación diaria y actividad física.", tags: ["wellness", "athleisure", "accesorios"] },
  { id: "acc-011", name: "Cinturón cuero café", category: "accesorios", brand: "Patprimo", price: 41, currency: "USD", image: accessoryImages[2], description: "Cinturón clásico de cuero sintético premium en tono café.", tags: ["oficina", "accesorios", "moda"] },
  { id: "acc-012", name: "Bufanda soft gris", category: "accesorios", brand: "Patprimo", price: 35, currency: "USD", image: accessoryImages[3], description: "Bufanda suave de tejido liviano para climas frescos.", tags: ["accesorios", "casual", "moda"] },
  { id: "acc-013", name: "Riñonera urbana nylon", category: "accesorios", brand: "Seven Seven", price: 48, currency: "USD", image: accessoryImages[4], description: "Riñonera compacta de nylon para movilidad urbana.", tags: ["streetwear", "urbano", "accesorios"] },
  { id: "acc-014", name: "Medias performance pack x3", category: "accesorios", brand: "Atmos Movement", price: 24, currency: "USD", image: accessoryImages[5], description: "Pack de medias deportivas respirables con soporte en arco.", tags: ["athleisure", "deportivo", "running"] },
  { id: "acc-015", name: "Llavero charm premium", category: "accesorios", brand: "Ostu", price: 22, currency: "USD", image: accessoryImages[6], description: "Charm decorativo para bolso o llaves con acabado metálico.", tags: ["regalo", "accesorios", "premium"] },
  { id: "acc-016", name: "Bandolera mini negra", category: "accesorios", brand: "Seven Seven", price: 59, currency: "USD", image: accessoryImages[7], description: "Bandolera compacta para celular, billetera y esenciales.", tags: ["urbano", "moda", "accesorios"] },
  { id: "acc-017", name: "Visera running blanca", category: "accesorios", brand: "Atmos Movement", price: 27, currency: "USD", image: accessoryImages[0], description: "Visera deportiva liviana para running y actividades outdoor.", tags: ["running", "athleisure", "deportivo"] },
  { id: "acc-018", name: "Pañuelo satinado print", category: "accesorios", brand: "Patprimo", price: 33, currency: "USD", image: accessoryImages[1], description: "Pañuelo satinado estampado para cuello, bolso o cabello.", tags: ["moda", "oficina", "accesorios"] },
  { id: "acc-019", name: "Anillo statement silver", category: "accesorios", brand: "Ostu", price: 46, currency: "USD", image: accessoryImages[2], description: "Anillo statement plateado para elevar outfits minimalistas.", tags: ["premium", "regalo", "accesorios"] },
  { id: "acc-020", name: "Sneaker running knit", category: "accesorios", brand: "Atmos Movement", price: 98, currency: "USD", image: accessoryImages[3], description: "Tenis de tejido flexible para caminatas, gimnasio y movilidad diaria.", tags: ["athleisure", "running", "premium"] },

  { id: "bel-001", name: "Serum hidratante glow", category: "belleza", brand: "Ostu", price: 32, currency: "USD", image: beautyImages[0], description: "Serum facial de textura ligera para una rutina de hidratación diaria.", tags: ["skincare", "belleza", "wellness"] },
  { id: "bel-002", name: "Crema facial día suave", category: "belleza", brand: "Ostu", price: 29, currency: "USD", image: beautyImages[1], description: "Crema facial ligera para uso diario con acabado no graso.", tags: ["skincare", "belleza", "diario"] },
  { id: "bel-003", name: "Limpiador facial espuma", category: "belleza", brand: "Ostu", price: 24, currency: "USD", image: beautyImages[2], description: "Limpiador facial suave para remover impurezas sin resecar.", tags: ["skincare", "belleza", "rutina"] },
  { id: "bel-004", name: "Tónico balance botanical", category: "belleza", brand: "Ostu", price: 22, currency: "USD", image: beautyImages[3], description: "Tónico refrescante para equilibrar y preparar la piel.", tags: ["skincare", "wellness", "belleza"] },
  { id: "bel-005", name: "Mascarilla arcilla rosa", category: "belleza", brand: "Ostu", price: 27, currency: "USD", image: beautyImages[4], description: "Mascarilla purificante de arcilla rosa para ritual semanal.", tags: ["skincare", "spa", "belleza"] },
  { id: "bel-006", name: "Aceite corporal relax", category: "belleza", brand: "Ostu", price: 35, currency: "USD", image: beautyImages[5], description: "Aceite corporal aromático para hidratación y masaje relajante.", tags: ["wellness", "belleza", "spa"] },
  { id: "bel-007", name: "Bálsamo labial nude", category: "belleza", brand: "Ostu", price: 14, currency: "USD", image: beautyImages[6], description: "Bálsamo labial hidratante con acabado natural.", tags: ["belleza", "skincare", "diario"] },
  { id: "bel-008", name: "Mist facial fresh", category: "belleza", brand: "Ostu", price: 19, currency: "USD", image: beautyImages[7], description: "Bruma facial refrescante para recargar la piel durante el día.", tags: ["skincare", "wellness", "belleza"] },
  { id: "bel-009", name: "Crema de manos soft", category: "belleza", brand: "Patprimo", price: 16, currency: "USD", image: beautyImages[0], description: "Crema de manos de rápida absorción para llevar en el bolso.", tags: ["belleza", "regalo", "diario"] },
  { id: "bel-010", name: "Perfume textil clean cotton", category: "belleza", brand: "Patprimo", price: 23, currency: "USD", image: beautyImages[1], description: "Fragancia textil suave para prendas, armario y espacios personales.", tags: ["belleza", "hogar", "wellness"] },
  { id: "bel-011", name: "Gel post workout cooling", category: "belleza", brand: "Atmos Movement", price: 28, currency: "USD", image: beautyImages[2], description: "Gel refrescante para sensación de descanso después del entrenamiento.", tags: ["athleisure", "wellness", "belleza"] },
  { id: "bel-012", name: "Protector solar urban SPF demo", category: "belleza", brand: "Atmos Movement", price: 31, currency: "USD", image: beautyImages[3], description: "Producto demo tipo protector solar urbano para rutina activa.", tags: ["skincare", "athleisure", "wellness"] },
  { id: "bel-013", name: "Exfoliante corporal café", category: "belleza", brand: "Ostu", price: 26, currency: "USD", image: beautyImages[4], description: "Exfoliante corporal con textura suave e inspiración natural.", tags: ["spa", "belleza", "wellness"] },
  { id: "bel-014", name: "Set skincare viaje", category: "belleza", brand: "Ostu", price: 49, currency: "USD", image: beautyImages[5], description: "Kit compacto con esenciales de cuidado facial para viajes.", tags: ["skincare", "regalo", "premium"] },
  { id: "bel-015", name: "Crema noche repair", category: "belleza", brand: "Ostu", price: 38, currency: "USD", image: beautyImages[6], description: "Crema nocturna de textura confortable para rutina de descanso.", tags: ["skincare", "belleza", "premium"] },
  { id: "bel-016", name: "Rodillo facial cuarzo demo", category: "belleza", brand: "Ostu", price: 30, currency: "USD", image: beautyImages[7], description: "Accesorio facial tipo rodillo para ritual de autocuidado.", tags: ["skincare", "spa", "regalo"] },
  { id: "bel-017", name: "Shampoo sólido herbal", category: "belleza", brand: "Ostu", price: 18, currency: "USD", image: beautyImages[0], description: "Shampoo sólido demo con inspiración herbal y enfoque sostenible.", tags: ["belleza", "wellness", "sostenible"] },
  { id: "bel-018", name: "Acondicionador nutritivo mini", category: "belleza", brand: "Ostu", price: 21, currency: "USD", image: beautyImages[1], description: "Acondicionador nutritivo en formato compacto para cuidado diario.", tags: ["belleza", "diario", "wellness"] },
  { id: "bel-019", name: "Kit spa en casa", category: "belleza", brand: "Ostu", price: 57, currency: "USD", image: beautyImages[2], description: "Kit demo con productos de relajación para experiencia spa en casa.", tags: ["spa", "regalo", "premium"] },
  { id: "bel-020", name: "Sérum premium botanical", category: "belleza", brand: "Ostu", price: 64, currency: "USD", image: beautyImages[3], description: "Sérum premium demo con estética botanical para personalización por interés.", tags: ["skincare", "premium", "belleza"] },

  { id: "hog-001", name: "Manta tejida arena", category: "hogar", brand: "Ostu", price: 54, currency: "USD", image: homeImages[0], description: "Manta decorativa de tejido suave para sofá, cama o lectura.", tags: ["hogar", "lifestyle", "regalo"] },
  { id: "hog-002", name: "Cojín textura lino", category: "hogar", brand: "Ostu", price: 32, currency: "USD", image: homeImages[1], description: "Cojín decorativo de textura lino para espacios cálidos y minimalistas.", tags: ["hogar", "decoración", "lifestyle"] },
  { id: "hog-003", name: "Vela aromática calma", category: "hogar", brand: "Ostu", price: 24, currency: "USD", image: homeImages[2], description: "Vela aromática demo con notas suaves para crear ambiente de descanso.", tags: ["hogar", "wellness", "regalo"] },
  { id: "hog-004", name: "Difusor botanical home", category: "hogar", brand: "Ostu", price: 29, currency: "USD", image: homeImages[3], description: "Difusor de ambiente con estética natural para sala o habitación.", tags: ["hogar", "wellness", "decoración"] },
  { id: "hog-005", name: "Set mugs cerámica x2", category: "hogar", brand: "Ostu", price: 36, currency: "USD", image: homeImages[4], description: "Set de mugs de cerámica en tonos neutros para café o té.", tags: ["hogar", "regalo", "lifestyle"] },
  { id: "hog-006", name: "Bandeja madera natural", category: "hogar", brand: "Ostu", price: 42, currency: "USD", image: homeImages[5], description: "Bandeja decorativa de madera para mesa, café o ritual de desayuno.", tags: ["hogar", "decoración", "premium"] },
  { id: "hog-007", name: "Canasto fibras naturales", category: "hogar", brand: "Ostu", price: 48, currency: "USD", image: homeImages[6], description: "Canasto organizador de fibras naturales para textiles y accesorios.", tags: ["hogar", "organización", "decoración"] },
  { id: "hog-008", name: "Set toallas spa", category: "hogar", brand: "Ostu", price: 52, currency: "USD", image: homeImages[7], description: "Set de toallas suaves con estética spa y tonos neutros.", tags: ["hogar", "spa", "wellness"] },
  { id: "hog-009", name: "Aromatizante closet fresh", category: "hogar", brand: "Patprimo", price: 18, currency: "USD", image: homeImages[0], description: "Aromatizante para armario y textiles con fragancia limpia.", tags: ["hogar", "ropa", "wellness"] },
  { id: "hog-010", name: "Organizador de accesorios", category: "hogar", brand: "Patprimo", price: 34, currency: "USD", image: homeImages[1], description: "Organizador práctico para joyas, correas, gafas y pequeños accesorios.", tags: ["hogar", "organización", "accesorios"] },
  { id: "hog-011", name: "Mat yoga natural", category: "hogar", brand: "Atmos Movement", price: 61, currency: "USD", image: homeImages[2], description: "Mat de yoga para práctica en casa y rutinas de movilidad.", tags: ["athleisure", "hogar", "wellness"] },
  { id: "hog-012", name: "Bloques yoga cork", category: "hogar", brand: "Atmos Movement", price: 28, currency: "USD", image: homeImages[3], description: "Bloques de yoga tipo corcho para soporte en práctica y estiramiento.", tags: ["athleisure", "hogar", "wellness"] },
  { id: "hog-013", name: "Set escritorio calm", category: "hogar", brand: "Patprimo", price: 46, currency: "USD", image: homeImages[4], description: "Set decorativo para escritorio con estilo sobrio y funcional.", tags: ["hogar", "oficina", "decoración"] },
  { id: "hog-014", name: "Fragancia habitación cotton", category: "hogar", brand: "Ostu", price: 21, currency: "USD", image: homeImages[5], description: "Spray de habitación con aroma suave tipo algodón limpio.", tags: ["hogar", "wellness", "diario"] },
  { id: "hog-015", name: "Portavelas cerámica mate", category: "hogar", brand: "Ostu", price: 27, currency: "USD", image: homeImages[6], description: "Portavelas de cerámica mate para ambientación cálida.", tags: ["hogar", "decoración", "regalo"] },
  { id: "hog-016", name: "Set descanso premium", category: "hogar", brand: "Ostu", price: 79, currency: "USD", image: homeImages[7], description: "Set demo de descanso con manta, vela y antifaz de textura suave.", tags: ["hogar", "premium", "wellness"] },
  { id: "hog-017", name: "Bolsa lavandería delicate", category: "hogar", brand: "Patprimo", price: 17, currency: "USD", image: homeImages[0], description: "Bolsa de lavado para prendas delicadas y cuidado del clóset.", tags: ["hogar", "ropa", "organización"] },
  { id: "hog-018", name: "Kit orden semanal", category: "hogar", brand: "Ostu", price: 39, currency: "USD", image: homeImages[1], description: "Kit de organización para pequeños espacios y rutinas semanales.", tags: ["hogar", "organización", "lifestyle"] },
  { id: "hog-019", name: "Manta active recovery", category: "hogar", brand: "Atmos Movement", price: 58, currency: "USD", image: homeImages[2], description: "Manta ligera para recuperación, descanso y estiramientos en casa.", tags: ["athleisure", "hogar", "wellness"] },
  { id: "hog-020", name: "Set premium ritual hogar", category: "hogar", brand: "Ostu", price: 96, currency: "USD", image: homeImages[3], description: "Set premium demo con vela, difusor y textil decorativo.", tags: ["hogar", "premium", "regalo"] },

  { id: "pre-001", name: "Reloj signature black", category: "premium", brand: "Patprimo", price: 179, currency: "USD", image: premiumImages[0], description: "Reloj premium de diseño sobrio para clientes de alto valor.", tags: ["premium", "accesorios", "oficina"] },
  { id: "pre-002", name: "Bolso premium café", category: "premium", brand: "Ostu", price: 189, currency: "USD", image: premiumImages[1], description: "Bolso premium de estructura elegante para looks sofisticados.", tags: ["premium", "moda", "regalo"] },
  { id: "pre-003", name: "Collar edición especial", category: "premium", brand: "Ostu", price: 129, currency: "USD", image: premiumImages[2], description: "Collar de edición especial para ocasiones relevantes.", tags: ["premium", "accesorios", "regalo"] },
  { id: "pre-004", name: "Morral ejecutivo leather look", category: "premium", brand: "Patprimo", price: 149, currency: "USD", image: premiumImages[3], description: "Morral ejecutivo con diseño premium y compartimento para portátil.", tags: ["premium", "oficina", "tech"] },
  { id: "pre-005", name: "Blazer premium wool touch", category: "premium", brand: "Patprimo", price: 159, currency: "USD", image: premiumImages[4], description: "Blazer premium de textura suave para eventos, oficina y cenas.", tags: ["premium", "moda", "oficina"] },
  { id: "pre-006", name: "Vestido noche satinado", category: "premium", brand: "Ostu", price: 142, currency: "USD", image: premiumImages[5], description: "Vestido satinado de silueta elegante para ocasiones especiales.", tags: ["premium", "moda", "ocasión"] },
  { id: "pre-007", name: "Set premium travel", category: "premium", brand: "Ostu", price: 118, currency: "USD", image: premiumImages[6], description: "Set de viaje con accesorios lifestyle para clientes frecuentes.", tags: ["premium", "regalo", "lifestyle"] },
  { id: "pre-008", name: "Gafas premium tortoise", category: "premium", brand: "Seven Seven", price: 112, currency: "USD", image: premiumImages[7], description: "Gafas de sol premium con montura carey y estética urbana.", tags: ["premium", "urbano", "accesorios"] },
  { id: "pre-009", name: "Chaqueta denim premium", category: "premium", brand: "Seven Seven", price: 135, currency: "USD", image: premiumImages[0], description: "Chaqueta denim premium con lavado especial y acabados reforzados.", tags: ["premium", "denim", "streetwear"] },
  { id: "pre-010", name: "Sneaker limited edition", category: "premium", brand: "Seven Seven", price: 148, currency: "USD", image: premiumImages[1], description: "Sneaker de edición limitada para looks urbanos de alto impacto.", tags: ["premium", "streetwear", "calzado"] },
  { id: "pre-011", name: "Legging elite compression", category: "premium", brand: "Atmos Movement", price: 106, currency: "USD", image: premiumImages[2], description: "Legging premium con compresión y soporte para entrenamiento avanzado.", tags: ["premium", "athleisure", "deportivo"] },
  { id: "pre-012", name: "Chaqueta active shell", category: "premium", brand: "Atmos Movement", price: 168, currency: "USD", image: premiumImages[3], description: "Chaqueta premium liviana para clima variable y movilidad urbana.", tags: ["premium", "athleisure", "deportivo"] },
  { id: "pre-013", name: "Set wellness recovery", category: "premium", brand: "Atmos Movement", price: 124, currency: "USD", image: premiumImages[4], description: "Set premium de recuperación con accesorios de bienestar y descanso.", tags: ["premium", "wellness", "athleisure"] },
  { id: "pre-014", name: "Camisa premium algodón pima", category: "premium", brand: "Patprimo", price: 104, currency: "USD", image: premiumImages[5], description: "Camisa premium de algodón pima para clientes de estilo ejecutivo.", tags: ["premium", "oficina", "moda"] },
  { id: "pre-015", name: "Falda premium plisada", category: "premium", brand: "Ostu", price: 111, currency: "USD", image: premiumImages[6], description: "Falda plisada de acabado premium para looks sofisticados.", tags: ["premium", "moda", "lifestyle"] },
  { id: "pre-016", name: "Kit regalo premium beauty", category: "premium", brand: "Ostu", price: 137, currency: "USD", image: premiumImages[7], description: "Kit premium de belleza y autocuidado para campañas personalizadas.", tags: ["premium", "belleza", "regalo"] },
  { id: "pre-017", name: "Pantalón premium tailored", category: "premium", brand: "Patprimo", price: 116, currency: "USD", image: premiumImages[0], description: "Pantalón tailored premium para oficina, eventos y uso versátil.", tags: ["premium", "oficina", "moda"] },
  { id: "pre-018", name: "Hoodie premium tech knit", category: "premium", brand: "Atmos Movement", price: 128, currency: "USD", image: premiumImages[1], description: "Hoodie premium en tejido técnico para confort y estilo activo.", tags: ["premium", "athleisure", "casual"] },
  { id: "pre-019", name: "Bolso mini premium night", category: "premium", brand: "Ostu", price: 156, currency: "USD", image: premiumImages[2], description: "Bolso mini premium para noche, eventos y ocasiones especiales.", tags: ["premium", "accesorios", "ocasión"] },
  { id: "pre-020", name: "Pack cliente VIP Minders demo", category: "premium", brand: "Ostu", price: 199, currency: "USD", image: premiumImages[3], description: "Pack demo para mostrar segmentación VIP, interés premium y journeys personalizados.", tags: ["premium", "regalo", "vip"] }
];
