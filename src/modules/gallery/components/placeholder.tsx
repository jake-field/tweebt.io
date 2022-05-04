import LoadingSpinner from "../../../common/components/loadingspinner";

export default function Placeholder() {
	return (
		<div className="bg-slate-700 border border-blue-300 m-1 animate-pulse rounded-md flex items-center justify-center" style={{ width: 150, height: 150 }}>
			<LoadingSpinner />
		</div>
	)
}