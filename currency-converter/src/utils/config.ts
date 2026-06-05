export const ENV_CONFIG = {
  api: {
    baseUrl: import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5081'
  }
};

export const CONFIG = {
  paths: {
    main: '/'
  },
  languages: {},
  themes: {}
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
      serverErrorTitle: 'Something went wrong on the server side.',
      serverErrorDescription: 'Please make sure the backend is running and try again later.',
      empty: 'No currencies available.'
    }
  }
};