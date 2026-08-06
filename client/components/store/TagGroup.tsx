"use client";
import { TagOption } from "./TagOption";

interface TagValue {
  id: number;
  value: string;
  isAvailable: boolean;
}

interface TagGroupData {
  id: number;
  name: string;
  color: string;
  values: TagValue[];
}

interface TagGroupProps {
  tag: TagGroupData;
  selectedTagIds: number[];
  onToggle: (tagValueId: number, tagId: number) => void;
}

export function TagGroup({ tag, selectedTagIds, onToggle }: TagGroupProps) {
  if (tag.values.length === 1) {
    const tv = tag.values[0];
    const isSelected = selectedTagIds.includes(tv.id);
    return (
      <div className="mb-3">
        <TagOption
          label={tv.value}
          color={tag.color}
          selected={isSelected}
          disabled={!tv.isAvailable}
          onClick={() => onToggle(tv.id, tag.id)}
        />
        <hr className="border-[var(--color-border)] mt-2" />
      </div>
    );
  }

  return (
    <div className="mb-2">
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: tag.color }}
        />
        <h4
          className="text-sm font-medium text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {tag.name}
        </h4>
      </div>

      <div className="space-y-1">
        {tag.values.map((tv) => {
          const isSelected = selectedTagIds.includes(tv.id);

          return (
            <TagOption
              key={tv.id}
              label={tv.value}
              color={tag.color}
              selected={isSelected}
              disabled={!tv.isAvailable}
              onClick={() => onToggle(tv.id, tag.id)}
            />
          );
        })}
      </div>

      <hr className="border-[var(--color-border)] mt-2" />
    </div>
  );
}
