import { Outlet } from "react-router-dom";
import DataTable from "../../../pages/Home";
import Header from "../Header";
import Footer from "../Footer";

function Main() {
  return (
    <div className="main">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Main;
