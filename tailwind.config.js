module.exports = {
  mode: 'jit',
  theme: {
    screens:{
      'sm': '600px',
    },
    colors:{
      'purple':'#7561A4',
      'purplergb': '117,97,164',
      'dark':'#45337F',
      'white':'#FFFFFF'
    },
    fontFamily:{
      sans: ['Varela Round', 'sans-serif']
    },
    fill:(theme)=>({
      'purple':theme('colors.purple')
    }),
    extend:{
      spacing:{
        'gutter': '20px',
        'logo': '50px',
        'header': '90px',
        'header-space':'110px'
      }
    }
  }
}
