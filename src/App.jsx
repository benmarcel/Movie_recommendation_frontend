// import { useState } from 'react'
import { RouterProvider } from "react-router-dom";
import router from "./routes/route.jsx";
import AuthProvider from "./contexts/AuthProvider.jsx";


function App() {

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App


  
