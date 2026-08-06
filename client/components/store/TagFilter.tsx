'use client'
import { TagGroup } from './TagGroup'

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

interface TagFilterProps {
  tags: TagGroupData[]
  selectedTagIds: number[]
  onToggleTag: (tagValueId: number, tagId: number) => void
}

export function TagFilter({
  tags,
  selectedTagIds,
  onToggleTag,
}: TagFilterProps) {
  if (tags.length === 0) return null

  return (
    <div>
      {tags.map((tag) => (
        <TagGroup
          key={tag.id}
          tag={tag}
          selectedTagIds={selectedTagIds}
          onToggle={onToggleTag}
        />
      ))}
    </div>
  )
}
