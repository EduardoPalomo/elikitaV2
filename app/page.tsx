'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Activity, Brain, Clock, Globe, Heart, MessageCircle, Microscope, Stethoscope, Users } from 'lucide-react'

// Animations
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

const staggerChildren = {
  animate: { transition: { staggerChildren: 0.1 } }
}

function Header() {
  console.log("Header component is rendering");

  return (
    <motion.header 
      className="sticky top-0 z-50 bg-white shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center h-20">
        <div className="flex items-center h-full">
          <div className="w-24 h-full relative">
            <Image 
              src="/e-likita.jpg" 
              alt="e-Likita Logo" 
              layout="fill"
              objectFit="contain"
              className="rounded-md"
            />
          </div>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <motion.a href="#benefits" className="text-sky-600 hover:text-sky-800" whileHover={{ scale: 1.1 }}>Benefits</motion.a>
          <motion.a href="#how-it-works" className="text-sky-600 hover:text-sky-800" whileHover={{ scale: 1.1 }}>How It Works</motion.a>
          <motion.a href="#testimonials" className="text-sky-600 hover:text-sky-800" whileHover={{ scale: 1.1 }}>Testimonials</motion.a>
          
          {/* Chat AI button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/protected/chat" className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-sky-600" />
              <span className="text-sky-600 hover:text-sky-800">Chat AI</span>
            </Link>
          </motion.div>

          {/* New Consultation button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/consultation" className="flex items-center space-x-2">
              <Stethoscope className="h-5 w-5 text-sky-600" />
              <span className="text-sky-600 hover:text-sky-800">Consultation</span>
            </Link>
          </motion.div>

          {/* New Patients button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/patients" className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-sky-600" />
              <span className="text-sky-600 hover:text-sky-800">Patients</span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/sign-in" className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-sky-600"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" x2="3" y1="12" y2="12" />
              </svg>
              <span className="text-sky-600 hover:text-sky-800">Sign In</span>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/sign-up" className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-sky-600"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" x2="19" y1="8" y2="14" />
                <line x1="22" x2="16" y1="11" y2="11" />
              </svg>
              <span className="text-sky-600 hover:text-sky-800">Sign Up</span>
            </Link>
          </motion.div>
        </nav>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden md:block">
          <Button className="bg-sky-500 hover:bg-sky-600 text-white">Get Started</Button>
        </motion.div>
        <div className="md:hidden flex items-center space-x-4">
          <Link href="/sign-in" className="text-sky-600 hover:text-sky-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" x2="3" y1="12" y2="12" />
            </svg>
          </Link>
          <Link href="/signup" className="text-sky-600 hover:text-sky-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" x2="19" y1="8" y2="14" />
              <line x1="22" x2="16" y1="11" y2="11" />
            </svg>
          </Link>
          <Link href="/protected/chat" className="text-sky-600 hover:text-sky-800">
            <MessageCircle className="h-6 w-6" />
          </Link>
          <Link href="/consultation" className="text-sky-600 hover:text-sky-800">
            <Stethoscope className="h-6 w-6" />
          </Link>
          <Link href="/patients" className="text-sky-600 hover:text-sky-800">
            <Users className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </motion.header>
  )
}

function Hero() {
  return (
    <motion.section 
      className="py-20 bg-gradient-to-r from-sky-400 to-emerald-400 text-white overflow-hidden"
      initial="initial"
      animate="animate"
      variants={staggerChildren}
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center relative">
        <motion.div 
          className="md:w-1/2 md:pr-8 text-center md:text-left"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Empowering Healthcare with AI</h1>
          <p className="text-xl mb-8">Enhance medical capabilities in rural Africa with e-Likita's AI Healthcare Agents</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-white text-sky-600 hover:bg-sky-100">Learn More</Button>
          </motion.div>
        </motion.div>
        <motion.div 
          className="md:w-1/2 mt-10 md:mt-0 relative"
          variants={fadeInUp}
        >
          <motion.div
            className="absolute inset-0 bg-sky-200 rounded-full opacity-50 blur-3xl"
            animate={{
              scale: [1, 1.05, 1],
              transition: { duration: 2, repeat: Infinity }
            }}
          />
          <Image 
            src="/e-likita.jpg" 
            alt="AI Healthcare Illustration" 
            width={400} 
            height={400} 
            className="rounded-lg shadow-2xl relative z-10 mx-auto"
          />
        </motion.div>
      </div>
    </motion.section>
  )
}

function Benefits() {
  const benefits = [
    { title: "Enhanced Diagnosis", description: "AI-powered assistance for accurate and timely diagnoses", icon: Microscope },
    { title: "Knowledge Access", description: "Instant access to vast medical resources and up-to-date information", icon: Brain },
    { title: "Improved Patient Care", description: "Personalized treatment plans based on AI analysis", icon: Heart },
    { title: "Time Efficiency", description: "Streamlined processes for quicker patient consultations", icon: Clock },
  ]

  return (
    <motion.section 
      id="benefits"
      className="py-20 bg-sky-50 relative overflow-hidden"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      variants={staggerChildren}
    >
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2 className="text-3xl font-bold text-center mb-12" variants={fadeInUp}>Benefits of e-Likita</motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="p-6 h-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 bg-sky-100 rounded-full flex items-center justify-center text-sky-600"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <benefit.icon size={32} />
                </motion.div>
                <h3 className="text-xl font-semibold mb-4 text-sky-700 text-center">{benefit.title}</h3>
                <p className="text-sky-600 text-center">{benefit.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

function HowItWorks() {
  const steps = [
    { title: "Input Patient Data", description: "Enter patient information and symptoms into e-Likita", icon: Users },
    { title: "AI Analysis", description: "Our AI agent processes the data using advanced algorithms", icon: Brain },
    { title: "Diagnosis Suggestion", description: "Receive AI-generated diagnosis suggestions and treatment options", icon: Stethoscope },
    { title: "Practitioner Review", description: "Healthcare professional reviews and confirms the AI recommendations", icon: Activity },
  ]

  return (
    <motion.section 
      id="how-it-works"
      className="py-20 bg-gradient-to-b from-sky-100 to-white relative overflow-hidden"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      variants={staggerChildren}
    >
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2 className="text-3xl font-bold text-center mb-12" variants={fadeInUp}>How e-Likita Works</motion.h2>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          {steps.map((step, index) => (
            <motion.div key={index} className="flex flex-col items-center text-center mb-8 md:mb-0" variants={fadeInUp}>
              <motion.div 
                className="w-20 h-20 bg-sky-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <step.icon size={36} />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-sky-700">{step.title}</h3>
              <p className="text-sky-600 max-w-xs">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

function Testimonials() {
  const testimonials = [
    { name: "Dr. Amina Kone", role: "Community Health Officer", quote: "e-Likita has revolutionized how we provide healthcare in our rural clinic. It's like having a team of specialists at our fingertips." },
    { name: "Kwame Osei", role: "Patient", quote: "Thanks to e-Likita, I received an accurate diagnosis and treatment plan quickly, even though I live far from any major hospital." },
    { name: "Nurse Fatima Diallo", role: "Community Health Extension Worker", quote: "The AI agent's ability to suggest relevant questions has greatly improved our patient consultations and outcomes." },
  ]

  return (
    <motion.section 
      id="testimonials"
      className="py-20 bg-sky-50 relative overflow-hidden"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      variants={staggerChildren}
    >
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2 className="text-3xl font-bold text-center mb-12" variants={fadeInUp}>What People Are Saying</motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="p-6 h-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <motion.div
                  className="mb-4 text-sky-500"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 * index }}
                >
                  <MessageCircle size={32} />
                </motion.div>
                <p className="text-sky-600 mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-sky-200 rounded-full mr-4 flex items-center justify-center">
                    <Users size={24} className="text-sky-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sky-700">{testimonial.name}</h4>
                    <p className="text-sky-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

function CallToAction() {
  return (
    <motion.section 
      className="py-20 bg-gradient-to-r from-sky-500 to-emerald-500 text-white relative overflow-hidden"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      variants={staggerChildren}
    >
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h2 className="text-3xl font-bold mb-6" variants={fadeInUp}>Ready to Transform Healthcare in Rural Africa?</motion.h2>
        <motion.p className="text-xl mb-8 max-w-2xl mx-auto" variants={fadeInUp}>
          Join e-Likita in our mission to bring advanced AI-powered healthcare to those who need it most.
        </motion.p>
        <motion.div variants={fadeInUp}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="bg-white text-sky-600 hover:bg-sky-100 text-lg px-8 py-3">Get Started Now</Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}

function Footer() {
  return (
    <footer className="bg-sky-900 text-sky-100 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <p className="text-sm">Empowering healthcare practitioners in rural Africa with AI-powered solutions.</p>
          </div>
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-sky-300 flex items-center"><Globe size={16} className="mr-2" /> Home</a></li>
              <li><a href="#benefits" className="hover:text-sky-300 flex items-center"><Heart size={16} className="mr-2" /> Benefits</a></li>
              <li><a href="#how-it-works" className="hover:text-sky-300 flex items-center"><Activity size={16} className="mr-2" /> How It Works</a></li>
              <li><a href="#testimonials" className="hover:text-sky-300 flex items-center"><MessageCircle size={16} className="mr-2" /> Testimonials</a></li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-sm flex items-center"><MessageCircle size={16} className="mr-2" /> Email: info@e-likita.com</p>
            <p className="text-sm flex items-center"><Globe size={16} className="mr-2" /> Phone: +123 456 7890</p>
          </div>
          <div className="w-full md:w-1/4">
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-sky-100 hover:text-sky-300"><Globe size={24} /></a>
              <a href="#" className="text-sky-100 hover:text-sky-300"><MessageCircle size={24} /></a>
              <a href="#" className="text-sky-100 hover:text-sky-300"><Users size={24} /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-sky-700 flex justify-between items-center">
          <div className="w-24 h-10 relative">
            <Image 
              src="/e-likita.jpg" 
              alt="e-Likita Logo" 
              layout="fill"
              objectFit="contain"
              className="rounded-md"
            />
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} e-Likita. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-sky-900">
      <Header />
      <Hero />
      <Benefits />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  )
}