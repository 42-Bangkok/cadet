"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarDays,
  Code,
  GraduationCap,
  MapPin,
  School,
  Shield,
} from "lucide-react";
import { IUserProfile } from "./types";
import { formatDate } from "@/lib/datetime/utils";
import { Profile } from "@/drizzle/schemas";

interface UserProfileProps {
  user: IUserProfile;
  profile: Profile;
}

export function UserProfile({ user, profile }: UserProfileProps) {
  const {
    login,
    first_name,
    last_name,
    usual_full_name,
    email,
    wallet,
    created_at,
    campus,
    roles,
    cursus_users,
    projects_users,
    achievements,
  } = user;

  const initials = `${first_name?.[0] || ""}${
    last_name?.[0] || ""
  }`.toUpperCase();
  const joinDate = formatDate(created_at);
  const location = campus?.[0]
    ? `${campus[0].city}, ${campus[0].country}`
    : "Unknown Location";
  const isStaff = user["staff?"];
  const isAdmin = user.kind === "admin";

  return (
    <div className="container mx-auto py-6">
      <Card className="mb-6">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{usual_full_name}</CardTitle>
              <CardDescription className="flex flex-col md:flex-row md:items-center gap-2 mt-1">
                <span className="flex items-center gap-1">
                  <Code className="h-4 w-4" />
                  {login}
                </span>
                <span className="hidden md:inline">•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {location}
                </span>
              </CardDescription>
              <div className="flex flex-wrap gap-2 mt-2">
                {isAdmin && <Badge variant="secondary">Admin</Badge>}
                {isStaff && (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
                  >
                    Staff
                  </Badge>
                )}
                {cursus_users.map((cu) => (
                  <Badge key={cu.cursus_id} variant="outline">
                    {cu.cursus.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end gap-1">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-amber-500" />
              <span className="font-medium">Wallet: {wallet} points</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span className="text-sm text-muted-foreground">
                Joined {joinDate}
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </h3>
                  <p>{usual_full_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Email
                  </h3>
                  <p>{email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Login
                  </h3>
                  <p>{login}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Staff
                  </h3>
                  <p>{isStaff ? "Yes" : "No"}</p>
                </div>
              </div>

              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Foreigner
                  </h3>
                  <p>{<Badge>{profile.foreigner ? "Yes" : "No"}</Badge>}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    DiscordLink
                  </h3>
                  <p>
                    {
                      <Badge
                        variant={profile.discordId ? "default" : "destructive"}
                      >
                        {profile.discordId ? "Linked" : "Not Linked"}
                      </Badge>
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Cursus Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {cursus_users.map((cu) => (
                  <div key={cu.id} className="bg-muted p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      {cu.cursus.kind === "piscine" ? (
                        <School className="h-5 w-5 mt-0.5 text-primary" />
                      ) : cu.cursus.kind === "main" ? (
                        <GraduationCap className="h-5 w-5 mt-0.5 text-primary" />
                      ) : (
                        <Code className="h-5 w-5 mt-0.5 text-primary" />
                      )}
                      <div>
                        <h3 className="font-medium">{cu.cursus.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Started: {formatDate(cu.begin_at)}
                        </p>
                        <p className="text-sm">Level: {cu.level}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {projects_users.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-base font-medium mb-3">
                      Current Projects
                    </h3>
                    {projects_users.map((pu) => (
                      <div key={pu.id} className="bg-muted p-3 rounded-md mb-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{pu.project.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Started: {formatDate(pu.created_at)}
                            </p>
                          </div>
                          <Badge>{pu.status.replace("_", " ")}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Roles & Permissions</CardTitle>
              <CardDescription>
                User has {roles.length} assigned roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {roles.map((role) => (
                  <Badge
                    key={role.id}
                    variant="outline"
                    className="justify-start py-1.5 px-3"
                  >
                    {role.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-muted p-4 rounded-md">
                    <h3 className="font-medium">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {achievement.kind}
                      </Badge>
                      {achievement.nbr_of_success && (
                        <span className="text-xs text-muted-foreground">
                          {achievement.nbr_of_success} points
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
