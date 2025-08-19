// import {
//   Routes,
//   Route,
//   Navigate,
// } from 'react-router-dom';


// import '../styles/index.css';

// import LoginRegister from '../pages/loginRegister';
// import { useState } from 'react';



// function RouteComponent() {

//    const [auth, setAuth] = useState(false);

//     return(
//       <Routes>

//          <Route path="/login" element={<LoginRegister setAuth={setAuth} />} />
//       </Routes>
//     )
// }

// export default RouteComponent;






// import { Routes, Route, Navigate } from 'react-router-dom'
// import '../styles/index.css'

// import LoginRegister from '../pages/loginRegister'
// // import Register from '../pages/Register'
// import { useState } from 'react'

// function RouteComponent() {
//   const [auth, setAuth] = useState(false)

//   return (
//     <Routes>
//       <Route path="/" element={<LoginRegister />} />
//       {/* <Route path="/register" element={<Register />} /> */}
//       {/* <Route path="*" element={<Navigate to="/login" />} /> */}
//     </Routes>
//   )
// }

// export default RouteComponent



import { Routes, Route, Navigate } from 'react-router-dom'
// import '../styles/index.css'

import Register from '../pages/loginRegister';
import InstitutionForm from '../pages/InstitutionForm'

function RouteComponent() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} /> 
        <Route path="/institution" element={<InstitutionForm />} />
      <Route path="*" element={<Navigate to="/register" />} />
      
    </Routes>
  )
}

export default RouteComponent
