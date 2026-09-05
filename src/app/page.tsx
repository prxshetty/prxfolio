import { profile } from "@/data";
import { getContributions } from "@/lib/github";
import Portfolio from "@/components/portfolio";

export default async function Home() {
  const contributions = await getContributions(profile.githubUsername);
  return <Portfolio contributions={contributions} />;
}
