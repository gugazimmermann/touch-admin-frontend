import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import slugify from "slugify";
import PlansAPI from "../../api/plans";
import { PLANSTYPES, ROUTES } from "../../interfaces/enums";
import { PlanType, useOutletContextProfileProps } from "../../interfaces/types";
import EventForm from "../events/EventForm";

export default function New() {
  const navigate = useNavigate();
  const params = useParams();
  const { setLoading } = useOutletContext<useOutletContextProfileProps>();
  const [plan, setPlan] = useState<PlanType>();

  const handlePlan = useCallback(async (): Promise<void> => {
    setLoading(true);
    if (!params.name) navigate(ROUTES.HOME);
    const activeplans = await PlansAPI.get();
    const selectedPlan = activeplans.find(p => slugify(p.name, { lower: true }) === params.name)
    if (!params.name) navigate(ROUTES.HOME);
    setPlan(selectedPlan as PlanType);
    setLoading(false);
  }, [navigate, params.name, setLoading]);

  useEffect(() => {
    handlePlan();
  }, [handlePlan]);

  if (plan && plan.type !== PLANSTYPES.SUBSCRIPTION) return <EventForm plan={plan} />
  return <div>SUBSCRIPTION</div>;
}
