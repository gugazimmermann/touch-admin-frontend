import { Storage } from 'aws-amplify';
import { SendPublicFileType } from '../interfaces/types';

export const sendPublicFile = async ({type, id, file, setProgress}: SendPublicFileType) => {
	if (setProgress) setProgress(0);
	await Storage.put(`${type}/${id}.${file.name.split('.').pop()}`, file, {
		contentType: file.type,
		progressCallback(p) {
			if (setProgress) setProgress(parseInt(((p.loaded / p.total) * 100).toString(), 10));
		},
	});
	if (setProgress) setProgress(0);
};

export const getImage = async (img: string): Promise<string | null> => {
	const [data] = await Storage.list(img);
	return data?.key || null;
};
