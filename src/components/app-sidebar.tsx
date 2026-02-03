"use client";

import * as React from "react";
import {
  Home,
  ShoppingBag,
  Heart,
  User,
  Settings,
  HelpCircle,
  Smartphone,
  Watch,
  Shirt,
  Armchair,
  Gift,
  Zap,
  Truck,
  CreditCard,
  MessageSquare,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const data = {
  navMain: [
    { title: "হোম", url: "/", icon: Home },
    { title: "ফ্ল্যাশ সেল", url: "#flash-sale", icon: Zap },
    { title: "অর্ডার ট্র্যাকিং", url: "#", icon: Truck },
    { title: "আমার উইশলিস্ট", url: "#", icon: Heart },
  ],
  categories: [
    { title: "ইলেকট্রনিক্স", url: "#", icon: Smartphone },
    { title: "ফ্যাশন", url: "#", icon: Shirt },
    { title: "ঘড়ি ও এক্সেসরিজ", url: "#", icon: Watch },
    { title: "ফার্নিচার", url: "#", icon: Armchair },
    { title: "গিফট আইটেম", url: "#", icon: Gift },
  ],
  account: [
    { title: "আমার প্রোফাইল", url: "#", icon: User },
    { title: "পেমেন্ট মেথড", url: "#", icon: CreditCard },
    { title: "মেসেজ", url: "#", icon: MessageSquare },
    { title: "সেটিংস", url: "#", icon: Settings },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="border-r border-primary/10 bg-card/50 backdrop-blur-xl" {...props}>
      <SidebarHeader className="h-20 flex items-center justify-center border-b border-primary/10 px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <ShoppingBag className="h-6 w-6 text-background" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-headline font-bold text-lg leading-none tracking-tight gold-gradient">
              SS SMART HAAT
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Premium Store</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary/70 font-bold uppercase tracking-tighter">মেনু</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} className="hover:bg-primary/10 hover:text-primary transition-all">
                    <a href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-primary/70 font-bold uppercase tracking-tighter">ক্যাটাগরি</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.categories.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} className="hover:bg-primary/10 hover:text-primary transition-all">
                    <a href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-primary/70 font-bold uppercase tracking-tighter">অ্যাকাউন্ট</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.account.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} className="hover:bg-primary/10 hover:text-primary transition-all">
                    <a href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-primary/10 p-4">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <Avatar className="h-9 w-9 border border-primary/20">
            <AvatarImage src="https://picsum.photos/seed/user1/40/40" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold truncate">জুবায়ের রহমান</span>
            <span className="text-[10px] text-muted-foreground truncate">Premium Member</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}