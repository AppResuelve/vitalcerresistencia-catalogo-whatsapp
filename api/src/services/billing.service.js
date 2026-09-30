const { Setting } = require('../models')

const STATUSES = ['active', 'past_due', 'suspended']
const KEY = 'billing_status'

const getStatus = async () => {
  const row = await Setting.findOne({ where: { key: KEY } })
  const status = row?.value
  return STATUSES.includes(status) ? status : 'active'
}

const setStatus = async (status) => {
  if (!STATUSES.includes(status)) {
    throw Object.assign(new Error('Estado de billing inválido'), { status: 400 })
  }
  return Setting.upsert({ key: KEY, value: status })
}

module.exports = { getStatus, setStatus, STATUSES }