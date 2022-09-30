import { useCallback, useEffect, useState } from "react";
import Cookies from 'universal-cookie';
import { Outlet, useNavigate } from "react-router-dom";
import Auth from "../../api/auth";
import { Footer, Loading, Nav } from "../../components";
import { COOKIES } from "../../helpers";
import { ROUTES } from '../../interfaces/enums';

const cookies = new Cookies();

export default function Layout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignOut = useCallback(async () => {
    await Auth.SignOut();
    cookies.remove(COOKIES.NAME);
    navigate(ROUTES.SIGNIN);
  }, [navigate]);

  const loadClient = useCallback(async () => {
    setLoading(true);
    const getCookie = COOKIES.Decode(cookies.get(COOKIES.NAME));
    if (!getCookie?.email) navigate(ROUTES.SIGNIN);
    setLoading(false);
  }, [navigate]);

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
