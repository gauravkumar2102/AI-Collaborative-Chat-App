import { useState } from 'react'
import AppRoute from './routes/AppRoute'
import { UserProvider } from './context/user.context.jsx'

function App() {
 

  return (
    <>
    <UserProvider>
        <AppRoute/>
    </UserProvider>
    
    </>
  )
}

export default App
