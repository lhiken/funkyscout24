
const setTheme = (theme: string) => {
   localStorage.setItem('current_theme', theme);
   document.documentElement.className = theme;
}

const updateTheme = () => {
   const theme = localStorage.getItem('current_theme');

   if (theme) {
      setTheme(theme);
   } else {
      setTheme('theme-dark');
      console.log('set theme');
   }
}

export {setTheme, updateTheme}