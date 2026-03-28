import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X, Send, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { Event } from '../types';

interface RatingModalProps {
  event: Event;
  onClose: () => void;
  onSubmit: (ratingData: RatingData) => void;
}

export interface RatingData {
  eventId: string;
  review: string;
  criteria: {
    content: number;
    organization: number;
    engagement: number;
    value: number;
    fun: number;
  };
}

const CRITERIA = [
  { id: 'content', label: 'Content Quality' },
  { id: 'organization', label: 'Organization' },
  { id: 'engagement', label: 'Engagement' },
  { id: 'value', label: 'Value for Time' },
  { id: 'fun', label: 'Overall Fun' },
] as const;

export function RatingModal({ event, onClose, onSubmit }: RatingModalProps) {
  const [review, setReview] = useState('');
  const [ratings, setRatings] = useState<Record<string, number>>({
    content: 0,
    organization: 0,
    engagement: 0,
    value: 0,
    fun: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleStarClick = (criterionId: string, value: number) => {
    setRatings(prev => ({ ...prev, [criterionId]: value }));
  };

  const isComplete = review.trim().length > 0 && (Object.values(ratings) as number[]).every(r => r > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('RatingModal: Attempting to submit...', { review, ratings, isComplete });
    
    if (isComplete && !isSubmitting) {
      setIsSubmitting(true);
      console.log('RatingModal: Submission started');
      
      // Simulate a small delay for "processing"
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setIsSuccess(true);
      console.log('RatingModal: Success state triggered');
      
      // Wait for success animation
      await new Promise(resolve => setTimeout(resolve, 1200));

      console.log('RatingModal: Calling onSubmit prop');
      onSubmit({
        eventId: event.id,
        review,
        criteria: ratings as RatingData['criteria'],
      });
    } else {
      console.warn('RatingModal: Submission blocked', { isComplete, isSubmitting });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
      >
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="w-20 h-20 bg-rpg-gold rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,215,0,0.3)]">
                <Sparkles size={40} className="text-slate-900" />
              </div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tight">Quest Complete!</h2>
              <p className="text-rpg-gold font-bold text-xl">+150 XP Awarded</p>
              <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">Your feedback has been recorded in the archives.</p>
            </motion.div>
          ) : (
            <motion.div key="form" exit={{ opacity: 0, scale: 0.95 }}>
              {/* Header */}
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">
                    Rate Quest: <span className="text-rpg-red">{event.title}</span>
                  </h2>
                  <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mt-1">Provide feedback to earn XP</p>
                </div>
                <button 
                  onClick={onClose}
                  disabled={isSubmitting}
                  className={cn(
                    "p-2 rounded-full text-slate-400 transition-colors",
                    isSubmitting ? "opacity-20 cursor-not-allowed" : "hover:bg-slate-800"
                  )}
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* Ratings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {CRITERIA.map((criterion) => (
                    <div key={criterion.id} className="space-y-2">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        {criterion.label}
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleStarClick(criterion.id, star)}
                            className="transition-transform active:scale-90"
                          >
                            <Star 
                              size={24} 
                              className={cn(
                                "transition-colors",
                                ratings[criterion.id] >= star 
                                  ? "text-rpg-gold fill-rpg-gold" 
                                  : "text-slate-700 hover:text-slate-500"
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Review Textarea */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Detailed Review
                  </label>
                  <textarea
                    required
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="What did you think of this quest? Your feedback helps the society grow..."
                    className="w-full h-32 bg-slate-800/50 border-2 border-slate-700 rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-rpg-accent transition-all resize-none shadow-inner"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={!isComplete || isSubmitting}
                    className={cn(
                      "w-full py-4 rounded-xl font-black uppercase tracking-widest text-white transition-all duration-300 flex items-center justify-center gap-3",
                      isComplete && !isSubmitting
                        ? "bg-rpg-red hover:bg-rpg-red/90 shadow-[0_10px_20px_rgba(239,68,68,0.2)]" 
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    )}
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={20} />
                        Submit Review & Claim XP
                        {isComplete && <Sparkles size={20} className="text-rpg-gold animate-pulse" />}
                      </>
                    )}
                  </button>
                  {!isComplete && !isSubmitting && (
                    <p className="text-center text-[10px] font-mono text-rpg-red/60 mt-2 uppercase tracking-widest">
                      Please complete all ratings and the review
                    </p>
                  )}
                  <p className="text-center text-[10px] font-mono text-slate-500 mt-4 uppercase tracking-widest">
                    Rewards: +150 XP for completion
                  </p>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
