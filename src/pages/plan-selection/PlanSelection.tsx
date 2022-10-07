import { useState, useCallback, useEffect, ReactElement } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import slugify from "slugify";
import PlansAPI from "../../api/plans";
import { ConfirmationDialog } from "../../components";
import { PLANSTYPES, ROUTES } from "../../interfaces/enums";
import { useOutletContextProfileProps, PlanType, PlansModalType, PlansCardInfoType } from "../../interfaces/types";

export default function PlanSelection() {
  const navigate = useNavigate();
  const { setLoading } = useOutletContext<useOutletContextProfileProps>();
  const [plans, setPlans] = useState<PlanType[]>();
  const [open, setOpen] = useState(false);
  const [planModal, setPlanModal] = useState<PlansModalType>();

  const getPlans = useCallback(async (): Promise<void> => {
    setLoading(true);
    const activeplans = await PlansAPI.get();
    setPlans(activeplans);
    setLoading(false);
  }, [setLoading]);

  useEffect(() => {
    getPlans();
  }, [getPlans]);

  const renderPlanPrice = (price: number, type: PLANSTYPES): string => {
    let res = `R$ ${price},00`;
    res +=
      type === PLANSTYPES.SUBSCRIPTION
        ? ' Mensal'
        : type === PLANSTYPES.BASIC
          ? ' Por Evento'
          : '* Por Evento';
    return res;
  };

  const renderInfoModal = (p: PlanType): ReactElement => {
    return (
      <>
        <h1 className="text-lg font-bold mb-4">{p.name}</h1>
        {p.detail &&
          p.detail.map((d) => (
            <p key={d} className="border-b mb-2 pb-2">
              {d}
            </p>
          ))}
        <h2 className="font-bold mt-4">
          {renderPlanPrice(p.price || 0, p.type)}
        </h2>
      </>
    );
  }

  function choosePlan(name: string): void {
    if (name) navigate(`${ROUTES.NEW}/${slugify(name, { lower: true })}`);
  }

  const handlePlanInfo = (cardPlan: PlanType, cardInfo: PlansCardInfoType): void => {
    setPlanModal({ plan: cardPlan, info: cardInfo });
    setOpen(true);
  };

  const plansCardInfo = (type: PLANSTYPES): PlansCardInfoType => {
    if (type === PLANSTYPES.BASIC) {
      return {
        color: "bg-emerald-500",
        icon: (
          <i className="bx bx-mail-send text-6xl mb-4 hover:text-emerald-500" />
        ),
      };
    }
    if (type === PLANSTYPES.ADVANCED) {
      return {
        color: "bg-orange-500",
        icon: (
          <i className="bx bxs-message-detail text-6xl mb-4 hover:text-orange-500" />
        ),
      };
    }
    return {
      color: "bg-sky-500",
      icon: <i className="bx bx-calendar text-6xl mb-4 hover:text-sky-500" />,
    };
  };

  const renderPlanCard = (type: PLANSTYPES): ReactElement => {
    const cardPlan = plans?.find(p => p.type === type) as PlanType;
    const cardInfo = plansCardInfo(cardPlan.type);
    return (
      <div className="relative shadow-md text-center bg-white">
        <button
          type="button"
          onClick={() => handlePlanInfo(cardPlan, cardInfo)}
          className="absolute top-2 right-2 text-slate-500 z-10"
        >
          <i className="bx bxs-info-circle text-3xl" />
        </button>
        <button
          type="button"
          onClick={() => choosePlan(cardPlan.name)}
          className={`p-8 hover:text-${cardInfo.color.split("bg-")[1]}`}
        >
          {cardInfo.icon}
          <h1 className="text-lg font-bold">{cardPlan.name}</h1>
        </button>
      </div>
    );
  };

  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {plans && (
        <>
          {renderPlanCard(PLANSTYPES.BASIC)}
          {renderPlanCard(PLANSTYPES.ADVANCED)}
          {renderPlanCard(PLANSTYPES.SUBSCRIPTION)}
        </>
      )}
      {planModal && planModal.plan && (
        <ConfirmationDialog
          open={open}
          setOpen={setOpen}
          handleConfirm={() => choosePlan(planModal?.plan?.name)}
          icon={planModal?.info?.icon}
          cancelText='Fechar'
          confirmText='Selecionar'
          confirmColor={planModal?.info?.color || ""}
        >
          {renderInfoModal(planModal.plan)}
        </ConfirmationDialog>
      )}
    </div>
  );
}