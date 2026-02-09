'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Mic, Wifi, Clock, CheckCircle2, Play, Square, ChevronRight, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

// Types
type Step = 
  | 'registration'
  | 'intro'
  | 'ready-job'
  | 'job-description'
  | 'ready-tech'
  | 'tech-check'
  | 'ready-about'
  | 'about-yourself'
  | 'ready-interview'
  | 'main-interview'
  | 'feedback'
  | 'success'

type TechStatus = 'idle' | 'testing' | 'success' | 'failed'

interface CaseStudy {
  id: number
  title: string
  situation: string
  questions: {
    text: string
    isSubQuestion?: boolean
  }[]
}

// Case Studies Data
const caseStudies: CaseStudy[] = [
  {
    id: 1,
    title: 'Dropping Footfall in Flagship Stores',
    situation: 'Your flagship stores are experiencing a 30% drop in footfall over the last quarter, while online sales remain steady.',
    questions: [
      { text: 'What immediate actions would you take to address this issue?' },
      { text: 'How would you create a staff motivation plan during this challenging period?', isSubQuestion: true }
    ]
  },
  {
    id: 2,
    title: 'Inventory Mismatch Between Online/Offline',
    situation: 'There are frequent inventory mismatches between online and offline channels, causing customer complaints and lost sales.',
    questions: [
      { text: 'What coordination strategy would you implement?' },
      { text: 'Outline your system audit steps.', isSubQuestion: true }
    ]
  },
  {
    id: 3,
    title: 'High Churn Rate of Floor Staff',
    situation: 'Your stores are experiencing a 45% annual churn rate among floor staff, well above industry standards.',
    questions: [
      { text: 'What retention tactics would you deploy?' },
      { text: 'How would you improve training programs?', isSubQuestion: true }
    ]
  },
  {
    id: 4,
    title: 'Seasonal Sales Peak Preparation',
    situation: 'The holiday season is approaching in 6 weeks, and you need to prepare all 50 stores for the expected 200% increase in traffic.',
    questions: [
      { text: 'Walk us through your preparation strategy.' }
    ]
  },
  {
    id: 5,
    title: 'Launching a Loyalty Program in 20 Regions',
    situation: 'The company wants to launch a new loyalty program across 20 regional markets with different customer demographics.',
    questions: [
      { text: 'How would you approach this rollout?' }
    ]
  },
  {
    id: 6,
    title: 'Conflict with Regional Distributor',
    situation: 'A key regional distributor is threatening to terminate the partnership due to payment disputes and delivery delays.',
    questions: [
      { text: 'How would you handle this situation?' }
    ]
  },
  {
    id: 7,
    title: 'Implementing AI-Driven Sales Forecasting',
    situation: 'Leadership wants to implement AI-driven sales forecasting across all stores within 3 months.',
    questions: [
      { text: 'What would be your implementation roadmap?' }
    ]
  }
]

