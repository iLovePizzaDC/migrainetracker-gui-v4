import LegalLayout from '@/pages/legal/LegalLayout';
import { Link } from 'react-router';

const LIMITED_USE = (
	<p>
		MigraineTracker’s use and transfer to any other app of information received from Google APIs
		will adhere to the{' '}
		<a href='https://developers.google.com/terms/api-services-user-data-policy'>
			Google API Services User Data Policy
		</a>
		, including the Limited Use requirements.
	</p>
);

function PrivacyPage({ lang = 'en' }: { lang?: 'de' | 'en' }) {
	if (lang === 'de') {
		return (
			<LegalLayout title='Datenschutz' documentTitle='Datenschutz · MigraineTracker'>
				<p>
					Diese Erklärung gilt nur für MigraineTracker unter{' '}
					<a href='https://migraine.nicobetz.de'>migraine.nicobetz.de</a>. Sie gilt nicht für das
					Portfolio unter <a href='https://nicobetz.de'>nicobetz.de</a>. Dort gibt es eine eigene
					Datenschutzerklärung.
				</p>
				<p>
					<Link to='/privacy'>English version</Link>
				</p>

				<h2>Verantwortlicher</h2>
				<p>
					Nico Betz
					<br />
					Ofengasse 2
					<br />
					71336 Waiblingen
					<br />
					Deutschland
					<br />
					<a href='mailto:n.betz1102@gmail.com'>n.betz1102@gmail.com</a>
				</p>
				<p>
					MigraineTracker ist ein privates Tagebuch für Migräne-Einträge. Es ist kein Medizinprodukt
					und ersetzt keine ärztliche Beratung.
				</p>

				<h2>Welche Daten verarbeitet werden</h2>
				<p>Google-Konto, wenn du dich mit Google anmeldest:</p>
				<ul>
					<li>Google-Konto-ID, E-Mail-Adresse, Vor- und Nachname</li>
					<li>
						Berechtigungen: <code>userinfo.email</code>, <code>userinfo.profile</code> und{' '}
						<code>calendar</code>
					</li>
				</ul>
				<p>
					Google-Kalender. Die Berechtigung <code>https://www.googleapis.com/auth/calendar</code>{' '}
					wird nur für das Tagebuch in deinem primären Google-Kalender genutzt:
				</p>
				<ul>
					<li>
						Anlegen, Lesen und Löschen von Migräne-Einträgen. Darin können Uhrzeit, Dauer,
						Intensität, Symptome, eingenommene Medikamente und ob sie geholfen haben sowie
						MIDAS-Angaben stehen. Das sind Gesundheitsdaten.
					</li>
					<li>
						Lesen von Terminen im geöffneten Zeitraum (ID, Titel, Beschreibung, Beginn, Ende,
						Termintyp, bei Serien auch die Wiederholung), damit die Einträge angezeigt und gezählt
						werden können. Andere Termine aus diesem Zeitraum können dafür kurz über den Server
						laufen. Eine Kopie deines gesamten Kalenders wird nicht in unserer Datenbank gespeichert
						und nicht für Werbung oder etwas anderes verwendet.
					</li>
				</ul>
				<p>Auf dem Server, den Nico Betz betreibt:</p>
				<ul>
					<li>Google-Konto-ID, Name, E-Mail, Zeitpunkt der letzten Anmeldung</li>
					<li>die Medikamentenliste, die du anlegst</li>
					<li>
						Google-Zugangs- und Aktualisierungstoken, damit der Server den Kalender in deinem
						Auftrag aufrufen kann
					</li>
				</ul>
				<p>
					Cookies, beide nur für die Anmeldung, HTTP-only, Secure, SameSite=Lax:{' '}
					<code>MT_session</code> (Sitzung, bis zu 30 Tage) und <code>refreshToken</code>{' '}
					(Aktualisierungstoken, bis zu 1 Jahr). Es gibt keine Werbe- oder Analyse-Cookies.
				</p>
				<p>
					In der Produktivversion nutzt die Website Sentry (Functional Software, Inc., USA) für
					Fehlerberichte, Leistungsdaten und eine kleine Stichprobe von Sitzungsaufzeichnungen,
					außerdem eine Aufzeichnung, wenn ein Fehler auftritt. Eine Aufzeichnung kann zeigen, was
					auf dem Bildschirm stand, auch Migräne-Einträge, die du gerade angesehen oder eingetippt
					hast. Sentry dient der Fehlersuche, nicht der Werbung.
				</p>
				<p>
					Der Server kann technische Verbindungsdaten (IP-Adresse, Zeitpunkt, aufgerufene Adresse)
					in Protokollen speichern, um den Betrieb abzusichern.
				</p>

				<h2>Zwecke und Rechtsgrundlagen</h2>
				<ul>
					<li>
						Tagebuch und Anmeldung: Art. 6 Abs. 1 lit. b DSGVO, weil du den Dienst damit nutzen
						willst.
					</li>
					<li>
						Gesundheitsdaten in den Einträgen: Art. 9 Abs. 2 lit. a DSGVO, ausdrückliche
						Einwilligung. Die gibst du, indem du dich nach diesem Hinweis anmeldest und Einträge
						speicherst. Du kannst sie jederzeit per E-Mail widerrufen. Der Widerruf ändert nichts an
						der Verarbeitung bis dahin. Einträge im Google-Kalender bleiben, bis du sie löschst.
					</li>
					<li>
						Sitzungs-Cookies und Sicherheitsprotokolle: Art. 6 Abs. 1 lit. f DSGVO, Betrieb und
						Sicherheit. Für die Cookies gilt außerdem § 25 Abs. 2 TDDDG, weil sie für die Anmeldung
						erforderlich sind.
					</li>
					<li>
						Sentry: Art. 6 Abs. 1 lit. f DSGVO, Fehlersuche. Soweit eine Aufzeichnung
						Gesundheitsdaten zeigt, Art. 9 Abs. 2 lit. a DSGVO, beschränkt auf die Fehlersuche.
					</li>
				</ul>

				<h2>Google-Nutzerdaten</h2>
				<p>
					Die Nutzung von Daten, die MigraineTracker über Google-APIs erhält, entspricht der Google
					API Services User Data Policy, einschließlich der Limited Use Requirements.
				</p>
				{LIMITED_USE}
				<ul>
					<li>
						Google-Nutzerdaten werden nur für dieses Tagebuch verwendet: Anmeldung und
						Kalendereinträge.
					</li>
					<li>Sie werden nicht verkauft und nicht für Werbung genutzt.</li>
					<li>
						Sie werden nicht zum Trainieren allgemeiner KI- oder Machine-Learning-Modelle verwendet.
					</li>
					<li>
						Sie werden nicht weitergegeben, außer um diesen Dienst zu betreiben (dieser Server,
						Google und Sentry, wie hier beschrieben), wenn das Gesetz es verlangt, oder auf deine
						Veranlassung.
					</li>
					<li>
						Menschen lesen sie nicht, außer um ein Sicherheits- oder Missbrauchsproblem zu beheben,
						wenn das Gesetz es verlangt, oder mit deiner ausdrücklichen Erlaubnis.
					</li>
				</ul>

				<h2>Empfänger</h2>
				<ul>
					<li>
						Google (Google Ireland Limited und Google LLC, USA) für die Anmeldung und den Kalender.
						Die Migräne-Einträge liegen in deinem Google-Konto.
					</li>
					<li>Sentry, Functional Software, Inc., USA, für die Fehlersuche.</li>
				</ul>
				<p>Sonst niemand. Personenbezogene Daten werden nicht verkauft oder vermietet.</p>

				<h2>Drittländer</h2>
				<p>
					Kontodaten und Token liegen auf einem Server und in einer Datenbank, die Nico Betz
					betreibt. Die Migräne-Einträge selbst liegen in deinem Google-Kalender. Google und Sentry
					können Daten in den USA verarbeiten. Soweit das eine Übermittlung aus dem EWR ist, stützt
					sie sich auf das EU-US Data Privacy Framework, wenn der Empfänger zertifiziert ist, sonst
					auf die Standardvertragsklauseln der Europäischen Kommission.
				</p>

				<h2>Speicherdauer</h2>
				<ul>
					<li>Sitzungs-Cookie: bis zu 30 Tage oder bis zur Abmeldung.</li>
					<li>Cookie mit dem Aktualisierungstoken: bis zu 1 Jahr oder bis zur Abmeldung.</li>
					<li>
						Konto, Medikamentenliste und Token in der Datenbank: bis du die Löschung verlangst. Die
						Abmeldung beendet die Sitzung. Sie löscht weder das Konto noch die Kalendereinträge.
					</li>
					<li>
						Kalendereinträge: in deinem Google-Kalender, bis du sie hier oder bei Google löschst.
					</li>
					<li>Sentry: so lange, wie es die Fehlersuche braucht.</li>
					<li>Serverprotokolle: nur so lange, wie es Betrieb und Sicherheit brauchen.</li>
				</ul>

				<h2>Deine Rechte</h2>
				<p>
					Du hast, soweit die Voraussetzungen vorliegen, Recht auf Auskunft, Berichtigung, Löschung,
					Einschränkung, Datenübertragbarkeit und Widerspruch. Eine Einwilligung kannst du jederzeit
					widerrufen. Du kannst dich bei einer Aufsichtsbehörde beschweren.
				</p>
				<p>
					Schreib dafür an <a href='mailto:n.betz1102@gmail.com'>n.betz1102@gmail.com</a>. Es kann
					sein, dass wir prüfen müssen, ob die Anfrage von dir kommt.
				</p>
				<p>
					Die Löschung des Kontos entfernt Profil, Medikamentenliste und gespeicherte Google-Token
					aus der Datenbank. Einträge, die schon in deinem Google-Kalender stehen, bleiben dort, bis
					du sie in MigraineTracker oder im Google-Kalender löschst. Den Zugriff kannst du auch in
					deinem Google-Konto entziehen (Sicherheit, Drittanbieterzugriff).
				</p>

				<h2>Aufsichtsbehörde</h2>
				<p>
					Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg
					<br />
					Lautenschlagerstraße 20, 70173 Stuttgart
					<br />
					<a href='https://www.baden-wuerttemberg.datenschutz.de'>
						baden-wuerttemberg.datenschutz.de
					</a>
				</p>

				<h2>Keine Pflicht, keine automatische Entscheidung</h2>
				<p>
					Du musst dich nicht anmelden. Ohne Google-Anmeldung und Kalenderfreigabe kann das Tagebuch
					nicht gespeichert werden. Es gibt keine ausschließlich automatisierte Entscheidung mit
					rechtlicher Wirkung oder ähnlicher erheblicher Beeinträchtigung.
				</p>
				<p>Stand: 2. Oktober 2026.</p>
			</LegalLayout>
		);
	}

	return (
		<LegalLayout title='Privacy Policy' documentTitle='Privacy Policy · MigraineTracker'>
			<p>
				This notice covers only MigraineTracker at{' '}
				<a href='https://migraine.nicobetz.de'>migraine.nicobetz.de</a>. It does not cover the
				portfolio at <a href='https://nicobetz.de'>nicobetz.de</a>, which has its own privacy
				notice.
			</p>
			<p>
				<Link to='/datenschutz'>Deutsche Fassung</Link>
			</p>

			<h2>Controller</h2>
			<p>
				Nico Betz
				<br />
				Ofengasse 2
				<br />
				71336 Waiblingen
				<br />
				Germany
				<br />
				<a href='mailto:n.betz1102@gmail.com'>n.betz1102@gmail.com</a>
			</p>
			<p>
				MigraineTracker is a private diary for migraine entries. It is not a medical device and does
				not replace advice from a doctor.
			</p>

			<h2>Data we process</h2>
			<p>Google account, when you sign in with Google:</p>
			<ul>
				<li>Google account ID, email address, given name, and family name</li>
				<li>
					Scopes: <code>userinfo.email</code>, <code>userinfo.profile</code>, and{' '}
					<code>calendar</code>
				</li>
			</ul>
			<p>
				Google Calendar. The scope <code>https://www.googleapis.com/auth/calendar</code> is used
				only to keep the diary in your primary Google Calendar:
			</p>
			<ul>
				<li>
					Create, read, and delete migraine entries. An entry can include time, duration, intensity,
					symptoms, medicines taken and whether they helped, and MIDAS answers. That is health data.
				</li>
				<li>
					Read events in the period you open (id, title, description, start, end, event type, and
					recurrence where a series is involved) so entries can be shown and counted. Other events
					in that period can pass through the server for that purpose. We do not keep a copy of your
					full calendar in our database, and we do not use those events for advertising or anything
					else.
				</li>
			</ul>
			<p>On the server operated by Nico Betz:</p>
			<ul>
				<li>Google account ID, name, email, and last sign-in time</li>
				<li>the medicine list you add</li>
				<li>Google access and refresh tokens, so the server can call the Calendar API for you</li>
			</ul>
			<p>
				Cookies, both only for sign-in, HTTP-only, Secure, SameSite=Lax: <code>MT_session</code>{' '}
				(session, up to 30 days) and <code>refreshToken</code> (refresh token, up to 1 year). There
				are no advertising or analytics cookies.
			</p>
			<p>
				In production the site uses Sentry (Functional Software, Inc., United States) for error
				reports, performance traces, and a small sample of session replays, plus a replay when an
				error happens. A replay can show what was on the screen, including migraine entries you were
				viewing or typing. Sentry is used to fix faults, not for advertising.
			</p>
			<p>
				The server may store technical connection data (IP address, time, requested address) in logs
				to keep the service secure.
			</p>

			<h2>Purposes and legal bases</h2>
			<ul>
				<li>The diary and sign-in: Art. 6(1)(b) GDPR, because that is how you use the service.</li>
				<li>
					Health data in the entries: Art. 9(2)(a) GDPR, explicit consent. You give it by signing in
					after this notice and saving entries. You can withdraw it at any time by email. Withdrawal
					does not affect processing that already happened. Entries in Google Calendar stay until
					you delete them.
				</li>
				<li>
					Session cookies and security logs: Art. 6(1)(f) GDPR, running and securing the service.
					The cookies are also covered by § 25(2) TDDDG, because they are strictly necessary for
					sign-in.
				</li>
				<li>
					Sentry: Art. 6(1)(f) GDPR, diagnosing errors. Where a replay shows health data, Art.
					9(2)(a) GDPR, limited to fault diagnosis.
				</li>
			</ul>

			<h2>Google user data</h2>
			{LIMITED_USE}
			<ul>
				<li>Google user data is used only for this diary: sign-in and your calendar entries.</li>
				<li>It is not sold and not used for advertising.</li>
				<li>It is not used to train generalized AI or machine-learning models.</li>
				<li>
					It is not transferred, except to run this service (this server, Google, and Sentry, as
					described here), to comply with the law, or at your direction.
				</li>
				<li>
					Humans do not read it except to fix a security or abuse problem, to comply with the law,
					or with your explicit permission.
				</li>
			</ul>

			<h2>Recipients</h2>
			<ul>
				<li>
					Google (Google Ireland Limited, and Google LLC in the United States) for sign-in and
					Calendar. Migraine entries are stored in your Google account.
				</li>
				<li>Sentry, Functional Software, Inc., United States, for error diagnosis.</li>
			</ul>
			<p>No one else. Personal data is not sold or rented.</p>

			<h2>Transfers outside the EEA</h2>
			<p>
				Account data and tokens are stored on a server and in a database operated by Nico Betz.
				Migraine entries themselves are stored in your Google Calendar. Google and Sentry can
				process data in the United States. Where that is a transfer out of the EEA, it relies on the
				EU-US Data Privacy Framework where the recipient is certified, and otherwise on the European
				Commission’s standard contractual clauses.
			</p>

			<h2>How long data is kept</h2>
			<ul>
				<li>Session cookie: up to 30 days, or until you sign out.</li>
				<li>Refresh-token cookie: up to 1 year, or until you sign out.</li>
				<li>
					Account, medicine list, and tokens in the database: until you ask for deletion. Signing
					out ends the session. It does not delete the account or the calendar entries.
				</li>
				<li>Calendar entries: in your Google Calendar until you delete them here or at Google.</li>
				<li>Sentry: for as long as needed to diagnose the error.</li>
				<li>Server logs: only as long as needed to operate and secure the service.</li>
			</ul>

			<h2>Your rights</h2>
			<p>
				You can ask for access, rectification, erasure, restriction, and portability, and you can
				object, where those rights apply. You can withdraw consent at any time. You can also
				complain to a supervisory authority.
			</p>
			<p>
				Email <a href='mailto:n.betz1102@gmail.com'>n.betz1102@gmail.com</a>. We may need to confirm
				that the request comes from you.
			</p>
			<p>
				Deleting the account removes the profile, medicine list, and stored Google tokens from the
				database. Entries already in your Google Calendar stay there until you delete them in
				MigraineTracker or in Google Calendar. You can also revoke access in your Google Account
				(Security, third-party access).
			</p>

			<h2>Supervisory authority</h2>
			<p>
				Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg
				<br />
				Lautenschlagerstraße 20, 70173 Stuttgart, Germany
				<br />
				<a href='https://www.baden-wuerttemberg.datenschutz.de'>
					baden-wuerttemberg.datenschutz.de
				</a>
			</p>

			<h2>No obligation, no automated decision</h2>
			<p>
				You do not have to sign in. Without a Google sign-in and the calendar permission, the diary
				cannot be saved. There is no decision based solely on automated processing that produces a
				legal effect or similarly significant effect.
			</p>
			<p>Last updated: 2 October 2026.</p>
		</LegalLayout>
	);
}

export default PrivacyPage;
