import { ReactElement } from 'react';
type ConfirmationDialogProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	handleConfirm: () => void;
	icon?: ReactElement;
	cancelText: string
	confirmText: string
	confirmColor?: string;
	children: ReactElement;
}

export default function ConfirmationDialog({
	open,
	setOpen,
	handleConfirm,
	icon,
	cancelText,
	confirmText,
	confirmColor,
	children,
}:ConfirmationDialogProps): ReactElement {
	return (
		<div
			className={`${
				open ? 'fixed' : 'hidden'
			} overflow-y-auto overflow-x-hidden top-0 right-0 left-0 z-50 inset-0 h-full bg-black bg-opacity-50`}
		>
			<div className="flex justify-center items-center w-full h-full">
				<div className="relative w-full max-w-md md:h-auto">
					<div className="relative bg-white mx-4 sm:mx-0 rounded-lg shadow-md">
						<button type="button" className="absolute top-1 right-1" onClick={() => setOpen(!open)}>
							<i className="bx bx-x text-2xl" />
							<span className="sr-only">Close modal</span>
						</button>
						<div className="p-6 text-center">
							{icon}
							<div className="mb-5">{children}</div>
							<div className="space-x-2">
								<button
									type="button"
									className="text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-900  rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5"
									onClick={() => setOpen(!open)}
								>
									{cancelText}
								</button>
								<button
									type="button"
									className={`text-white ${confirmColor || 'bg-danger'} font-bold rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center`}
									onClick={() => handleConfirm()}
								>
									{confirmText}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
