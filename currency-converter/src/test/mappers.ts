import {describe, expect, it} from "vitest";
import type {CurrencyDTO, PriceChangeDTO} from "../api/dto.ts";
import {mapCurrencyDtoToCurrency, mapPriceChangeDtoToPriceChange} from "../api/mappers.ts";

describe('mapCurrencyDtoToCurrency', () => {
    it('maps every field 1 to 1', () => {
        // Arrange
        const dto: CurrencyDTO = {
            code: 'CAD',
            name: 'Canadian Dollar',
            description: 'desc',
            symbol: '$',
        };

        // Act
        const mapped = mapCurrencyDtoToCurrency(dto);

        // Assert
        expect(mapped).toEqual({
            code: 'CAD',
            name: 'Canadian Dollar',
            description: 'desc',
            symbol: '$',
        });
    });

    it('does not retures the same ref as DTO', () => {
        // Arrange
        const dto: CurrencyDTO = {
            code: 'CAD',
            name: 'Canadian Dollar',
            description: 'desc',
            symbol: '$',
        };

        // Act
        const mapped = mapCurrencyDtoToCurrency(dto);

        // Assert
        expect(mapped).not.toBe(dto);
    });
});

describe('mapPriceChangeDtoToPriceChange', () => {
    it('maps every field 1 to 1', () => {
        // Arrange
        const dto: PriceChangeDTO = {
            purchasedCurrencyCode: 'JPY',
            paymentCurrencyCode: 'CAD',
            price: 0.741,
            dateTime: '2026-05-21T03:40:54.000Z'
        };

        // Act
        const mapped = mapPriceChangeDtoToPriceChange(dto);

        // Assert
        expect(mapped).toEqual({
            purchasedCurrencyCode: 'JPY',
            paymentCurrencyCode: 'CAD',
            price: 0.741,
            dateTime: '2026-05-21T03:40:54.000Z'
        });
    });

    it('does not retures the same ref as DTO', () => {
        // Arrange
        const dto: PriceChangeDTO = {
            purchasedCurrencyCode: 'JPY',
            paymentCurrencyCode: 'CAD',
            price: 0.741,
            dateTime: '2026-05-21T03:40:54.000Z'
        };

        // Act
        const mapped = mapPriceChangeDtoToPriceChange(dto);

        // Assert
        expect(mapped).not.toBe(dto);
    });
});