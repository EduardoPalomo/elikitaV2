// components/CompactPatientConsultation.tsx

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Loader2,
  Mic,
  Globe,
  Printer,
  VolumeIcon,
  Volume2Icon,
  Lightbulb,
  Send,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axios from 'axios';

// Import Recharts components for charts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface LabResult {
  date: string;
  cholesterol: number;
  bloodSugar: number;
  creatinine: number;
}

interface VitalSign {
  date: string;
  heartRate: number;
  bloodPressure: number;
  temperature: number;
}

interface PatientData {
  name: string;
  age: number;
  gender: string;
  currentConsultation: {
    [key: string]: string;
  };
  medicalHistory: Array<{ date: string; diagnosis: string; treatment: string }>;
  allergies: string[];
  medications: string[];
  vitalSigns: VitalSign[];
  labResults: LabResult[];
}

const initialPatientData: PatientData = {
  name: 'John Doe',
  age: 35,
  gender: 'Male',
  currentConsultation: {
    chiefcomplaint: '',
    symptoms: '',
    examination: '',
    diagnosis: '',
    treatmentplan: '',
    druginteractioncheck: '',
  },
  medicalHistory: [
    {
      date: '2022-05-15',
      diagnosis: 'Hypertension',
      treatment: 'Prescribed lisinopril',
    },
    {
      date: '2021-11-03',
      diagnosis: 'Type 2 Diabetes',
      treatment: 'Dietary changes and metformin',
    },
  ],
  allergies: ['Penicillin', 'Peanuts'],
  medications: ['Lisinopril 10mg daily', 'Metformin 500mg twice daily'],
  vitalSigns: [
    { date: '2023-01-01', heartRate: 72, bloodPressure: 120, temperature: 98.6 },
    { date: '2023-02-01', heartRate: 75, bloodPressure: 118, temperature: 98.4 },
    { date: '2023-03-01', heartRate: 70, bloodPressure: 122, temperature: 98.7 },
    { date: '2023-04-01', heartRate: 73, bloodPressure: 121, temperature: 98.5 },
  ],
  labResults: [
    { date: '2023-01-01', cholesterol: 180, bloodSugar: 95, creatinine: 0.9 },
    { date: '2023-02-01', cholesterol: 175, bloodSugar: 92, creatinine: 0.8 },
    { date: '2023-03-01', cholesterol: 190, bloodSugar: 98, creatinine: 0.9 },
    { date: '2023-04-01', cholesterol: 172, bloodSugar: 90, creatinine: 0.7 },
  ],
};

// Modify the translateText function to use Azure Translator
const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  const subscriptionKey = process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_KEY;
  const endpoint = process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_ENDPOINT;
  const location = process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_LOCATION;

  const response = await axios.post(
    `${endpoint}/translate?api-version=3.0&to=${targetLanguage}`,
    [{ Text: text }],
    {
      headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Ocp-Apim-Subscription-Region': location,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data[0].translations[0].text;
};

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ha', name: 'Hausa' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'ig', name: 'Igbo' },
];

