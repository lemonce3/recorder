import { ipcRenderer } from 'electron';

import resolver from 'resolver';

resolver.on('resolved-action', action => {
	ipcRenderer.emit('resolved-action', action);
});

ipcRenderer.on('push-snapshot', snapshot => {
	resolver.emit('snapshot', snapshot);
});

ipcRenderer.on('push-action', action => {
	resolver.emit('action', action);
});