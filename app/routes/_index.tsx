import type { MetaFunction, LoaderFunctionArgs } from "@vercel/remix";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@vercel/remix";
import { prisma } from "~/prisma.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Time Tracking App" },
    { name: "description", content: "时间追踪器; time tacking" },
  ];
};

export const loader = async (args: LoaderFunctionArgs) => {
  const posts = await prisma.posts.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return json({
    posts,
  });
};

const Page = () => {
  const loadedData = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="p-12 flex flex-col gap-4">
        {loadedData.posts.map((post: any) => (
          <div key={post.id}>
            <Link to={`/posts/${post.id}`} className="text-xl">
              {post.title}
            </Link>
            <div className="text-sm text-gray-400">{post.createdAt}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Page;
