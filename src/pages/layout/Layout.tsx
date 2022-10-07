import { useCallback, useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Outlet, useNavigate } from "react-router-dom";
import Auth from "../../api/auth";
import { Loading, Nav } from "../../components";
import { COOKIES } from "../../helpers";
import { ALERT, CONTEXT, ROUTES } from "../../interfaces/enums";
import ProfileAPI from "../../api/profile";
import { AppContext } from "../../context";
import { AlertType, ProfileType } from "../../interfaces/types";

const cookies = new Cookies();

export default function Layout() {
  const { dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignOut = useCallback(async () => {
    await Auth.SignOut();
    cookies.remove(COOKIES.NAME);
    navigate(ROUTES.SIGNIN);
  }, [navigate]);

  const profileAlert = useCallback((profile: ProfileType) => {
    setLoading(true);
    const alerts = [] as AlertType[];
    if (!profile?.phone)
      alerts.push({
        type: ALERT.WARNING,
        text: "Seu cadastro está incompleto, finalize para utilizar o sistema.",
      });
    if (!profile?.owners || !profile.owners.length)
      alerts.push({
        type: ALERT.WARNING,
        text: "Nenhum responsável cadastrado!",
      });
    dispatch({ type: CONTEXT.UPDATE_ALERTS, payload: alerts });
    setLoading(false);
  }, [dispatch]);

  const seeProfile = async (): Promise<ProfileType> => {
    let profile = await ProfileAPI.get();
    if (!profile.profileID) profile = await ProfileAPI.post();
    return profile;
  };

  const loadClient = useCallback(async (force?: boolean) => {
    setLoading(true);
    const getCookie = COOKIES.Decode(cookies.get(COOKIES.NAME));
    if (!getCookie?.sub) {
      navigate(ROUTES.SIGNIN);
      return;
    }
      const profile = await seeProfile();
      dispatch({ type: CONTEXT.UPDATE_PROFILE, payload: profile });
      profileAlert(profile);
    setLoading(false);
  }, [dispatch, navigate, profileAlert]);

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
    </main>
  );
}
