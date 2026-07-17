// @ts-nocheck
'use client'
import { useState, useRef, useMemo, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { FileSpreadsheet, AlertTriangle, ChevronDown, Download } from 'lucide-react'
import { Button } from './ui/Form'
import { Modal } from './ui/Modal'
import { Spinner } from './ui/Spinner'
import { LoadingOverlay } from './ui/LoadingOverlay'
import { useAlert } from './ui/AlertContext'
import api from '@/services/admin-api'

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 255) || 'sin-nombre'

const NAME_ALIASES = ['nombre', 'name', 'producto', 'product', 'product_name', 'producto_nombre']
const PRICE_ALIASES = ['precio', 'price', 'importe', 'costo', 'valor', 'retail_price', 'precio_venta']

const OPTIONAL_FIELDS = [
  { key: 'description', label: 'Descripción', aliases: ['descripcion', 'description', 'desc', 'detalle'] },
  { key: 'discountPercentage', label: '% Descuento', aliases: ['descuento', 'discount', 'porcentaje', 'off'] },
  { key: 'comparePrice', label: 'Precio de comparación', aliases: ['precio_original', 'compare_price', 'precio_anterior'] },
  { key: 'wholesalePrice', label: 'Precio mayorista', aliases: ['mayorista', 'wholesale', 'precio_mayorista'] },
  { key: 'wholesaleMinQty', label: 'Cant. mín. mayorista', aliases: ['unidades_mayorista', 'wholesale_min', 'cantidad_mayorista', 'min_mayorista'] },
  { key: 'stock', label: 'Stock', aliases: ['stock', 'cantidad', 'inventario', 'disponible'] },
  { key: 'sku', label: 'Código SKU', aliases: ['sku', 'codigo', 'code', 'cod'] },
  { key: 'images', label: 'URL imagen', aliases: ['imagen', 'image', 'foto', 'url_imagen', 'img'] },
]

const ATTR_COL_PATTERN = /^(atributo|attr)[\s_-]?(\d+)$/i
const VAL_COL_PATTERN = /^(valor|val)[\s_-]?(\d+)$/i

function detectColumn(headers, aliases) {
  const lower = headers.map((h) => h.toLowerCase().trim())
  for (const alias of aliases) {
    const idx = lower.findIndex((h) => h === alias || h.includes(alias))
    if (idx !== -1) return headers[idx]
  }
  return ''
}

function parseProducts(rawData, nameCol, priceCol, optionals, attrPairs) {
  const products = []
  const errors = []
  const grouped = {}

  rawData.rows.forEach((row, i) => {
    const name = String(row[nameCol] ?? '').trim()
    const price = row[priceCol]

    if (!name) { errors.push(`Fila ${i + 2}: falta el nombre`); return }
    if (price == null || price === '' || isNaN(Number(price)) || Number(price) < 0) {
      errors.push(`Fila ${i + 2}: "${name}" — precio inválido`)
      return
    }

    const key = name.toLowerCase()

    if (!grouped[key]) {
      grouped[key] = {
        name,
        slug: slugify(name),
        price: Number(price),
        skus: [],
      }
      for (const { key: fKey } of OPTIONAL_FIELDS) {
        if (fKey === 'sku') continue  // SKU-level, handled below
        const col = optionals[fKey]
        if (!col || row[col] == null || row[col] === '') continue
        if (fKey === 'images' || fKey === 'description') grouped[key][fKey] = String(row[col])
        else { const num = Number(row[col]); if (!isNaN(num)) grouped[key][fKey] = num }
      }
    }

    // Build SKU from attribute columns
    const attrValues = []
    attrPairs.forEach(({ attrCol, valCol, num }) => {
      const attrName = String(row[attrCol] ?? '').trim()
      const value = String(row[valCol] ?? '').trim()
      if (attrName && value) attrValues.push({ attrName, value })
    })

    if (attrValues.length > 0) {
      grouped[key].skus.push({
        retailPrice: Number(row[priceCol]) || Number(price),
        stock: optionals['stock'] && row[optionals['stock']] != null ? Number(row[optionals['stock']]) || 0 : 0,
        sku: optionals['sku'] && row[optionals['sku']] != null ? String(row[optionals['sku']]).trim() : null,
        attrValues,
      })
    }
  })

  for (const p of Object.values(grouped)) {
    if (p.skus.length === 0) {
      // Producto simple: usar stock del producto
      const stock = p.stock || 0
      delete p.stock
      products.push(p)
    } else {
      products.push(p)
    }
  }

  return { products, errors }
}

