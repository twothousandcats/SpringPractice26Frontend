import {describe, expect, it} from "vitest";
import {CURRENCIES} from "./fixtures.ts";
import {DescriptionGroup} from "../components/DescriptionGroup/DescriptionGroup.tsx";
import {fireEvent, render, screen} from "@testing-library/react";
import {I18n} from "../utils/config.ts";

const [cad, pln] = CURRENCIES;
const ariaExpanded = "aria-expanded";

describe("DescriptionGroup", () => {
    it('renders a toggle button with the current pair in the title and is collapsed by default', () => {
        // Arrange
        // fixtures

        // Act
        render(<DescriptionGroup
            from={cad}
            to={pln}
        />);

        // Assert
        const btn = screen.getByTestId('more-btn');
        expect(btn).toBeInTheDocument();
        expect(btn).toHaveAttribute(ariaExpanded, 'false');
    });

    it('shows a description of both currencies in the pair after clicking', () => {
        // Arrange
        render(<DescriptionGroup
            from={cad}
            to={pln}
        />);
        const btn = screen.getByTestId('more-btn');

        // Act
        fireEvent.click(btn);

        // Assert
        expect(
            screen.getByText(`${cad.name} — ${cad.code} — ${cad.symbol}`)
        ).toBeInTheDocument();
        expect(
            screen.getByText(`${pln.name} — ${pln.code} — ${pln.symbol}`)
        ).toBeInTheDocument();
        expect(btn).toHaveAttribute(ariaExpanded, 'true');
    });

    it('shows fallback text if the currency has no description', () => {
        // Arrange
        render(<DescriptionGroup
            from={
                {
                    ...cad,
                    description: '',
                }
            }
            to={pln}
        />);
        const btn = screen.getByTestId('more-btn');

        // Act
        fireEvent.click(btn);

        // Assert
        expect(screen.getByText(I18n.en.fallbackDescription)).toBeInTheDocument();
    });
});