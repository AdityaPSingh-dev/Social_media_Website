import { Button } from "@/components/ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignupValidation } from "@/lib/validation";
import Loader from "@/components/ui/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

const Signup = () => {
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
    useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isSigningIn } =
    useSignInAccount();
  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const newUser = await createUserAccount(values);
    if (!newUser) {
      return toast("Please try again");
    }
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });
    console.log(session);
    if (!session) {
      return toast("Please try again,Sign in failed");
    }
    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      return toast("Sign up failed. Please try again");
    }
  }

  return (
    <Form {...form}>
      <div className="w-full sm:w-1/2 md:w-1/3 lg:w-2/5 flex flex-col  sm:items-start px-4 py-6 mx-auto justify-center items-center">
        <img src="/assets/images/logo.svg" alt="logo" className="mb-4" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12 text-center sm:text-left  text-white">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2 text-center sm:text-left text-white justify-items-center">
          To use Snapgram, please enter your account details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span className="text-white">Name</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="bg-white/30 border border-white/30 rounded-md p-2 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out w-full"
                    placeholder="Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span className="text-white">Username</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="bg-white/30 border border-white/30 rounded-md p-2 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out w-full"
                    placeholder="Username"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span className="text-white">Email</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className="bg-white/30 border border-white/30 rounded-md p-2 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out w-full"
                    placeholder="E-mail Address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span className="text-white">Password</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="bg-white/30 border border-white/30 rounded-md p-2 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out w-full"
                    placeholder="Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-[#837AFF]">
            {isCreatingAccount ? (
              <div className="flex gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>
          <p className="text-small-regular text-white text-center mt-2">
            Already have an account?
            <Link
              to="/signin"
              className="text-[#837AFF] text-small-semibold ml-1"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default Signup;
