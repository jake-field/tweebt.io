import React from 'react';
import ResultsProvider from './appsettings/results';
import ThemeProvider from './appsettings/theme';
import ViewProvider from './appsettings/view';

export default function SettingsProvider({ children }: any) {
	return (
		<ThemeProvider>
			<ViewProvider>
				<ResultsProvider>
					{children}
				</ResultsProvider>
			</ViewProvider>
		</ThemeProvider>
	)
}