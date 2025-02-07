"use client"
import React, { useState } from 'react'



import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'


// If you're using a custom Input component, import it from your UI library or define it here
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiAIModel'
import { LoaderCircle } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment/moment'
import { useRouter } from 'next/navigation'
  

function AddNewInterview() {
const [openDailog,setOpenDialog]=useState(false)
const [jobPosition,setJobPosition]=useState();
const [jobDesc,setJobDesc]=useState();
const [jobExperience,setJobExperience]=useState();
const [loading,setLoading]=useState(false);
const [jsonResponse,setJsonResponse]=useState([]);
const router=useRouter();

const {user}=useUser();

const onSubmit=async(e)=>{
  setLoading(true)
  e.preventDefault()
 console.log(jobPosition,jobDesc,jobExperience);

//  const InputPrompt="Job position:"+jobPosition+ " ,Job description:"+jobDesc+" , Years Of Experience:"+jobExperience+", depending on this information give us "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" Interview question along with Answer in JSON format. Give question and answer as field in JSON"

//  const result=await chatSession.sendMessage(InputPrompt);
//  const MockJsonResp=(result.response.text()).replace('```json','').replace('```','');
//  console.log(JSON.parse(MockJsonResp));

const InputPrompt = `Job position: ${jobPosition}, Job description: ${jobDesc}, Years of Experience: ${jobExperience}, depending on this information give us ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} Interview questions along with answers in JSON format. Include "question" and "answer" as fields in the JSON.`;

      const result = await chatSession.sendMessage(InputPrompt);
      let responseText = await result.response.text();

      // Clean up the response by removing potential markdown artifacts
      responseText = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      // Safely parse the cleaned JSON response
      const parsedJson = JSON.parse(responseText);
      console.log(parsedJson);
      setJsonResponse(responseText);

      if(responseText){

      const resp=await db.insert(MockInterview).values({
        mockId:uuidv4(),
        jsonMockResp:responseText,
        jobPosition:jobPosition,
        jobDesc:jobDesc,
        jobExperience:jobExperience,
        createdBy:user?.primaryEmailAddress?.emailAddress,
        createdAt:moment().format('DD-MM-yyyy')


      }).returning({mockId:MockInterview.mockId});

      console.log("Inserted ID:",resp)
      if(resp){
        setOpenDialog(false);
        router.push('/dashboard/interview/'+resp[0]?.mockId)
      }
    }else{
      console.log("ERROR");
    }


 setLoading(false);
}

  return (
    <div>
      <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
      onClick={()=>setOpenDialog(true)}
      >
        <h2 className='font-bold text-lg text-center'>+ Add New</h2>
      </div>

      <Dialog open={openDailog}>

  <DialogContent className='max-w-2xl'>
    <DialogHeader>
      <DialogTitle>Tell us more about your job interviewing</DialogTitle>
      <DialogDescription>
      <form onSubmit={onSubmit}>
        <div>
         
         <h2>Add Details about your job position/role, Job Description and years of experience</h2>
          <div className='mt-7 my-3'>
            <label>Job Role/Job Position</label>
           <Input placeholder="Ex. Full Stack Developer" required
            onChange={(event)=>setJobPosition(event.target.value)}
           />
          </div>

          <div className='my-3'>
            <label>Job Description/ Tech Stack(In short)</label>
           <Textarea placeholder="Ex. React, Angular, NodeJs ,MySql etc" required 
              onChange={(event)=>setJobDesc(event.target.value)}
           />
          </div>

          <div className='my-3'>
            <label>Years of experience</label>
           <Textarea placeholder="5" type="number" max="60" required
              onChange={(event)=>setJobExperience(event.target.value)}
           />
          </div>


        </div>
        <div className='flex gap-5 justify-end'>
            <Button type="button" variant="ghost" onClick={()=>setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
            {loading?
            <>
            <LoaderCircle className='animate-spin'/>'Generating from AI'</>:'Start Interview'
            }
            </Button>
        </div>
        </form>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

    </div>
  )
}

export default AddNewInterview
