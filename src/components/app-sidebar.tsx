"use client";

import * as React from "react";
import {
  Home,
  ShoppingBag,
  Heart,
  User,
  Settings,
  Smartphone,
  Watch,
  Shirt,
  Armchair,
  Gift,
  Zap,
  Truck,
  CreditCard,
  MessageSquare,
  ChevronDown
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
    { title: "Home", url: "/", icon: Home },
    { title: "Flash Sale", url: "#flash-sale", icon: Zap },
    { title: "Track Order", url: "#", icon: Truck },
    { title: "My Wishlist", url: "#", icon: Heart },
  ],
  categories: [
    { title: "Electronics", url: "#", icon: Smartphone },
    { title: "Fashion", url: "#", icon: Shirt },
    { title: "Watches & Accessories", url: "#", icon: Watch },
    { title: "Furniture", url: "#", icon: Armchair },
    { title: "Gift Items", url: "#", icon: Gift },
  ],
  account: [
    { title: "My Profile", url: "#", icon: User },
    { title: "Payment Methods", url: "#", icon: CreditCard },
    { title: "Messages", url: "#", icon: MessageSquare },
    { title: "Settings", url: "#", icon: Settings },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="border-r border-primary/10 bg-card/80 backdrop-blur-xl" {...props}>
      <SidebarHeader className="h-24 flex flex-col items-center justify-center border-b border-primary/5 px-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-xl shadow-primary/20">
            <ShoppingBag className="h-7 w-7 text-background" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-headline font-bold text-xl leading-none tracking-tight gold-gradient">
              SS SMART HAAT
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1.5 font-bold">Premium Store</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2 pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2 px-4">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} className="hover:bg-primary/10 hover:text-primary py-6 rounded-xl transition-all duration-300">
                    <a href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span className="font-semibold text-sm">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2 px-4">Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.categories.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} className="hover:bg-primary/10 hover:text-primary py-6 rounded-xl transition-all duration-300">
                    <a href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span className="font-semibold text-sm">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2 px-4">Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-primary/10 hover:text-primary py-6 rounded-xl transition-all duration-300">
                  <User className="h-5 w-5" />
                  <span className="font-semibold text-sm">My Profile</span>
                  <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-primary/5 p-6">
        <div className="flex items-center gap-4 group-data-[collapsible=icon]:justify-center bg-primary/5 p-3 rounded-2xl border border-primary/10">
          <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-lg">
            <AvatarImage src="https://picsum.photos/seed/user1/60/60" />
            <AvatarFallback className="bg-primary text-background font-bold">ZR</AvatarFallback>
          </Avatar>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold truncate">Zubair Rahman</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Premium Member</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
