import { ReactElement, ReactNode } from 'react';

type TableProps = {
	header: ReactElement;
	body: ReactNode;
}

const Table = ({ header, body }: TableProps): ReactElement => {
	return (
		<div className="overflow-x-auto">
			<table className="items-center w-full rounded-md bg-white shadow border-collapse mb-4">
				<thead>{header}</thead>
				<tbody>{body}</tbody>
			</table>
		</div>
	);
}

export default Table;
