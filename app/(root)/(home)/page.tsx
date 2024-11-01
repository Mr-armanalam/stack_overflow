import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import React from 'react'

const Home = () => {
  return (
    <div>Home
        <SignedOut> 
            <SignInButton />
          </SignedOut>
           <SignedIn>
            <UserButton />
          </SignedIn>
    </div>
  )
}

export default Home