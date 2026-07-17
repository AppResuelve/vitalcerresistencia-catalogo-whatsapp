const servicesService = require('../../services/admin/services.service')

const list = async (req, res, next) => {
  try {
    const result = await servicesService.list(req.query)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

const getById = async (req, res, next) => {
  try {
    const service = await servicesService.getById(req.params.id)
    res.json(service)
  } catch (err) {
    next(err)
  }
}

const create = async (req, res, next) => {
  try {
    const service = await servicesService.create(req.body)
    res.status(201).json(service)
  } catch (err) {
    next(err)
  }
}

const update = async (req, res, next) => {
  try {
    const service = await servicesService.update(req.params.id, req.body)
    res.json(service)
  } catch (err) {
    next(err)
  }
}

const remove = async (req, res, next) => {
  try {
    await servicesService.remove(req.params.id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

module.exports = { list, getById, create, update, remove }
