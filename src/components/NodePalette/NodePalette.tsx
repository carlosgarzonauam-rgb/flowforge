import type { DragEvent } from 'react';
import type { NodeType } from '../../types/flow';

interface PaletteItem {
  type: NodeType;
  label: string;
  icon: string;
  colorClass: string;
  borderClass: string;
  textClass: string;
}

const PALETTE_ITEMS: PaletteItem[] = [
  {
    type: 'trigger',
    label: 'Trigger',
    icon: '⚡',
    colorClass: 'bg-green-500',
    borderClass: 'border-green-400',
    textClass: 'text-green-700',
  },
  {
    type: 'action',
    label: 'Action',
    icon: '⚙️',
    colorClass: 'bg-blue-500',
    borderClass: 'border-blue-400',
    textClass: 'text-blue-700',
  },
  {
    type: 'condition',
    label: 'Condition',
    icon: '🔀',
    colorClass: 'bg-yellow-500',
    borderClass: 'border-yellow-400',
    textClass: 'text-yellow-700',
  },
  {
    type: 'ai',
    label: 'AI Step',
    icon: '🤖',
    colorClass: 'bg-purple-500',
    borderClass: 'border-purple-400',
    textClass: 'text-purple-700',
  },
];

export function NodePalette() {
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: NodeType) => {
    event.dataTransfer.setData('nodeType', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-44 bg-gray-50 border-r border-gray-200 flex flex-col p-3 gap-2">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nodes</p>
      {PALETTE_ITEMS.map((item) => (
        <div
          key={item.type}
          draggable
          onDragStart={(e) => onDragStart(e, item.type)}
          className={`flex items-center gap-2 p-2 rounded-lg border-2 bg-white cursor-grab
            active:cursor-grabbing select-none shadow-sm hover:shadow-md transition-shadow
            ${item.borderClass}`}
        >
          <span className={`w-7 h-7 rounded-md flex items-center justify-center text-sm ${item.colorClass}`}>
            {item.icon}
          </span>
          <span className={`text-sm font-medium ${item.textClass}`}>{item.label}</span>
        </div>
      ))}
      <p className="text-xs text-gray-400 mt-2">Drag nodes onto the canvas</p>
    </aside>
  );
}
