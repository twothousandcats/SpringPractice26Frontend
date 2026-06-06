import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { Base } from '../components/Base/Base.tsx';
import { currencies, priceChanges } from '../mocks';

const CONFIG = {
  testingAmountValue: 10,
  firstCurrencyCode: 'CAD',
  secondCurrencyCode: 'PLN',
  thirdCurrencyCode: 'JPY',
  selectors: {
    fromSelect: 'from-select',
    toSelect: 'to-select',
    amountInput: 'amount-input',
    resultInput: 'result-input'
  },
  statusArias: {
    moreBtn: 'aria-expanded'
  }
};

// todo: refactor
describe('Base (converter integration)', () => {
  it('renders both selects and fields filled with mocks', () => {
    render(<Base />);

    const fromSelect = screen.getByTestId(CONFIG.selectors.fromSelect);
    const toSelect = screen.getByTestId(CONFIG.selectors.toSelect);

    expect(within(fromSelect).getAllByText(CONFIG.firstCurrencyCode).length).toBeGreaterThan(0);
    expect(within(toSelect).getAllByText(CONFIG.secondCurrencyCode).length).toBeGreaterThan(0);

    currencies.forEach(({ code }) => {
      expect(within(fromSelect).getAllByText(code).length).toBeGreaterThan(0);
      expect(within(toSelect).getAllByText(code).length).toBeGreaterThan(0);
    });

    expect(screen.getByTestId(CONFIG.selectors.amountInput)).toHaveValue(1);
    expect(screen.getByTestId(CONFIG.selectors.resultInput)).toHaveValue(
      priceChanges[CONFIG.firstCurrencyCode][CONFIG.secondCurrencyCode].price
    );
  });

  it('rerenders the result when the sum changes', () => {
    render(<Base />);

    fireEvent.change(screen.getByTestId(CONFIG.selectors.amountInput), { target: { value: CONFIG.testingAmountValue.toString() } });

    expect(screen.getByTestId(CONFIG.selectors.amountInput)).toHaveValue(CONFIG.testingAmountValue);
    expect(screen.getByTestId(CONFIG.selectors.resultInput)).toHaveValue(CONFIG.testingAmountValue * priceChanges[CONFIG.firstCurrencyCode][CONFIG.secondCurrencyCode].price);
  });

  it('rerenders the result when changing the currency in "to"', () => {
    render(<Base />);

    fireEvent.click(within(screen.getByTestId(CONFIG.selectors.toSelect)).getByText(CONFIG.thirdCurrencyCode));

    expect(screen.getByTestId(CONFIG.selectors.resultInput)).toHaveValue(priceChanges[CONFIG.firstCurrencyCode][CONFIG.thirdCurrencyCode].price);
  });

  it('does not allow identical pairs: choosing "to" = current "from" shifts "from"', () => {
    render(<Base />);

    fireEvent.click(within(screen.getByTestId(CONFIG.selectors.toSelect)).getByText(CONFIG.firstCurrencyCode));

    expect(screen.getByTestId(CONFIG.selectors.resultInput)).toHaveValue(priceChanges[CONFIG.secondCurrencyCode][CONFIG.firstCurrencyCode].price);
  });

  it('swaps the pair and rerenders the result', () => {
    render(<Base />);

    fireEvent.click(screen.getByRole('button', { name: 'Swap' }));

    expect(screen.getByTestId(CONFIG.selectors.resultInput)).toHaveValue(priceChanges[CONFIG.secondCurrencyCode][CONFIG.firstCurrencyCode].price);
  });

  it('reset open/closed descriptions by changing pair', () => {
    render(<Base />);

    fireEvent.click(screen.getByRole('button', { name: /CAD\/PLN: about/i }));
    expect(screen.getByText(currencies[0].description)).toBeInTheDocument();

    fireEvent.click(within(screen.getByTestId(CONFIG.selectors.toSelect)).getByText(CONFIG.thirdCurrencyCode));

    expect(
      screen.getByRole('button', { name: /CAD\/JPY: about/i })
    ).toHaveAttribute(CONFIG.statusArias.moreBtn, 'false');
  });
});