"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import QuestionsSection from './_components/QuestionsSection';
import RecordAnsSection from './_components/RecordAnsSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function StartInterview({ params }) {

     const [interviewId, setInterviewId] = useState();
     const [interviewData,setInterviewData]=useState();
     const[mockInterviewQuestion,setMockInterviewQuestion]=useState();

     const[activeQuestionIndex,setActiveQuestionIndex]=useState(0);
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
      const jsonMockResp=JSON.parse(result[0].jsonMockResp)
      console.log(jsonMockResp)
      setMockInterviewQuestion(jsonMockResp);
      setInterviewData(result[0]);
     
      }catch (error){
          console.error("Error fetching interview details:", error);
      }
    };

  return (
    <div>
     <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>

   {/* {  questions} */}
   <QuestionsSection mockInterviewQuestion={mockInterviewQuestion}
    activeQuestionIndex={activeQuestionIndex}
   />


   {/* {Video/Audio Recording} */}
   <RecordAnsSection mockInterviewQuestion={mockInterviewQuestion}
    activeQuestionIndex={activeQuestionIndex}
      interviewData={interviewData}
    />

     </div>
     {/* <div className='flex justify-end gap-6'>
      {activeQuestionIndex>0 &&<Button>Previous Question</Button>}
      <Button>Next Question</Button>
     {activeQuestionIndex==mockInterviewQuestion?Button.length-1 && <Button>End Interview</Button> }
     </div> */}

     <div className="flex justify-end gap-6">
  {activeQuestionIndex > 0 && 
  <Button  onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button>}
  {mockInterviewQuestion && activeQuestionIndex != mockInterviewQuestion.length - 1 ? (
    <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>
  ) : null}
  {mockInterviewQuestion && activeQuestionIndex == mockInterviewQuestion.length - 1 ? (
    <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}>
    <Button>End Interview</Button>
    </Link>
  ) : null}
</div>


    </div>
  )
}

export default StartInterview
