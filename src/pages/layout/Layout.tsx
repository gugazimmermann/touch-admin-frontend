import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Outlet, useNavigate } from "react-router-dom";
import Auth from "../../api/auth";
import { Footer, Loading, Nav } from "../../components";
import { COOKIES } from "../../helpers";
import { ROUTES } from '../../interfaces/enums';

export default function Layout() {
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies([COOKIES.NAME]);
  const [loading, setLoading] = useState(false);

  const handleSignOut = useCallback(async () => {
    await Auth.SignOut();
    removeCookie(COOKIES.NAME);
    navigate(ROUTES.SIGNIN);
  }, [navigate, removeCookie]);

  const loadClient = useCallback(async () => {
    setLoading(true);
    const getCookie = COOKIES.Decode(cookies[COOKIES.NAME]);
    if (!getCookie?.email) navigate(ROUTES.SIGNIN);
    setLoading(false);
  }, [cookies, navigate]);

  useEffect(() => {
    loadClient();
  }, [loadClient]);

  return (
    <main className="layout flex flex-col h-screen justify-between container mx-auto max-w-5xl">
      {loading && <Loading />}
      <Nav handleSignOut={handleSignOut} />
      <div className="layout mb-auto h-full p-4 bg-slate-100">
        <Outlet context={{ loadClient, setLoading }} />
      </div>
      <Footer />
    </main>
  );
}
