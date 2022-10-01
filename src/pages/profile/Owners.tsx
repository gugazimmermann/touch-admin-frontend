import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import { Input, Button, Title, ConfirmationDialog, Table, Form } from "../../components";
import { AppContext } from "../../context";
import { validateEmail, normalizePhone } from "../../helpers";
import { OwnersType } from "../../interfaces/types";

type OwnersProps = {
  clientID: string;
  setError: (error: boolean) => void;
  setErrorMsg: (errorMsg: string) => void;
  setLoading: (loading?: boolean) => void;
  loadClient: (force?: boolean) => void;
};

const initial = { id: "", name: "", phone: "", email: "", ClientID: "" };

export default function Owners({
  clientID,
  setError,
  setErrorMsg,
  setLoading,
}: OwnersProps): ReactElement {
  const { state } = useContext(AppContext);
  const [ownersList, setOwnersList] = useState<OwnersType[]>([]);
  const [formOwner, setFormOwner] = useState<OwnersType>(initial);
  const [selected, setSelected] = useState<OwnersType>({} as OwnersType);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [update, setUpdate] = useState(false);

  // const getOwnersList = useCallback(async () => {
  //   const listOwners = await Queries.listOwners(clientID);
  //   setOwnersList(listOwners || []);
  // }, [clientID]);

  // useEffect(() => {
  //   getOwnersList();
  // }, [getOwnersList]);

  useEffect(() => {
    if (!update && selected) setSelected(initial);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  function validadeForm(f: OwnersType) {
    if (!f.email || !f.name || !f.phone) {
      setErrorMsg('Preencha os campos obrigatórios!');
      return false;
    }
    if (f.phone.length < 14) {
      setErrorMsg('Telefone Inválido!');
      return false;
    }
    if (!validateEmail(f.email)) {
      setErrorMsg('Email é Obrigatório!');
      return false;
    }
    return true;
  }

  async function handleSubmit(u?: boolean) {
    setErrorMsg("");
    setError(false);
    setLoading(true);
    if (!validadeForm(!u ? formOwner : selected)) {
      setError(true);
      setLoading(false);
      return null;
    }
    // if (!u) await Mutations.createOwner(formOwner, clientID);
    // else await Mutations.updateOwner(selected);
    setUpdate(false);
    setFormOwner(initial);
    // getOwnersList();
    setLoading(false);
    return true;
  }

  async function handleDelete(): Promise<void> {
    setLoading(true);
    // await Mutations.deleteOwner(selected.id);
    setConfirmDelete(false);
    // getOwnersList();
    setLoading(false);
  }

  function renderForm() {
    return (
      <Form>
        <div className="w-full md:w-4/12 sm:pr-4 mb-4">
          <Input
            type="text"
            value={!update ? formOwner.name : selected.name}
            placeholder="Nome"
            handler={(e) => {
              if (!update) setFormOwner({ ...formOwner, name: e.target.value });
              else setSelected({ ...selected, name: e.target.value });
            }}
          />
        </div>
        <div className="w-full md:w-4/12 sm:pr-4 mb-4">
          <Input
            type="text"
            value={!update ? formOwner.phone : selected.phone}
            placeholder="Telefone *"
            handler={(e) => {
              if (!update)
                setFormOwner({
                  ...formOwner,
                  phone: normalizePhone(e.target.value),
                });
              else
                setSelected({
                  ...selected,
                  phone: normalizePhone(e.target.value),
                });
            }}
          />
        </div>
        <div className="w-full md:w-4/12 mb-4">
          <Input
            type="email"
            value={!update ? formOwner.email : selected.email}
            placeholder="Email *"
            handler={(e) => {
              if (!update)
                setFormOwner({ ...formOwner, email: e.target.value });
              else setSelected({ ...selected, email: e.target.value });
            }}
          />
        </div>
        <div className="w-full flex justify-center">
          <Button
            text={`${!update ? 'Adicionar' : 'Atualizar'} Responsável`}
            handler={() => {
              if (!update) handleSubmit();
              else handleSubmit(true);
            }}
            update={update}
          />
        </div>
      </Form>
    );
  }

  function header(): ReactElement {
    return (
      <tr>
        <th className="p-2 text-sm font-normal text-secondary border-b border-solid border-secondary whitespace-nowrap text-left">
          Nome
        </th>
        <th className="p-2 text-sm font-normal text-secondary border-b border-solid border-secondary whitespace-nowrap text-left">
          Telefone
        </th>
        <th className="p-2 text-sm font-normal text-secondary border-b border-solid border-secondary whitespace-nowrap text-left">
          Email
        </th>
        <th
          colSpan={2}
          className="p-2 text-sm font-normal text-secondary border-b border-solid border-secondary whitespace-nowrap text-left"
        />
      </tr>
    );
  }

  function body(): ReactNode {
    return ownersList.map((o) => (
      <tr key={o.email}>
        <td className="border-t text-sm border-gray-200 align-middle font-light whitespace-nowrap py-2 pl-2 text-left">
          {o.name}
        </td>
        <td className="border-t text-sm border-gray-200 align-middle font-light whitespace-nowrap py-2 text-left">
          {normalizePhone(o.phone, true)}
        </td>
        <td className="border-t text-sm border-gray-200 align-middle font-light whitespace-nowrap py-2 text-left">
          {o.email}
        </td>
        <td
          className="border-t border-gray-200 align-middle py-2 text-right cursor-pointer"
          onClick={() => {
            setSelected({ ...o, phone: normalizePhone(o.phone, true) });
            setUpdate(!update);
          }}
        >
          {!update ? (
            <i className="bx bx-message-square-edit text-xl text-primary" />
          ) : (
            <i className="bx bx-message-square-minus text-xl text-warning" />
          )}
        </td>
        <td
          className="border-t border-gray-200 align-middle py-2 pr-2 text-right cursor-pointer"
          onClick={() => {
            setSelected(o);
            setConfirmDelete(true);
          }}
        >
          <i className="bx bx-message-square-x text-xl text-primary" />
        </td>
      </tr>
    ));
  }

  function renderDeleteDialog() {
    return (
      <ConfirmationDialog
        open={confirmDelete}
        setOpen={setConfirmDelete}
        handleConfirm={handleDelete}
        cancelText="Cancelar"
        confirmText="Remover"
      >
        <span>Deseja remover o responsável {selected?.name}?</span>
      </ConfirmationDialog>
    );
  }

  return (
    <>
      <Title
        text={`${ !update  ? 'Adicionar' : 'Atualizar' } Responsável`}
        className={
          update
            ? "text-warning font-bold text-center"
            : "font-bold text-center"
        }
      />
      {renderForm()}
      {ownersList && ownersList.length > 0 && (
        <Table header={header()} body={body()} />
      )}
      {renderDeleteDialog()}
    </>
  );
}
