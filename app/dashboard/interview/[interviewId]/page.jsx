// "use client"
// import { db } from '@/utils/db'
// import { MockInterview } from '@/utils/schema'
// import { eq } from 'drizzle-orm'
// import React, { useEffect, useState } from 'react'

// function Interview ({params}) {

//     // const[interviewData,setInterviewData]=useState();
// useEffect(()=>{
//         console.log(params.interviewId)
//         GetInterviewDetails();
//     },[])

//     const GetInterviewDetails=async()=>{
//         const result=await db.select().from(MockInterview).where(eq(MockInterview.mockId,params.interviewId))
    
//         console.log(result);

//     }
//   return (

   
//     <div>
//       Interview
//     </div>
//   )
// }

// export default Interview

// "use client";
// import { db } from '@/utils/db';
// import { MockInterview } from '@/utils/schema';
// import { eq } from 'drizzle-orm';
// import React, { useEffect, useState } from 'react';

// function Interview({ params }) {
//   const [interviewData, setInterviewData] = useState(null);
//   const [interviewId, setInterviewId] = useState(null);

//   // Unwrap params with React.use
//   useEffect(() => {
//     (async () => {
//       const unwrappedParams = await params;
//       setInterviewId(unwrappedParams.interviewId);
//     })();
//   }, [params]);

//   // Fetch interview details once params are unwrapped
//   useEffect(() => {
//     if (interviewId) {
//       GetInterviewDetails();
//     }
//   }, [interviewId]);

//   const GetInterviewDetails = async () => {
//     const result = await db
//       .select()
//       .from(MockInterview)
//       .where(eq(MockInterview.mockId, interviewId));
   
//     console.log(result);
//     setInterviewData(result);
//   };

//   return (
//     <div>
//       Interview
//       {interviewData && <pre>{JSON.stringify(interviewData, null, 2)}</pre>}
//     </div>
//   );
// }

// export default Interview;


// "use client";
// import { db } from '@/utils/db';
// import { MockInterview } from '@/utils/schema';
// import { eq } from 'drizzle-orm';
// import React, { useEffect, useState } from 'react';

// function Interview({ params }) {
//   const [interviewId, setInterviewId] = useState(null);

//   // Unwrap params with React.use
//   useEffect(() => {
//     (async () => {
//       const unwrappedParams = await params;
//       console.log("Unwrapped Params:", unwrappedParams); // Debug params
//       setInterviewId(unwrappedParams.interviewId);
//     })();
//   }, [params]);

//   // Fetch interview details once params are unwrapped
//   useEffect(() => {
//     console.log("Interview ID:", interviewId); // Debug interviewId
//     if (interviewId) {
//       GetInterviewDetails();
//     }
//   }, [interviewId]);

//   const GetInterviewDetails = async () => {
//     try {
//       const result = await db
//         .select()
//         .from(MockInterview)
//         .where(eq(MockInterview.mockId, interviewId));
//       console.log("Database Result:", result); // Log the result
//     } catch (error) {
//       console.error("Database Error:", error); // Log any errors
//     }
//   };

//   return <div>Interview</div>;
// }

// export default Interview;


"use client";
import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import Link from 'next/link';

function Interview({ params }) {
  const [interviewId, setInterviewId] = useState();
  const [interviewData,setInterviewData]=useState();
  const [webCamEnabled, setwebCamEnabled] = useState(false);

  // Unwrap params with React.use
  useEffect(() => {
    (async () => {
      const unwrappedParams = await params;
      setInterviewId(unwrappedParams.interviewId);
    })();
  }, [params]);

  // Fetch interview details once params are unwrapped
  useEffect(() => {
    if (interviewId) {
      GetInterviewDetails();
    }
  }, [interviewId]);

  //used to get Interview Details by MockId/Interview Id

  const GetInterviewDetails = async () => {
    try{
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));
    // console.log(result); // Log the interview details to the console

    console.log("Database Result:", result);
    setInterviewData(result[0] || {});
    }catch (error){
        console.error("Error fetching interview details:", error);
    }
  };

  return (
    <div className='my-10 '>
      <h2 className='font-bold text-2xl'>Let's Get Started</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
    

      <div className="flex flex-col my-5 gap-5 ">
        {interviewData ? (<div className=' flex flex-col p-5 rounded-lg border gap-5'>
          <h2 className="text-lg p-2">
            <strong>Job Role/Job Position: </strong>
            {interviewData.jobPosition || "N/A"}
          </h2>
          <h2 className="text-lg p-2">
            <strong>Job Description/Tech Stack: </strong>
            {interviewData.jobDesc || "N/A"}
          </h2>
          <h2 className="text-lg p-2">
            <strong>Years of Experience: </strong>
            {interviewData.jobExperience || "N/A"}
          </h2>
          </div>
          
        ) : (
          <h2 className="text-lg">Loading interview details...</h2>
        )}
        <div className='p-5 border rounded-lg border-yellow-200 bg-yellow-100'>
          <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb/><strong>Information</strong></h2>
          <h2 className='mt-3 text-yellow-500
          '>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
        </div>
      </div>

      <div>
       { webCamEnabled?<Webcam
         onUserMedia={()=>setwebCamEnabled(true)}
         onUserMediaError={()=>setwebCamEnabled(false)}  
         mirrored={true}
        style={{
            height:300,
            width:300,
        }}
       />
       :
       <>
       <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border'/>
       <Button  variant="ghost" className="w-full" onClick={()=>setwebCamEnabled(true)}>Enable Web Cam and Microphone</Button>
       </>
       }
      </div>
      </div>
      <div className='flex justify-end items-end'>
      <Link href={`/dashboard/interview/${interviewId}/start`}>
            <Button>Start Interview</Button>
          </Link>

      </div>

      

   
    </div>
  );
}

export default Interview;
