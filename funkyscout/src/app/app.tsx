import { useLocation, useNavigate, useOutlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { updateTheme } from "../utils/theme";
import Navbar from "../components/navigation/navbar/navbar";
import Topbar from "../components/navigation/topbar/topbar";

const NavbarDisplay = () => {
   const currentPage = useLocation();
   const paths = ["/dashboard", "/scouting", "/data"];
   const check = paths.includes(currentPage.pathname);
   if (check) {
      return <Navbar />;
   }
   return null;
};

const TopbarDisplay = () => {
   const currentPage = useLocation();
   const paths = ["/auth", "/scouting", "/data", "/scout/matches", "/data/team"];

   const check = paths.some((path) =>
      currentPage.pathname === path ||
      (path === "/scout/matches" &&
         currentPage.pathname.startsWith(path + "/")) ||
      (path === "/data/team" &&
         currentPage.pathname.startsWith(path + "/"))
   );

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
            <AppOutlet key={currentPage.pathname} />
            <NavbarDisplay />
            <TopbarDisplay />
         </div>
      </>
   );
};

export default App;
