import LegalLayout from '@/pages/legal/LegalLayout';
import { Link } from 'react-router';

function Address({ country }: { country: string }) {
	return (
		<p>
			Nico Betz
			<br />
			Ofengasse 2
			<br />
			71336 Waiblingen
			<br />
			{country}
		</p>
	);
}

function ImpressumPage({ lang = 'de' }: { lang?: 'de' | 'en' }) {
	if (lang === 'en') {
		return (
			<LegalLayout title='Imprint' documentTitle='Imprint · MigraineTracker'>
				<p>Information according to § 5 DDG (German Digital Services Act).</p>
				<Address country='Germany' />
				<p>
					Email: <a href='mailto:n.betz1102@gmail.com'>n.betz1102@gmail.com</a>
				</p>
				<p>
					This imprint covers MigraineTracker at migraine.nicobetz.de only. The portfolio at{' '}
					<a href='https://nicobetz.de'>nicobetz.de</a> is a separate site.
				</p>
				<h2>What this service is</h2>
				<p>
					MigraineTracker is a private diary for migraine entries. It is not a medical device and
					does not replace a diagnosis, advice, or treatment by a doctor.
				</p>
				<h2>Consumer dispute resolution</h2>
				<p>
					I am not obliged and not willing to take part in dispute resolution before a consumer
					arbitration board.
				</p>
				<p>
					<Link to='/datenschutz'>Datenschutz (Deutsch)</Link>
					{' · '}
					<Link to='/privacy'>Privacy Policy</Link>
					{' · '}
					<Link to='/impressum'>Impressum</Link>
				</p>
			</LegalLayout>
		);
	}

	return (
		<LegalLayout title='Impressum' documentTitle='Impressum · MigraineTracker'>
			<p>Angaben gemäß § 5 DDG.</p>
			<Address country='Deutschland' />
			<p>
				E-Mail: <a href='mailto:n.betz1102@gmail.com'>n.betz1102@gmail.com</a>
			</p>
			<p>
				Dieses Impressum gilt nur für MigraineTracker unter migraine.nicobetz.de. Das Portfolio
				unter <a href='https://nicobetz.de'>nicobetz.de</a> ist ein anderes Angebot.
			</p>
			<h2>Worum es geht</h2>
			<p>
				MigraineTracker ist ein privates Tagebuch für Migräne-Einträge. Es ist kein Medizinprodukt
				und ersetzt keine ärztliche Diagnose, Beratung oder Behandlung.
			</p>
			<h2>Verbraucherstreitbeilegung</h2>
			<p>
				Ich bin nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer
				Verbraucherschlichtungsstelle teilzunehmen.
			</p>
			<p>
				<Link to='/datenschutz'>Datenschutz</Link>
				{' · '}
				<Link to='/privacy'>Privacy Policy (English)</Link>
				{' · '}
				<Link to='/imprint'>Imprint</Link>
			</p>
		</LegalLayout>
	);
}

export default ImpressumPage;
