import { DateTime } from "luxon";
import { useState, useEffect, ReactElement, useCallback } from "react";
import EventsAPI from "../../api/events";
import { Form, Grid, LoadingSmall, Title } from "../../components";
import { PLANSTYPES } from "../../interfaces/enums";
import { EventType } from "../../interfaces/types";
import DashboardCard from "./DashboardCard";

export default function DashboardRow(): ReactElement {
  const [loading, setLoading] = useState(false);
  const [showContent, setShowContent] = useState<EventType[]>([]);
  const [currentEvents, setCurrentEvents] = useState<EventType[]>([]);
  const [pastEvents, setPastEvents] = useState<EventType[]>([]);
  const [futureEvents, setFutureEvents] = useState<EventType[]>([]);
  const [subscriptions, setSubscriptions] = useState<EventType[]>([]);

  const seeCurrentEvents = (e: EventType) => {
    if (e.dates.find((d) => d === DateTime.now().toFormat("yyyy-MM-dd")))
      return e;
  };

  const seePastEvents = useCallback((e: EventType) => {
    if (
      e.dates.find((d) => DateTime.fromFormat(d, "yyyy-MM-dd") > DateTime.now())
    ) {
      if (!seeCurrentEvents(e)) return e;
    }
  }, []);

  const seeFutureEvents = useCallback((e: EventType) => {
    if (
      e.dates.find((d) => DateTime.fromFormat(d, "yyyy-MM-dd") < DateTime.now())
    ) {
      if (!seeCurrentEvents(e)) return e;
    }
  }, []);

  const orderContent = useCallback(async () => {
    setLoading(true);
    const content = await EventsAPI.getByProfileID();
    const events = content.filter(
      (e) => e.planType !== PLANSTYPES.SUBSCRIPTION
    );
    const subs = content.filter((e) => e.planType === PLANSTYPES.SUBSCRIPTION);
    setSubscriptions(subs);
    const current = events.map((e) => seeCurrentEvents(e)).filter((x) => x);
    setCurrentEvents(current as EventType[]);
    const furure = events.map((e) => seePastEvents(e)).filter((x) => x);
    setFutureEvents(furure as EventType[]);
    const past = events.map((e) => seeFutureEvents(e)).filter((x) => x);
    setPastEvents(past as EventType[]);
    setShowContent(content);
    setLoading(false);
  }, [seeFutureEvents, seePastEvents]);

  useEffect(() => {
    orderContent();
  }, [orderContent]);

  const renderRow = (title: string, events: EventType[]) => (
    <>
      <Title text={title} className="font-bold text-center -mb-4" />
      <Form>
        <Grid>
          <>
            {events.map((e) => <DashboardCard key={e.eventID} content={e}  />)}
          </>
        </Grid>
      </Form>
    </>
  );

  if (loading) return <LoadingSmall />;

  return (
    <>
      {!showContent.length ? (
        <h1 className="font-bold text-lg text-center my-4">
          Nenhum registro encontrado!
        </h1>
      ) : (
        <>
          {!!currentEvents.length && renderRow('Eventos Acontecendo', currentEvents)}
          {!!subscriptions.length && renderRow('Asstinaturas', subscriptions)}
          {!!futureEvents.length && renderRow('Eventos Programados', futureEvents)}
          {!!pastEvents.length && renderRow('Eventos Passados', pastEvents)}
        </>
      )}
    </>
  );
}
