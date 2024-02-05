import { Button, Input, Textarea } from "@nextui-org/react";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { redirect, type ActionFunctionArgs, json } from "@vercel/remix";
import { prisma } from "~/prisma.server";
export const action = async (args: ActionFunctionArgs) => {
  const formData = await args.request.formData();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title.match("^\\w+$")) {
    return json({
      success: "failed",
      error_message: {
        title: "title must not be null",
        content: "",
      },
    });
  }

  if (!content) {
    return json({
      success: "failed",
      error_message: {
        title: "",
        content: "content must not be null",
      },
    });
  }
  await prisma.posts.create({
    data: {
      title,
      content,
    },
  });
  return redirect("/");
};

const Page = () => {
  const actionData = useActionData<typeof action>();
  const error_message = actionData?.error_message;
  const navigation = useNavigation();
  const loading = navigation.state === "submitting";
  return (
    <div>
      <Form method="POST">
        <div className="flex flex-col p-12 gap-3">
          <h1 className="text-xl font-black">Publish Your TimeLine </h1>
          <Input
            label="title"
            name="title"
            errorMessage={error_message?.title}
          />
          <Textarea
            name="content"
            className="border-none"
            label="content"
            errorMessage={error_message?.content}
            maxLength={144}
            minRows={150}
          />
          <Button color="primary" type="submit" isLoading={loading}>
            Publish
          </Button>
        </div>
      </Form>
    </div>
  );
};
export default Page;
