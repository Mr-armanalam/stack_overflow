import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import React from "react";

const Home = () => {
  return (
    <div>
      <SignedOut>
        <SignInButton fallbackRedirectUrl={"/"} />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};

export default Home;
