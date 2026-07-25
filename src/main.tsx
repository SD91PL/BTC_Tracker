import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './app/App.tsx'
import './styles/index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
	<Provider store={store}>
		<QueryClientProvider client={queryClient}>
			<App />
		</QueryClientProvider>
	</Provider>,
)
