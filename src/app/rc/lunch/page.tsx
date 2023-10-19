import { RedirectType } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";

export default async function Page() {
  const url =
    "https://felt.com/map/Lunch-RC-Cqn9BPaoWQuShkZsLQVFeGC?loc=40.689819,-73.984279,17.09z";
  redirect(url, RedirectType.replace);
}
