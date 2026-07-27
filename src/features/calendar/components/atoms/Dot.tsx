interface IDot {
	color?: string;
	ring?: boolean;
	testId?: string;
}

function Dot({ color = 'bg-transparent', ring = false, testId }: IDot) {
	return (
		<div
			data-testid={testId}
			className={`w-2 h-2 rounded-full mt-1 ${color} ${ring ? 'ring-1 ring-red-500' : ''}`}
		/>
	);
}

export default Dot;
