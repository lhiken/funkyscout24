import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { updateTheme } from "../utils/theme";
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

   useEffect(() => {
      updateTheme();
   }, []);

   return (
      <>
         <div id='app' className="preload">
            <Outlet />
            <NavbarDisplay />
            <TopbarDisplay />
         </div>
      </>
   );
}

export default App;