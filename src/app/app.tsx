import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { updateTheme } from "../utils/theme";
import Navbar from "../components/navbar/navbar";
import Topbar from "../components/topbar/topbar";

const NavbarDisplay = () => {
   const currentPage = useLocation()
   const paths = ['/dashboard'];
   const check = paths.includes(currentPage.pathname);
   if (check) {
      return (
         <Navbar />
      )
   }
   return null;
}

const TopbarDisplay = () => {
   const currentPage = useLocation()
   const paths = ['/dashboard', '/auth'];
   const check = paths.includes(currentPage.pathname);
   if (check) {
      return (
         <Topbar />
      )
   }
   return null;
}

const App = () => {
   const currentPage = useLocation();
   const navigate = useNavigate();

   useEffect(() => {
      if (currentPage.pathname == '/') {
         if (localStorage.getItem('user')) {
            navigate("/dashboard")
         } else {
            navigate("/auth");
         }
      }
   }, [navigate, currentPage.pathname]);

   useEffect(() => {
      updateTheme();
   }, []);

   return (
      <>
         <div id='app'>
            <Outlet />
            <NavbarDisplay />
            <TopbarDisplay />
         </div>
      </>
   );
}

export default App;