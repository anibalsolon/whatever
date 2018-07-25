const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Tray = electron.Tray 
const Menu = electron.Menu 

const shell = electron.shell
const path = require('path')
const url = require('url')

let mainWindow, settingsWindow, configWindow, tray, contextMenu

function createTray () {
  tray = new Tray(path.join(__dirname, 'tray/18x18.png'))
      
  contextMenu = Menu.buildFromTemplate([
    {label: "Open Whatever", click() { 
        if ( mainWindow == null ) { createWindow() }
    }},
    {label: "Account settings", click() { openSettings() }},
    {label: "Quit", click() { app.quit() }}
  ])

  tray.setContextMenu(contextMenu)
}

function createWindow () {
  
  mainWindow = new BrowserWindow({
    width: 900, 
    height: 600, 
    webPreferences: {nodeIntegration: false}, 
    show: false
  })

  mainWindow.loadURL('https://www.evernote.com/Home.action')
  mainWindow.setMenu(null)
  mainWindow.on('page-title-updated', event => {
      event.preventDefault()
  })
  mainWindow.once('ready-to-show', () => {
      mainWindow.show()
  })

  mainWindow.on('close', function () {
    mainWindow = null
  })
  
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    var urlDest = url.split('=')[1]
    shell.openExternal(decodeURIComponent(urlDest))
  })

}

function openSettings () {
  settingsWindow = new BrowserWindow({
    width: 700, 
    height: 550, 
    webPreferences: {nodeIntegration: false}
  })

  settingsWindow.loadURL('https://www.evernote.com/Settings.action')
  
  settingsWindow.on('page-title-updated', event => {
      event.preventDefault()
  })
  
  settingsWindow.setMenu(null)
}

function launchApp () {
  createTray()
  createWindow()
}

app.on('ready', launchApp)

app.on('activate', function () {
  if (mainWindow === null) {
    launchApp()
  }
})
