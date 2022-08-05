interface Props {
	visible?: boolean;
}

export default function Options({ visible }: Props) {
	const liClassName = 'border-b last:border-b-0 border-gray-500 py-1 px-3 hover:bg-slate-500 cursor-pointer';
	return (
		<div className='absolute rounded-lg bg-slate-700 top-2 right-3 pt-10' style={{ contain: 'content', display: visible ? 'block' : 'none' }}>
			<ul className='border-t border-gray-500 font-light text-sm'>
				<li className={liClassName}>Dark Mode</li>
				<li className={liClassName}>Blur Flagged</li>
				<li className={liClassName}>Results Settings</li>
				<li className={liClassName}>View Settings</li>
				<li className={liClassName}>Sign out</li>
			</ul>
		</div>
	)
}