module.exports = {
  purge: ['src/pages/**/*.{js,ts,jsx,tsx}', 'src/components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1680px',
    },
    extend: {
      colors: {
        priceHistory: '#333333AA',
        primary: '#F6C30D',
        primaryt: '#F6C30D77',
        primaryt2: '#F6C30D22',
        secondary: '#0a0a0a',
        secondaryt: '#0a0a0aAA',
        neutral: '#fefefe',
        invert: '#ff0000',
        blue: '#1A3952',
        blued: '#0F2D44ED',
        bluet: '#1A395299',
        bluet2: '#1A395266',
        blueg: '#1A3952EE',
        bluel: '#4A82AF',
        brown: '#472A00',
        browng: '#472A00EE',
        graphbg: '#333333',
        page: '#0a0a0a',
        paper: '#262626AA',
        paperl: '#323232AA',
        paperd: '#262626DD',
        transactionInfo: '#141414AA',
      },
      fontFamily: {
        'main': 'Kanit',
        'sans': ['Rubik', 'ui-sans-serif', 'system-ui']
      },
      fontSize: {
        'xs-asset': '0.6rem',
        'sm-asset': '0.8rem'
      },
      container: {
        padding: {
          DEFAULT: '1rem',
          sm: '1rem',
          lg: '0',
          xl: '0',
          '2xl': '1rem',
        },
      },
      margin: {
        '5%': '5%',
        'xs': '0.1rem',
      },
      minWidth: {
        'img-small': '2rem',
        '30': '7.5rem',
        '54': '13.5rem',
      },
      minHeight: {
        'content': 'calc(100% - 25px)',
        '50': '12.5rem',
        '192': '48rem',
      },
      maxWidth: {
        'img-small': '2rem',
        'td': '6rem',
        'popup-lg': '36rem',
        'popup': '26rem',
        'filter': '26rem',
        '8': '2rem',
        '10': '2.5rem',
        '62.5': '15.625rem',
      },
      hueRotate: {
        '-50': '-50deg'
      },
      saturate: {
        '300': '3.00'
      },
      maxHeight: {
        'img-small': '2rem',
        'img-collection': '25rem',
        'img-asset': '37.5rem',
        '240': '60rem',
        '192': '48rem',
        '168': '42rem',
        '44': '11rem',
        '10': '2.5rem',
        'xs': '20rem',
        '25': '6.25rem',
      },
      inset: {
        '15': '3.75rem',
        '17.5': '4.375rem',
        '22': '5.5rem',
      },
      width: {
        'asset': '14rem',
        'popup': '30rem',
        'popup-lg': '40rem',
        'asset-td': '30%',
        'half': '50%',
      },
      height: {
        '6.5':'1.625rem',
        'asset': '23rem',
        '168': '42rem',
        '192': '48rem',
        '84': '21rem',
        '88': '22rem',
        '92': '23rem',
        '100': '25rem',
        'fit-content': 'fit-content',
      },
      lineHeight: {
        'tab': '1.625rem',
        '11': '2.75rem',
        '12': '3rem',
        '13': '3.25rem',
        'triple': '3',
      },
      border: {
        '1': '1px',
      },
      zIndex: {
        '-10': '-10',
        '70': '70',
        '100': '100',
      },
      transitionProperty: {
        'width': 'width',
        'height': 'height, max-height',
        'spacing': 'margin, padding',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'collection': '5px 5px 20px -5px #000000AA',
      },
      borderWidth: {
        xs: '0.05rem',
      },
      opacity: {
        '85': '.85',
      },
      borderColor: {
        'ascButton-active': 'transparent transparent #F6C30D',
        'ascButton': 'transparent transparent #FEFEFE',
        'descButton-active': '#F6C30D transparent transparent',
        'descButton': '#FEFEFE transparent transparent',
        'errorNote': '#bf0007',
        'primary': '#F6C30D',
      },
      backgroundImage: theme => ({
        'collection-card': "url('/collection_card/Main.svg')"
      }),
      // adding theme colors to gradient-stops
      gradientColorStops: theme => ({
        ...theme('colors'),
      })
    }
  },
  variants: {
    extend: {
      textTransform: ['hover', 'focus'],
      fontFamily: ['hover', 'focus'],
      fontWeight: ['hover', 'focus'],
      width: ['active', 'hover', 'focus'],
      grayscale: ['hover'],
      brightness: ['hover'],
      saturate: ['hover'],
      sepia: ['hover'],
      hueRotate: ['hover']
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio')
  ]
}
