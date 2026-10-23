'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  ShoppingCart,
  ArrowRight,
  ExternalLink,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  recommendedProducts?: Product[];
  actionPrompt?: string;
}

export const AiAdvisorModal: React.FC = () => {
  const {
    aiAssistantOpen,
    setAiAssistantOpen,
    products,
    addToCart,
    navigateTo,
    storeConfig
  } = useStore();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I am **Dagdi PowerGenius**, your electrical & power automation technical assistant. 
How can I assist your project today? I can help you with:
- Selecting the right **welding electrode** (E7018 vs 6013 vs MIG wire)
- Sizing **APFC panels** for your plant motor load
- Choosing **enameled copper wire gauge (SWG)** for motor rewinding
- **Submersible pump cables** and 11kV HT switchgear specifications.`,
      actionPrompt: 'Ask a question or tap a popular engineering query below:'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (aiAssistantOpen) {
      scrollToBottom();
    }
  }, [messages, aiAssistantOpen]);

  if (!aiAssistantOpen) return null;

  // Domain Rule & Knowledge Matching
  const processQuery = (userText: string) => {
    const text = userText.toLowerCase();
    let responseText = '';
    let matches: Product[] = [];

    if (text.includes('welding') || text.includes('electrode') || text.includes('rod') || text.includes('7018') || text.includes('6013') || text.includes('mig')) {
      if (text.includes('heavy') || text.includes('structure') || text.includes('7018') || text.includes('boiler') || text.includes('pressure')) {
        matches = products.filter((p) => p.sku.includes('E7018') || p.sku.includes('7018'));
        responseText = `For heavy structural fabrication, pressure vessels, and critical joints requiring high impact strength and crack resistance, **Ador Super-6 E7018 (3.15mm)** or **D&H 7018 (4.0mm)** low-hydrogen basic electrodes are the industry benchmark. They provide radiographic quality welds conforming to AWS A5.1. Both are in stock at our Beawar godown with 18% GST invoicing.`;
      } else if (text.includes('gate') || text.includes('grill') || text.includes('general') || text.includes('6013') || text.includes('sheet')) {
        matches = products.filter((p) => p.sku.includes('6013'));
        responseText = `For general purpose mild steel fabrication, grills, gates, and sheet metal fabrication, **D&H 6013 (3.15mm)** is the most versatile and economical choice. It offers smooth all-position arc restriking and easy self-peeling slag.`;
      } else if (text.includes('mig') || text.includes('co2') || text.includes('wire')) {
        matches = products.filter((p) => p.subcategory.includes('MIG'));
        responseText = `For high-speed semi-automatic or robotic welding, we stock **Ador ER70S-6 1.2mm CO2 MIG Wire (15kg plastic spools)** with uniform copper coating to prevent liner wear and tip clogging.`;
      } else {
        matches = products.filter((p) => p.category === 'welding-solutions').slice(0, 3);
        responseText = `Here are our top authorized welding consumables from Ador Welding and D&H Secheron:`;
      }
    } else if (text.includes('apfc') || text.includes('panel') || text.includes('power factor') || text.includes('penalty') || text.includes('kvar')) {
      matches = products.filter((p) => p.category === 'panels-switchgear' && p.subcategory === 'APFC Panels');
      responseText = `To eliminate DISCOM penalty surcharges and raise power factor above 0.98, Dagdi custom fabricates **150 kVAR (12-step)** and **60 kVAR (6-step)** APFC panels in Beawar using Entes/Multispan digital controllers and Momaya heavy-duty MPP box capacitors. Built inside IP54 powder-coated CRCA steel enclosures with ETP electrolytic copper busbars.`;
    } else if (text.includes('copper') || text.includes('wire') || text.includes('swg') || text.includes('rewind') || text.includes('winding')) {
      matches = products.filter((p) => p.category === 'wires-cables' || p.category === 'motors-rewinding').slice(0, 3);
      responseText = `For motor rewinding, we supply **Milan Super Enameled Copper Wire (SWG 21, Class H 200°C)** made with 99.99% pure electrolytic tough pitch (ETP) copper with >101% IACS conductivity. We also supply water-sealed BOPP poly-wrapped wire for submersible pumps and KEI 3-core flat power cables.`;
    } else if (text.includes('motor') || text.includes('pump') || text.includes('induction') || text.includes('hp')) {
      matches = products.filter((p) => p.category === 'motors-rewinding');
      responseText = `Dagdi manufactures and supplies **15 HP 3-Phase AC Induction Motors (1440 RPM, Class F, IE3)** and **7.5 HP V6 Submersible Borewell Pump Motors**. In addition, our Beawar workshop provides full stator rewinding and dynamic rotor balancing services.`;
    } else if (text.includes('meter') || text.includes('amp') || text.includes('volt') || text.includes('multispan')) {
      matches = products.filter((p) => p.category === 'meters-instruments');
      responseText = `We are an authorized distributor for **Multispan digital microprocessor meters** (AMP19 ammeter with programmable CT ratio and VLT19 true RMS voltmeter) and **Entes RG3-12CS 12-step APFC relays**.`;
    } else if (text.includes('gst') || text.includes('bill') || text.includes('tax') || text.includes('invoice')) {
      responseText = `Yes! All purchases from Dagdi Electric Motor Rewinding Works come with official GST Tax Invoices (GSTIN: **${storeConfig.gstin}**) with proper HSN codes. B2B purchasers and contractors receive 100% eligible Input Tax Credit (ITC).`;
    } else if (text.includes('address') || text.includes('location') || text.includes('where') || text.includes('shop')) {
      responseText = `Our workshop & sales godown is located at:
**Near Tejaji Ka Than, Chhawani, Beawar, District Ajmer, Rajasthan - 305901**.
Phone: ${storeConfig.phone1} / ${storeConfig.phone2}. We dispatch daily across Ajmer, Kishangarh, Jaipur, Jodhpur, Bhilwara, and Pan-India.`;
    } else {
      matches = products.filter((p) => p.featured).slice(0, 2);
      responseText = `I understand you are asking about "${userText}". As Dagdi's technical advisor, I recommend exploring our certified product catalogue or connecting directly with our senior engineer Sandesh Dagdi Saini for custom panel engineering or bulk contractor pricing.`;
    }

    return { responseText, matches };
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const { responseText, matches } = processQuery(query);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        recommendedProducts: matches
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const sampleQueries = [
    'Which welding electrode for heavy structural fabrication?',
    'What APFC panel size do I need for 100 HP motor load?',
    'Do you supply Milan copper winding wire SWG 21?',
    'How do I book heavy motor rewinding in Beawar?',
    'Are your invoices GST tax credit compliant?'
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1080,
        backgroundColor: 'rgba(7, 14, 32, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={() => setAiAssistantOpen(false)}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '680px',
          width: '100%',
          height: '620px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#0b1b3d',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div className="flex items-center gap-3">
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #0066ff, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} color="#ffffff" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '16px', fontWeight: 800 }}>Dagdi PowerGenius</span>
                <span className="badge badge-amber" style={{ fontSize: '9px', padding: '1px 6px' }}>AI ADVISOR</span>
              </div>
              <p style={{ fontSize: '11px', color: '#93c5fd', margin: 0 }}>
                Trained on Dagdi catalogue, IEEE/IS electrical standards & workshop knowledge
              </p>
            </div>
          </div>
          <button onClick={() => setAiAssistantOpen(false)} style={{ color: '#ffffff' }}>
            <X size={20} />
          </button>
        </div>

        {/* Message Thread */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                gap: '10px',
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}
            >
              {m.sender === 'ai' && (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0066ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={18} />
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div
                  style={{
                    backgroundColor: m.sender === 'user' ? 'var(--color-accent-blue)' : '#f8fafc',
                    color: m.sender === 'user' ? '#ffffff' : 'var(--color-text-main)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '12px 16px',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    border: m.sender === 'ai' ? '1px solid #e2e8f0' : 'none',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {m.text}
                </div>

                {/* Render recommended products if AI matched them */}
                {m.recommendedProducts && m.recommendedProducts.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary-900)', textTransform: 'uppercase' }}>
                      Recommended In-Stock Products:
                    </div>
                    {m.recommendedProducts.map((p) => (
                      <div
                        key={p.id}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          boxShadow: 'var(--shadow-xs)'
                        }}
                      >
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          style={{ width: '44px', height: '44px', objectFit: 'contain', background: '#f8fafc', borderRadius: '4px' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.name}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                            {p.brand} • <strong style={{ color: 'var(--color-primary-900)' }}>₹{p.price.toLocaleString('en-IN')}</strong> /{p.unit}
                          </div>
                        </div>
                        <button
                          onClick={() => addToCart(p, 1)}
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: '11px', padding: '6px 10px' }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0066ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} />
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: '10px 16px', borderRadius: '16px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Analyzing specifications & stock inventory...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div style={{ padding: '8px 16px', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '6px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                color: 'var(--color-text-main)',
                cursor: 'pointer'
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Bottom Input Area */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-surface-border)', backgroundColor: '#ffffff' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{ display: 'flex', gap: '8px' }}
          >
            <input
              type="text"
              placeholder="Ask about welding rods, APFC sizing, rewinding or copper wire..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-surface-border-strong)',
                fontSize: '13px'
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 16px' }}>
              <Send size={16} />
            </button>
          </form>
          <div className="flex justify-between items-center" style={{ marginTop: '8px', fontSize: '11px', color: 'var(--color-text-subtle)' }}>
            <span>Verified answers directly from Beawar workshop engineering team.</span>
            <a
              href={`https://wa.me/${storeConfig.whatsapp.replace('+', '')}?text=Hello%20Dagdi%20team,%20I%20need%20technical%20assistance`}
              target="_blank"
              rel="noreferrer"
              style={{ color: '#25D366', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <PhoneCall size={12} /> Talk to Human Engineer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
