import { useRef, useLayoutEffect, useState, type FC } from "react";
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

export const ScrollTimeline: FC<ScrollTimelineProps> = ({
  events = DEFAULT_EVENTS,
  title = "Timeline",
  subtitle = "Scroll to explore",
  className = "",
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [connectorYs, setConnectorYs] = useState<number[]>([]);
  const { scrollYProgress } = useScroll({ target: scrollRef });
  const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });
  const translateY = useTransform(smooth, [0, 1], [0, 300]);

  // measure function: compute vertical center of each item relative to the container
  const measure = () => {
    const container = scrollRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const ys = itemRefs.current.map((el) => {
      if (!el) return 0;
      const r = el.getBoundingClientRect();
      return r.top + r.height / 2 - containerRect.top;
    });
    setConnectorYs(ys);
  };

  useLayoutEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    // use ResizeObserver to re-measure whenever an item changes size (images, fonts, content)
    let ro: ResizeObserver | null = null;
    try {
      ro = new ResizeObserver(() => {
        measure();
      });
      itemRefs.current.forEach((el) => {
        if (el) ro?.observe(el);
      });
    } catch {
      // ResizeObserver may not be available in older environments; fallback is window resize
    }

    return () => {
      window.removeEventListener("resize", onResize);
      if (ro) {
        ro.disconnect();
      }
    };
  }, [events]);

  return (
    <section className={cn("w-full py-12 px-4", className)}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold timeline-title text-center">{title}</h2>
        <p className="text-sm timeline-subtitle mb-8 text-center">{subtitle}</p>

        <div className="timeline-container bg-transparent p-6" ref={scrollRef}>
          {/* central vertical line (anchored via CSS) */}
          <div
            className="timeline-center-line"
            style={{ left: '50%', top: '24px', bottom: '1rem', transform: 'translateX(-50%)' }}
          />

          <motion.div
            style={{
              position: "absolute",
              left: "50%",
              x: -10,
              width: 20,
              height: 20,
              borderRadius: 9999,
              background: "linear-gradient(180deg,#ff4da6,#ff8aa2)",
              translateY,
            }}
          />

          <div className="timeline-items space-y-10 relative">
            {events.map((ev, idx) => {
              const side = idx % 2 === 0 ? "left" : "right";
              return (
                <div
                  key={ev.id ?? idx}
                  className={cn("timeline-row grid items-center lg:items-start", "grid-cols-1 lg:grid-cols-[1fr_56px_1fr]")}
                >
                  {/* left card (shows when side === 'left') */}
                  <div
                    ref={(el) => { itemRefs.current[idx] = el; }}
                    className={cn('card-cell px-4', side === 'left' ? 'order-1 lg:order-1' : 'order-1 lg:order-3')}
                  >
                    {side === 'left' && (
                      <div className="timeline-card-wrap">
                        <Card className="timeline-card">
                          <CardContent>
                            <div className="flex items-start gap-3">
                              <Calendar size={20} />
                              <div>
                                <div className="text-sm font-medium timeline-subtitle">{ev.year}</div>
                                <div className="text-xl font-semibold timeline-title">{ev.title}</div>
                                {ev.subtitle && <div className="text-sm timeline-subtitle">{ev.subtitle}</div>}
                              </div>
                            </div>
                            <p className="mt-2 text-sm timeline-description">{ev.description}</p>
                            {ev.imageUrl && (
                              <img src={ev.imageUrl} alt={ev.title} className="timeline-image mt-4 w-full h-64 object-cover rounded" />
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>

                  {/* center column: marker + connector */}
                  <div className="center-cell order-2">
                    {/* absolutely-positioned marker + connector inside timeline container using measured Y */}
                    <div
                      className="center-branch"
                      style={{ position: 'absolute', left: 0, top: 0, width: '100%', pointerEvents: 'none' }}
                    >
                      <div
                        className="timeline-marker"
                        style={{
                          position: 'absolute',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          top: connectorYs[idx] ? `${connectorYs[idx]}px` : '0px',
                        }}
                      />
                      <div
                        className={cn('branch-connector', side === 'left' ? 'to-left' : 'to-right')}
                        style={{
                          position: 'absolute',
                          top: connectorYs[idx] ? `${connectorYs[idx]}px` : '0px',
                          transform: 'translateY(-50%)',
                        }}
                      />
                    </div>
                  </div>

                  {/* right card (shows when side === 'right') */}
                  <div className={cn('card-cell px-4', side === 'right' ? 'order-3 lg:order-3' : 'order-3 lg:order-1')}>
                    {side === 'right' && (
                      <div ref={(el) => { itemRefs.current[idx] = el; }} className="timeline-card-wrap">
                        <Card className="timeline-card">
                          <CardContent>
                            <div className="flex items-start gap-3">
                              <Calendar size={20} />
                              <div>
                                <div className="text-sm font-medium timeline-subtitle">{ev.year}</div>
                                <div className="text-xl font-semibold timeline-title">{ev.title}</div>
                                {ev.subtitle && <div className="text-sm timeline-subtitle">{ev.subtitle}</div>}
                              </div>
                            </div>
                            <p className="mt-2 text-sm timeline-description">{ev.description}</p>
                            {ev.imageUrl && (
                              <img src={ev.imageUrl} alt={ev.title} className="timeline-image mt-4 w-full h-64 object-cover rounded" />
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollTimeline;
