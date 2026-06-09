import {Base} from "../components/Base/Base.tsx";
import {act, render, screen, waitFor} from "@testing-library/react";
import {CURRENCIES_DTO, PRICE_CHANGE_DTO} from "./fixtures.ts";

const okResponse = (body: unknown): Response => (
    {
        ok: true,
        status: 200,
        json: async () => body
    }
) as Response;

const errorResponse = (status = 500): Response => (
    {
        ok: false,
        status,
        json: async () => ({})
    }
) as Response;

const mockFetch = (impl: (url: string) => Promise<Response>) => {
    const fn = vi.fn(impl);
    globalThis.fetch = fn as unknown as typeof fetch;
};

describe('Base UI states', () => {
    beforeEach(() => {
        vi.useFakeTimers(
            {
                shouldAdvanceTime: true
            }
        );
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('shows loading screen while currencies are loading', () => {
        // Arrange
        mockFetch(() => new Promise(() => {
        }));

        // Act
        render(<Base/>);

        // Assert
        expect(screen.getByTestId('status-loading')).toBeInTheDocument();
    });

    it('shows full-screen error when currencies fetch fails', async () => {
        // Arrange
        mockFetch(async () => errorResponse(500));

        // Act
        render(<Base/>);

        // Assert
        await waitFor(() => {
            expect(screen.getByTestId('status-error')).toBeInTheDocument();
        });
    });

    it('renders WorkArea after currencies and price are loaded', async () => {
        // Arrange
        mockFetch(
            async (url) => {
                if (url.includes('/Currency')) {
                    return okResponse(CURRENCIES_DTO);
                }
                if (url.includes('/prices')) {
                    return okResponse([PRICE_CHANGE_DTO]);
                }

                throw new Error(`unexpected url ${url}`);
            }
        );

        // Act
        render(<Base/>);
        await waitFor(
            () => {
                expect(screen.getByTestId('amount-input')).toBeInTheDocument();
            }
        );
        await act(
            async () => {
                await vi.advanceTimersByTimeAsync(400);
            }
        );

        // Assert
        await waitFor(
            () => {
                expect(screen.getByTestId('result-input')).toHaveValue(PRICE_CHANGE_DTO.price);
            }
        );
    });

    it('keeps the app working and shows Toast when /prices fails after init', async () => {
        // Arrange
        mockFetch(async (url) => {
                if (url.includes('/Currency')) {
                    return okResponse(CURRENCIES_DTO);
                }
                if (url.includes('/prices')) {
                    return errorResponse(500);
                }

                throw new Error(`unexpected url ${url}`);
            }
        );

        // Act
        render(<Base/>);
        await waitFor(() => {
            expect(screen.getByTestId('amount-input')).toBeInTheDocument();
        });
        await act(async () => {
            await vi.advanceTimersByTimeAsync(400);
        });

        // Assert
        await waitFor(() => {
            const toast = screen.getByTestId('toast');
            expect(toast).toHaveTextContent(/failed with status 500/i);
        });
    });
});