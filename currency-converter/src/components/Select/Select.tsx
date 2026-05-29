import styles from './Select.module.scss';
import { SelectList } from '../SelectList/SelectList.tsx';
import type { Currencies } from '../../models/types.ts';
import { formatNumber } from '../../utils/functions.ts';
import { TriangleDownIcon } from '../Icons/TriangleDownIcon.tsx';
import { useEffect, useRef, useState } from 'react';
import { IconContainer } from '../IconContainer/IconContainer.tsx';

type SelectProps = {
  currencies: Currencies;
  selected: string;
  onSelect: (code: string) => void;
  value: number;
  onValueChange?: (value: number) => void;
  readOnly?: boolean;
  containerTestId?: string;
  inputTestId?: string;
}

export const Select = (
  {
    currencies,
    selected,
    onSelect,
    value,
    onValueChange,
    containerTestId,
    inputTestId,
    readOnly = false
  }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEsc);
    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('click', handleOutsideClick);
    };

  }, [isOpen]);
  return (
    <div className={styles.select}
         ref={containerRef}
         data-testid={containerTestId}>
      <input
        type="number"
        className={styles.input}
        min={0}
        readOnly={readOnly}
        data-testid={inputTestId}
        value={
          readOnly
            ? formatNumber(value)
            : value
        }
        onChange={
          readOnly
            ? undefined
            : (event) => onValueChange?.(Number(event.target.value))
        }
      />
      <div className={styles.separator}></div>
      <div
        className={styles.selected}
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}>
        {selected}
      </div>
      <IconContainer
        icon={<TriangleDownIcon />}
        isActive={isOpen}
        isAbsolute={true}
      />
      <SelectList
        currencies={currencies}
        selected={selected}
        isOpen={isOpen}
        onSelect={(code) => {
          onSelect(code);
          setIsOpen(false);
        }}
      />
    </div>
  );
};