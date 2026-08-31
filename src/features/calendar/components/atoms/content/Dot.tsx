interface IDot {
	color?: string;
	ring?: boolean;
	testId?: string;
}

function Dot({ color = 'bg-transparent', ring = false, testId }: IDot) {
	return (
		<div
			data-testid={testId}
			className={`mt-1 h-2 w-2 rounded-full ${color} ${ring ? 'ring-1 ring-red-400/70' : ''}`}
		/>
	);
}

export default Dot;
