"use client"

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "sonner"
import { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowBigDownDash, Github, Info, Loader2, PercentCircle, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link as ScrollLink } from 'react-scroll';
import Link from 'next/link';


export default function Home() {
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(null);
  const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } },
  };
  const ref = useRef(null);
  const isInView = useInView(ref)

  const handleImport = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { resume, jobDesc, model } = event.target.elements;
    let formData = new FormData();
    formData.append("resume", resume.files[0]);
    formData.append('jobDescription', jobDesc.value);
    formData.append('model', 'gemini-pro');
    await axios
      .post(`api/generateReview`, formData)
      .then((res) => {
        setReview(res?.data?.data);
        toast.success("Success", {
          description: res?.data?.message,
          variant: "success",
        })
      })
      .catch((error) => {
        const errorMessage = error?.response?.data?.error
        toast.error("Error", {
          description: errorMessage,
        })
      })
      .finally(() => {
        setLoading(false);
      });
  }


  return (
    <>
      <header className="w-full flex justify-between items-center shadow-sm py-4 px-8">
        <h1 className="text-3xl font-bold">RL</h1>
        <Link href='https://github.com/rishabhbizzle/resumelint'>
          <Button ><Github className='w-5 h-5 mr-2' />Github</Button>
        </Link>
      </header>

      {/* hero section */}

      <div className='p-8 mb-20'>
        <div className="min-h-[90vh] flex flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            <motion.div
              initial="hidden"
              className="max-w-2xl"
              ref={ref}
              animate={isInView ? 'show' : 'hidden'}
              viewport={{ once: true }}
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
            >
              <motion.h1
                variants={FADE_DOWN_ANIMATION_VARIANTS}
                className="space-x-4 text-5xl font-bold tracking-tight sm:text-7xl"
              >
                <div className="bg-gradient-to-r from-purple-700 via-violet-600 to-pink-500 bg-clip-text text-transparent whitespace-nowrap animate-background-pan">
                  ResumeLint
                </div>
              </motion.h1>
              <motion.p
                variants={FADE_DOWN_ANIMATION_VARIANTS}
                className="space-x-4 text-2xl font-bold tracking-tight sm:text-4xl mt-3">Where Skills Align with Opportunities.
              </motion.p>

              <motion.p
                variants={FADE_DOWN_ANIMATION_VARIANTS}
                className="mt-6 text-base sm:text-lg leading-8 "
              >
                Our AI-driven platform meticulously analyzes job descriptions and let you know if the resume is perfect match or not. Elevate your job search, optimize your opportunities, and embark on a seamless path to career success.
              </motion.p>

              <motion.div
                variants={FADE_DOWN_ANIMATION_VARIANTS}
                className="mt-10 flex items-center justify-center gap-x-6 "
              >
                <ScrollLink to="test" smooth={true} duration={500}>
                  <Button variant="secondary">
                    <ArrowBigDownDash className='w-5 h-5 mr-2' />
                    Try Now
                  </Button>
                </ScrollLink>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Import section */}

        <div className="grid w-full items-center gap-1.5 sm:p-8" id='test'>
          <Card>
            <CardHeader>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleImport} className='flex flex-col gap-5'>
                <div>
                  <Label htmlFor="resume">Job Description</Label>
                  <Textarea rows="10" id="jobDesc" name="jobDesc" required minLength={100} />
                </div>
                <div className='flex flex-col sm:flex-row justify-between items-end gap-5'>
                  <div className='w-full'>
                    <Label htmlFor="resume">Resume</Label>
                    <Input required id="resume" name="resume" accept="application/pdf" type="file" />
                  </div>
                  {/* <div className='w-full'>
                    <Label htmlFor="model">Reviewer</Label>
                    <Select name='model' id='model' required defaultValue='gemini-pro'>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Reviewer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                        <SelectItem value="gpt">GPT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}
                </div>
                <Button type="submit" disabled={loading}>
                  {loading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Analyse Resume</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Review section */}

        {review &&
          <div className='w-full mt-8 sm:p-8'>
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-extrabold">Review</CardTitle>
                <CardDescription className='flex gap-2 sm:text-lg font-medium py-5'><Star className='w-20 h-10 mr-2' />{review?.ProfileSummary}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-col sm:flex-row sm:justify-between gap-2 '>
                  <div className='w-full flex flex-col gap-5'>
                    <Card className=''>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-bold">
                          Match
                        </CardTitle>
                        <PercentCircle className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {review?.JdMatch}
                        </div>
                        {/* <p className="text-xs text-muted-foreground">
                          Match Percentage
                        </p> */}
                      </CardContent>
                    </Card>
                    <Card className='w-full'>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-bold">
                          Missing Keywords
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {review?.MissingKeywords?.length > 0 ? review?.MissingKeywords?.map((item, index) => (
                          <Badge key={index} className="mr-2 mt-2 sm:text-sm">
                            {item}
                          </Badge>
                        ))
                          :
                          <p className='font-medium'>
                            - No missing keywords 🎉
                          </p>
                        }
                      </CardContent>
                    </Card>
                  </div>
                  <div className='w-full'  >
                    <Card className='w-full'>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-bold">
                          Improvements
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='flex flex-col gap-2'>
                        {review?.Improvements?.length > 0 ? review?.Improvements?.map((item, index) => (
                          <p key={index} className='font-medium'>
                            - {item}
                          </p>
                        ))
                          :
                          <p className='font-medium'>
                            - No improvements required 🎉
                          </p>
                        }
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        }
      </div>

      {/* footer section */}

      <footer className="flex items-center justify-center p-6 bg-gray-800 text-white">
        <p>© 2024 ResumeLint. All rights reserved.</p>
      </footer>
    </>
  );
}
