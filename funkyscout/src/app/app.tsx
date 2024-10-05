import { useLocation, useNavigate, useOutlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { updateTheme } from "../utils/theme";
import Navbar from "../components/navigation/navbar/navbar";
import Topbar from "../components/navigation/topbar/topbar";
import { AnimatePresence } from "framer-motion";

const NavbarDisplay = () => {
   const currentPage = useLocation();
   const paths = ["/dashboard"];
   const check = paths.includes(currentPage.pathname);
   if (check) {
      return <Navbar />;
   }
   return null;
};

const TopbarDisplay = () => {
   const currentPage = useLocation();
   const paths = ["/dashboard", "/auth"];
   const check = paths.includes(currentPage.pathname);
   if (check) {
      return <Topbar />;
   }
   return null;
};

const App = () => {
   const currentPage = useLocation();
   const navigate = useNavigate();

   useEffect(() => {
      if (currentPage.pathname == "/") {
         if (localStorage.getItem("user")) {
            navigate("/dashboard");
         } else {
            navigate("/auth");
         }
      }
   }, [navigate, currentPage.pathname]);

   useEffect(() => {
      updateTheme();
   }, []);

   const AppOutlet = () => {
      const appOutlet = useOutlet();
      const [outlet] = useState(appOutlet);

      return <>{outlet}</>;
   };

   return (
      <>
         <div id="app">
            <AnimatePresence mode="wait">
                  <AppOutlet key={currentPage.pathname} />
            </AnimatePresence>
            <NavbarDisplay />
            <TopbarDisplay />
         </div>
      </>
   );
};

export default App;
