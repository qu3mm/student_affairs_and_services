"use client";
import { Book, LogOut, Menu, Sunset, Trees, User, Zap } from "lucide-react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ustp_logo from "../../public/images/USTP_LOGO.png";
import Image from "next/image";
import { logoutUser } from "@/lib/logout";
import { useRouter } from "next/navigation";
import ProfileDropdown from "./admin/dropdown-profile";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}



interface Navbar1Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
  session?: any;
}

const Navbar = ({
  menu = [
    { title: "Home", url: "/" },
    {
      title: "Services",
      url: "#",
      items: [
        {
          title: "Admissions",
          description: "The latest industry news, updates, and info",
          icon: <Book className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Counseling Services",
          description: "Our mission is to innovate and empower the world",
          icon: <Trees className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Guidance Office",
          description: "Browse job listing and discover our workspace",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "student organizations office",
          description:
            "Get in touch with our support team or visit our community forums",
          icon: <Zap className="size-5 shrink-0" />,
          url: "#",
        },
      ],
    },
    { title: "Events", url: "/events" },
    // {
    //   title: "Events",
    //   url: "/events",
    //   items: [
    //     {
    //       title: "Upcoming Events",
    //       description: "Don't miss our future events and activities",
    //       icon: <CalendarCheck className="size-5 shrink-0" />,
    //       url: "/events",
    //     },
    //     {
    //       title: "Ongoing Events",
    //       description: "Stay updated with events happening now",
    //       icon: <Timer className="size-5 shrink-0" />,
    //       url: "#",
    //     },
    //     {
    //       title: "Past Events",
    //       description: "Explore our previous events and highlights",
    //       icon: <History className="size-5 shrink-0" />,
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "Organizations",
      url: "#",
    },
    {
      title: "About Us",
      url: "#",
    },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Sign up", url: "/sign-up" },
  },
  session,
}: Navbar1Props) => {
  const user = session?.user;
  const loading = !session;


   const router = useRouter();
  const handleLogout = async () => {
    try {
      await logoutUser();
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <section className="py-4">
      <div className="container">
        {/* Desktop Menu */}
        <nav className="hidden lg:flex fixed top-0 left-0 right-0 z-50 w-full bg-background px-5 py-2 ">
          {/* Logo - Left */}
          <div className="flex items-center">
            <a href={"/"} className="flex items-center gap-2">
              <Image
                src={ustp_logo.src}
                className="max-h-8 dark:invert"
                width={32}
                height={32}
                alt={"ustp logo"}
              />
            </a>
          </div>

          {/* Navigation - Absolutely Centered */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <NavigationMenu>
              <NavigationMenuList>
                {menu.map((item) => renderMenuItem(item))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Auth Buttons - Right */}
          <div className="flex gap-2 items-center ml-auto">
            {!loading && user ? (
              <DropdownMenu>
                <ProfileDropdown
                  user={user}
                  trigger={
                    <Button variant="ghost" size="icon" className="size-9.5">
                      <Avatar className="size-9.5 rounded-md">
                        <AvatarImage src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png" />
                        <AvatarFallback></AvatarFallback>
                      </Avatar>
                    </Button>
                  }
                />
              </DropdownMenu>
            ) : (
              <div className="flex gap-2 items-center ml-auto">
                <Button asChild variant="outline" size="sm">
                  <a href={auth.login.url}>{auth.login.title}</a>
                </Button>
                <Button asChild variant={"secondary"} size="sm">
                  <a href={auth.signup.url}>{auth.signup.title}</a>
                </Button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href={"/"} className="flex items-center gap-2 ml-2">
              <Image
                src={ustp_logo.src}
                className="max-h-8 dark:invert"
                width={32}
                height={32}
                alt={"ustp logo"}
              />
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <a href={"/"} className="flex items-center gap-2">
                      <Image
                        src={ustp_logo.src}
                        className="max-h-8 dark:invert"
                        width={32}
                        height={32}
                        alt={"ustp logo"}
                      />
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>
                  {!loading && user ? (
                    <DropdownMenu>
                      <Button
                        onClick={handleLogout}
                        variant="destructive"
                        className="p-0"
                      >
                        <span>Logout</span>
                      </Button>
                    </DropdownMenu>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Button asChild variant="outline">
                        <a href={auth.login.url}>{auth.login.title}</a>
                      </Button>
                      <Button asChild>
                        <a href={auth.signup.url}>{auth.signup.title}</a>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="bg-background hover:bg-muted hover:text-accent-foreground group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      className="hover:bg-muted hover:text-accent-foreground flex min-w-80 select-none flex-row gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-muted-foreground text-sm leading-snug">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

export { Navbar };
