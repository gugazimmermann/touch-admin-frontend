import { useCallback, useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Outlet, useNavigate } from "react-router-dom";
import Auth from "../../api/auth";
import { Loading, Nav } from "../../components";
import { COOKIES } from "../../helpers";
import { ALERT, CONTEXT, ROUTES } from "../../interfaces/enums";
import ProfileAPI from "../../api/profile";
import { AppContext } from "../../context";
import { AlertType, ProfileType, UUID } from "../../interfaces/types";
import PlansAPI from '../../api/plans';

const cookies = new Cookies();

export default function Layout() {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignOut = useCallback(async () => {
    await Auth.SignOut();
    dispatch({ type: CONTEXT.UPDATE_PROFILE, payload: {} as ProfileType });
    navigate(ROUTES.SIGNIN);
  }, [dispatch, navigate]);

  const profileAlert = useCallback(
    (profile: ProfileType) => {
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
    },
    [dispatch]
  );

  const seeProfile = async (sub: UUID, email: string): Promise<ProfileType> => {
    let profile = await ProfileAPI.get(sub);
    if (!profile.profileID) {
      profile = await ProfileAPI.post(sub, email);
    }
    return profile;
  };

  const loadClient = useCallback(async (force?: boolean) => {
      setLoading(true);
      const getCookie = COOKIES.Decode(cookies.get(COOKIES.NAME));
      if (!getCookie?.sub) {
        navigate(ROUTES.SIGNIN);
        return;
      }
      if (!state.profile?.profileID || force) {
        let profile = await seeProfile(getCookie.sub, getCookie.email);
        dispatch({ type: CONTEXT.UPDATE_PROFILE, payload: profile });
        profileAlert(profile);
      }
      if (!state.plans || !state.plans.length) {
        const plans = await PlansAPI.get();
        dispatch({ type: CONTEXT.UPDATE_PLANS, payload: plans });
      }
      setLoading(false);
    },
    [dispatch, navigate, profileAlert, state.plans, state.profile?.profileID]
  );

  useEffect(() => {
    loadClient();
  }, [loadClient]);

  return (
    <main className="layout flex flex-col bg-slate-100 h-screen justify-between container mx-auto max-w-5xl">
      {loading && <Loading />}
      <Nav handleSignOut={handleSignOut} />
      <div className="layout mb-auto h-min p-4 pb-8 bg-slate-100">
        <Outlet context={{ loadClient }} />
      </div>
    </main>
  );
}