function downloadTemplate() {
  const headers = [
    'nombre', 'descripcion', 'precio', 'stock',
    'precio_mayorista', 'cantidad_mayorista',
    'descuento', 'imagen', 'sku',
    'atributo_1', 'valor_1', 'atributo_2', 'valor_2',
  ]
  const example1 = [
    'Remera básica', 'Remera de algodón', 1500, 10,
    '', '', '', '', '',
    'Color', 'Rojo', 'Talle', 'M',
  ]
  const example2 = [
    'Remera básica', '', 1800, 5,
    '', '', '', '', '',
    'Color', 'Rojo', 'Talle', 'XL',
  ]
  const example3 = [
    'Alfajor chocolate', 'Sin variantes', 1400, 100,
    1000, 12, '', '', '',
    '', '', '', '',
  ]
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet([headers, example1, example2, example3])
  XLSX.utils.book_append_sheet(wb, ws, 'Productos')
  XLSX.writeFile(wb, 'plantilla-productos.xlsx')
}

export default function BulkProductModal({ open, onClose, categories, onCreated }) {
  const Alert = useAlert()
  const fileInputRef = useRef(null)
  const [step, setStep] = useState('upload')
  const [categoryId, setCategoryId] = useState('')
  const [fileName, setFileName] = useState('')
  const [rawData, setRawData] = useState(null)
  const [nameCol, setNameCol] = useState('')
  const [priceCol, setPriceCol] = useState('')
  const [optionals, setOptionals] = useState({})
  const [attrPairs, setAttrPairs] = useState([])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [readError, setReadError] = useState('')
  const [createdCount, setCreatedCount] = useState(0)
  const [createdAttributes, setCreatedAttributes] = useState([])
  const [warnings, setWarnings] = useState([])
  const [previewPage, setPreviewPage] = useState(1)

  const PREVIEW_SIZE = 50

  const { products: parsed, errors } = useMemo(() => {
    if (!rawData || !nameCol || !priceCol) return { products: [], errors: [] }
    return parseProducts(rawData, nameCol, priceCol, optionals, attrPairs)
  }, [rawData, nameCol, priceCol, optionals, attrPairs])

  const detectedAttributes = useMemo(() => {
    const map = new Map<string, Set<string>>()
    parsed.forEach((p) => {
      (p.skus || []).forEach((sku) => {
        sku.attrValues.forEach(({ attrName, value }) => {
          if (!map.has(attrName)) map.set(attrName, new Set())
          map.get(attrName)!.add(value)
        })
      })
    })
    return Array.from(map.entries()).map(([name, values]) => ({
      name,
      values: Array.from(values),
    }))
  }, [parsed])

  useEffect(() => {
    setPreviewPage(1)
  }, [rawData, nameCol, priceCol, optionals])

  const totalPages = Math.ceil(parsed.length / PREVIEW_SIZE)
  const pagedProducts = parsed.slice((previewPage - 1) * PREVIEW_SIZE, previewPage * PREVIEW_SIZE)

  const mappedCount = Object.values(optionals).filter(Boolean).length

  const handleFile = (file) => {
    setReadError('')
    setRawData(null)
    setNameCol('')
    setPriceCol('')
    setOptionals({})
    setAttrPairs([])
    setShowAdvanced(false)
    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

        if (rows.length === 0) {
          setReadError('El archivo está vacío o no tiene datos.')
          return
        }

        const headers = Object.keys(rows[0])
        const data = { headers, rows }

        setRawData(data)
        setNameCol(detectColumn(headers, NAME_ALIASES) || headers[0])
        setPriceCol(detectColumn(headers, PRICE_ALIASES) || headers[0])

        const detected = {}
        for (const { key, aliases } of OPTIONAL_FIELDS) {
          const col = detectColumn(headers, aliases)
          if (col) detected[key] = col
        }
        setOptionals(detected)
        if (Object.keys(detected).length > 0) setShowAdvanced(true)

        // Detect attribute columns: atributo_N / valor_N pairs
        const pairs = []
        const lowerHeaders = headers.map(h => h.toLowerCase().trim())
        let n = 1
        while (n <= 10) {
          const attrIdx = lowerHeaders.findIndex(h => ATTR_COL_PATTERN.test(h) && ATTR_COL_PATTERN.exec(h)[2] === String(n))
          const valIdx = lowerHeaders.findIndex(h => VAL_COL_PATTERN.test(h) && VAL_COL_PATTERN.exec(h)[2] === String(n))
          if (attrIdx !== -1 && valIdx !== -1) {
            pairs.push({ attrCol: headers[attrIdx], valCol: headers[valIdx], num: n })
          } else { break }
          n++
        }
        setAttrPairs(pairs)

        setStep('mapping')
      } catch {
        setReadError('No se pudo leer el archivo. Verificá que sea .xlsx o .csv válido.')
      }
    }

    reader.readAsArrayBuffer(file)
  }

  const handleSubmit = async () => {
    const final = parsed.filter((p) =>
      p.name && p.price != null && !isNaN(p.price) && Number(p.price) >= 0
    )

    if (final.length === 0) return

    setStep('creating')

    const payload = final.map(p => {
      const { skus, stock, ...productData } = p
      if (skus?.length > 0) return { ...productData, skus }
      return productData
    })

    try {
      const { data } = await api.post('/admin/products/bulk', {
        products: payload,
        categoryId: categoryId || null,
      })

      setCreatedCount(data.created)
      setCreatedAttributes(data.createdAttributes || [])
      setWarnings(data.warnings || [])

      Alert.fire({
        message: `${data.created} productos creados${data.createdAttributes?.length ? `. ${data.createdAttributes.length} atributo(s) nuevo(s): ${data.createdAttributes.join(', ')}` : ''}`,
        type: 'success',
      })

      onCreated?.()
      setStep('results')
    } catch (err) {
      let msg = 'Error al crear productos'
      try {
        const body = typeof err.response?.data === 'string'
          ? JSON.parse(err.response.data)
          : err.response?.data
        msg = body?.error || body?.message || msg
      } catch {}
      Alert.fire({ message: msg, type: 'error' })
      setStep('mapping')
    }
  }

  const handleClose = () => {
    setStep('upload')
    setRawData(null)
    setNameCol('')
    setPriceCol('')
    setOptionals({})
    setAttrPairs([])
    setShowAdvanced(false)
    setReadError('')
    setFileName('')
    setCategoryId('')
    setWarnings([])
    setCreatedAttributes([])
    setCreatedCount(0)
    onClose()
  }

  const reset = () => {
    setRawData(null)
    setNameCol('')
    setPriceCol('')
    setOptionals({})
    setAttrPairs([])
    setShowAdvanced(false)
    setReadError('')
    setFileName('')
    setWarnings([])
    setCreatedAttributes([])
    setCreatedCount(0)
    setStep('upload')
  }

  const extraCols = OPTIONAL_FIELDS.filter(({ key }) => optionals[key])
  const hasExtraCols = extraCols.length > 0

  return (
    <>
    <Modal open={open} onClose={handleClose} title="Creación masiva" closable={step !== 'creating'}>
      {/* Step 1: Upload */}
      {step === 'upload' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Categoría</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-cyan-500"
            >
              <option value="">Sin categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const file = e.dataTransfer.files[0]
              if (file) handleFile(file)
            }}
            className="border-2 border-dashed border-zinc-700 hover:border-cyan-500 rounded-xl p-8 text-center cursor-pointer transition-colors bg-zinc-800/30"
          >
            <FileSpreadsheet className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
            <p className="text-sm text-zinc-400 mb-1">Arrastrá tu archivo o clickeá para buscar</p>
            <p className="text-xs text-zinc-600">.xlsx .csv</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.csv,.xls"
            onChange={(e) => {
              const file = e.target.files[0]
              if (file) handleFile(file)
            }}
            className="hidden"
          />

          {readError && (
            <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {readError}
            </div>
          )}

          <button type="button" onClick={downloadTemplate}
            className="flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            <Download className="w-3.5 h-3.5" /> Descargar plantilla
          </button>

          <div className="flex justify-end">
            <Button type="button" variant="secondary" onClick={handleClose}>Cancelar</Button>
          </div>
        </div>
      )}

      {/* Step 2: Mapping */}
      {step === 'mapping' && rawData && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <FileSpreadsheet className="w-4 h-4" />
            <span className="text-zinc-500">{fileName}</span>
            <span className="text-zinc-600">—</span>
            <span className="text-zinc-400">{rawData.rows.length} filas</span>
          </div>

          <p className="text-sm text-zinc-400">Indicá qué columna corresponde a cada campo:</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">
                Nombre del producto
              </label>
              <select
                value={nameCol}
                onChange={(e) => setNameCol(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-cyan-500"
              >
                {rawData.headers.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">
                Precio
              </label>
              <select
                value={priceCol}
                onChange={(e) => setPriceCol(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-cyan-500"
              >
                {rawData.headers.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Advanced mapping */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-0' : '-rotate-90'}`} />
            Campos opcionales
            {mappedCount > 0 && (
              <span className="text-xs text-cyan-400">({mappedCount} mapeado{mappedCount !== 1 ? 's' : ''})</span>
            )}
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-2 gap-4">
              {OPTIONAL_FIELDS.map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5">
                    {label}
                  </label>
                  <select
                    value={optionals[key] || ''}
                    onChange={(e) => setOptionals((prev) => ({ ...prev, [key]: e.target.value || null }))}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">-- No mapear --</option>
                    {rawData.headers.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* Detected attributes */}
          {detectedAttributes.length > 0 && (
            <div className="px-4 py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-sm">
              <p className="font-medium text-cyan-400 mb-2">
                Atributos detectados en el archivo:
              </p>
              {detectedAttributes.map(({ name, values }) => (
                <p key={name} className="text-cyan-300/80 leading-relaxed">
                  • <span className="text-cyan-400 font-medium">{name}</span>:
                  {' '}{values.length} valor{values.length !== 1 ? 'es' : ''} — {values.join(', ')}
                </p>
              ))}
              <p className="mt-2 text-cyan-500/60 text-xs">
                Estos atributos y sus valores se crearán automáticamente al confirmar.
              </p>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm space-y-1">
              <p className="font-medium flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.length} fila{errors.length > 1 ? 's' : ''} con problemas:
              </p>
              {errors.map((e, i) => <p key={i}>• {e}</p>)}
            </div>
          )}

          {/* Preview table */}
          {parsed.length > 0 && (
            <>
              {totalPages > 1 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">
                    {previewPage * PREVIEW_SIZE - PREVIEW_SIZE + 1}–{Math.min(previewPage * PREVIEW_SIZE, parsed.length)} de {parsed.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPreviewPage((p) => Math.max(1, p - 1))}
                      disabled={previewPage === 1}
                      className="px-2 py-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
                    >
                      Anterior
                    </button>
                    <span className="text-zinc-600 text-xs">{previewPage}/{totalPages}</span>
                    <button
                      onClick={() => setPreviewPage((p) => Math.min(totalPages, p + 1))}
                      disabled={previewPage === totalPages}
                      className="px-2 py-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
              <div className="max-h-64 overflow-y-auto border border-zinc-800 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-900 sticky top-0">
                    <tr className="text-zinc-500 text-xs uppercase tracking-wider">
                      <th className="text-left px-3 py-2 font-medium">Nombre</th>
                      <th className="text-left px-3 py-2 font-medium">Slug</th>
                      <th className="text-right px-3 py-2 font-medium">Precio</th>
                      {attrPairs.length > 0 && <th className="text-center px-3 py-2 font-medium">Variantes</th>}
                      {hasExtraCols && extraCols.map(({ key, label }) => (
                        <th key={key} className="text-right px-3 py-2 font-medium">{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {pagedProducts.map((p, i) => (
                      <tr key={i} className="text-zinc-300">
                        <td className="px-3 py-2 truncate max-w-[200px]">{p.name}</td>
                        <td className="px-3 py-2 text-zinc-500 font-mono text-xs">{p.slug}</td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {`$${p.price.toLocaleString('es-AR')}`}
                        </td>
                        {attrPairs.length > 0 && (
                          <td className="px-3 py-2 text-center">
                            <span className="text-xs text-cyan-400">{p.skus?.length || 0}</span>
                          </td>
                        )}
                        {hasExtraCols && extraCols.map(({ key }) => (
                          <td key={key} className="px-3 py-2 text-right text-xs text-zinc-400">
                            {key === 'images' ? (p[key] ? '✓' : '—') : p[key] ?? '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={reset}>Cancelar</Button>
            <Button type="button" onClick={handleSubmit} disabled={parsed.length === 0}>
              Crear {parsed.length} producto{parsed.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      )}

      {/* Creating — overlay handles the UI */}
      {step === 'creating' && (
        <div className="text-center py-8">
          <Spinner size="lg" />
          <p className="text-zinc-300 font-medium mt-4">Creando {parsed.length} productos...</p>
          <p className="text-zinc-500 text-sm mt-1">No cierres esta ventana.</p>
        </div>
      )}

      {/* Results */}
      {step === 'results' && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-emerald-400 font-medium text-lg">{createdCount} productos creados</p>
            {createdAttributes.length > 0 && (
              <p className="text-sm text-cyan-400 mt-1">
                + {createdAttributes.length} atributo{createdAttributes.length !== 1 ? 's' : ''} nuevo{createdAttributes.length !== 1 ? 's' : ''}: {createdAttributes.join(', ')}
              </p>
            )}
            {warnings.length === 0 && createdAttributes.length === 0 && (
              <p className="text-sm text-zinc-500 mt-1">Sin conflictos de slugs</p>
            )}
          </div>

          {warnings.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <p className="text-sm text-amber-400 font-medium">
                  {warnings.length} slug{warnings.length > 1 ? 's' : ''} modificado{warnings.length > 1 ? 's' : ''} por duplicación:
                </p>
              </div>
              <div className="max-h-52 overflow-y-auto border border-zinc-800 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-900 sticky top-0">
                    <tr className="text-zinc-500 text-xs uppercase tracking-wider">
                      <th className="text-left px-3 py-2 font-medium">Producto</th>
                      <th className="text-left px-3 py-2 font-medium">Slug generado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {warnings.map((w, i) => (
                      <tr key={i} className="text-zinc-300">
                        <td className="px-3 py-2 truncate max-w-[200px]">{w.name}</td>
                        <td className="px-3 py-2 text-zinc-400 font-mono text-xs">{w.slug}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-zinc-500 mt-2">Podés editarlos desde la lista de productos.</p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button type="button" onClick={handleClose}>Entendido</Button>
          </div>
        </div>
      )}
    </Modal>
    <LoadingOverlay
      open={step === 'creating'}
      message={`Creando ${parsed.length} productos...`}
      description="No cierres esta ventana."
    />
    </>
  )
}
