import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

onAuthStateChanged(auth, (user) => {
  chrome.storage.local.set({ uid: user?.uid ?? null })
})

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_AUTH_TOKEN') {
    auth.currentUser?.getIdToken().then((token) => {
      sendResponse({ token })
    })
    return true
  }

  if (message.type === 'GET_SETTINGS') {
    chrome.storage.sync.get(['sourceLanguage', 'targetLanguage', 'difficulty', 'pausedSites'], (result) => {
      sendResponse(result)
    })
    return true
  }
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    chrome.tabs.sendMessage(tabId, { type: 'TAB_UPDATED' }).catch(() => {})
  }
})

console.log('LinguaLens background service worker started')
