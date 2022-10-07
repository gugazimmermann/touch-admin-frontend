import { ReactElement } from "react";

type UploadingProps = {
  progress: number;
};

const Uploading = ({ progress }: UploadingProps): ReactElement => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 overflow-y-auto h-full w-full z-50">
      <div className="flex flex-col justify-center items-center h-full w-full">
        <div
          className="mb-4 text-primary text-2xl font-bold"
          data-testid="loading"
        >
          Aguarde...
        </div>
        <div className="w-1/2 bg-slate-50 rounded-lg">
          <div
            style={{ width: `${progress}%` }}
            className="bg-primary text-center p-0.5 leading-none rounded-l-lg"
          >
            <span className="text-bold text-lg text-slate-50">{`${progress}%`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Uploading;