export default function CompactPatientConsultation() {
  const [aiEnabled, setAiEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [patientData, setPatientData] = useState<PatientData>(initialPatientData);
  const [aiResponses, setAiResponses] = useState<Record<string, string>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState('patient-info');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translatedContent, setTranslatedContent] = useState<Record<string, string>>({});
  const [selectedLabTest, setSelectedLabTest] = useState<keyof LabResult>('cholesterol');
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

  const [aiAnalysisReport, setAiAnalysisReport] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [maximizedTextarea, setMaximizedTextarea] = useState<string | null>(null);

  const steps = [
    { key: 'chiefcomplaint', label: 'Chief Complaint' },
    { key: 'symptoms', label: 'Symptoms' },
    { key: 'examination', label: 'Examination' },
    { key: 'diagnosis', label: 'Diagnosis' },
    { key: 'treatmentplan', label: 'Treatment Plan' },
    { key: 'druginteractioncheck', label: 'Drug Interaction Check' },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
    }
  }, []);

  const updateConsultationData = (key: string, value: string) => {
    setPatientData((prev) => ({
      ...prev,
      currentConsultation: {
        ...prev.currentConsultation,
        [key]: value,
      },
    }));
  };

  const handleVoiceInput = (key: string) => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      updateConsultationData(
        key,
        patientData.currentConsultation[key] + ' [Voice input transcription]'
      );
      toast({
        title: 'Voice Input Processed',
        description:
          'Your voice input has been transcribed and added to the consultation.',
      });
    }, 3000);
  };

  const handleLanguageChange = async (langCode: string) => {
    setCurrentLanguage(langCode);
    if (langCode !== 'en') {
      setIsLoading(true);
      const translatedData: Record<string, string> = {};
      for (const [key, value] of Object.entries(patientData.currentConsultation)) {
        translatedData[key] = await translateText(value, langCode);
      }
      // Translate AI responses
      for (const [key, value] of Object.entries(aiResponses)) {
        translatedData[`ai_${key}`] = await translateText(value, langCode);
      }
      // Translate AI Analysis Report
      if (aiAnalysisReport) {
        translatedData['ai_analysis_report'] = await translateText(aiAnalysisReport, langCode);
      }
      setTranslatedContent(translatedData);
      setIsLoading(false);
    } else {
      setTranslatedContent({});
    }
  };

  const handlePrintReport = () => {
    toast({
      title: 'Printing Report',
      description: 'Generating PDF report of patient information and charts.',
    });
    // Implement actual PDF generation and printing logic here
  };

  const handleSendReport = () => {
    toast({
      title: 'Sending Report',
      description: 'Preparing to send the patient report...',
    });
    // Implement actual report sending logic here
  };

  const handleTextToSpeech = (key: string) => {
    if (speechSynthesisRef.current) {
      if (isSpeaking === key) {
        speechSynthesisRef.current.cancel();
        setIsSpeaking(null);
      } else {
        speechSynthesisRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(
          currentLanguage === 'en'
            ? patientData.currentConsultation[key]
            : translatedContent[key] || ''
        );
        utterance.lang = currentLanguage;
        utterance.onend = () => setIsSpeaking(null);
        speechSynthesisRef.current.speak(utterance);
        setIsSpeaking(key);
      }
    } else {
      toast({
        title: 'Text-to-Speech Unavailable',
        description: 'Your browser does not support text-to-speech functionality.',
        variant: 'destructive',
      });
    }
  };

  const handleGetAISuggestionsForSection = async (key: string) => {
    if (aiEnabled) {
      setIsLoading(true);
      try {
        const response = await fetch('/api/get-ai-suggestions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ section: key, patientData }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch AI suggestions');
        }

        const data = await response.json();
        console.log('Raw API response:', data); // Log the raw response

        if (data.suggestion) {
          setAiResponses((prev) => ({
            ...prev,
            [key]: data.suggestion,
          }));
        } else {
          throw new Error('Unexpected response format');
        }
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error fetching AI suggestions:', error);
        setIsLoading(false);
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch AI suggestions. Please try again.',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'AI Assistance Disabled',
        description: 'Please enable AI assistance to get suggestions.',
        variant: 'destructive',
      });
    }
  };

  const handleGetAIAnalysis = async () => {
    if (aiEnabled) {
      setIsAnalyzing(true);
      try {
        const response = await fetch('/api/ai-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ patientData }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to perform AI Analysis');
        }

        const data = await response.json();

        setAiAnalysisReport(data.analysisReport);
        setIsAnalyzing(false);
      } catch (error: any) {
        console.error('Error performing AI Analysis:', error);
        setIsAnalyzing(false);
        toast({
          title: 'Error',
          description: error.message || 'Failed to perform AI Analysis. Please try again.',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'AI Assistance Disabled',
        description: 'Please enable AI assistance to perform AI Analysis.',
        variant: 'destructive',
      });
    }
  };

  const toggleMaximize = (key: string) => {
    setMaximizedTextarea(maximizedTextarea === key ? null : key);
  };

  // Custom Tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow">
          <p className="text-sm font-bold">{`Date: ${label}`}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: pld.color }}>
              {`${pld.name}: ${pld.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col bg-gradient-to-br from-blue-100 to-green-100">
      <div className="flex justify-between items-center mb-4 bg-gradient-to-r from-blue-600 to-green-600 p-4 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-white">e-Likita: Smart Consultation</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch id="ai-mode" checked={aiEnabled} onCheckedChange={setAiEnabled} />
            <Label htmlFor="ai-mode" className="text-white">
              AI Assistance
            </Label>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-blue-700 border-none hover:bg-blue-100"
              >
                <Globe className="h-4 w-4 mr-2" />
                Translate
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onSelect={() => handleLanguageChange(lang.code)}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mb-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg">
          <TabsTrigger
            value="patient-info"
            className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-700"
          >
            Patient Info
          </TabsTrigger>
          <TabsTrigger
            value="consultation"
            className="text-white data-[state=active]:bg-white data-[state=active]:text-green-700"
          >
            Consultation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patient-info" className="flex-1 overflow-hidden">
          <Card className="h-full flex flex-col bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500">
              <CardTitle className="text-white">Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <ScrollArea className="h-full pr-4">
                {/* Personal Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Personal Information</h3>
                  <p>
                    <strong>Name:</strong> {patientData.name}
                  </p>
                  <p>
                    <strong>Age:</strong> {patientData.age}
                  </p>
                  <p>
                    <strong>Gender:</strong> {patientData.gender}
                  </p>
                </div>
                {/* Medical History */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Medical History</h3>
                  <ul className="list-disc pl-5">
                    {patientData.medicalHistory.map((item, index) => (
                      <li key={index}>
                        {item.date}: {item.diagnosis} - {item.treatment}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Allergies */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Allergies</h3>
                  <ul className="list-disc pl-5">
                    {patientData.allergies.map((allergy, index) => (
                      <li key={index}>{allergy}</li>
                    ))}
                  </ul>
                </div>
                {/* Current Medications */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Current Medications</h3>
                  <ul className="list-disc pl-5">
                    {patientData.medications.map((medication, index) => (
                      <li key={index}>{medication}</li>
                    ))}
                  </ul>
                </div>
                {/* Vital Signs Over Time */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Vital Signs Over Time</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={patientData.vitalSigns}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {/* Lab Test Results */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Lab Test Results</h3>
                  <Select onValueChange={(value: string) => setSelectedLabTest(value as keyof LabResult)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select test" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cholesterol">Cholesterol</SelectItem>
                      <SelectItem value="bloodSugar">Blood Sugar</SelectItem>
                      <SelectItem value="creatinine">Creatinine</SelectItem>
                    </SelectContent>
                  </Select>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={patientData.labResults}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultation" className="flex-1 overflow-hidden">
          <Card className="h-full flex flex-col bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 flex flex-row justify-between items-center">
              <CardTitle className="text-white">Consultation</CardTitle>
              <div className="flex space-x-2">
                <Button
                  onClick={handleSendReport}
                  variant="outline"
                  size="sm"
                  className="bg-white text-green-700 hover:bg-green-100"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Report
                </Button>
                <Button
                  onClick={handlePrintReport}
                  variant="outline"
                  size="sm"
                  className="bg-white text-green-700 hover:bg-green-100"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Report
                </Button>
                <Button
                  onClick={handleGetAIAnalysis}
                  variant="outline"
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Lightbulb className="h-4 w-4 mr-2" />
                  )}
                  AI Analysis
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <ScrollArea className="h-full pr-4">
                {steps.map((step) => (
                  <div key={step.key} className="mb-6">
                    <Label
                      htmlFor={step.key}
                      className="mb-1 block text-lg font-medium text-blue-800"
                    >
                      {step.label}
                    </Label>
                    {/* User Input Textarea */}
                    <div className="relative">
                      <Textarea
                        id={step.key}
                        placeholder={`Enter ${step.label}`}
                        value={
                          currentLanguage === 'en'
                            ? patientData.currentConsultation[step.key]
                            : translatedContent[step.key] || ''
                        }
                        onChange={(e) => updateConsultationData(step.key, e.target.value)}
                        className={`mb-2 bg-white border-blue-300 focus:border-green-500 focus:ring-green-500 ${
                          maximizedTextarea === step.key ? 'h-96' : 'h-24'
                        }`}
                        readOnly={currentLanguage !== 'en'}
                      />
                      <Button
                        onClick={() => toggleMaximize(step.key)}
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 bg-white"
                      >
                        {maximizedTextarea === step.key ? (
                          <Minimize2 className="h-4 w-4" />
                        ) : (
                          <Maximize2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="flex space-x-2 mb-2">
                      <Button
                        onClick={() => handleVoiceInput(step.key)}
                        disabled={isRecording || currentLanguage !== 'en'}
                        variant="outline"
                        size="sm"
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        {isRecording ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Mic className="h-4 w-4" />
                        )}
                        {isRecording ? 'Recording...' : 'Voice Input'}
                      </Button>
                      <Button
                        onClick={() => handleTextToSpeech(step.key)}
                        variant="outline"
                        size="sm"
                        className={`${
                          isSpeaking === step.key ? 'bg-green-700' : 'bg-green-600'
                        } text-white hover:bg-green-700`}
                      >
                        {isSpeaking === step.key ? (
                          <Volume2Icon className="h-4 w-4" />
                        ) : (
                          <VolumeIcon className="h-4 w-4" />
                        )}
                        {isSpeaking === step.key ? 'Stop' : 'Read Aloud'}
                      </Button>
                      <Button
                        onClick={() => handleGetAISuggestionsForSection(step.key)}
                        variant="outline"
                        size="sm"
                        className="bg-blue-600 text-white hover:bg-blue-700"
                        disabled={isLoading || currentLanguage !== 'en'}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Lightbulb className="h-4 w-4" />
                        )}
                        AI Suggestions
                      </Button>
                    </div>
                    {/* AI Response Textarea */}
                    <div className="mt-2">
                      <Label className="block text-sm font-medium text-blue-800">
                        AI Response
                      </Label>
                      <div className="relative">
                        <Textarea
                          value={
                            currentLanguage === 'en'
                              ? aiResponses[step.key] || ''
                              : translatedContent[`ai_${step.key}`] || ''
                          }
                          readOnly
                          className={`bg-gray-100 border-blue-300 ${
                            maximizedTextarea === `ai_${step.key}` ? 'h-96' : 'h-24'
                          }`}
                        />
                        <Button
                          onClick={() => toggleMaximize(`ai_${step.key}`)}
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2 bg-white"
                        >
                          {maximizedTextarea === `ai_${step.key}` ? (
                            <Minimize2 className="h-4 w-4" />
                          ) : (
                            <Maximize2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Display AI Analysis Report at the bottom */}
                {aiAnalysisReport && (
                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-blue-800 mb-2">AI Analysis Report</h3>
                    <div className="bg-gray-100 p-4 rounded-md">
                      <pre className="whitespace-pre-wrap">
                        {currentLanguage === 'en'
                          ? aiAnalysisReport
                          : translatedContent['ai_analysis_report'] || aiAnalysisReport}
                      </pre>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
