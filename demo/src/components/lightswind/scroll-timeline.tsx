// How to import:
// import { ScrollTimeline } from "@/components/lightswind/scroll-timeline"

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "../lib/utils";
import { Card, CardContent } from "./card";
import { Calendar } from "lucide-react";

export interface TimelineEvent {
  id?: string;
  year: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl?: string;
}

export interface ScrollTimelineProps {
  events?: TimelineEvent[];
  title?: string;
  subtitle?: string;
  className?: string;
}

const DEFAULT_EVENTS: TimelineEvent[] = [
  { year: "2023", title: "Major Achievement", description: "A big milestone." },
  { year: "2022", title: "Important Milestone", description: "Another milestone." },
  { year: "2021", title: "Key Event", description: "A key event." },
];

export const ScrollTimeline: React.FC<ScrollTimelineProps> = ({
  events = DEFAULT_EVENTS,
  title = "Timeline",
  subtitle = "Scroll to explore",
  className = "",
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: scrollRef });
  const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });
  const translateY = useTransform(smooth, [0, 1], [0, 300]);

  return (
    <section className={cn("w-full py-8 px-4", className)}>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold timeline-title">{title}</h2>
        <p className="text-sm timeline-subtitle mb-6">{subtitle}</p>

        <div className="relative lg:grid lg:grid-cols-12" ref={scrollRef}>
          <div className="hidden lg:flex lg:col-span-1 items-start justify-center">
            <div className="relative h-full w-2">
              <div className={cn("absolute left-1/2 -translate-x-1/2 w-1 bg-gray-200 rounded-full h-full")} />
              <motion.div
                style={{
                  position: "absolute",
                  left: "50%",
                  x: -6,
                  width: 12,
                  height: 12,
                  borderRadius: 9999,
                  background: "linear-gradient(90deg,#7c3aed,#06b6d4)",
                  translateY,
                }}
              />
            </div>
          </div>

          <div className="lg:col-span-11 space-y-8">
            {events.map((ev, idx) => (
              <div key={ev.id ?? idx} className="flex items-start">
                <div className={cn("w-full lg:w-3/4")}>
                  <Card className="timeline-card">
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <Calendar size={18} />
                        <div>
                          <div className="text-sm font-medium timeline-subtitle">{ev.year}</div>
                          <div className="text-lg font-semibold timeline-title">{ev.title}</div>
                          {ev.subtitle && <div className="text-sm timeline-subtitle">{ev.subtitle}</div>}
                        </div>
                      </div>
                      <p className="mt-2 text-sm timeline-description">{ev.description}</p>
                      {ev.imageUrl && (
                        <img src={ev.imageUrl} alt={ev.title} className="timeline-image mt-4 w-full h-48 object-cover rounded" />
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollTimeline;
