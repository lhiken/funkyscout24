import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/navbar/navbar";
import Topbar from "../components/topbar/topbar";

interface userInfo {
   userId: number,
   user: string | null,
}

const userInfo = {
   userId: 0,
   user: null,
}

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

   const navigate = useNavigate();

   useEffect(() => {
      if (userInfo.userId == 0) {
         navigate("/auth");
      }
   }, [navigate]);

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