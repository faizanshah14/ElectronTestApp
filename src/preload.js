const {ipcRenderer, contextBridge} = require('electron')

contextBridge.exposeInMainWorld('api', {
    req: (req) => ipcRenderer.invoke('req', req)
})

ipcRenderer.on('res', (event, res) => { 
    switch(res.resType) 
    {
      case 'downloaded':
        console.log('downloaded update')
        break;
      
      case 'error':
        console.log(res.msg)
        break;
      
      case 'checking':
        console.log('checking for updates')
        break;

      case 'available':
        console.log('update available')
        break;

      case 'url':
        console.log(res.url)
        break;

      case 'version':
        document.querySelector('#display-version').innerHTML = res.version
        break;
        
      default:   
        break;  
    }
})