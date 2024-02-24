import React from "react";
// , { useEffect, useState }
// import { json, useLoaderData } from "react-router-dom";

// const HomePage = () => {

//   return (
//     <div style={{ textAlign: 'center' }}>
//       HomePage
//     </div>
//   );
// };

const HomePage = () => {

  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '90vh'
    }}>
      <div style={{fontSize: "40px", fontFamily: "fantasy"}}>
        HomePage
      </div>
    </div>
  );
};


export default HomePage;

// export async function loader() {
//   const response = await fetch("http://localhost:8080/api/institute");

//   if (!response.ok) {
//     throw json(
//       { message: "Could not fetch institutes seminar information" },
//       { status: 500 }
//     );
//   } else {
//     return response;
//   }
// }
