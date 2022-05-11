import LoadingSpinner from "./loadingspinner";

interface Props {
	width?: string | number;
	height?: string | number;
}

export default function Placeholder({ width, height }: Props) {
	return (
		<div className="bg-slate-700 border border-blue-300 max-h-[95vh] max-w-[95vw] animate-pulse flex items-center justify-center" style={{ width: width , height: height }}>
			<LoadingSpinner className="w-10 h-10" />
		</div>
	)
}