import {
  useContext,
  useState,
  useEffect,
  ReactElement,
  useCallback,
} from "react";
import EventsAPI from "../../api/events";
import { Grid, Loading, Title } from "../../components";
import { AppContext } from "../../context";
import { PLANSTYPES } from "../../interfaces/enums";
import { EventType } from "../../interfaces/types";
import DashboardCard from "./DashboardCard";

type DashboardRowProps = {
  type: PLANSTYPES;
};

export default function DashboardRow({
  type,
}: DashboardRowProps): ReactElement {
  const { state } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [showContent, setShowContent] = useState<EventType[]>([]);

  const orderContent = useCallback(async () => {
    setLoading(true);
    if (state.profile) {
      const content = await EventsAPI.getByProfileID();
      setShowContent(content);
    }
    setLoading(false);
  }, [state.profile]);

  useEffect(() => {
    orderContent();
  }, [orderContent]);

  if (loading) return <Loading />;
  return (
    <div>
      <Title
        text={type !== PLANSTYPES.SUBSCRIPTION ? "Eventos" : "Assinaturas"}
      />
      {!showContent.length ? (
        <h1 className="font-bold text-lg text-center my-4">
          'Nenhum registro encontrado!'
        </h1>
      ) : (
        <Grid>
          <>
            {showContent.map((content) => (
              <DashboardCard
                key={content.eventID}
                type={PLANSTYPES.ADVANCED}
                content={content}
              />
            ))}
          </>
        </Grid>
      )}
    </div>
  );
}
