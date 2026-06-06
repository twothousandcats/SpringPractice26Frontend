import styles from './MoreButton.module.scss';
import { ArrowUpIcon } from '../Icons/ArrowUpIcon.tsx';
import { IconContainer } from '../IconContainer/IconContainer.tsx';

type MoreButtonProps = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
}

export const MoreButton = ({ title, isOpen, onToggle }: MoreButtonProps) => {
  return (
    <button
      type="button"
      className={styles.moreButton}
      aria-expanded={isOpen}
      onClick={onToggle}
    >
      {title}
      <IconContainer
        icon={<ArrowUpIcon />}
        isActive={isOpen}
      />
    </button>
  );
};