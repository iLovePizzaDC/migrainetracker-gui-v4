import App from '@/app/App.tsx';
import '@/index.css';
import { UserProvider } from '@/shared/hooks/user/user-provider';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<UserProvider>
			<App />
		</UserProvider>
	</StrictMode>,
);
