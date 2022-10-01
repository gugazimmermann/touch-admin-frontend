import { ReactElement, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { Link } from "../../components";
import { AppContext } from "../../context";
import { ROUTES, ALERT } from "../../interfaces/enums";
import AlertCard from "./AlertCard";

export default function Alerts(): ReactElement {
  const { state } = useContext(AppContext);

  const profileLink = () => (
    <Link className="pl-2" to={ROUTES.PROFILE} text="Clique Aqui!" />
  );

  function handleAlertLink(text: string) {
    switch (text) {
      case "Nenhum responsável cadastrado!":
        return profileLink();
      case "Seu cadastro está incompleto, finalize para utilizar o sistema.":
        return profileLink();
      default:
        return null;
    }
  }

  if (state.alerts.length > 0) {
    return (
      <>
        {state.alerts.map((a) => (
          <AlertCard key={uuidv4()} index={uuidv4()} type={a.type as ALERT}>
            <>
              {a.text}
              {handleAlertLink(a.text || "")}
            </>
          </AlertCard>
        ))}
      </>
    );
  }
  return (
    <h1 className="font-bold text-lg text-center my-4">
      Nenhum registro encontrado!
    </h1>
  );
}
