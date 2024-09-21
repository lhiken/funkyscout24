import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface userInfo {
   userId: number,
   user: string | null,
}

const userInfo = {
   userId: 0,
   user: null,
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
         </div>
      </>
   );
}

export default App;