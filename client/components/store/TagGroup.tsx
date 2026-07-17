'use client'
import { TagOption } from './TagOption'

interface TagValue {
  id: number
  value: string
  isAvailable: boolean
}

interface TagGroupData {
  id: number
  name: string
  color: string
  values: TagValue[]
}

interface TagGroupProps {
  tag: TagGroupData
  selectedTagIds: number[]
  selectionMode: 'single' | 'multiple'
  onToggle: (tagValueId: number, tagId: number) => void
}

export function TagGroup({
  tag,
  selectedTagIds,
  selectionMode,
  onToggle,
}: TagGroupProps) {
  const groupValueIds = tag.values.map(v => v.id)
  const hasSelectedInGroup = tag.values.some(v => selectedTagIds.includes(v.id))

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: tag.color }}
        />
        <h4 className="text-sm font-medium text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-body)' }}>
          {tag.name}
        </h4>
      </div>

      <div className="space-y-1">
        {tag.values.map((tv) => {
          const isSelected = selectedTagIds.includes(tv.id)

          return (
            <TagOption
              key={tv.id}
              label={tv.value}
              selected={isSelected}
              disabled={!tv.isAvailable}
              onClick={() => onToggle(tv.id, tag.id)}
            />
          )
        })}
      </div>
    </div>
  )
}
