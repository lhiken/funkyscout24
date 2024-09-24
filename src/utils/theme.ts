
const setTheme = (theme: string) => {
   localStorage.setItem('current_theme', theme);
   document.documentElement.className = theme;
}

const updateTheme = () => {
   const theme = localStorage.getItem('current_theme');

   if (theme) {
      if(theme == 'dark') {
         setTheme('dark');
      } else if (theme == 'light') {
         setTheme('dark');
      }
   } else {
      setTheme('dark');
   }
}

export {setTheme, updateTheme}