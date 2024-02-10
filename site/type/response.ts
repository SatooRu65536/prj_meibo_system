import { Member, MemberWithPrivateInfo } from "./member";

export type MembersRes<T extends Member | MemberWithPrivateInfo> = {
  members: T[];
}