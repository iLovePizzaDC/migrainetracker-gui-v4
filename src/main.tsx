import App from '@/app/App.tsx';
import '@/index.css';
import { UserProvider } from '@/shared/hooks/user/user-provider';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<UserProvider>
				<App />
			</UserProvider>
		</BrowserRouter>
	</StrictMode>,
);
