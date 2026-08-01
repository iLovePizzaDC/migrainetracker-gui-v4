import Tooltip from '@/features/calendar/components/atoms/Tooltip';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/calendar/hooks/use-tooltip', () => ({
	useTooltip: () => ({
		coords: { top: 0, left: 0 },
	}),
}));

describe('<Tooltip />', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('renders the trigger children', () => {
		render(
			<Tooltip content='tooltip content'>
				<span>trigger</span>
			</Tooltip>,
		);

		expect(screen.getByText('trigger')).toBeInTheDocument();
	});

	it('does not show the tooltip content initially', () => {
		render(
			<Tooltip content='tooltip content'>
				<span>trigger</span>
			</Tooltip>,
		);

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('shows the tooltip content when the trigger is clicked', async () => {
		const user = userEvent.setup();

		render(
			<Tooltip content='tooltip content'>
				<span>trigger</span>
			</Tooltip>,
		);

		await user.click(screen.getByRole('button'));

		expect(screen.getByRole('tooltip')).toHaveTextContent('tooltip content');
	});

	it('hides the tooltip content when the trigger is clicked again', async () => {
		const user = userEvent.setup();

		render(
			<Tooltip content='tooltip content'>
				<span>trigger</span>
			</Tooltip>,
		);

		const trigger = screen.getByRole('button');
		await user.click(trigger);
		await user.click(trigger);

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('opens the tooltip when pressing Enter on the trigger', async () => {
		const user = userEvent.setup();

		render(
			<Tooltip content='tooltip content'>
				<span>trigger</span>
			</Tooltip>,
		);

		screen.getByRole('button').focus();
		await user.keyboard('{Enter}');

		expect(screen.getByRole('tooltip')).toBeInTheDocument();
	});

	it('opens the tooltip when pressing Space on the trigger', async () => {
		const user = userEvent.setup();

		render(
			<Tooltip content='tooltip content'>
				<span>trigger</span>
			</Tooltip>,
		);

		screen.getByRole('button').focus();
		await user.keyboard('[Space]');

		expect(screen.getByRole('tooltip')).toBeInTheDocument();
	});

	it('does not toggle on unrelated key presses', async () => {
		const user = userEvent.setup();

		render(
			<Tooltip content='tooltip content'>
				<span>trigger</span>
			</Tooltip>,
		);

		screen.getByRole('button').focus();
		await user.keyboard('{Escape}');

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('closes the tooltip when clicking outside', async () => {
		const user = userEvent.setup();

		render(
			<div>
				<Tooltip content='tooltip content'>
					<span>trigger</span>
				</Tooltip>
				<button>outside</button>
			</div>,
		);

		await user.click(screen.getByRole('button', { name: 'trigger' }));
		expect(screen.getByRole('tooltip')).toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'outside' }));

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('does not close the tooltip when clicking inside the popup content', async () => {
		const user = userEvent.setup();

		render(
			<Tooltip content={<button>inner action</button>}>
				<span>trigger</span>
			</Tooltip>,
		);

		await user.click(screen.getByRole('button', { name: 'trigger' }));
		await user.click(screen.getByRole('button', { name: 'inner action' }));

		expect(screen.getByRole('tooltip')).toBeInTheDocument();
	});

	it('renders the tooltip content into document.body via a portal', async () => {
		const user = userEvent.setup();

		const { container } = render(
			<Tooltip content='tooltip content'>
				<span>trigger</span>
			</Tooltip>,
		);

		await user.click(screen.getByRole('button'));

		const tooltip = screen.getByRole('tooltip');
		expect(container.contains(tooltip)).toBe(false);
		expect(document.body.contains(tooltip)).toBe(true);
	});

	it('applies a custom className to the anchor wrapper', () => {
		const { container } = render(
			<Tooltip content='tooltip content' className='custom-class'>
				<span>trigger</span>
			</Tooltip>,
		);

		expect(container.querySelector('.custom-class')).toBeInTheDocument();
	});

	it('stops click propagation on the trigger so parent handlers are not triggered', async () => {
		const user = userEvent.setup();
		const parentOnClick = vi.fn();

		render(
			<div onClick={parentOnClick}>
				<Tooltip content='tooltip content'>
					<span>trigger</span>
				</Tooltip>
			</div>,
		);

		await user.click(screen.getByRole('button'));

		expect(parentOnClick).not.toHaveBeenCalled();
	});

	it('opens the tooltip when clicking the trigger', async () => {
		const user = userEvent.setup();

		render(
			<Tooltip content='Tooltip content'>
				<span>Trigger</span>
			</Tooltip>,
		);

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

		await user.click(screen.getByRole('button'));

		expect(screen.getByRole('tooltip')).toBeInTheDocument();
		expect(screen.getByText('Tooltip content')).toBeInTheDocument();
	});

	it('closes the tooltip when clicking the trigger again', async () => {
		const user = userEvent.setup();

		render(
			<Tooltip content='Tooltip content'>
				<span>Trigger</span>
			</Tooltip>,
		);

		const trigger = screen.getByRole('button');

		await user.click(trigger);
		expect(screen.getByRole('tooltip')).toBeInTheDocument();

		await user.click(trigger);
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});
});
