import { useState } from "react";
import { Outlet } from "react-router-dom";
import Alert from "../../components/Alert";
import Title from "../../components/Title";
import LogoIcon from "../../images/LogoIcon";
import { AlertType } from "../../interfaces/types";

export default function AuthLayout() {
  const [image, setImage] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [alert, setAlert] = useState<AlertType>({});
  
  const projectName = process.env.REACT_APP_TITLE || "Touch Sistemas";

  return (
    <main className="h-screen mx-auto">
      <section className="container h-full fixed">
        <div className="h-full flex flex-col-reverse md:flex-row items-center justify-evenly">
          <div className="w-10/12 md:w-6/12 lg:w-4/12 md:mb-0 flex justify-center items-center">
            <img
              src={image}
              alt="auth"
              className="h-96 w-96 md:h-auto md:w-auto"
            />
          </div>
          <div className="w-10/12 md:w-5/12 lg:w-4/12">
            <div className="hidden md:flex flex-col justify-center items-center text-primary gap-2">
              <LogoIcon styles="h-28 w-28" />
              <Title
                text={projectName}
                className="text-2xl font-bold text-center mb-4 text-primary"
              />
            </div>
            <Title text={title} className="text-xl text-center mb-4" />
            <Alert type={alert?.type} text={alert?.text} />
            <Outlet
              context={{ setImage, setTitle, setAlert }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
