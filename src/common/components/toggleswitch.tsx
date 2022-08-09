import { MouseEventHandler } from "react";

interface Props {
	label: string;
	className?: string;
	checked?: boolean;
	onClick?: MouseEventHandler<HTMLInputElement>;
	children?: any;
}

export default function ToggleSwitch({ label, className, checked, onClick, children }: Props) {
	const inputId = `toggle-${label.toLowerCase().replaceAll(' ', '-')}`;

	return (
		<div title={label} className={`flex gap-2 justify-between items-center ${className}`}>
			<input alt={label} id={inputId} type='checkbox' className='absolute peer hidden' onClick={onClick} defaultChecked={checked} />
			<label title={label} htmlFor={inputId} className='cursor-pointer'>{children || label}</label>
			<label title={label} htmlFor={inputId} className='cursor-pointer rounded-full hover:ring-2 w-8 h-4 flex items-center peer-checked:bg-slate-400 peer-checked:justify-end bg-slate-800'>
				<span title='Toggle' className='rounded-full h-4 w-4 bg-white' />
			</label>
		</div>
	)
}