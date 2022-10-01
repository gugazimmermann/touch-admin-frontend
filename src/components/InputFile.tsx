import { FormEvent, ReactElement } from 'react';

type InputFileProps = {
  fileName: string;
  handler: (e: FormEvent<HTMLInputElement>) => void;
};

const InputFile = ({ fileName, handler }: InputFileProps): ReactElement => (
  <>
    <input
      type="file"
      id="files"
      className="hidden"
      onChange={handler}
      accept=".jpg,.jpeg,.png,image/png,image/jpeg"
    />
    <label
      htmlFor="files"
      className="relative file:hidden block w-full px-4 py-2 font-normal text-slate-700 bg-stone-100 border border-stone-400 rounded-md m-0"
    >
      <i className="bx bx-file-find text-2xl absolute top-1 right-1" />
      {fileName}
    </label>
  </>
);

export default InputFile;
