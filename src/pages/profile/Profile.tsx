import { useState, useCallback, useEffect, useContext } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import MercadoPagoAPI from '../../api/mercadopago';
import ProfileAPI from "../../api/profile";
import { sendPublicFile } from "../../api/storage";
import {
  Title,
  Alert,
  Input,
  Button,
  Uploading,
  Select,
  InputFile,
  Form,
  Loading,
} from "../../components";
import { AppContext } from '../../context';
import {
  createMap,
  getAddressFromCEP,
  normalizeCEP,
  normalizeDocument,
  normalizePhone,
  normalizeWebsite,
  validateFile,
} from "../../helpers";
import {
  ROUTES,
  ALERT,
  FILEERROR,
  DOCS,
  MAP,
  BrazilStates,
  FILETYPES,
} from "../../interfaces/enums";
import {
  ProfileType,
  useOutletContextProfileProps,
} from "../../interfaces/types";
import Owners from "./Owners";

const initial = {
  profileID: "",
  name: "",
  phone: "",
  documenttype: "",
  document: "",
  email: "",
  website: "",
  zipCode: "",
  state: "",
  city: "",
  district: "",
  street: "",
  number: "",
  complement: "",
  map: "",
  logo: "",
};

export default function Profile() {
  const navigate = useNavigate();
  const { state } = useContext(AppContext);
  const { loadClient } = useOutletContext<useOutletContextProfileProps>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [profile, setProfile] = useState<ProfileType>();
  const [form, setForm] = useState(initial);
  const [logoFile, setLogoFile] = useState<File>();
  const [fileName, setFileName] = useState("Logo");
  const [progress, setProgress] = useState<number>(0);

  const getAddress = useCallback(async () => {
    setErrorMsg("");
    setError(false);
    setLoading(true);
    try {
      const address = await getAddressFromCEP(form.zipCode.replace(/\D/g, ""));
      if (address) {
        setForm({
          ...form,
          state: address.state,
          city: address.city,
          street: address.street,
        });
      } else {
        setForm({
          ...form,
          state: "",
          city: "",
          street: "",
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message);
      setError(true);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.zipCode, setLoading]);

  useEffect(() => {
    if (form.zipCode.length === 10) getAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.zipCode]);

  const handleFile = (e: React.FormEvent<HTMLInputElement>) => {
    setErrorMsg("");
    setError(false);
    const file = validateFile((e.target as HTMLInputElement).files as FileList);
    if (!file) return;
    if (typeof file === "string" && file === FILEERROR.SIZE) {
      setErrorMsg("Imagem n??o pode ter mais de 2 mb!");
      setError(true);
      return;
    }
    if (typeof file === "string" && file === FILEERROR.TYPE) {
      setErrorMsg("Imagem precisa ser PNG or JPG!");
      setError(true);
      return;
    }
    setFileName(file.name);
    setLogoFile(file);
    setErrorMsg("");
    setError(false);
  }

  const validadeForm = (f: ProfileType) => {
    if (
      !f.name ||
      !f.phone ||
      !f.documenttype ||
      !f.document ||
      !f.zipCode ||
      !f.city ||
      !f.state ||
      !f.street
    ) {
      setErrorMsg("Preencha os campos obrigat??rios!");
      return false;
    }
    if (f.phone.length < 14) {
      setErrorMsg("Telefone Inv??lido!");
      return false;
    }
    if (f.zipCode.length < 10) {
      setErrorMsg("CEP Inv??lido!");
      return false;
    }
    if (
      (f.documenttype === DOCS.CPF && f.document.length < 14) ||
      (f.documenttype === DOCS.CNPJ && f.document.length < 18)
    ) {
      setErrorMsg(f.documenttype === DOCS.CPF ? "CPF inv??lido!" : "CNPJ inv??lido");
      return false;
    }
    return true;
  }

  const handleLogoAndMap = async (p: ProfileType) => {
    let mapURL = p.map || "";
    let logoURL = p.logo || "";
    const mapFile = await createMap({
      type: MAP.PROFILE,
      id: p.profileID,
      name: form.name,
      street: form.street,
      number: form.number,
      city: form.city,
      state: form.state,
      zipCode: form.zipCode,
    });
    await sendPublicFile({
      type: FILETYPES.MAP,
      id: p.profileID,
      file: mapFile,
      setProgress,
    });
    mapURL = `/public/map/${mapFile.name}?${Date.now()}`;
    if (logoFile) {
      await sendPublicFile({
        type: FILETYPES.LOGO,
        id: p.profileID,
        file: logoFile,
        setProgress,
      });
      logoURL = logoFile ? `/public/logo/${p.profileID}.${logoFile.name.split(".").pop()}?${Date.now()}`: "";
    }
    await ProfileAPI.logoAndMapPatch(logoURL, mapURL);
  }

  const updateForm = (p: ProfileType) => {
    const normalizeForm = {
      profileID: p.profileID,
      name: p.name || "",
      phone: normalizePhone(p.phone, true),
      documenttype: p.documenttype || "",
      document: normalizeDocument(p.documenttype as DOCS, p.document || ""),
      email: p.email || "",
      website: p.website || "",
      zipCode: normalizeCEP(p.zipCode || ""),
      state: p.state || "",
      city: p.city || "",
      district: p.district || "",
      street: p.street || "",
      number: p.number || "",
      complement: p.complement || "",
      map: p.map || "",
      logo: p.logo || "",
    }
    setProfile(normalizeForm);
    setForm(normalizeForm);
  };

  const handleSubmit = async (): Promise<boolean> => {
    setErrorMsg("");
    setError(false);
    setLoading(true);
    if (!validadeForm({ ...form })) {
      setError(true);
      setLoading(false);
      return false;
    }
    form.phone = form.phone ? `+55${(form.phone || "").replace(/[^\d]/g, "")}` : "";
    form.document = form.document ? form.document.replace(/[^\d]/g, "") : "";
    form.website = form.website ? normalizeWebsite(form.website || "") : "";
    form.zipCode = form.zipCode ? form.zipCode.replace(/[^\d]/g, "") : "";
    await ProfileAPI.update(form);
    await handleLogoAndMap(form);
    loadClient(true);
    setLoading(false);
    navigate(ROUTES.HOME);
    return true;
  }

  useEffect(() => {
    if (form.email) setLoading(false)
  }, [form.email, setLoading])

  const getClient = useCallback(async (): Promise<void> => {
    const p = await ProfileAPI.get();
    updateForm(p);
  }, []);

  useEffect(() => {
    setLoading(true);
    getClient();
  }, [getClient, setLoading]);

  return (
    <>
      {loading && <Loading />}
      {!!progress && <Uploading progress={progress} />}
      <Title
        text="Meu Perfil"
        back={ROUTES.HOME}
        advanced={ROUTES.PROFILE_ADVANCED}
        className="font-bold text-center"
      />
      {error && <Alert type={ALERT.ERROR} text={errorMsg} />}
      <Form>
        <div className="w-full md:w-4/12 sm:pr-4 mb-4">
          <Input
            type="text"
            placeholder="Nome *"
            value={form.name || ""}
            handler={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="w-full md:w-3/12 sm:pr-4 mb-4">
          <Input
            type="text"
            value={form.phone || ""}
            placeholder="Telefone *"
            handler={(e) =>
              setForm({ ...form, phone: normalizePhone(e.target.value) })
            }
          />
        </div>
        <div className="w-full md:w-2/12 sm:pr-4 mb-4">
          <Select
            placeholder="Tipo do Documento *"
            value={form.documenttype || ""}
            handler={(e) => setForm({ ...form, documenttype: e.target.value })}
          >
            <>
              <option value="">Tipo *</option>
              {Object.values(DOCS).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </>
          </Select>
        </div>
        <div className="w-full md:w-3/12 mb-4">
          <Input
            type="text"
            value={form.document || ""}
            placeholder={form.documenttype || "Selecione o Tipo do Documento"}
            handler={(e) =>
              setForm({
                ...form,
                document: normalizeDocument(
                  form.documenttype as DOCS,
                  e.target.value
                ),
              })
            }
            disabled={!form.documenttype}
          />
        </div>
        <div className="w-full md:w-6/12 sm:pr-4 mb-4">
          <Input
            type="text"
            value={form.email || ""}
            placeholder="Email"
            disabled
          />
        </div>
        <div className="w-full md:w-6/12 mb-4">
          <Input
            type="text"
            value={form.website || ""}
            placeholder="WebSite"
            handler={(e) => setForm({ ...form, website: e.target.value })}
          />
        </div>
        <div className="w-full md:w-4/12 sm:pr-4 mb-4">
          <Input
            type="text"
            value={form.zipCode || ""}
            placeholder="CEP *"
            handler={(e) => setForm({ ...form, zipCode: normalizeCEP(e.target.value) })
            }
          />
        </div>
        <div className="w-full md:w-4/12 sm:pr-4 mb-4">
          <Select
            placeholder="Estado"
            value={form.state || ""}
            handler={(e) => setForm({ ...form, state: e.target.value })}
          >
            <>
              <option value="">Estado *</option>
              {BrazilStates.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.name}
                </option>
              ))}
            </>
          </Select>
        </div>
        <div className="w-full md:w-4/12 mb-4">
          <Input
            type="text"
            value={form.city || ""}
            placeholder="Cidade *"
            handler={(e) => setForm({ ...form, city: e.target.value })}
          />
        </div>
        <div className="w-full md:w-4/12 sm:pr-4 mb-4">
          <Input
            type="text"
            value={form.district || ""}
            placeholder="Bairro"
            handler={(e) => setForm({ ...form, district: e.target.value })}
          />
        </div>
        <div className="w-full md:w-5/12 sm:pr-4 mb-4">
          <Input
            type="text"
            value={form.street || ""}
            placeholder="Rua"
            handler={(e) => setForm({ ...form, street: e.target.value })}
          />
        </div>
        <div className="w-full md:w-3/12 mb-4">
          <Input
            type="number"
            value={form.number || ""}
            placeholder="N??mero"
            handler={(e) => setForm({ ...form, number: e.target.value })}
          />
        </div>
        <div className="w-full md:w-4/12 sm:pr-4 mb-4">
          <Input
            type="text"
            value={form.complement || ""}
            placeholder="Complemento"
            handler={(e) => setForm({ ...form, complement: e.target.value })}
          />
        </div>
        <div className="w-full md:w-8/12 mb-4">
          <InputFile fileName={fileName} handler={(e) => handleFile(e)} />
        </div>
        <div className="w-full flex justify-center">
          <Button text="Atualizar Cadastro" handler={() => handleSubmit()} />
        </div>
      </Form>
      {profile && <Owners />}
    </>
  );
}
