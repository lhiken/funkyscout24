
const setTheme = (theme: string) => {
   localStorage.setItem('current_theme', theme);
   document.documentElement.className = theme;
}

const updateTheme = () => {
   const theme = localStorage.getItem('current_theme');

   if (theme) {
      if(theme == 'theme-dark') {
         setTheme('theme-dark');
      } else if (theme == 'theme-light') {
         setTheme('theme-dark');
      }
   } else {
      setTheme('theme-dark');
   }
}

export {setTheme, updateTheme}