export default function Page() {
  const [step, setStep] = useState<Step>('registration')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  
  // Tech check states
  const [cameraStatus, setCameraStatus] = useState<TechStatus>('idle')
  const [micStatus, setMicStatus] = useState<TechStatus>('idle')
  const [internetStatus, setInternetStatus] = useState<TechStatus>('idle')
  
  // Video recording states
  const [isRecording, setIsRecording] = useState(false)
  const [aboutTimer, setAboutTimer] = useState(300) // 5 min = 300 sec
  
  // Interview states
  const [currentCase, setCurrentCase] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [globalTimer, setGlobalTimer] = useState(1800) // 30 min = 1800 sec
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [recordingAnswer, setRecordingAnswer] = useState(false)
  
  // Feedback states
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackVideoRecording, setFeedbackVideoRecording] = useState(false)
  const [feedbackTimer, setFeedbackTimer] = useState(300) // 5 min

  // About Yourself Timer
  useEffect(() => {
    if (step === 'about-yourself' && isRecording && aboutTimer > 0) {
      const interval = setInterval(() => {
        setAboutTimer(prev => Math.max(0, prev - 1))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [step, isRecording, aboutTimer])

  // Global Interview Timer
  useEffect(() => {
    if (step === 'main-interview' && interviewStarted && globalTimer > 0) {
      const interval = setInterval(() => {
        setGlobalTimer(prev => {
          if (prev <= 1) {
            setStep('feedback')
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [step, interviewStarted, globalTimer])

  // Feedback Video Timer
  useEffect(() => {
    if (step === 'feedback' && feedbackVideoRecording && feedbackTimer > 0) {
      const interval = setInterval(() => {
        setFeedbackTimer(prev => Math.max(0, prev - 1))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [step, feedbackVideoRecording, feedbackTimer])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const testTech = async (type: 'camera' | 'mic' | 'internet') => {
    const setStatus = type === 'camera' ? setCameraStatus : type === 'mic' ? setMicStatus : setInternetStatus
    setStatus('testing')
    await new Promise(resolve => setTimeout(resolve, 2000))
    setStatus('success')
  }

  const allTechChecked = cameraStatus === 'success' && micStatus === 'success' && internetStatus === 'success'

  const currentCaseData = caseStudies[currentCase]
  const currentQuestionData = currentCaseData?.questions[currentQuestion]
  const hasMoreQuestions = currentCaseData && currentQuestion < currentCaseData.questions.length - 1
  const hasMoreCases = currentCase < caseStudies.length - 1

  const handleEndAnswer = () => {
    setRecordingAnswer(false)
  }

  const handleNextQuestion = () => {
    if (hasMoreQuestions) {
      setCurrentQuestion(prev => prev + 1)
      setRecordingAnswer(false)
    } else if (hasMoreCases) {
      setCurrentCase(prev => prev + 1)
      setCurrentQuestion(0)
      setRecordingAnswer(false)
    } else {
      setStep('feedback')
    }
  }

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  return (
    <div className="min-h-screen bg-[#F9FAF8] flex items-center justify-center p-4 md:p-8">
      <AnimatePresence mode="wait">
        {/* Registration */}
        {step === 'registration' && (
          <motion.div
            key="registration"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <Card className="rounded-3xl shadow-lg border-0">
              <CardHeader className="space-y-2 text-center pb-4">
                <CardTitle className="text-3xl font-bold text-[#2D3436]">Welcome</CardTitle>
                <CardDescription className="text-base">Let's get started with your video interview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 px-8">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#2D3436]">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 rounded-2xl border-[#8BA88E]/30 focus:border-[#8BA88E]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#2D3436]">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-2xl border-[#8BA88E]/30 focus:border-[#8BA88E]"
                  />
                </div>
                <div className="flex items-start space-x-3 pt-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    className="mt-1 h-6 w-6 rounded-lg border-[#8BA88E]/50"
                  />
                  <label htmlFor="terms" className="text-sm leading-relaxed text-[#2D3436]/80 cursor-pointer">
                    I agree to the Terms of Service and Privacy Policy. I understand this interview will be recorded.
                  </label>
                </div>
              </CardContent>
              <CardFooter className="px-8 pb-8 pt-2">
                <Button
                  onClick={() => setStep('intro')}
                  disabled={!name || !email || !termsAccepted}
                  className="w-full h-12 bg-[#8BA88E] hover:bg-[#7A9A7D] text-white rounded-2xl text-base font-medium"
                >
                  Continue
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Interactive Intro */}
        {step === 'intro' && (
          <motion.div
            key="intro"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl"
          >
            <Card className="rounded-3xl shadow-lg border-0">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-3xl font-bold text-[#2D3436]">How It Works</CardTitle>
                <CardDescription>Follow these steps to complete your video interview</CardDescription>
              </CardHeader>
              <CardContent className="px-8">
                <Tabs defaultValue="intro" className="w-full">
                  <TabsList className="grid w-full grid-cols-5 gap-2 bg-[#8BA88E]/10 p-1 rounded-2xl">
                    <TabsTrigger value="intro" className="rounded-xl data-[state=active]:bg-[#8BA88E] data-[state=active]:text-white">1. Intro</TabsTrigger>
                    <TabsTrigger value="setup" className="rounded-xl data-[state=active]:bg-[#8BA88E] data-[state=active]:text-white">2. Setup</TabsTrigger>
                    <TabsTrigger value="about" className="rounded-xl data-[state=active]:bg-[#8BA88E] data-[state=active]:text-white">3. About</TabsTrigger>
                    <TabsTrigger value="interview" className="rounded-xl data-[state=active]:bg-[#8BA88E] data-[state=active]:text-white">4. Interview</TabsTrigger>
                    <TabsTrigger value="feedback" className="rounded-xl data-[state=active]:bg-[#8BA88E] data-[state=active]:text-white">5. Feedback</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="intro" className="space-y-4 mt-6">
                    <div className="aspect-video bg-[#8BA88E]/10 rounded-3xl flex items-center justify-center">
                      <Play className="h-16 w-16 text-[#8BA88E]" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg text-[#2D3436]">Introduction Videos</h3>
                      <div className="space-y-2 text-[#2D3436]/70 leading-relaxed">
                        <p><strong>Step 1.1:</strong> Company Video (Skippable) - Learn about our company culture and values.</p>
                        <p><strong>Step 1.2:</strong> Manager Video - Your potential manager introduces the role and team.</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="setup" className="space-y-4 mt-6">
                    <div className="aspect-video bg-[#8BA88E]/10 rounded-3xl flex items-center justify-center">
                      <Play className="h-16 w-16 text-[#8BA88E]" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg text-[#2D3436]">Technical Check</h3>
                      <p className="text-[#2D3436]/70 leading-relaxed">
                        We'll help you test your camera, microphone, and internet connection to ensure the best interview experience.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="about" className="space-y-4 mt-6">
                    <div className="aspect-video bg-[#8BA88E]/10 rounded-3xl flex items-center justify-center">
                      <Play className="h-16 w-16 text-[#8BA88E]" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg text-[#2D3436]">Tell Us About Yourself</h3>
                      <p className="text-[#2D3436]/70 leading-relaxed">
                        Record a 5-minute video introducing yourself, your background, and why you're interested in this role.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="interview" className="space-y-4 mt-6">
                    <div className="aspect-video bg-[#8BA88E]/10 rounded-3xl flex items-center justify-center">
                      <Play className="h-16 w-16 text-[#8BA88E]" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg text-[#2D3436]">Case Study Interview</h3>
                      <p className="text-[#2D3436]/70 leading-relaxed">
                        You'll be presented with 7 real-world retail scenarios. You have 30 minutes total to record your responses. Think through each case and share your approach.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="feedback" className="space-y-4 mt-6">
                    <div className="aspect-video bg-[#8BA88E]/10 rounded-3xl flex items-center justify-center">
                      <Play className="h-16 w-16 text-[#8BA88E]" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg text-[#2D3436]">Your Feedback</h3>
                      <p className="text-[#2D3436]/70 leading-relaxed">
                        Share your thoughts about the interview process. You can provide written feedback or record a video message.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="px-8 pb-8 pt-2">
                <Button
                  onClick={() => setStep('ready-job')}
                  className="w-full h-12 bg-[#8BA88E] hover:bg-[#7A9A7D] text-white rounded-2xl text-base font-medium"
                >
                  I'm Ready
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Get Ready - Job Description */}
        {step === 'ready-job' && (
          <motion.div
            key="ready-job"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            <Card className="rounded-3xl shadow-lg border-0">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-4xl font-bold text-[#2D3436] text-balance">Next: Role Overview</CardTitle>
              </CardHeader>
              <CardContent className="px-8 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-[#2D3436]">What to expect:</h3>
                  <ul className="space-y-3 text-[#2D3436]/70">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-[#8BA88E] mr-3 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">Review the detailed job description and requirements</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-[#8BA88E] mr-3 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">Understand key responsibilities and expectations</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-[#8BA88E] mr-3 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">Get familiar with the skills we're looking for</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-[#8BA88E]/10 p-6 rounded-2xl border border-[#8BA88E]/20">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-[#8BA88E] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-[#2D3436] mb-1">Pro Tip</h4>
                      <p className="text-sm text-[#2D3436]/70 leading-relaxed">
                        Take notes on the key requirements. You'll reference this role throughout the interview.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-8 pb-8 pt-2">
                <Button
                  onClick={() => setStep('job-description')}
                  className="w-full h-12 bg-[#8BA88E] hover:bg-[#7A9A7D] text-white rounded-2xl text-base font-medium"
                >
                  View Job Description
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Job Description */}
        {step === 'job-description' && (
          <motion.div
            key="job-description"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl"
          >
            <Card className="rounded-3xl shadow-lg border-0">
              <CardHeader className="text-center pb-4">
                <div className="inline-block">
                  <Badge className="bg-[#8BA88E] text-white px-4 py-1 rounded-full mb-3">Open Position</Badge>
                </div>
                <CardTitle className="text-3xl font-bold text-[#2D3436]">Head of Sales (Retail)</CardTitle>
                <CardDescription className="text-base">Full-time • Remote/Hybrid</CardDescription>
              </CardHeader>
              <CardContent className="px-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg text-[#2D3436] mb-3">Key Responsibilities</h3>
                    <ul className="space-y-2 text-[#2D3436]/70 list-disc list-inside leading-relaxed">
                      <li>Lead and scale a multi-regional retail sales organization</li>
                      <li>Drive revenue growth across 50+ physical stores and online channels</li>
                      <li>Develop and execute strategic sales plans aligned with business objectives</li>
                      <li>Build and mentor high-performing sales teams across regions</li>
                      <li>Collaborate with operations, marketing, and supply chain teams</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg text-[#2D3436] mb-3">Key Skills Required</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Leadership', 'Retail Strategy', 'P&L Management', 'Team Building', 'Data Analysis', 'Customer Focus', 'Change Management', 'Omnichannel Sales'].map(skill => (
                        <Badge key={skill} variant="secondary" className="bg-[#8BA88E]/10 text-[#2D3436] px-4 py-1.5 rounded-full">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg text-[#2D3436] mb-3">Expectations</h3>
                    <ul className="space-y-2 text-[#2D3436]/70 list-disc list-inside leading-relaxed">
                      <li>10+ years of retail sales experience with 5+ years in leadership</li>
                      <li>Proven track record of driving double-digit growth</li>
                      <li>Experience managing multi-location teams</li>
                      <li>Strong analytical and problem-solving capabilities</li>
                      <li>Excellent communication and stakeholder management skills</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-8 pb-8 pt-2">
                <Button
                  onClick={() => setStep('ready-tech')}
                  className="w-full h-12 bg-[#8BA88E] hover:bg-[#7A9A7D] text-white rounded-2xl text-base font-medium"
                >
                  Continue to Technical Check
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Get Ready - Technical Check */}
        {step === 'ready-tech' && (
          <motion.div
            key="ready-tech"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            <Card className="rounded-3xl shadow-lg border-0">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-4xl font-bold text-[#2D3436] text-balance">Next: Technical Check</CardTitle>
              </CardHeader>
              <CardContent className="px-8 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-[#2D3436]">What we'll test:</h3>
                  <ul className="space-y-3 text-[#2D3436]/70">
                    <li className="flex items-start">
                      <Camera className="h-5 w-5 text-[#8BA88E] mr-3 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">Camera - Ensure your video is clear and well-framed</span>
                    </li>
                    <li className="flex items-start">
                      <Mic className="h-5 w-5 text-[#8BA88E] mr-3 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">Microphone - Check your audio quality and volume</span>
                    </li>
                    <li className="flex items-start">
                      <Wifi className="h-5 w-5 text-[#8BA88E] mr-3 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">Internet Speed - Verify stable connection for recording</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-[#8BA88E]/10 p-6 rounded-2xl border border-[#8BA88E]/20">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-[#8BA88E] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-[#2D3436] mb-1">Pro Tip</h4>
                      <p className="text-sm text-[#2D3436]/70 leading-relaxed">
                        Find a quiet, well-lit space. Position yourself at eye level with the camera and ensure your face is clearly visible.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-8 pb-8 pt-2">
                <Button
                  onClick={() => setStep('tech-check')}
                  className="w-full h-12 bg-[#8BA88E] hover:bg-[#7A9A7D] text-white rounded-2xl text-base font-medium"
                >
                  Start Technical Check
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Technical Check */}
        {step === 'tech-check' && (
          <motion.div
            key="tech-check"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            <Card className="rounded-3xl shadow-lg border-0">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-3xl font-bold text-[#2D3436]">Technical Check</CardTitle>
                <CardDescription>Test your equipment before starting the interview</CardDescription>
              </CardHeader>
              <CardContent className="px-8 space-y-6">
                {/* Camera Test */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Camera className="h-5 w-5 text-[#8BA88E]" />
                      <span className="font-medium text-[#2D3436]">Camera</span>
                    </div>
                    {cameraStatus === 'success' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                  </div>
                  <Button
                    onClick={() => testTech('camera')}
                    disabled={cameraStatus === 'testing' || cameraStatus === 'success'}
                    variant={cameraStatus === 'success' ? 'secondary' : 'outline'}
                    className="w-full h-12 rounded-2xl"
                  >
                    {cameraStatus === 'idle' && 'Test Camera'}
                    {cameraStatus === 'testing' && 'Testing...'}
                    {cameraStatus === 'success' && 'Camera Working'}
                  </Button>
                </div>

                {/* Microphone Test */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mic className="h-5 w-5 text-[#8BA88E]" />
                      <span className="font-medium text-[#2D3436]">Microphone</span>
                    </div>
                    {micStatus === 'success' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                  </div>
                  <Button
                    onClick={() => testTech('mic')}
                    disabled={micStatus === 'testing' || micStatus === 'success'}
                    variant={micStatus === 'success' ? 'secondary' : 'outline'}
                    className="w-full h-12 rounded-2xl"
                  >
                    {micStatus === 'idle' && 'Test Microphone'}
                    {micStatus === 'testing' && 'Testing...'}
                    {micStatus === 'success' && 'Microphone Working'}
                  </Button>
                </div>

                {/* Internet Test */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Wifi className="h-5 w-5 text-[#8BA88E]" />
                      <span className="font-medium text-[#2D3436]">Internet Speed</span>
                    </div>
                    {internetStatus === 'success' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                  </div>
                  <Button
                    onClick={() => testTech('internet')}
                    disabled={internetStatus === 'testing' || internetStatus === 'success'}
                    variant={internetStatus === 'success' ? 'secondary' : 'outline'}
                    className="w-full h-12 rounded-2xl"
                  >
                    {internetStatus === 'idle' && 'Test Internet Speed'}
                    {internetStatus === 'testing' && 'Testing...'}
                    {internetStatus === 'success' && 'Connection Stable'}
                  </Button>
                </div>

                <div className="bg-[#8BA88E]/5 p-4 rounded-2xl">
                  <p className="text-sm text-[#2D3436]/70 leading-relaxed text-center">
                    A stable internet connection prevents video lag and ensures the employer sees you clearly. We recommend at least 5 Mbps upload speed.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="px-8 pb-8 pt-2">
                <Button
                  onClick={() => setStep('ready-about')}
                  disabled={!allTechChecked}
                  className="w-full h-12 bg-[#8BA88E] hover:bg-[#7A9A7D] text-white rounded-2xl text-base font-medium disabled:opacity-50"
                >
                  Continue
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Get Ready - About Yourself */}
        {step === 'ready-about' && (
          <motion.div
            key="ready-about"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            <Card className="rounded-3xl shadow-lg border-0">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-4xl font-bold text-[#2D3436] text-balance">Next: Tell Us About Yourself</CardTitle>
              </CardHeader>
              <CardContent className="px-8 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-[#2D3436]">What to cover:</h3>
                  <ul className="space-y-3 text-[#2D3436]/70">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-[#8BA88E] mr-3 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">Your professional background and experience</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-[#8BA88E] mr-3 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">Why you're interested in this role</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-[#8BA88E] mr-3 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">What makes you a great fit for Head of Sales</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-[#8BA88E]/10 p-6 rounded-2xl border border-[#8BA88E]/20">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-[#8BA88E] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-[#2D3436] mb-1">Pro Tip</h4>
                      <p className="text-sm text-[#2D3436]/70 leading-relaxed">
                        You have 5 minutes. Be authentic and conversational. This is your chance to make a great first impression!
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-8 pb-8 pt-2">
                <Button
                  onClick={() => setStep('about-yourself')}
                  className="w-full h-12 bg-[#8BA88E] hover:bg-[#7A9A7D] text-white rounded-2xl text-base font-medium"
                >
                  Start Recording
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* About Yourself */}
        {step === 'about-yourself' && (
          <motion.div
            key="about-yourself"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            <Card className="rounded-3xl shadow-lg border-0">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-[#2D3436]">About Yourself</CardTitle>
                <CardDescription>Introduce yourself to the hiring team (5 minutes)</CardDescription>
              </CardHeader>
              <CardContent className="px-8 space-y-6">
                {/* Video Preview - Responsive */}
                <div className="relative mx-auto max-w-sm md:max-w-full">
                  <div className="aspect-[9/16] md:aspect-[3/2] bg-[#8BA88E]/10 rounded-3xl flex items-center justify-center relative overflow-hidden">
                    {isRecording && (
                      <div className="absolute top-4 left-4 flex items-center space-x-2 z-10">
                        <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-white bg-black/50 px-2 py-1 rounded">REC</span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-black/70 px-3 py-1.5 rounded-full z-10">
                      <span className="text-white font-mono text-sm">{formatTime(aboutTimer)}</span>
                    </div>
                    <Camera className="h-16 w-16 text-[#8BA88E]" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`w-full h-14 rounded-2xl text-base font-medium ${
                      isRecording
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-[#8BA88E] hover:bg-[#7A9A7D] text-white'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <Square className="mr-2 h-5 w-5" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-5 w-5" />
                        Start Recording
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => setStep('ready-interview')}
                    variant="outline"
                    className="w-full h-12 rounded-2xl"
                  >
                    Skip This Step
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="px-8 pb-8 pt-2">
                <Button
                  onClick={() => setStep('ready-interview')}
                  disabled={!isRecording && aboutTimer === 300}
                  className="w-full h-14 bg-[#8BA88E] hover:bg-[#7A9A7D] text-white rounded-2xl text-base font-medium"
                >
                  Continue to Interview
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Get Ready - Main Interview */}
        {step === 'ready-interview' && (
          <motion.div
            key="ready-interview"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            <Card className="rounded-3xl shadow-lg border-0">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-4xl font-bold text-[#2D3436] text-balance">Next: Case Study Interview</CardTitle>
              </CardHeader>
              <CardContent className="px-8 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-[#2D3436]">Interview Format:</h3>
                  <ul className="space-y-3 text-[#2D3436]/70">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-[#8BA88E] mr-3 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">7 real-world retail sales scenarios</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-[#8BA88E] mr-3 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">30 minutes total (global timer starts when you begin)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-[#8BA88E] mr-3 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">Some cases have follow-up questions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-[#8BA88E] mr-3 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">You can skip cases, but cannot go back</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-[#8BA88E]/10 p-6 rounded-2xl border border-[#8BA88E]/20">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-[#8BA88E] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-[#2D3436] mb-1">Pro Tip</h4>
                      <p className="text-sm text-[#2D3436]/70 leading-relaxed">
                        Think strategically about time. Quality over quantity - it's better to answer fewer cases thoroughly than rush through all of them.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-8 pb-8 pt-2">
                <Button
                  onClick={() => {
                    setStep('main-interview')
                    setInterviewStarted(true)
                  }}
                  className="w-full h-12 bg-[#8BA88E] hover:bg-[#7A9A7D] text-white rounded-2xl text-base font-medium"
                >
                  Start Interview
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Main Interview */}
        {step === 'main-interview' && currentCaseData && (
          <motion.div
            key="main-interview"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full max-w-7xl"
          >
            {/* Global Timer - Always Visible */}
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-2 bg-red-50 px-6 py-3 rounded-full border-2 border-red-200 shadow-lg">
                <Clock className="h-5 w-5 text-red-600" />
                <span className="font-mono font-bold text-red-600 text-lg">{formatTime(globalTimer)}</span>
                <span className="text-sm text-red-600/70">remaining</span>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
              <Card className="rounded-3xl shadow-lg border-0">
                <CardHeader className="pb-4">
                  <Badge className="bg-[#8BA88E] text-white px-3 py-1 rounded-full mb-2 w-fit">
                    Case {currentCase + 1} of {caseStudies.length}
                  </Badge>
                  <CardTitle className="text-xl font-bold text-[#2D3436]">{currentCaseData.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-6 space-y-6">
                  {/* Video Preview - Mobile Vertical */}
                  <div className="relative mx-auto max-w-sm">
                    <div className="aspect-[9/16] bg-[#8BA88E]/10 rounded-3xl flex items-center justify-center relative overflow-hidden">
                      {recordingAnswer && (
                        <div className="absolute top-4 left-4 flex items-center space-x-2 z-10">
                          <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-sm font-medium text-white bg-black/50 px-2 py-1 rounded">REC</span>
                        </div>
                      )}
                      <Camera className="h-16 w-16 text-[#8BA88E]" />
                    </div>
                  </div>

                  {/* Case Situation */}
                  <div className="bg-[#8BA88E]/5 p-5 rounded-2xl border border-[#8BA88E]/20">
                    <h3 className="font-semibold text-[#2D3436] mb-2">Situation:</h3>
                    <p className="text-[#2D3436]/80 leading-relaxed text-sm">{currentCaseData.situation}</p>
                  </div>

                  {/* Current Question */}
                  <div className="bg-white p-5 rounded-2xl border-2 border-[#8BA88E]/30">
                    <h3 className="font-semibold text-[#2D3436] mb-2">
                      {currentQuestionData.isSubQuestion ? 'Follow-up Question:' : 'Question:'}
                    </h3>
                    <p className="text-[#2D3436] leading-relaxed">{currentQuestionData.text}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {!recordingAnswer ? (
                      <Button
                        onClick={() => setRecordingAnswer(true)}
                        className="w-full h-14 bg-[#8BA88E] hover:bg-[#7A9A7D] text-white rounded-2xl text-base font-medium"
                      >
                        <Play className="mr-2 h-5 w-5" />
                        Record Answer
                      </Button>
                    ) : (
                      <Button
                        onClick={handleEndAnswer}
                        className="w-full h-14 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-base font-medium"
                      >
                        <Square className="mr-2 h-5 w-5" />
                        End Answer
                      </Button>
                    )}

                    {!recordingAnswer && (
                      <Button
                        onClick={handleNextQuestion}
                        variant="outline"
                        className="w-full h-12 rounded-2xl bg-transparent"
                      >
                        {hasMoreQuestions ? 'Next Question' : hasMoreCases ? 'Finish & Next Case' : 'Finish Interview'}
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-[#2D3436]/60">
                      <span>Progress</span>
                      <span>{currentCase + 1} / {caseStudies.length} cases</span>
                    </div>
                    <Progress value={((currentCase + 1) / caseStudies.length) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Desktop Split Layout */}
            <div className="hidden md:grid md:grid-cols-2 md:gap-6">
              {/* Left: Case Content */}
              <Card className="rounded-3xl shadow-lg border-0">
                <CardHeader className="pb-4">
                  <Badge className="bg-[#8BA88E] text-white px-3 py-1 rounded-full mb-2 w-fit">
                    Case {currentCase + 1} of {caseStudies.length}
                  </Badge>
                  <CardTitle className="text-2xl font-bold text-[#2D3436]">{currentCaseData.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-8 space-y-6">
                  {/* Case Situation */}
                  <div className="bg-[#8BA88E]/5 p-6 rounded-2xl border border-[#8BA88E]/20">
                    <h3 className="font-semibold text-[#2D3436] mb-2">Situation:</h3>
                    <p className="text-[#2D3436]/80 leading-relaxed">{currentCaseData.situation}</p>
                  </div>

                  {/* Current Question */}
                  <div className="bg-white p-6 rounded-2xl border-2 border-[#8BA88E]/30">
                    <h3 className="font-semibold text-[#2D3436] mb-2">
                      {currentQuestionData.isSubQuestion ? 'Follow-up Question:' : 'Question:'}
                    </h3>
                    <p className="text-[#2D3436] text-lg leading-relaxed">{currentQuestionData.text}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {!recordingAnswer ? (
                      <Button
                        onClick={() => setRecordingAnswer(true)}
                        className="w-full h-14 bg-[#8BA88E] hover:bg-[#7A9A7D] text-white rounded-2xl text-base font-medium"
                      >
                        <Play className="mr-2 h-5 w-5" />
                        Record Answer
                      </Button>
                    ) : (
                      <Button
                        onClick={handleEndAnswer}
                        className="w-full h-14 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-base font-medium"
                      >
                        <Square className="mr-2 h-5 w-5" />
                        End Answer
                      </Button>
                    )}

                    {!recordingAnswer && (
                      <Button
                        onClick={handleNextQuestion}
                        variant="outline"
                        className="w-full h-12 rounded-2xl bg-transparent"
                      >
                        {hasMoreQuestions ? 'Next Question' : hasMoreCases ? 'Finish & Next Case' : 'Finish Interview'}
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-[#2D3436]/60">
                      <span>Progress</span>
                      <span>{currentCase + 1} / {caseStudies.length} cases</span>
                    </div>
                    <Progress value={((currentCase + 1) / caseStudies.length) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Right: Video Preview */}
              <Card className="rounded-3xl shadow-lg border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-[#2D3436]">Your Response</CardTitle>
                </CardHeader>
                <CardContent className="px-8">
                  <div className="relative">
                    <div className="aspect-[3/2] bg-[#8BA88E]/10 rounded-3xl flex items-center justify-center relative overflow-hidden">
                      {recordingAnswer && (
                        <div className="absolute top-4 left-4 flex items-center space-x-2 z-10">
                          <div className="h-4 w-4 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-base font-medium text-white bg-black/50 px-3 py-1.5 rounded">REC</span>
                        </div>
                      )}
                      <Camera className="h-20 w-20 text-[#8BA88E]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Feedback */}
        {step === 'feedback' && (
          <motion.div
            key="feedback"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            <Card className="rounded-3xl shadow-lg border-0">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-3xl font-bold text-[#2D3436]">Your Feedback</CardTitle>
                <CardDescription>Help us improve the interview experience</CardDescription>
              </CardHeader>
              <CardContent className="px-8 space-y-6">
                {/* Text Feedback */}
                <div className="space-y-2">
                  <Label htmlFor="feedback" className="text-[#2D3436]">Written Feedback (Optional)</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Share your thoughts about the interview process..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="min-h-[120px] rounded-2xl border-[#8BA88E]/30 focus:border-[#8BA88E]"
                  />
                </div>

                {/* Video Feedback - Responsive */}
                <div className="space-y-3">
                  <Label className="text-[#2D3436]">Video Message (Optional - 5 min max)</Label>
                  <div className="relative mx-auto max-w-sm md:max-w-full">
                    <div className="aspect-[9/16] md:aspect-[3/2] bg-[#8BA88E]/10 rounded-3xl flex items-center justify-center relative overflow-hidden">
                      {feedbackVideoRecording && (
                        <>
                          <div className="absolute top-4 left-4 flex items-center space-x-2 z-10">
                            <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-white bg-black/50 px-2 py-1 rounded">REC</span>
                          </div>
                          <div className="absolute top-4 right-4 bg-black/70 px-3 py-1.5 rounded-full z-10">
                            <span className="text-white font-mono text-sm">{formatTime(feedbackTimer)}</span>
                          </div>
                        </>
                      )}
                      <Camera className="h-16 w-16 text-[#8BA88E]" />
                    </div>
                  </div>
                  <Button
                    onClick={() => setFeedbackVideoRecording(!feedbackVideoRecording)}
                    variant="outline"
                    className="w-full h-12 rounded-2xl"
                  >
                    {feedbackVideoRecording ? (
                      <>
                        <Square className="mr-2 h-5 w-5" />
                        Stop Video
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-5 w-5" />
                        Record Video Message
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="px-8 pb-8 pt-2">
                <Button
                  onClick={() => setStep('success')}
                  className="w-full h-14 bg-[#8BA88E] hover:bg-[#7A9A7D] text-white rounded-2xl text-base font-medium"
                >
                  Submit & Finish
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Success */}
        {step === 'success' && (
          <motion.div
            key="success"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            <Card className="rounded-3xl shadow-lg border-0">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="h-20 w-20 bg-[#8BA88E]/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-12 w-12 text-[#8BA88E]" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-[#2D3436]">Interview Completed!</CardTitle>
                <CardDescription className="text-base mt-2">
                  Thank you for taking the time to complete your video interview
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 space-y-6">
                <div className="bg-[#8BA88E]/5 p-6 rounded-2xl">
                  <h3 className="font-semibold text-[#2D3436] mb-4 text-center">What happens next?</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 h-8 w-8 bg-[#8BA88E] text-white rounded-full flex items-center justify-center font-semibold">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium text-[#2D3436]">Application Sent</h4>
                        <p className="text-sm text-[#2D3436]/70 leading-relaxed">Your interview has been submitted to the hiring team</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 h-8 w-8 bg-[#8BA88E]/30 text-[#2D3436] rounded-full flex items-center justify-center font-semibold">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium text-[#2D3436]">Review</h4>
                        <p className="text-sm text-[#2D3436]/70 leading-relaxed">The team will review your responses within 5-7 business days</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 h-8 w-8 bg-[#8BA88E]/30 text-[#2D3436] rounded-full flex items-center justify-center font-semibold">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium text-[#2D3436]">Decision</h4>
                        <p className="text-sm text-[#2D3436]/70 leading-relaxed">You'll receive an email with next steps or feedback</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#8BA88E]/10 p-6 rounded-2xl border border-[#8BA88E]/20 text-center">
                  <p className="text-[#2D3436]/70 leading-relaxed">
                    Check your dashboard for updates on your application status
                  </p>
                </div>
              </CardContent>
              <CardFooter className="px-8 pb-8 pt-2">
                <Button
                  className="w-full h-12 bg-[#8BA88E] hover:bg-[#7A9A7D] text-white rounded-2xl text-base font-medium"
                >
                  Go to Dashboard
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
