export const ENV_CONFIG = {
    api: {
        baseUrl: 'http://localhost:5081'
    }
};

const second = 1000;
const secondPerMinute = 60;
export const CONFIG = {
    paths: {
        main: '/'
    },
    languages: {},
    themes: {},
    settings: {
        debounceDelayMs: 300,
        toastDelayMs: 4000,
        // from ms
        millisecondsPerSecond: second,
        millisecondsPerMinute: secondPerMinute * second,
        millisecondsPerHour: secondPerMinute * secondPerMinute * second,
    },
};

export const I18n = {
    en: {
        fallbackDescription: 'No description available for this currency.',
        app: {
            title: 'Currency Converter'
        },
        pages: {
            title: {
                notFound: 'Page not found'
            }
        },
        status: {
            loading: 'Loading currencies...',
            serverError: 'Could not get data from the server.',
            empty: 'No currencies available.'
        }
    }
};