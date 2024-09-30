import { AvatarProps } from "@radix-ui/react-avatar"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "./Icons"
import { InferSelectModel } from "drizzle-orm"
import { users } from "@/db/schema"

type User = InferSelectModel<typeof users>

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "email" | "image">
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.image ? (
        <AvatarImage
          alt="Picture"
          src={user.image}
          referrerPolicy="no-referrer"
        />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.email}</span>
          <Icons.user className="size-6" />
        </AvatarFallback>
      )}
    </Avatar>
  )
}
