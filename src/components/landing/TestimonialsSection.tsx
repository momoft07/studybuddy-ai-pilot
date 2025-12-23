import { TestimonialsColumn } from "@/components/ui/testimonials-columns";

const testimonials = [
  {
    text: "I went from a 2.8 GPA to Dean's List using StudyPilot. The AI-generated study plans actually work and adapt to my schedule!",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Sarah Mitchell",
    role: "Medical Student, UCLA",
  },
  {
    text: "Finally, an app that understands how students actually study. The spaced repetition flashcards are a game changer for exam prep.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "James Thompson",
    role: "Engineering Major, MIT",
  },
  {
    text: "The AI tutor helped me understand organic chemistry concepts I'd been struggling with for months. Worth every minute!",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Emily Rodriguez",
    role: "Pre-Med Student, NYU",
  },
  {
    text: "StudyPilot's focus timer with the Pomodoro technique improved my concentration by 3x. I actually finish my assignments now.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Michael Chen",
    role: "Computer Science, Stanford",
  },
  {
    text: "The calendar integration synced all my deadlines perfectly. No more missed assignments or last-minute cramming sessions.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Priya Patel",
    role: "Law Student, Harvard",
  },
  {
    text: "I used to waste hours not knowing what to study first. StudyPilot's smart recommendations saved my semester.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Jessica Williams",
    role: "Biology Major, Columbia",
  },
  {
    text: "The note-taking feature with AI summaries is incredible. I can review a whole lecture in 5 minutes.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "David Kim",
    role: "Physics Major, Caltech",
  },
  {
    text: "My study group all switched to StudyPilot. Our collective GPA went up by 0.5 points in one semester!",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Aisha Johnson",
    role: "Economics Major, Princeton",
  },
  {
    text: "As a working student, I have limited time. StudyPilot helps me maximize every study session efficiently.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Carlos Martinez",
    role: "MBA Student, Wharton",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export function TestimonialsSection() {
  return (
    <section className="relative z-10 py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-sm font-medium text-primary">Testimonials</span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-center">
            What our <span className="gradient-text">users say</span>
          </h2>

          <p className="text-muted-foreground text-center max-w-md">
            See what students from top universities have to say about StudyPilot.
          </p>
        </div>

        <div className="flex justify-center gap-6 h-[500px] md:h-[600px] [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
          <TestimonialsColumn
            testimonials={firstColumn}
            duration={15}
            className="hidden md:block"
          />
          <TestimonialsColumn
            testimonials={secondColumn}
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            duration={17}
            className="hidden lg:block"
          />
        </div>
      </div>
    </section>
  );
}
