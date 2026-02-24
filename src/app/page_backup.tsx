'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slides, sections, SlideContent } from '@/data/slides';
import { useSlideNavigation } from '@/hooks/useSlideNavigation';
import { Navigation } from '@/components/Presentation/Navigation';
import { ProgressBar } from '@/components/Presentation/ProgressBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Heart,
  Users,
  BookOpen,
  Target,
  Shield,
  MessageCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  Quote,
  ChevronRight,
  X,
  Lightbulb,
  BarChart3,
  HelpCircle,
  AlertCircle,
  List,
  Star,
  User
} from 'lucide-react';

// Icon mapping
const iconMap: { [key: string]: React.ReactNode } = {
  heart: <Heart className="h-6 w-6" />,
  users: <Users className="h-6 w-6" />,
  'book-open': <BookOpen className="h-6 w-6" />,
  target: <Target className="h-6 w-6" />,
  shield: <Shield className="h-6 w-6" />,
  'message-circle': <MessageCircle className="h-6 w-6" />,
};

// Section colors
const sectionColors = [
  { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', accent: 'bg-blue-500' },
  { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', accent: 'bg-green-500' },
  { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', accent: 'bg-purple-500' },
  { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', accent: 'bg-orange-500' },
  { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', accent: 'bg-pink-500' },
  { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', accent: 'bg-red-500' },
  { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', accent: 'bg-teal-500' },
];

// Get section color
const getSectionColor = (sectionNumber: number) => {
  return sectionColors[sectionNumber - 1] || sectionColors[0];
};

// Table of Contents Component
function TableOfContents({
  isOpen,
  onClose,
  currentSlide,
  goToSlide,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentSlide: number;
  goToSlide: (slide: number) => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold text-gray-800">Агуулгын жагсаалт</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <ScrollArea className="h-[calc(100vh-65px)]">
              <div className="p-4">
                {sections.map((section) => {
                  const isActive = currentSlide >= section.startPage && currentSlide <= section.endPage;
                  const color = getSectionColor(section.number);
                  
                  return (
                    <div key={section.number} className="mb-4">
                      <div
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          isActive ? `${color.bg} ${color.border} border-2` : 'hover:bg-gray-50'
                        }`}
                        onClick={() => goToSlide(section.startPage)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-6 h-6 rounded-full ${color.accent} flex items-center justify-center text-white text-xs font-bold`}>
                            {section.number}
                          </div>
                          <span className={`font-medium text-sm ${isActive ? color.text : 'text-gray-700'}`}>
                            {section.title}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 ml-8">
                          Хуудас {section.startPage}-{section.endPage}
                        </div>
                      </div>
                      
                      {/* Individual slides in section */}
                      {isActive && (
                        <div className="ml-6 mt-2 space-y-1">
                          {slides
                            .filter((slide) => slide.sectionNumber === section.number)
                            .map((slide) => (
                              <motion.div
                                key={slide.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: (slide.id - section.startPage) * 0.03 }}
                                onClick={() => goToSlide(slide.id)}
                                className={`flex items-center gap-2 p-2 rounded cursor-pointer text-sm transition-all ${
                                  currentSlide === slide.id
                                    ? `${color.bg} ${color.text} font-medium`
                                    : 'hover:bg-gray-50 text-gray-600'
                                }`}
                              >
                                <span className="w-5 text-xs text-gray-400">{slide.id}</span>
                                <ChevronRight className="h-3 w-3 text-gray-400" />
                                <span className="truncate">{slide.title}</span>
                                {currentSlide === slide.id && (
                                  <div className={`ml-auto w-2 h-2 rounded-full ${color.accent}`} />
                                )}
                              </motion.div>
                            ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Stats Box Component
function StatsBox({ stats, sectionNumber }: { stats: NonNullable<SlideContent['stats']>; sectionNumber: number }) {
  const color = getSectionColor(sectionNumber);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${color.bg} rounded-xl p-4 text-center border ${color.border}`}
        >
          <div className={`text-2xl md:text-3xl font-bold ${color.text}`}>{stat.value}</div>
          <div className="text-sm font-medium text-gray-700 mt-1">{stat.label}</div>
          {stat.description && (
            <div className="text-xs text-gray-500 mt-1">{stat.description}</div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// Highlight Box Component
function HighlightBox({ title, content, type = 'info' }: { title: string; content: string; type?: 'info' | 'warning' | 'success' }) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 border-l-4',
    warning: 'bg-amber-50 border-amber-200 border-l-4',
    success: 'bg-green-50 border-green-200 border-l-4',
  };
  
  const icons = {
    info: <Info className="h-5 w-5 text-blue-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`${styles[type]} rounded-lg p-4 mb-6 border`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icons[type]}</div>
        <div>
          <h4 className="font-bold text-gray-800 mb-1">{title}</h4>
          <p className="text-gray-600 text-sm leading-relaxed">{content}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Quote Component
function QuoteBox({ text, author }: { text: string; author: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100"
    >
      <div className="flex items-start gap-4">
        <Quote className="h-8 w-8 text-blue-400 flex-shrink-0" />
        <div>
          <p className="text-lg italic text-gray-700 leading-relaxed">{text}</p>
          <p className="text-sm text-gray-500 mt-2">— {author}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Bullet Points Component
function BulletPoints({ items, sectionNumber }: { items: string[]; sectionNumber: number }) {
  const color = getSectionColor(sectionNumber);
  
  return (
    <ul className="space-y-3 mb-6">
      {items.map((item, index) => (
        <motion.li
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.08 }}
          className="flex items-start gap-3"
        >
          <div className={`w-2 h-2 rounded-full ${color.accent} mt-2.5 flex-shrink-0`} />
          <span className="text-gray-700 leading-relaxed">{item}</span>
        </motion.li>
      ))}
    </ul>
  );
}

// Tips Component
function TipsBox({ tips }: { tips: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 mb-6 border border-amber-200"
    >
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-5 w-5 text-amber-500" />
        <h4 className="font-bold text-amber-800">Практикийн зөвлөмж</h4>
      </div>
      <ul className="space-y-2">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-amber-700">
            <Star className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// Case Study Component
function CaseStudyBox({ caseStudy }: { caseStudy: NonNullable<SlideContent['caseStudy']> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-6 border border-purple-200"
    >
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-purple-500" />
        <h4 className="font-bold text-purple-800">{caseStudy.title}</h4>
      </div>
      <p className="text-gray-700 mb-4 leading-relaxed">{caseStudy.scenario}</p>
      <div className="space-y-2">
        {caseStudy.questions.map((question, index) => (
          <div key={index} className="flex items-start gap-2 text-sm text-purple-700 bg-white/50 rounded-lg p-2">
            <HelpCircle className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
            <span>{question}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Quiz Component
function QuizBox({ quiz }: { quiz: NonNullable<SlideContent['quiz']> }) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  const handleSelect = (index: number) => {
    if (!showResult) {
      setSelectedAnswer(index);
    }
  };
  
  const handleCheck = () => {
    setShowResult(true);
  };
  
  const handleReset = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border border-green-200"
    >
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="h-5 w-5 text-green-500" />
        <h4 className="font-bold text-green-800">Асуулт</h4>
      </div>
      <p className="text-gray-800 font-medium mb-4">{quiz.question}</p>
      <div className="space-y-2 mb-4">
        {quiz.options.map((option, index) => {
          let bgClass = 'bg-white hover:bg-green-50';
          if (showResult) {
            if (index === quiz.correctAnswer) {
              bgClass = 'bg-green-100 border-green-400';
            } else if (index === selectedAnswer && selectedAnswer !== quiz.correctAnswer) {
              bgClass = 'bg-red-100 border-red-400';
            }
          } else if (selectedAnswer === index) {
            bgClass = 'bg-green-100 border-green-400';
          }
          
          return (
            <motion.div
              key={index}
              whileHover={{ scale: showResult ? 1 : 1.02 }}
              whileTap={{ scale: showResult ? 1 : 0.98 }}
              onClick={() => handleSelect(index)}
              className={`cursor-pointer rounded-lg p-3 border-2 transition-all ${bgClass}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                  selectedAnswer === index ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-gray-700">{option}</span>
                {showResult && index === quiz.correctAnswer && (
                  <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                )}
                {showResult && index === selectedAnswer && index !== quiz.correctAnswer && (
                  <X className="h-5 w-5 text-red-500 ml-auto" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="flex gap-2">
        {!showResult ? (
          <Button onClick={handleCheck} disabled={selectedAnswer === null} className="bg-green-500 hover:bg-green-600">
            Хариулт шалгах
          </Button>
        ) : (
          <Button onClick={handleReset} variant="outline">
            Дахин оролдох
          </Button>
        )}
      </div>
    </motion.div>
  );
}

// Emergency Contacts Component
function EmergencyContacts() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 mb-6 border-2 border-red-200"
    >
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <h4 className="font-bold text-red-800">Яаралтай утаснууд</h4>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-3 border border-red-100">
          <div className="text-lg font-bold text-red-600">108</div>
          <div className="text-xs text-gray-600">Хүүхдийн тусламжийн шугам</div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-red-100">
          <div className="text-lg font-bold text-red-600">102</div>
          <div className="text-xs text-gray-600">Цагдаагийн байгууллага</div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-red-100">
          <div className="text-lg font-bold text-red-600">103</div>
          <div className="text-xs text-gray-600">Эрүүл мэндийн яаралтай тусламж</div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-red-100">
          <div className="text-lg font-bold text-red-600">1800-1212</div>
          <div className="text-xs text-gray-600">Бэлгийн хүчирхийллийн эсрэг дэмжлэг</div>
        </div>
      </div>
    </motion.div>
  );
}

// References Component
function ReferencesBox({ references }: { references: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200"
    >
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-gray-500" />
        <h4 className="font-bold text-gray-700">Ном зүй ба нөөц</h4>
      </div>
      <ul className="space-y-2">
        {references.map((ref, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
            <ChevronRight className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span>{ref}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// TOC Slide Component
function TOCSlide({ goToSlide }: { goToSlide: (slide: number) => void }) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Агуулгын жагсаалт</h2>
        <p className="text-gray-600">Хичээлийн бүтэц, 7 хэсэг, 40 хуудас</p>
      </div>
      
      {sections.map((section, index) => {
        const color = getSectionColor(section.number);
        return (
          <motion.div
            key={section.number}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => goToSlide(section.startPage)}
            className={`p-4 rounded-xl cursor-pointer transition-all hover:shadow-lg border ${color.bg} ${color.border}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full ${color.accent} flex items-center justify-center text-white font-bold`}>
                {section.number}
              </div>
              <div className="flex-1">
                <h3 className={`font-bold ${color.text}`}>{section.title}</h3>
                <p className="text-sm text-gray-500">Хуудас {section.startPage}-{section.endPage}</p>
              </div>
              <ChevronRight className={`h-5 w-5 ${color.text}`} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// Title Slide Component
function TitleSlide({ slide }: { slide: SlideContent }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-4 mb-8">
          {slide.icons?.map((icon, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
              className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"
            >
              {iconMap[icon]}
            </motion.div>
          ))}
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
          {slide.title}
        </h1>
        
        {slide.subtitle && (
          <p className="text-xl text-gray-600 mb-8">{slide.subtitle}</p>
        )}
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-lg text-gray-600 leading-relaxed mb-8">{slide.body}</p>
        </motion.div>
        
        {slide.quote && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <QuoteBox text={slide.quote.text} author={slide.quote.author} />
          </motion.div>
        )}
        
        {slide.highlightBox && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <HighlightBox title={slide.highlightBox.title} content={slide.highlightBox.content} type="info" />
          </motion.div>
        )}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-8"
      >
        <p className="text-sm text-gray-400 flex items-center gap-2">
          <span>Дараагийн хуудас руу шилжих</span>
          <ChevronRight className="h-4 w-4 animate-pulse" />
        </p>
      </motion.div>
    </div>
  );
}

// Content Slide Component
function ContentSlide({ slide }: { slide: SlideContent }) {
  const color = getSectionColor(slide.sectionNumber);
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Badge className={`${color.accent} text-white mb-2`}>
          {slide.section}
        </Badge>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{slide.title}</h2>
        {slide.subtitle && (
          <p className="text-gray-500 text-lg">{slide.subtitle}</p>
        )}
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-700 leading-relaxed text-lg"
      >
        {slide.body}
      </motion.p>
      
      {slide.stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatsBox stats={slide.stats} sectionNumber={slide.sectionNumber} />
        </motion.div>
      )}
      
      {slide.bulletPoints && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <BulletPoints items={slide.bulletPoints} sectionNumber={slide.sectionNumber} />
        </motion.div>
      )}
      
      {slide.highlightBox && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <HighlightBox
            title={slide.highlightBox.title}
            content={slide.highlightBox.content}
            type={slide.highlightBox.title.includes('Анхааруулга') || slide.highlightBox.title.includes('Анхаар') ? 'warning' : 'info'}
          />
        </motion.div>
      )}
      
      {slide.tips && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <TipsBox tips={slide.tips} />
        </motion.div>
      )}
      
      {slide.quote && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <QuoteBox text={slide.quote.text} author={slide.quote.author} />
        </motion.div>
      )}
      
      {slide.caseStudy && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <CaseStudyBox caseStudy={slide.caseStudy} />
        </motion.div>
      )}
      
      {slide.references && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ReferencesBox references={slide.references} />
        </motion.div>
      )}
    </div>
  );
}

// Summary Slide Component
function SummarySlide({ slide }: { slide: SlideContent }) {
  const color = getSectionColor(slide.sectionNumber);
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Badge className={`${color.accent} text-white mb-2`}>
          {slide.section}
        </Badge>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{slide.title}</h2>
        {slide.subtitle && (
          <p className="text-gray-500 text-lg">{slide.subtitle}</p>
        )}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`${color.bg} rounded-xl p-6 border ${color.border}`}
      >
        <div className="flex items-center gap-2 mb-4">
          <List className={`h-5 w-5 ${color.text}`} />
          <h3 className={`font-bold ${color.text}`}>Гол сургамж</h3>
        </div>
        <p className="text-gray-700 leading-relaxed">{slide.body}</p>
      </motion.div>
      
      {slide.bulletPoints && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <BulletPoints items={slide.bulletPoints} sectionNumber={slide.sectionNumber} />
        </motion.div>
      )}
      
      {slide.quiz && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <QuizBox quiz={slide.quiz} />
        </motion.div>
      )}
      
      {slide.quote && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <QuoteBox text={slide.quote.text} author={slide.quote.author} />
        </motion.div>
      )}
    </div>
  );
}

// Stats Slide Component
function StatsSlide({ slide }: { slide: SlideContent }) {
  const color = getSectionColor(slide.sectionNumber);
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Badge className={`${color.accent} text-white mb-2`}>
          {slide.section}
        </Badge>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{slide.title}</h2>
        {slide.subtitle && (
          <p className="text-gray-500 text-lg">{slide.subtitle}</p>
        )}
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-700 leading-relaxed text-lg"
      >
        {slide.body}
      </motion.p>
      
      {slide.stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatsBox stats={slide.stats} sectionNumber={slide.sectionNumber} />
        </motion.div>
      )}
      
      {slide.bulletPoints && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <BulletPoints items={slide.bulletPoints} sectionNumber={slide.sectionNumber} />
        </motion.div>
      )}
      
      {slide.highlightBox && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <HighlightBox title={slide.highlightBox.title} content={slide.highlightBox.content} />
        </motion.div>
      )}
    </div>
  );
}

// Diagram Slide Component
function DiagramSlide({ slide }: { slide: SlideContent }) {
  const color = getSectionColor(slide.sectionNumber);
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Badge className={`${color.accent} text-white mb-2`}>
          {slide.section}
        </Badge>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{slide.title}</h2>
        {slide.subtitle && (
          <p className="text-gray-500 text-lg">{slide.subtitle}</p>
        )}
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-700 leading-relaxed text-lg"
      >
        {slide.body}
      </motion.p>
      
      {/* Interactive Diagram */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className={`${color.bg} rounded-xl p-6 border ${color.border}`}
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className={`h-5 w-5 ${color.text}`} />
          <h3 className={`font-bold ${color.text}`}>Зураглал</h3>
        </div>
        
        {slide.bulletPoints && (
          <div className="grid md:grid-cols-3 gap-4">
            {slide.bulletPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-full ${color.accent} flex items-center justify-center text-white text-xs font-bold`}>
                    {index + 1}
                  </div>
                </div>
                <p className="text-sm text-gray-700">{point}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
      
      {slide.stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatsBox stats={slide.stats} sectionNumber={slide.sectionNumber} />
        </motion.div>
      )}
      
      {slide.highlightBox && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <HighlightBox title={slide.highlightBox.title} content={slide.highlightBox.content} />
        </motion.div>
      )}
      
      {slide.tips && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <TipsBox tips={slide.tips} />
        </motion.div>
      )}
    </div>
  );
}

// Case Study Slide Component
function CaseStudySlide({ slide }: { slide: SlideContent }) {
  const color = getSectionColor(slide.sectionNumber);
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Badge className={`${color.accent} text-white mb-2`}>
          {slide.section}
        </Badge>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{slide.title}</h2>
        {slide.subtitle && (
          <p className="text-gray-500 text-lg">{slide.subtitle}</p>
        )}
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-700 leading-relaxed text-lg"
      >
        {slide.body}
      </motion.p>
      
      {slide.caseStudy && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CaseStudyBox caseStudy={slide.caseStudy} />
        </motion.div>
      )}
      
      {slide.bulletPoints && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <BulletPoints items={slide.bulletPoints} sectionNumber={slide.sectionNumber} />
        </motion.div>
      )}
    </div>
  );
}

// Main Slide Renderer
function SlideRenderer({ slide, goToSlide }: { slide: SlideContent; goToSlide: (slide: number) => void }) {
  switch (slide.type) {
    case 'title':
      return <TitleSlide slide={slide} />;
    case 'toc':
      return <TOCSlide goToSlide={goToSlide} />;
    case 'summary':
      return <SummarySlide slide={slide} />;
    case 'stats':
      return <StatsSlide slide={slide} />;
    case 'diagram':
      return <DiagramSlide slide={slide} />;
    case 'case-study':
      return <CaseStudySlide slide={slide} />;
    case 'quiz':
      return slide.quiz ? (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className={`${getSectionColor(slide.sectionNumber).accent} text-white mb-2`}>
              {slide.section}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{slide.title}</h2>
            {slide.subtitle && <p className="text-gray-500 text-lg">{slide.subtitle}</p>}
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-700 leading-relaxed text-lg"
          >
            {slide.body}
          </motion.p>
          <QuizBox quiz={slide.quiz} />
        </div>
      ) : <ContentSlide slide={slide} />;
    default:
      return <ContentSlide slide={slide} />;
  }
}

// Main Component
export default function Presentation() {
  const [tocOpen, setTocOpen] = useState(false);
  
  const {
    currentSlide,
    totalSlides,
    progress,
    isAnimating,
    isFullscreen,
    goNext,
    goPrevious,
    goToSlide,
    toggleFullscreen,
    hasNext,
    hasPrevious,
  } = useSlideNavigation();
  
  const slide = slides[currentSlide - 1];
  const color = getSectionColor(slide.sectionNumber);
  
  return (
    <div className="min-h-screen bg-white" id="presentation-container">
      {/* Progress Bar */}
      <ProgressBar progress={progress} sectionNumber={slide.sectionNumber} />
      
      {/* Table of Contents */}
      <TableOfContents
        isOpen={tocOpen}
        onClose={() => setTocOpen(false)}
        currentSlide={currentSlide}
        goToSlide={(slideNum) => {
          goToSlide(slideNum);
          setTocOpen(false);
        }}
      />
      
      {/* Main Content */}
      <main className="pt-6 pb-20 min-h-screen">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="max-w-5xl mx-auto px-4 md:px-8 min-h-[calc(100vh-100px)] flex flex-col"
        >
          <SlideRenderer slide={slide} goToSlide={goToSlide} />
          
          {/* Emergency Contacts for relevant slides */}
          {(slide.id === 34 || slide.id === 35 || slide.id === 37) && (
            <div className="mt-auto">
              <EmergencyContacts />
            </div>
          )}
        </motion.div>
      </main>
      
      {/* Navigation */}
      <Navigation
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        isFullscreen={isFullscreen}
        goNext={goNext}
        goPrevious={goPrevious}
        goToSlide={goToSlide}
        toggleFullscreen={toggleFullscreen}
        onOpenTOC={() => setTocOpen(true)}
      />
      
      {/* Keyboard Hints (only visible in non-fullscreen) */}
      {!isFullscreen && currentSlide === 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="fixed bottom-20 left-0 right-0 flex justify-center"
        >
          <div className="bg-gray-800/80 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">←</kbd>
              <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">→</kbd>
              Navigation
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">F</kbd>
              Full screen
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Home</kbd>
              First slide
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
