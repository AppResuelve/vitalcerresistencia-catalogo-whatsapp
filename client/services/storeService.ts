import api from "./api-client"

export const productsService = {
  list(params = {}) {
    return api.get("/store/products", { params }).then((r) => r.data)
  },
  getBySlug(slug: string) {
    return api.get(`/store/products/${slug}`).then((r) => r.data)
  },
}

export const categoriesService = {
  list() {
    return api.get("/store/categories").then((r) => r.data)
  },
}

export const settingsService = {
  get() {
    return api.get("/store/settings").then((r) => r.data)
  },
}

export const ordersService = {
  create(data: unknown) {
    return api.post("/store/orders", data).then((r) => r.data)
  },
}

export const tagsService = {
  list(params = {}) {
    return api.get("/store/tags", { params }).then((r) => r.data)
  },
}

export const servicesService = {
  list(params = {}) {
    return api.get("/store/services", { params }).then((r) => r.data)
  },
  getBySlug(slug: string) {
    return api.get(`/store/services/${slug}`).then((r) => r.data)
  },
}
