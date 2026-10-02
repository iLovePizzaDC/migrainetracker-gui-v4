import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router';

type LegalLayoutProps = {
	title: string;
	documentTitle: string;
	children: ReactNode;
};

function LegalLayout({ title, documentTitle, children }: LegalLayoutProps) {
	useEffect(() => {
		const previous = document.title;
		document.title = documentTitle;
		return () => {
			document.title = previous;
		};
	}, [documentTitle]);

	return (
		<article className='mx-auto w-full max-w-3xl'>
			<div className='legal-panel'>
				<p className='text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35'>
					MigraineTracker
				</p>
				<h1 className='page-heading mt-3'>{title}</h1>
				<div className='legal-prose'>{children}</div>
				<p className='mt-8'>
					<Link to='/' className='link-subtle'>
						Back
					</Link>
				</p>
			</div>
		</article>
	);
}

export default LegalLayout;
