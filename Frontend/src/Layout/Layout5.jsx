import { Outlet } from "react-router-dom";
import Header from "../components/header/Header.jsx";
import Menubar from "../components/menu/Menubar.jsx";
import EditHeader from "../components/edit/EditHeader.jsx";
import EditImageContextProvider from "../contexts/EditImageContextProvider.jsx";

function Layout5() {
  return (
    <div
      id="scrollingDiv"
      className="h-screen overflow-y-auto bg-[#121212] text-white"
    >
      <Header />

      <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
        <Menubar
          className="lg:sticky lg:max-w-[250px]"
          menuSpanClass="lg:inline"
        />

        <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
          <EditImageContextProvider>
            <EditHeader />

            <Outlet />
          </EditImageContextProvider>
        </section>
      </div>
    </div>
  );
}

export default Layout5;
