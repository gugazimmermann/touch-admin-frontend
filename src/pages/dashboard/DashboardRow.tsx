import {
  useState,
  useEffect,
  ReactElement,
  useCallback,
} from "react";
import EventsAPI from "../../api/events";
import { Grid, LoadingSmall } from "../../components";
import { PLANSTYPES } from "../../interfaces/enums";
import { EventType } from "../../interfaces/types";
import DashboardCard from "./DashboardCard";

export default function DashboardRow(): ReactElement {
  const [loading, setLoading] = useState(false);
  const [showContent, setShowContent] = useState<EventType[]>([]);

  const orderContent = useCallback(async () => {
    setLoading(true);
    const content = await EventsAPI.getByProfileID();
    setShowContent(content);
    setLoading(false);
  }, []);

  useEffect(() => {
    orderContent();
  }, [orderContent]);
  if (loading) return <LoadingSmall />;
  return (
    <div>
      {!showContent.length ? (
        <h1 className="font-bold text-lg text-center my-4">
          Nenhum registro encontrado!
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
