import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Brain, CheckSquare, Timer, Calendar, TrendingUp, Menu, Sparkles, GraduationCap, MessageSquare, HelpCircle } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: JSX.Element;
  items?: MenuItem[];
}

const menu: MenuItem[] = [
  { title: "Home", url: "/" },
  {
    title: "Features",
    url: "#",
    items: [
      {
        title: "AI Study Plans",
        description: "Personalized schedules based on your courses",
        icon: <BookOpen className="size-5 shrink-0" />,
        url: "#features",
      },
      {
        title: "Smart Flashcards",
        description: "Spaced repetition for better retention",
        icon: <Brain className="size-5 shrink-0" />,
        url: "#features",
      },
      {
        title: "Task Tracking",
        description: "Stay organized with daily checklists",
        icon: <CheckSquare className="size-5 shrink-0" />,
        url: "#features",
      },
      {
        title: "Focus Mode",
        description: "Pomodoro timer for deep work sessions",
        icon: <Timer className="size-5 shrink-0" />,
        url: "#features",
      },
    ],
  },
  {
    title: "Resources",
    url: "#",
    items: [
      {
        title: "Help Center",
        description: "Get answers to common questions",
        icon: <HelpCircle className="size-5 shrink-0" />,
        url: "#faq",
      },
      {
        title: "Success Stories",
        description: "See how students improved their grades",
        icon: <TrendingUp className="size-5 shrink-0" />,
        url: "#testimonials",
      },
      {
        title: "Study Tips",
        description: "Learn effective study techniques",
        icon: <GraduationCap className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Contact Us",
        description: "Get in touch with our support team",
        icon: <MessageSquare className="size-5 shrink-0" />,
        url: "#",
      },
    ],
  },
  {
    title: "Pricing",
    url: "#pricing",
  },
];

const mobileExtraLinks = [
  { name: "FAQ", url: "#faq" },
  { name: "Contact", url: "#" },
  { name: "Privacy", url: "#" },
];

export function LandingNavbar() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Glassmorphism background with animated gradient showing through */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-xl border-b border-border/30" />
      
      <div className="container relative mx-auto">
        <nav className="hidden justify-between lg:flex py-4">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                StudyPilot
              </span>
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Auth buttons */}
          <div className="flex gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth">Log in</Link>
            </Button>
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
              <Link to="/auth?signup=true">Get started</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between py-4 px-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-display font-bold">StudyPilot</span>
            </Link>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="border-border/50 bg-background/50">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto bg-background/95 backdrop-blur-xl">
                <SheetHeader>
                  <SheetTitle>
                    <Link to="/" className="flex items-center gap-3" onClick={() => setSheetOpen(false)}>
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80">
                        <Sparkles className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <span className="text-lg font-display font-bold">StudyPilot</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="my-8 flex flex-col gap-4">
                  <Accordion type="single" collapsible className="w-full">
                    {menu.map((item) => renderMobileMenuItem(item, () => setSheetOpen(false)))}
                  </Accordion>
                  <div className="border-t border-border/50 pt-4">
                    <div className="flex flex-col gap-3">
                      {mobileExtraLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setSheetOpen(false)}
                        >
                          {link.name}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-border/50 pt-4">
                    <div className="flex flex-col gap-3">
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/auth" onClick={() => setSheetOpen(false)}>Log in</Link>
                      </Button>
                      <Button asChild className="w-full bg-primary hover:bg-primary/90">
                        <Link to="/auth?signup=true" onClick={() => setSheetOpen(false)}>Get started</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger className="bg-transparent hover:bg-accent/50">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="w-80 p-3 bg-popover/95 backdrop-blur-xl">
            <li className="grid gap-1">
              {item.items.map((subItem) => (
                <NavigationMenuLink asChild key={subItem.title}>
                  <a
                    className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href={subItem.url}
                  >
                    <span className="text-primary">{subItem.icon}</span>
                    <div>
                      <div className="text-sm font-semibold">
                        {subItem.title}
                      </div>
                      {subItem.description && (
                        <p className="text-sm leading-snug text-muted-foreground">
                          {subItem.description}
                        </p>
                      )}
                    </div>
                  </a>
                </NavigationMenuLink>
              ))}
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink asChild>
        <a
          className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/50 hover:text-accent-foreground"
          href={item.url}
        >
          {item.title}
        </a>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem, onClose: () => void) => {
  if (item.items) {
    return (
      <AccordionItem value={item.title} key={item.title} className="border-b-0">
        <AccordionTrigger className="py-2 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="pb-2">
          {item.items.map((subItem) => (
            <a
              key={subItem.title}
              className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
              href={subItem.url}
              onClick={onClose}
            >
              <span className="text-primary">{subItem.icon}</span>
              <div>
                <div className="text-sm font-semibold">{subItem.title}</div>
                {subItem.description && (
                  <p className="text-sm leading-snug text-muted-foreground">
                    {subItem.description}
                  </p>
                )}
              </div>
            </a>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a
      key={item.title}
      href={item.url}
      className="flex py-2 text-base font-semibold"
      onClick={onClose}
    >
      {item.title}
    </a>
  );
};
