import * as React from 'react';

interface ActiveCheckboxProps {
  isChecked: boolean;
  onToggle: (next: boolean) => void;
  ariaLabel?: string;
}

export default function ActiveCheckbox({
  isChecked,
  onToggle,
  ariaLabel = 'Activo',
}: ActiveCheckboxProps): JSX.Element {
  return (
    <input
      type="checkbox"
      checked={isChecked}
      onChange={(e) => onToggle(e.target.checked)}
      aria-label={ariaLabel}
    />
  );
}
