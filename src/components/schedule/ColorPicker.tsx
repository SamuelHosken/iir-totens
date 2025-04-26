import { EventColor } from '@/types/schedule';

interface ColorPickerProps {
  value: EventColor;
  onChange: (color: EventColor) => void;
}

const colors: { value: EventColor; label: string; class: string }[] = [
  { value: 'purple', label: 'Roxo', class: 'bg-purple-500' },
  { value: 'green', label: 'Verde', class: 'bg-green-500' },
  { value: 'cyan', label: 'Azul', class: 'bg-cyan-500' },
  { value: 'pink', label: 'Rosa', class: 'bg-pink-500' },
  { value: 'orange', label: 'Laranja', class: 'bg-orange-500' }
];

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex gap-2">
      {colors.map((color) => (
        <button
          key={color.value}
          type="button"
          className={`
            w-8 h-8 rounded-full transition-all
            ${color.class}
            ${value === color.value ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}
          `}
          onClick={() => onChange(color.value)}
          title={color.label}
        />
      ))}
    </div>
  );
} 