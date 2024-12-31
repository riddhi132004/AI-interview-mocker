"use client"

import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import Image from 'next/image'; 
import { Button } from '@/components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, MicIcon } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAIModel';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { db } from '@/utils/db';



function RecordAnsSection({mockInterviewQuestion,activeQuestionIndex,interviewData}) {
  const [useAnswer,setUserAnswer]=useState('');
  const {user}=useUser();
  const [loading,setLoading]=useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults

  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  useEffect(()=>{
   results.map((result)=>(
    setUserAnswer(prevAns=>prevAns+result?.transcript)
   ))
  },[results])

  useEffect(()=>{
   if(!isRecording&&useAnswer.length>10){
    UpdateUserAnswer();
   }
  //  if(useAnswer?.length<10){
  //   setLoading(false);
  //   toast('Error while saving your answer,Please record again')
  //   return;
  //  }
  

  },[useAnswer])


  const StartStopRecording=async()=>{
    if(isRecording){
     
      stopSpeechToText()
      
     

      }
  else{
      startSpeechToText();
    }
  }

   const UpdateUserAnswer= async()=>{

    console.log(useAnswer)
    setLoading(true)
    const feedbackPrompt="Question:"+mockInterviewQuestion[activeQuestionIndex]?.question+", User Answer:"+useAnswer+", Depends on question and user answer for give interview question"+"please give us rating for answer and feedback as area of improvement if any"+"in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";

    const result=await chatSession.sendMessage(feedbackPrompt);

    const mockJsonResp=(result.response.text()).replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

    console.log(mockJsonResp);
    const JsonFeedbackResp=JSON.parse(mockJsonResp);

    const resp=await db.insert(UserAnswer).values({
      mockIdRef:interviewData?.mockId,
      question:mockInterviewQuestion[activeQuestionIndex]?.question,
      correctAns:mockInterviewQuestion[activeQuestionIndex]?.answer,
    userAns:useAnswer,
    feedback:JsonFeedbackResp?.feedback,
    rating:JsonFeedbackResp?.rating,
    userEmail:user?.primaryEmailAddress?.emailAddress,
    createdAt:moment().format('DD-MM-yyyy')
    })

    if(resp){
      toast('Your answer recorded successfully');
      setUserAnswer('');
      setResults([]);
    }
    setResults([]);
    setLoading(false);



   }

  return (
    <div className='flex items-center justify-center flex-col'>
    <div className='flex flex-col my-20 justify-center items-center  rounded-lg p-5 bg-black'>
      <Image src={'/web-cam-icon-16.jpg'} width={200} height={200} alt="Webcam Icon" className='absolute'/>
      <Webcam
        mirrored={true}
        style={{
          height:300,
          width:'100%',
          zIndex:10,
        }}
      />
    </div>
    {/* <Button  variant="outline" className="my-10" 
    onClick={isRecording?stopSpeechToText:startSpeechToText}>
    {isRecording?
    <h2 className='text-red-600 flex gap-2'>
      <Mic/> Stop Recording
    </h2>
    :
    
    'Record Answer'}</Button> */}
    <Button
    disabled={loading}
  variant="outline"
  className="my-10"
  onClick={StartStopRecording}
>
  {isRecording ? (
    <h2 className="text-red-600 flex gap-2 items-center">
      <Mic /> Stop Recording
    </h2>
  ) : (
    <span className="flex gap-2 items-center "
    >
      <Mic /> Record Answer
    </span>
  )}
</Button>


    {/* <Button onClick={()=>console.log(useAnswer)}>Show User Answer</Button> */}

    
    </div>
  )
}

export default RecordAnsSection
