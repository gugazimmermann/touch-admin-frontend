import { ReactElement, ReactNode } from "react";

type FormProps = {
  children: ReactNode;
};

const Form = ({ children }: FormProps): ReactElement => (
  <form className="w-full flex flex-wrap bg-white p-4 mb-4 mt-4 rounded-md shadow-md">
    {children}
  </form>
);

export default Form;
