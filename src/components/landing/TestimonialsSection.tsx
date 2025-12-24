import { TestimonialsColumn } from "@/components/ui/testimonials-columns";

const testimonials = [
  {
    text: "Went from a 2.8 GPA to making the Dean's List. The AI-generated study plans adapt perfectly to my schedule.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Sarah Mitchell",
    role: "Medical Student, UCLA",
  },
  {
    text: "Finally, a study platform that works the way students actually learn. The spaced repetition system is exceptional.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "James Thompson",
    role: "Engineering, MIT",
  },
  {
    text: "The AI tutor helped me master organic chemistry concepts I had struggled with for months.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Emily Rodriguez",
    role: "Pre-Med, NYU",
  },
  {
    text: "The focus timer transformed my productivity. I complete assignments in half the time now.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Michael Chen",
    role: "Computer Science, Stanford",
  },
  {
    text: "Calendar integration keeps all my deadlines in sync. No more last-minute cramming sessions.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Priya Patel",
    role: "Law, Harvard",
  },
  {
    text: "I used to waste hours deciding what to study. Now I have clarity from the moment I sit down.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Jessica Williams",
    role: "Biology, Columbia",
  },
  {
    text: "The AI summaries let me review an entire lecture in five minutes. Essential for exam prep.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "David Kim",
    role: "Physics, Caltech",
  },
  {
    text: "Our entire study group switched to StudyPilot. Collective GPA increased by 0.5 in one semester.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Aisha Johnson",
    role: "Economics, Princeton",
  },
  {
    text: "As a working student with limited time, StudyPilot helps me maximize every session.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Carlos Martinez",
    role: "MBA, Wharton",
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
            Trusted by <span className="gradient-text">students worldwide</span>
          </h2>

          <p className="text-muted-foreground text-center max-w-md">
            Students at leading universities rely on StudyPilot for academic success.
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
