import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { DescriptionGroup } from '../components/DescriptionGroup/DescriptionGroup.tsx';
import { currencies } from '../mocks';
import { I18n } from '../utils/config.ts';

const [cad, pln] = currencies;
const statusAriaName = 'aria-expanded';

// todo: Fix after switching to REST API
describe('DescriptionGroup', () => {
  it('renders a toggle button with the current pair in the title', () => {
    render(<DescriptionGroup from={cad} to={pln} />);

    const button = screen.getByRole('button', { name: /CAD\/PLN: about/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute(statusAriaName, 'false');
  });

  it('shows a description of both currencies in the pair after clicking', () => {
    render(<DescriptionGroup from={cad} to={pln} />);

    fireEvent.click(screen.getByRole('button'));
    expect(
      screen.getByText(`${cad.name} — ${cad.code} — ${cad.symbol}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${pln.name} — ${pln.code} — ${pln.symbol}`)
    ).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute(statusAriaName, 'true');
  });

  it('shows fallback text if the currency has no description', () => {
    render(<DescriptionGroup from={{ ...cad, description: '' }} to={pln} />);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText(I18n.en.fallbackDescription)).toBeInTheDocument();
  });
});