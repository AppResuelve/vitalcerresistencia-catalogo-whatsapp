export const siteData = {
  navbar: {
    logoOnly: false,
    items: [
      { label: 'Inicio', href: '/' },
      { label: 'Productos', href: '/productos' },
      { label: 'Contacto', href: '/contacto' },
    ],
    ctaText: 'WhatsApp',
  },

  footer: {
    columns: [
      {
        title: 'Navegación',
        links: [
          { label: 'Inicio', href: '/' },
          { label: 'Productos', href: '/productos' },
          { label: 'Contacto', href: '/contacto' },
        ],
      },
    ],
  },

  cart: {
    persistenceEnabled: true,
    persistenceKey: 'vitalcer-cart',
  },

  sucursales: [
    {
      id: 'centro',
      name: 'Sucursal Centro',
      address: 'Av. Paraguay 78',
      phone: '5493625217986',
      horarios: 'Lunes a sábado: 8:30 a 12:30 y 16:30 a 20:30',
      image: '/sucursales/paraguay.jpg',
    },
    {
      id: 'illia',
      name: 'Sucursal Illia',
      address: 'Av. Illia 387',
      phone: '5493624963955',
      horarios: 'Lunes a sábado: 8:30 a 12:30 y 16:30 a 20:30',
      image: '/sucursales/illia.webp',
    },
    {
      id: 'julio',
      name: 'Sucursal 9 de Julio',
      address: 'Av. 9 de Julio 160',
      phone: '5493624986044',
      horarios: 'Lunes a sábado: 8:00 a 12:30 y 17:00 a 20:30',
      image: '/sucursales/9dejulio.jpg',
    },
  ],
}

export const content = {
  home: {
    hero: {
      badge: 'Natural Market',
      title: 'Alimentación consciente',
      highlightedText: 'para tu bienestar',
      subtitle:
        'Productos naturales, aceites, frutos secos y suplementos. Todo lo que necesitás para una alimentación saludable.',
      primaryButtonText: 'Ver productos',
      primaryButtonLink: '/productos',
      secondaryButtonText: 'Contacto',
      secondaryButtonLink: '/contacto',
    },
    featuredTitle: 'Destacados',
    featuredSubtitle: 'Nuestros productos más buscados',
    categoriesTitle: 'Categorías',
    categoriesSubtitle: 'Explorá por tipo de producto',
    cta: {
      title: 'Descubrí todo lo que tenemos para vos',
      subtitle: 'Frutos secos, semillas, hierbas, suplementos y mucho más.',
      buttonText: 'Ver catálogo',
      buttonLink: '/productos',
    },
  },

  products: {
    badge: 'Catálogo',
    title: 'Nuestros productos',
    subtitle: 'Encontrá lo que necesitás',
    noResults: 'No hay productos que coincidan con tu búsqueda.',
    clearFilters: 'Limpiar filtros',
  },

  productDetail: {
    backTo: 'Volver al catálogo',
    categoryLabel: 'Categoría',
    tagsLabel: 'Etiquetas',
    addToCart: 'Agregar al carrito',
    addedToCart: '¡Agregado!',
    relatedTitle: 'También te puede gustar',
  },

  cart: {
    title: 'Tu pedido',
    emptyTitle: 'Tu pedido está vacío',
    emptyMessage: 'Agregá productos desde el catálogo para armar tu pedido.',
    browseProducts: 'Ver productos',
    itemCount: '{count} producto(s)',
    subtotal: 'Subtotal',
    total: 'Total',
    requestQuote: 'Enviar pedido por WhatsApp',
    removeItem: 'Eliminar',
    clearCart: 'Vaciar carrito',
    continueShopping: 'Seguir comprando',
  },

  contact: {
    badge: 'Contacto',
    title: 'Encontranos',
    subtitle:
      'Visitanos en cualquiera de nuestras 3 sucursales o escribinos por WhatsApp.',
    infoTitle: 'Sucursales',
  },

  notFound: {
    title: '404',
    subtitle: 'Página no encontrada',
    message: 'Lo sentimos, la página que buscás no existe o fue movida.',
    buttonText: 'Volver al inicio',
    buttonLink: '/',
  },
}
