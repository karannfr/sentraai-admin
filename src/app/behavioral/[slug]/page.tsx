"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

import { ChevronDown } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import BannedIP from "@/model/bannedIP";

interface SanitizationLog {
  truncated_in: boolean;
  removed_zero_width: number;
  unicode_nfkc: boolean;
  homoglyph_folds: number;
  decoded?: string;
  clamped_runs: boolean;
  truncated_out: boolean;
  sanitizedAndDeobfuscated: boolean;
}

interface Classification {
  label: string;
  category?: string | null;
  confidence: number;
  reason: string;
  excerpt?: string;
}

interface ChatHistoryItem {
  role: string;
  content: string;
}

interface ChatData {
  ipAddress: string;
  rawMessage: string;
  cleanedMessage: string;
  sanitizationLog: SanitizationLog;
  generatedResponse: string;
  classification: Classification;
  chatHistory: ChatHistoryItem[];
  thread_id: string;
  createdAt: string;
  updatedAt: string;
}

interface BannedIP {
    ipAddress: string;
    createdAt: string;
    updatedAt: string;
}

export default function ThreadPage() {
  const params = useParams();
  const thread_id = params?.slug;
  const [chat, setChat] = useState<ChatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [banned, setBanned] = useState(false);

  const banIP = async () => {
    const response = await axios.post("/api/ban", {ip : chat?.ipAddress})
    if(response.status == 400 || response.status == 500){
        toast.error(response.data.message || "Something Went Wrong!!")
        return;
    }
    toast.success(response.data.message || "IP Banned")
    setBanned(curr => !curr);
  } 

  const unbanIP = async () => {
    const response = await axios.post("/api/unban", {ip : chat?.ipAddress})
    if(response.status == 400 || response.status == 500){
        toast.error(response.data.message || "Something Went Wrong!!")
        return;
    }
    toast.success(response.data.message || "IP Unbanned")
    setBanned(curr => !curr);
  } 

  useEffect(() => {
    if (!thread_id) return;

    async function fetchChat() {
      try {
        const res = await axios.get(`/api/behavioral/${thread_id}`);
        setChat(res.data.chat);
        const bannedIps = await axios.get("/api/ban");
        bannedIps.data.data.forEach((element : BannedIP) => {
            if(element.ipAddress === res.data.chat.ipAddress)
                setBanned(true);
        })
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchChat();
  }, [thread_id]);

  const renderBoolean = (value: boolean) =>
    value ? <Badge variant="default" className="text-lg px-3 py-1">True</Badge> : <Badge variant="destructive" className="text-lg px-3 py-1">False</Badge>;


  if (loading) return <p className="p-8 text-center text-xl font-medium">Loading chat details...</p>;
  if (!chat) return <p className="p-8 text-center text-xl font-medium">No chat found</p>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
    <Toaster position="top-right" reverseOrder={false}/>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-4xl md:text-3xl font-bold tracking-tight">Thread: {chat.thread_id}</h1>
        <div>
          {banned ? (<Button variant="destructive" size="lg" className="text-lg px-5 py-2 cursor-pointer" onClick={() => {unbanIP();}}>
            UnBan IP
          </Button>) : 
          (<Button variant="destructive" size="lg" className="text-lg px-5 py-2 cursor-pointer" onClick={() => {banIP();}}>
            Ban IP
          </Button>)
          }
        </div>
      </div>

      {/* Basic Info */}
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-semibold">Basic Info</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 text-base md:text-lg">
          <p><span className="font-semibold">IP Address:</span> {chat.ipAddress}</p>
          <p><span className="font-semibold">Created At:</span> {new Date(chat.createdAt).toLocaleString()}</p>
          <p><span className="font-semibold">Updated At:</span> {new Date(chat.updatedAt).toLocaleString()}</p>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-semibold">Messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-base md:text-lg">
          <p><span className="font-semibold">Raw Message:</span> {chat.rawMessage}</p>
          <p><span className="font-semibold">Cleaned Message:</span> {chat.cleanedMessage}</p>
        </CardContent>
      </Card>

      {/* Sanitization Log */}
      <Accordion type="single" collapsible>
        <AccordionItem value="sanitization">
          <AccordionTrigger className="text-xl md:text-2xl font-semibold">Sanitization Log</AccordionTrigger>
          <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3 text-base md:text-lg">
            <p>Truncated In: {renderBoolean(chat.sanitizationLog.truncated_in)}</p>
            <p>Removed Zero Width: <Badge variant="secondary" className="text-lg px-3 py-1">{chat.sanitizationLog.removed_zero_width}</Badge></p>
            <p>Unicode NFKC: {renderBoolean(chat.sanitizationLog.unicode_nfkc)}</p>
            <p>Homoglyph Folds: <Badge variant="secondary" className="text-lg px-3 py-1">{chat.sanitizationLog.homoglyph_folds}</Badge></p>
            <p>Decoded: <span className="text-base md:text-lg">{chat.sanitizationLog.decoded || "-"}</span></p>
            <p>Clamped Runs: {renderBoolean(chat.sanitizationLog.clamped_runs)}</p>
            <p>Truncated Out: {renderBoolean(chat.sanitizationLog.truncated_out)}</p>
            <p>Sanitized & Deobfuscated: {renderBoolean(chat.sanitizationLog.sanitizedAndDeobfuscated)}</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Classification */}
      <Accordion type="single" collapsible>
        <AccordionItem value="classification">
          <AccordionTrigger className="text-xl md:text-2xl font-semibold">Classification</AccordionTrigger>
          <AccordionContent className="space-y-3 mt-3 text-base md:text-lg">
            <p><span className="font-semibold">Label:</span> {chat.classification.label}</p>
            <p><span className="font-semibold">Category:</span> {chat.classification.category || "-"}</p>
            <p><span className="font-semibold">Confidence:</span> <Badge variant="secondary" className="text-lg px-3 py-1">{chat.classification.confidence.toFixed(2)}</Badge></p>
            <p><span className="font-semibold">Reason:</span> {chat.classification.reason}</p>
            {chat.classification.excerpt && <p><span className="font-semibold">Excerpt:</span> {chat.classification.excerpt}</p>}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Chat History */}
      <Accordion type="single" collapsible>
        <AccordionItem value="history">
          <AccordionTrigger className="text-xl md:text-2xl font-semibold">Chat History</AccordionTrigger>
          <AccordionContent className="mt-3 space-y-3">
            {chat.chatHistory.length === 0 ? (
              <p className="text-lg">No history available</p>
            ) : (
              chat.chatHistory.map((item, idx) => (
                <Card key={idx} className="bg-muted border border-gray-200 dark:border-gray-700 shadow-sm">
                  <CardContent className="space-y-2 text-base md:text-lg">
                    <p><span className="font-semibold">Role:</span> <Badge variant="secondary" className="text-lg px-3 py-1">{item.role}</Badge></p>
                    <p><span className="font-semibold">Content:</span> {item.content}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Generated Response */}
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-semibold">Generated Response</CardTitle>
        </CardHeader>
        <CardContent className="text-base md:text-lg">{chat.generatedResponse}</CardContent>
      </Card>
    </div>
  );
}
